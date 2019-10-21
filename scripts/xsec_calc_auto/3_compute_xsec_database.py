import os, sys


crab_word = "" # put here your crab password
crab_user = "" # put here your crab user (the one that gets returned after voms etc etc)

os.system("echo "+crab_word+" | voms-proxy-init -voms cms; cp /tmp/"+crab_user+" "+os.getcwd())
os.environ["X509_USER_PROXY"] = crab_user

scram_arch = "slc7_amd64_gcc630"
cmssw = "CMSSW_10_2_0"

queue = "espresso" # uncomment to use condor (parallel)
# queue = "" # uncomment to launch interactively (serial)


njob=0
with open('datasets.txt') as f:
    for dataset in f:
        dataset = dataset.rstrip('\n')
        print dataset.split('/')[1]
        if not os.path.isfile("getXsec/getXsec_"+dataset.split('/')[1]+".sh"):
            print "Input file not found"
        else:
            if os.path.isfile("xsec/xsec_"+dataset.split('/')[1]+".log"):
                with open("xsec/xsec_"+dataset.split('/')[1]+".log", 'r+') as f:
                    content = f.read()
                    if 'final cross section' in content: 
                        print "Cross section already computed, skipping"
                        continue
            with open("getXsec/getXsec_"+dataset.split('/')[1]+".sh", 'r+') as f:
                content = f.read()
                if not '/store' in content:
                    print "Input script corrupted, skipping"
                    continue
                if not 'cvmfs' in content:
                    f.seek(0, 0)
                    f.write("#!/bin/bash\n"+"cd /cvmfs/cms.cern.ch/"+scram_arch+"/cms/cmssw/"+cmssw+"/\n eval `scramv1 runtime -sh`\n cd "+os.getcwd()+"\n\n" + content+"mv xsec_"+dataset.split('/')[1]+".log xsec/")
            print "Computing cross section"
            if queue != "":
#                os.system("chmod 755 "+os.getcwd()+"/getXsec/getXsec_"+dataset.split('/')[1]+".sh; bsub -q "+queue+" -u ciaociao1 -C 0 "+os.getcwd()+"/getXsec/getXsec_"+dataset.split('/')[1]+".sh; sleep 2")
                os.system("chmod 755 "+os.getcwd()+"/getXsec/getXsec_"+dataset.split('/')[1]+".sh;")
                os.system("mkdir -p xsec/;"+"mkdir -p output/"+dataset.split('/')[1]+"_;"+"bash pro_subfile.sh " + dataset.split('/')[1] )
                os.system("condor_submit "+os.getcwd()+"/output/"+dataset.split('/')[1]+"_/condor.sub" )
                njob = njob+1
            else:
                os.system("sh getXsec/getXsec_"+dataset.split('/')[1]+".sh")
        if njob % 100 == 0 and queue != "":
              os.system("echo 'submitted "+str(njob)+" jobs, sleeping 3 minutes'; sleep 200")
        sys.stdout.flush()
        
                
 
