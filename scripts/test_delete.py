import subprocess
import pycurl
import json
from StringIO import StringIO
from urllib import urlencode
import os, sys
import requests

""" Wrapper for making http requests to xsdb api """

base_url = 'https://cms-gen-dev.cern.ch/xsdb'
api_url = base_url + '/api'

# you can also create this cookie manually
subprocess.call(['bash', 'getCookie.sh'])

c = pycurl.Curl()
c.setopt(pycurl.FOLLOWLOCATION, 1)
c.setopt(pycurl.COOKIEJAR, os.path.expanduser("~/private/xsdbdev-cookie.txt"))
c.setopt(pycurl.COOKIEFILE, os.path.expanduser("~/private/xsdbdev-cookie.txt"))
c.setopt(pycurl.HTTPHEADER, ['Content-Type:application/json', 'Accept:application/json'])
c.setopt(pycurl.VERBOSE, 0)

with open('id_list', 'r') as f:
    lines = f.readlines()
    for line in lines:
        line = line.rstrip('\n')
        print(line)
        c.setopt(c.URL,api_url+'/delete/'+line)
        c.setopt(c.CUSTOMREQUEST, "DELETE")
        c.perform()



