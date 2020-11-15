import subprocess
import pycurl
import json
from StringIO import StringIO
from urllib import urlencode
import os
import requests
import re

""" Wrapper for making http requests to xsdb api """

base_url = 'https://cms-gen-dev.cern.ch/xsdb'
api_url = base_url + '/api'
keyval_dict = {'createdBy':'sdeng','modifiedOn':'2020-09-25'}
query = {
            'search': keyval_dict,
            'pagination':{
                'pageSize': 0,
                'currentPage': 0 
            },
            'orderBy':{} 
        }
# query= {'DAS':'/GJets_HT-400To600_TuneCP5_13TeV-madgraphMLM-pythia8/RunIIFall17MiniAODv2-PU2017_12Apr2018_94X_mc2017_realistic_v14-v1/MINIAODSIM'}
json = json.dumps(query)
subprocess.call(['bash', 'getCookie.sh'])

c = pycurl.Curl()
c.setopt(pycurl.FOLLOWLOCATION, 1)
c.setopt(pycurl.COOKIEJAR, os.path.expanduser("~/private/xsdbdev-cookie.txt"))
c.setopt(pycurl.COOKIEFILE, os.path.expanduser("~/private/xsdbdev-cookie.txt"))
c.setopt(pycurl.HTTPHEADER, ['Content-Type:application/json', 'Accept:application/json'])
c.setopt(pycurl.VERBOSE, 0)

c.setopt(pycurl.URL,api_url+'/search')
with open('search.json', 'w+') as f:
    c.setopt(pycurl.WRITEFUNCTION,f.write)
    c.setopt(pycurl.POST, 1)
    c.setopt(pycurl.POSTFIELDS,json)
    c.perform()
f.close()
with open('search.json', 'r') as f:
    line = f.read()
f.close()
with open('id_list', 'w+') as f:
    id_list = re.findall(r'\"\$oid\"\: \"(.+?)\"',line)
    for id in id_list:
        f.write(id+'\n')
f.close()
with open('DAS_list','w+') as f:
    DAS_list = re.findall(r'\"DAS\"\: \"(.+?)\"',line)
    for DAS in DAS_list:
        f.write(DAS+'\n')

