"""Self-hosted, dependency-free portfolio call signalling. Video never passes through this server."""
import argparse, hashlib, hmac, http.cookies, json, os, secrets, sqlite3, ssl, threading, time
from collections import defaultdict, deque
from http.server import ThreadingHTTPServer, BaseHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlparse, parse_qs

WEB=Path(__file__).parent.parent/'calls'
TERMINAL={'declined','ended','cancelled','expired'}
class Store:
 def __init__(self,path,password,origins=(),ice=()):
  self.path=str(path);self.password=password;self.origins=set(origins);self.ice=list(ice);self.lock=threading.RLock();self.sessions={};self.attempts=defaultdict(deque);self.online=False;self.heartbeat=0
  with self.db() as c:
   c.executescript('CREATE TABLE IF NOT EXISTS calls(id TEXT PRIMARY KEY, token TEXT NOT NULL,name TEXT NOT NULL,reason TEXT NOT NULL,state TEXT NOT NULL,created REAL NOT NULL,expires REAL NOT NULL);CREATE TABLE IF NOT EXISTS signals(seq INTEGER PRIMARY KEY AUTOINCREMENT,call_id TEXT NOT NULL,sender TEXT NOT NULL,message TEXT NOT NULL);')
  try:os.chmod(self.path,0o600)
  except OSError:pass
 def db(self):return sqlite3.connect(self.path,timeout=5)
 def cleanup(self):
  with self.db() as c:
   c.execute("UPDATE calls SET state='expired' WHERE state IN ('waiting','accepted') AND expires<?",(time.time(),))
   c.execute('DELETE FROM signals WHERE call_id IN (SELECT id FROM calls WHERE created<?)',(time.time()-3600,));c.execute('DELETE FROM calls WHERE created<?',(time.time()-3600,))
 def available(self):
  self.cleanup()
  with self.db() as c:busy=c.execute("SELECT 1 FROM calls WHERE state='accepted' LIMIT 1").fetchone()
  return self.online and time.time()-self.heartbeat<20 and not busy
 def limited(self,key,count,seconds):
  with self.lock:
   q=self.attempts[key];now=time.time()
   while q and q[0]<now-seconds:q.popleft()
   if len(q)>=count:return True
   q.append(now);return False
 def call(self,id):
  self.cleanup()
  with self.db() as c:
   c.row_factory=sqlite3.Row;row=c.execute('SELECT * FROM calls WHERE id=?',(id,)).fetchone();return dict(row) if row else None

