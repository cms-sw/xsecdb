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
#query= {'createdBy':'sdeng'}
#json = json.dumps(query)

# you can also create this cookie manually
subprocess.call(['bash', 'getCookie.sh'])

c = pycurl.Curl()
c.setopt(pycurl.FOLLOWLOCATION, 1)
c.setopt(pycurl.COOKIEJAR, os.path.expanduser("~/private/xsdbdev-cookie.txt"))
c.setopt(pycurl.COOKIEFILE, os.path.expanduser("~/private/xsdbdev-cookie.txt"))
c.setopt(pycurl.HTTPHEADER, ['Content-Type:application/json', 'Accept:application/json'])
c.setopt(pycurl.VERBOSE, 0)

with open('datasets.txt') as f:
    datasets = f.readlines()
with open('datasets.txt','w+') as f_out:
    for dataset in datasets:
        #print dataset
        dataset = dataset.rstrip('\n')
        process_name = dataset.split('/')[1]
        query = {'process_name':process_name}

    # if use filename in 1_inquire, the query should also modify
    # on XSDB, e.g. /ADDGravToGG_MS-10000_NED-2_KK-1_M-1000To2000_13TeV-sherpa/RunIISummer16MiniAODv3-PUMoriond17_94X_mcRun2_asymptotic_v3-v2/MINIAODSIM
    #               /ADDGravToGG_MS-10000_NED-2_KK-1_M-1000To2000_13TeV-sherpa/RunIISummer16MiniAODv2-PUMoriond17_80X_mcRun2_asymptotic_2016_TrancheIV_v6-v2/MINIAODSIM
    # The query to seperate them could be e.g. DAS=ADDGravToGG_MS-10000_NED-2_KK-1_M-1000To2000_13TeV-sherpa && DAS=RunIISummer16MiniAODv3-PUMoriond17_94X_mcRun2_asymptotic_v3-v2
    # query = {'process_name':process_name+'*','DAS':dataset.split('/')[2]}

        # search on XSDB and find if the dataset has already existed
        json_query = json.dumps(query)
        c.setopt(pycurl.URL,api_url+'/search')
        with open('search.json', 'w+') as f2:
            c.setopt(pycurl.WRITEFUNCTION,f2.write)
            c.setopt(pycurl.POST, 1)
            c.setopt(pycurl.POSTFIELDS,json_query)
            c.perform()
            f2.seek(0)
            search = f2.read()
            #print search
            #print type(search)
        if search == '[]':
            f_out.write(dataset+'\n')
        else:
            # filename = dataset.split('/')[1]+"__"+dataset.split('/')[2]
            # os.popen('echo test > getfiles/getfiles_'+filename+'.sh')
            # os.remove('getfiles/getfiles_'+filename+'.sh')
            os.popen('echo test > getfiles/getfiles_'+process_name+'.sh')
            os.remove('getfiles/getfiles_'+process_name+'.sh')
            print "existed on DB: ",dataset

