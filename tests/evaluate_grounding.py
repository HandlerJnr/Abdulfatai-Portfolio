"""Opt-in deployed-model evaluation; no API keys, no output of access URLs/cookies.

AGENT_PREVIEW_ACCESS_URL may contain a temporary Vercel share URL.
python tests/evaluate_grounding.py --base-url https://preview.vercel.app --case 'academic status'
"""
import argparse,http.cookiejar,json,os,sys,urllib.error,urllib.parse,urllib.request
from pathlib import Path

def evaluate(base_url,cases):
 opener=urllib.request.build_opener(urllib.request.HTTPCookieProcessor(http.cookiejar.CookieJar()))
 access=os.environ.get('AGENT_PREVIEW_ACCESS_URL')
 if access:
  with opener.open(access,timeout=30) as response:response.read()
 results=[]
 for case in cases:
  history=list(case.get('history',[]));rows=[]
  for turn in case['turns']:
   request=urllib.request.Request(base_url.rstrip('/')+'/api/agent',data=json.dumps({'question':turn['question'],'history':history,'stream':True}).encode(),headers={'Content-Type':'application/json','Origin':base_url.rstrip('/')},method='POST')
   try:
    with opener.open(request,timeout=55) as response:
     if 'application/x-ndjson' not in response.headers.get('content-type',''):
      raise RuntimeError('unexpected_response_type')
     events=[json.loads(line) for line in response if line.strip()]
    errors=[e for e in events if e.get('type')=='error']
    if errors:
     rows.append({'question':turn['question'],'error':errors[-1].get('code','unknown')});break
    done=next(e for e in reversed(events) if e.get('type')=='done')
    answer=done['answer'];lower=answer.lower()
    missing=[group for group in turn['required_any'] if not any(word.lower() in lower for word in group)]
    forbidden=[phrase for phrase in turn['forbidden'] if phrase.lower() in lower]
    rows.append({'question':turn['question'],'answer':answer,'pass':not missing and not forbidden,'missing':missing,'forbidden':forbidden})
    history.extend([{'role':'user','content':turn['question']},{'role':'assistant','content':answer}])
   except urllib.error.HTTPError as error:
    rows.append({'question':turn['question'],'error':'http_'+str(error.code)});break
   except Exception as error:
    rows.append({'question':turn['question'],'error':type(error).__name__});break
  results.append({'case':case['name'],'pass':len(rows)==len(case['turns']) and all(row.get('pass') for row in rows),'turns':rows})
  if any(row.get('error')=='rate_limit' for row in rows):break
 return results

if __name__=='__main__':
 parser=argparse.ArgumentParser();parser.add_argument('--base-url',required=True);parser.add_argument('--case');args=parser.parse_args()
 cases=json.loads(Path(__file__).with_name('grounding-conversations.json').read_text())
 if args.case:cases=[case for case in cases if case['name']==args.case]
 if not cases:raise SystemExit('No matching evaluation case')
 results=evaluate(args.base_url,cases);print(json.dumps(results,ensure_ascii=False,indent=2))
 sys.exit(0 if all(row['pass'] for row in results) else 1)
