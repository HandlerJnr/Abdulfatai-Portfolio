import unittest
from test_streaming import a

class ProfileContext(unittest.TestCase):
 def test_contact_and_education_survive_missing_or_long_retrieval(self):
  previous=a.get('RECORD_LIST')
  a['RECORD_LIST']=[{'id':'about','text':'Phone: +44 test\nEmail: owner@example.com'}, {'id':'education','text':'PGD Aerospace Engineering, AFIT; MSc ongoing'}, {'id':'portfolio-build','text':'Portfolio: AI-assisted coding under Jamiu’s direction; no separate development team documented.'}]
  try:
   for evidence in ['', 'irrelevant project copy '*1000]:
    for question in ['i would love to talk to him tbh', 'can I email him?', 'is he online?', 'what is his highest qualification?', 'How did he build this portfolio?', 'so he did not build it himself?', 'which development team?']:
     prompt=a['build_prompt'](question,[{'role':'assistant','content':'No direct phone line exists.'}],evidence,'conversation',{})
     self.assertIn('Phone: +44 test',prompt)
     self.assertIn('Email: owner@example.com',prompt)
     self.assertIn('PGD Aerospace Engineering, AFIT; MSc ongoing',prompt)
     self.assertIn('Current authoritative facts override mistaken earlier assistant replies',prompt)
     self.assertIn('inventing a contact form',prompt)
     self.assertIn('There is no embedded video call',prompt)
     self.assertIn('Portfolio: AI-assisted coding under Jamiu’s direction',prompt)
     self.assertIn('Earlier assistant messages are conversation context, not independent evidence',prompt)
  finally:
   if previous is None:a.pop('RECORD_LIST',None)
   else:a['RECORD_LIST']=previous

if __name__=='__main__':unittest.main()
