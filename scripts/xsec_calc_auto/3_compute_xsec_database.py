import os, sys


crab_word = "" # put here your crab password
crab_user = "" # put here your crab user (the one that gets returned after voms etc etc)

os.system("echo "+crab_word+" | voms-proxy-init -voms cms; cp /tmp/"+crab_user+" "+os.getcwd())
os.environ["X509_USER_PROXY"] = crab_user

scram_arch = "slc7_amd64_gcc700"
cmssw = "CMSSW_10_6_0"

queue = "espresso" # uncomment to use lxbatch (parallel)
# queue = "" # uncomment to launch interactively (serial)

xsec_script_folder="/your/folder/to/genproductions/test/calculateXSectionAndFilterEfficiency/" # change this folder

njob=0
with open('datasets.txt') as f:
    for dataset in f:
        dataset = dataset.rstrip('\n')
        print dataset.split('/')[1]
        filename = dataset.split('/')[1]+"__"+dataset.split('/')[2]
        if not os.path.isfile("getXsec/getXsec_"+filename+".sh"):
            print "Input file not found"
        else:
            if os.path.isfile("xsec/xsec_"+filename+".log"):
                with open("xsec/xsec_"+filename+".log", 'r+') as f:
                    content = f.read()
                    if 'final cross section' in content: 
                        print "Cross section already computed, skipping"
                        continue
            with open("getXsec/getXsec_"+filename+".sh", 'r+') as f:
                content = f.read()
                if not '/store' in content:
                    print "Input script corrupted, skipping"
                    continue
                if not 'cvmfs' in content:
                    f.seek(0, 0)
                    f.write("#!/bin/bash\n"+"cd /cvmfs/cms.cern.ch/"+scram_arch+"/cms/cmssw/"+cmssw+"/\n eval `scramv1 runtime -sh`\n cd "+os.getcwd()+"/output/"+filename+"_/\n\n" + content+"mv xsec_"+dataset.split('/')[1]+".log xsec_"+filename+".log;"+"mv xsec_"+filename+".log "+os.getcwd()+"/xsec/")
            print "Computing cross section"
            if queue != "":
#                os.system("chmod 755 "+os.getcwd()+"/getXsec/getXsec_"+dataset.split('/')[1]+".sh; bsub -q "+queue+" -u ciaociao1 -C 0 "+os.getcwd()+"/getXsec/getXsec_"+dataset.split('/')[1]+".sh; sleep 2")
                os.system("chmod 755 "+os.getcwd()+"/getXsec/getXsec_"+filename+".sh;mkdir -p xsec/;mkdir -p output/"+filename+"_")
                dic= os.getcwd() ; dic_executable = dic+"/getXsec/getXsec" ; dic_output = dic+"/output/"+filename+"_/"
                with open(os.getcwd()+"/output/"+filename+"_/condor.sub", 'w+') as f:
 			f.write("universe              = vanilla\n"+"executable            = "+dic_executable+"_"+filename+".sh\n"+"output                = "+dic_output+filename+".out\n"+"error                 = "+dic_output+filename+".err\n"+"log                   = "+dic_output+filename+".log\n"+"+MaxRuntime           = 3600\n"+"transfer_input_files  = "+dic+"/"+crab_user+"\n"+"x509userproxy         = "+crab_user+"\n"+"+JobFlavour           = \"espresso\"\n"+"queue")
                os.system("chmod 777 "+os.getcwd()+"/output/"+filename+"_/condor.sub")
                os.system("cp genXsec_cfg.py "+"output/"+filename+"_/" )
                os.system("condor_submit "+os.getcwd()+"/output/"+filename+"_/condor.sub" )
                njob = njob+1
            else:
                os.system("sh getXsec/getXsec_"+dataset.split('/')[1]+".sh")
    #    if njob % 100 == 0 and queue != "":
    #          os.system("echo 'submitted "+str(njob)+" jobs, sleeping 3 minutes'; sleep 200")
    #    sys.stdout.flush()
        
                
 