class Handler(BaseHTTPRequestHandler):
 server_version='PortfolioCalls/1.0'
 def log_message(self,*args):pass # Never log SDP, candidates, passwords, visitor text, or capabilities.
 @property
 def store(self):return self.server.store
 def own_origin(self):return ('https' if isinstance(self.connection,ssl.SSLSocket) else 'http')+'://'+self.headers.get('Host','')
 def allowed(self):
  origin=self.headers.get('Origin');return not origin or origin==self.own_origin() or origin in self.store.origins
 def reply(self,status,data,extra=()):
  raw=json.dumps(data).encode();self.send_response(status);self.send_header('Content-Type','application/json');self.send_header('Cache-Control','no-store');self.send_header('Content-Length',str(len(raw)));self.send_header('X-Content-Type-Options','nosniff')
  origin=self.headers.get('Origin')
  if origin and self.allowed():self.send_header('Access-Control-Allow-Origin',origin);self.send_header('Vary','Origin')
  for k,v in extra:self.send_header(k,v)
  self.end_headers();self.wfile.write(raw)
 def host(self):
  try:
   cookies=http.cookies.SimpleCookie(self.headers.get('Cookie',''));key=cookies['portfolio_host'].value
   return self.store.sessions.get(key,0)>time.time()
  except (KeyError,http.cookies.CookieError):return False
 def body(self):
  n=int(self.headers.get('Content-Length','0'))
  if not 0<n<=65536:raise ValueError('Use a request of up to 64 KB.')
  data=json.loads(self.rfile.read(n))
  if not isinstance(data,dict):raise ValueError('Expected an object.')
  return data
 def do_OPTIONS(self):
  if not self.allowed():return self.reply(403,{'error':'Origin not allowed.'})
  return self.reply(200,{},[('Access-Control-Allow-Methods','GET, POST, OPTIONS'),('Access-Control-Allow-Headers','Content-Type, Authorization')])
 def do_GET(self):
  if not self.allowed():return self.reply(403,{'error':'Origin not allowed.'})
  path=urlparse(self.path).path
  if path.startswith('/calls-api/'):
   if path=='/calls-api/availability':return self.reply(200,{'available':self.store.available(),'iceServers':self.store.ice})
   if path=='/calls-api/host':
    if not self.host():return self.reply(401,{'error':'Please sign in.'})
    self.store.heartbeat=time.time();self.store.cleanup()
    with self.store.db() as c:
     c.row_factory=sqlite3.Row;rows=[dict(r) for r in c.execute("SELECT id,name,reason,state,created,expires FROM calls WHERE state IN ('waiting','accepted') ORDER BY created")]
    return self.reply(200,{'online':self.store.online,'calls':rows,'iceServers':self.store.ice,'portfolioUrl':'/' if self.server.site_root and (self.server.site_root/'index.html').is_file() else '/calls/demo'})
   parts=path.strip('/').split('/')
   if len(parts)==3 and parts[1]=='calls':
    call=self.store.call(parts[2]);role=self.authorize(call)
    if not role:return self.reply(404,{'error':'Call not found.'})
    try:after=max(0,int(parse_qs(urlparse(self.path).query).get('after',['0'])[0]))
    except ValueError:return self.reply(400,{'error':'Invalid cursor.'})
    with self.store.db() as c:signals=[{'seq':r[0],'message':json.loads(r[1])} for r in c.execute('SELECT seq,message FROM signals WHERE call_id=? AND sender!=? AND seq>? ORDER BY seq LIMIT 100',(call['id'],role,after))]
    return self.reply(200,{'id':call['id'],'state':call['state'],'expires':call['expires'],'signals':signals})
   return self.reply(404,{'error':'Not found.'})
  static={'/calls/host':'host.html','/calls/demo':'demo.html','/calls/peer.js':'peer.js','/calls/panel.js':'panel.js','/calls/call.css':'call.css'}
  if path in static:return self.file(WEB/static[path])
  # Serve a local portfolio checkout for complete integration testing, if supplied.
  root=getattr(self.server,'site_root',None)
  if root:
   requested=(root/path.lstrip('/')).resolve()
   if requested==root or root in requested.parents:
    if requested.is_dir():requested=requested/'index.html'
    if requested.is_file() and requested.suffix in {'.html','.js','.css','.json','.svg','.png','.webp','.jpg','.jpeg','.woff','.woff2'} and 'self-hosted-calls' not in requested.parts:return self.file(requested)
  return self.reply(404,{'error':'Not found.'})
 def file(self,path):
  import mimetypes
  raw=path.read_bytes();self.send_response(200);self.send_header('Content-Type',mimetypes.guess_type(path.name)[0] or 'application/octet-stream');self.send_header('Content-Length',str(len(raw)));self.send_header('X-Content-Type-Options','nosniff');self.send_header('Cache-Control','no-store');self.send_header('Referrer-Policy','no-referrer');self.end_headers();self.wfile.write(raw)
 def authorize(self,call):
  if not call:return None
  if self.host():return 'host'
  value=self.headers.get('Authorization','').removeprefix('Bearer ')
  if value and hmac.compare_digest(hashlib.sha256(value.encode()).hexdigest(),call['token']):return 'visitor'
  return None
 def do_POST(self):
  if not self.allowed():return self.reply(403,{'error':'Origin not allowed.'})
  try:return self.post(self.body())
  except (ValueError,TypeError,json.JSONDecodeError):return self.reply(400,{'error':'Invalid request.'})
  except sqlite3.Error:return self.reply(503,{'error':'Please try again.'})
 def post(self,data):
  path=urlparse(self.path).path;ip=self.client_address[0]
  if path=='/calls-api/login':
   if self.store.limited('login:'+ip,10,300):return self.reply(429,{'error':'Wait before trying again.'})
   if not hmac.compare_digest(str(data.get('password','')),self.store.password):return self.reply(401,{'error':'Incorrect password.'})
   token=secrets.token_urlsafe(32);self.store.sessions[token]=time.time()+43200
   secure='; Secure' if isinstance(self.connection,ssl.SSLSocket) else ''
   return self.reply(200,{'ok':True},[('Set-Cookie','portfolio_host='+token+'; HttpOnly; SameSite=Strict; Path=/calls-api; Max-Age=43200'+secure)])
  if path=='/calls-api/logout':
   if self.host():
    key=http.cookies.SimpleCookie(self.headers.get('Cookie',''))['portfolio_host'].value;self.store.sessions.pop(key,None);self.store.online=False
   return self.reply(200,{'ok':True},[('Set-Cookie','portfolio_host=; HttpOnly; SameSite=Strict; Path=/calls-api; Max-Age=0')])
  if path=='/calls-api/availability':
   if not self.host():return self.reply(401,{'error':'Please sign in.'})
   self.store.online=data.get('online') is True;self.store.heartbeat=time.time();return self.reply(200,{'online':self.store.online})
  if path=='/calls-api/calls':
   name=data.get('name');reason=data.get('reason')
   if not isinstance(name,str) or not 1<=len(name.strip())<=80 or not isinstance(reason,str) or not 1<=len(reason.strip())<=500:return self.reply(400,{'error':'Add your name and a short reason for the call.'})
   if not self.store.available():return self.reply(409,{'error':'Jamiu is unavailable right now.'})
   if self.store.limited('request:'+ip,3,600):return self.reply(429,{'error':'Please wait before requesting another call.'})
   id=secrets.token_urlsafe(18);token=secrets.token_urlsafe(32);now=time.time()
   with self.store.db() as c:c.execute('INSERT INTO calls VALUES(?,?,?,?,?,?,?)',(id,hashlib.sha256(token.encode()).hexdigest(),name.strip(),reason.strip(),'waiting',now,now+90))
   return self.reply(201,{'id':id,'token':token,'expires':now+90,'iceServers':self.store.ice})
  parts=path.strip('/').split('/')
  if len(parts)!=4 or parts[:2]!=['calls-api','calls']:return self.reply(404,{'error':'Not found.'})
  id,action=parts[2:];call=self.store.call(id);role=self.authorize(call)
  if not role:return self.reply(404,{'error':'Call not found.'})
  if action=='accept':
   if role!='host':return self.reply(403,{'error':'Only Jamiu can accept a call.'})
   with self.store.lock,self.store.db() as c:
    c.execute('BEGIN IMMEDIATE')
    busy=c.execute("SELECT 1 FROM calls WHERE state='accepted' AND id!=?",(id,)).fetchone()
    if busy or call['state']!='waiting':return self.reply(409,{'error':'This call is no longer available.'})
    c.execute("UPDATE calls SET state='accepted',expires=? WHERE id=? AND state='waiting'",(time.time()+1200,id))
   return self.reply(200,{'state':'accepted','iceServers':self.store.ice})
  if action in ('decline','end'):
   if action=='decline' and role!='host':return self.reply(403,{'error':'Only Jamiu can decline.'})
   state='declined' if action=='decline' else ('cancelled' if call['state']=='waiting' else 'ended')
   with self.store.db() as c:c.execute('UPDATE calls SET state=? WHERE id=? AND state NOT IN (\'ended\',\'declined\',\'expired\',\'cancelled\')',(state,id));c.execute('DELETE FROM signals WHERE call_id=?',(id,))
   return self.reply(200,{'state':state})
  if action=='signal':
   if call['state']!='accepted':return self.reply(409,{'error':'The call is not active.'})
   msg=data.get('message');kind=msg.get('type') if isinstance(msg,dict) else None
   if kind not in ('offer','answer','candidate'):return self.reply(400,{'error':'Invalid connection message.'})
   if kind=='offer' and role!='visitor' or kind=='answer' and role!='host':return self.reply(403,{'error':'Invalid sender.'})
   if kind in ('offer','answer') and (not isinstance(msg.get('sdp'),str) or len(msg['sdp'])>50000):return self.reply(400,{'error':'Invalid description.'})
   if kind=='candidate' and not isinstance(msg.get('candidate'),dict):return self.reply(400,{'error':'Invalid candidate.'})
   with self.store.db() as c:
    count=c.execute('SELECT COUNT(*) FROM signals WHERE call_id=?',(id,)).fetchone()[0]
    if count>=300:return self.reply(429,{'error':'Too many connection messages.'})
    c.execute('INSERT INTO signals(call_id,sender,message) VALUES(?,?,?)',(id,role,json.dumps(msg)))
   return self.reply(200,{'ok':True})
  return self.reply(404,{'error':'Not found.'})

