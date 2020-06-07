import os, sys

with open('.crab_word') as f0:
    crab_word=f0.read()
    crab_word=crab_word.rstrip()
os.system("echo "+crab_word+" | voms-proxy-init -voms cms -valid 192:0")
# os.environ["X509_USER_PROXY"] = os.getcwd()+"/"+crab_user

scram_arch = "slc7_amd64_gcc630"
cmssw = "CMSSW_10_6_0"

queue = "espresso" # uncomment to use lxbatch (parallel)
# queue = "" # uncomment to launch interactively (serial)

xsec_script_folder=os.getcwd()+"/genproductions/test/calculateXSectionAndFilterEfficiency/" # change this folder

# njob=0
with open('datasets.txt') as f:
    for dataset in f:
        dataset = dataset.rstrip('\n')
        print dataset.split('/')[1]
        if not os.path.isfile("getXsec/getXsec_"+dataset.split('/')[1]+".sh"):
            print "Input file not found"
        else:
            if os.path.isfile("xsec/xsec_"+dataset.split('/')[1]+".log"):
                with open("xsec/xsec_"+dataset.split('/')[1]+".log", 'r+') as f2:
                    content = f2.read()
                    if 'final cross section' in content: 
                        print "Cross section already computed, skipping"
                        continue
            with open("getXsec/getXsec_"+dataset.split('/')[1]+".sh", 'r+') as f2:
                content = f2.read()
            os.system("mkdir -p getXsec_for_condor/")
            with open("getXsec_for_condor/getXsec_"+dataset.split('/')[1]+".sh", 'w+') as f2:
                if not '/store' in content:
                    print "Input script corrupted, skipping"
                    continue
                else:
                    f2.seek(0, 0)
                    f2.write("cd /cvmfs/cms.cern.ch/"+scram_arch+"/cms/cmssw/"+cmssw+"/\neval `scramv1 runtime -sh`\ncd - \n\n")
                    f2.write(content)
                    f2.seek(0, 2)
                    f2.write("\ncp xsec_"+dataset.split('/')[1]+".log ../xsec/")

            print "Computing cross section for process: ",dataset.split('/')[1]

            os.system("mkdir -p condor_submit_code/") # the folder which stores submit codes
            os.system("mkdir -p xsec") # the folder which stores results
            os.system("cp "+xsec_script_folder+"genXsec_cfg.py "+os.getcwd()+"/condor_submit_code/")
            os.system("chmod 755 "+os.getcwd()+"/getXsec/getXsec_"+dataset.split('/')[1]+".sh")
            # if queue != "" run on condor
            if queue != "":
                with open(os.getcwd()+"/condor_submit_code/"+dataset.split('/')[1]+".sub",'w+') as f:
                    f.write("universe = vanilla\n")
                    f.write("executable = "+os.getcwd()+"/getXsec/getXsec_"+dataset.split('/')[1]+".sh\n")
                    f.write("requirements = (OpSysAndVer =?= \"SLCern7\")\n")
                    f.write("transfer_input_files = genXsec_cfg.py\n")
                    f.write("+JobFlavour = testmatch\n")
                    f.write("should_transfer_files = YES\n")
                    f.write("RequestCpus = 1\n")
                    # f.write("error = error/"+dataset.split('/')[1]+".err\n")
                    # f.write("output = putput/"+dataset.split('/')[1]+".output\n")
                    # f.write("log = log/"+dataset.split('/')[1]+".log\n")
                    f.write("queue 1")
                os.system("chmod 777 "+os.getcwd()+"/condor_submit_code/"+dataset.split('/')[1]+".sub")
                os.system("condor_submit "+os.getcwd()+"/condor_submit_code/"+dataset.split('/')[1]+".sub")
                    
                # os.system("chmod 755 "+os.getcwd()+"/getXsec/getXsec_"+dataset.split('/')[1]+".sh; bsub -q "+queue+" -u ciaociao1 -C 0 "+os.getcwd()+"/getXsec/getXsec_"+dataset.split('/')[1]+".sh; sleep 2")
                # njob = njob+1

            # local run
            else:
                 os.system("sh getXsec/getXsec_"+dataset.split('/')[1]+".sh")

        # if njob % 100 == 0 and queue != "":
        #      os.system("echo 'submitted "+str(njob)+" jobs, sleeping 3 minutes'; sleep 200")
        # os.system("rm -rf LSFJOB_* core.*")
        # sys.stdout.flush()
        
# while True:
#    os.system("rm -rf LSFJOB_* core.*; sleep 30")
                
 