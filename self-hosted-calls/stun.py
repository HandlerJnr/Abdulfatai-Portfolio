"""Optional self-hosted IPv4 STUN binding service. Not a TURN relay."""
import argparse,socket,struct,time
from collections import defaultdict,deque
COOKIE=0x2112A442

def binding_response(data,address):
 if len(data)<20:return None
 kind,length,cookie,transaction=struct.unpack('!HHI12s',data[:20])
 if kind!=1 or cookie!=COOKIE or length%4 or len(data)<20+length:return None
 ip,port=address[:2];encoded_ip=bytes(x^y for x,y in zip(socket.inet_aton(ip),struct.pack('!I',COOKIE)))
 value=struct.pack('!BBH',0,1,port^(COOKIE>>16))+encoded_ip
 attr=struct.pack('!HH',0x0020,len(value))+value
 return struct.pack('!HHI12s',0x0101,len(attr),COOKIE,transaction)+attr

def main():
 parser=argparse.ArgumentParser();parser.add_argument('--bind',default='127.0.0.1');parser.add_argument('--port',type=int,default=3478);args=parser.parse_args()
 sock=socket.socket(socket.AF_INET,socket.SOCK_DGRAM);sock.bind((args.bind,args.port));requests=defaultdict(deque)
 try:
  while True:
   data,address=sock.recvfrom(2048);now=time.monotonic();q=requests[address[0]]
   while q and q[0]<now-1:q.popleft()
   if len(q)>=10:continue
   if len(requests)>1000:requests.clear()
   q.append(now);reply=binding_response(data,address)
   if reply:sock.sendto(reply,address)
 except KeyboardInterrupt:pass
 finally:sock.close()
if __name__=='__main__':main()