def make_server(host,port,store,site_root=None):
 server=ThreadingHTTPServer((host,port),Handler);server.daemon_threads=True;server.store=store;server.site_root=Path(site_root).resolve() if site_root else None;return server

def main():
 p=argparse.ArgumentParser();p.add_argument('--bind',default='127.0.0.1');p.add_argument('--port',type=int,default=8765);p.add_argument('--state-dir',default=str(Path.home()/'.portfolio-calls'));p.add_argument('--origin',action='append',default=[]);p.add_argument('--site-root');p.add_argument('--certfile');p.add_argument('--keyfile');p.add_argument('--stun-url',help='Optional URL for a STUN server you operate; no external server is used by default.');args=p.parse_args()
 state=Path(args.state_dir);state.mkdir(parents=True,exist_ok=True);os.chmod(state,0o700);password_file=state/'host-password'
 if not password_file.exists():
  fd=os.open(password_file,os.O_WRONLY|os.O_CREAT|os.O_EXCL,0o600)
  with os.fdopen(fd,'w') as f:f.write(secrets.token_urlsafe(32))
 store=Store(state/'calls.sqlite',password_file.read_text().strip(),args.origin,[{'urls':args.stun_url}] if args.stun_url else [])
 server=make_server(args.bind,args.port,store,args.site_root)
 if args.certfile and args.keyfile:
  context=ssl.SSLContext(ssl.PROTOCOL_TLS_SERVER);context.load_cert_chain(args.certfile,args.keyfile);server.socket=context.wrap_socket(server.socket,server_side=True)
 stop_cleanup=threading.Event()
 def cleanup_loop():
  while not stop_cleanup.wait(60):store.cleanup()
 threading.Thread(target=cleanup_loop,daemon=True).start()
 print('Host dashboard: '+('https' if args.certfile else 'http')+'://localhost:'+str(args.port)+'/calls/host',flush=True)
 print('Host password is stored in '+str(password_file)+' (not printed).',flush=True)
 try:server.serve_forever()
 except KeyboardInterrupt:pass
 finally:stop_cleanup.set();server.server_close()
if __name__=='__main__':main()
