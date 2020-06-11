import os, sys

# THIS SCRIPT REQUIRES CMSSW AND VOMS ENVIRONMENT

xsec_script_folder=os.getcwd()+"/genproductions/test/calculateXSectionAndFilterEfficiency/" # change this folder

os.system("mkdir -p getXsec")

with open('datasets.txt') as f:
    for dataset in f:
        dataset = dataset.rstrip('\n')
        print dataset.split('/')[1]
        if not os.path.isfile("getXsec/getXsec_"+dataset.split('/')[1]+".sh"):
            print "Creating file"
            os.popen("sh getfiles/getfiles_"+dataset.split('/')[1]+".sh 2>&1 > getXsec/getXsec_"+dataset.split('/')[1]+".sh").read()
        else:
            with open("getXsec/getXsec_"+dataset.split('/')[1]+".sh", 'r+') as f:
                content = f.read()
                if not '/store' in content:
                    with open("getfiles/getfiles_"+dataset.split('/')[1]+".sh", 'r') as f2:
                        content2 = ""
                        content2 = f2.read()
                        if not '--skipexisting "False"' in content2:
                            print "File corrupted, recreating file"
                            content2 = content2.replace('--skipexisting "True"','--skipexisting "False"')
                            with open("getfiles/getfiles_"+dataset.split('/')[1]+".sh", 'w') as f2:
                                f2.write(content2)
                                print "setting skipexisting to False"
                    os.popen("sh getfiles/getfiles_"+dataset.split('/')[1]+".sh 2>&1 > getXsec/getXsec_"+dataset.split('/')[1]+".sh").read()
                    with open("getfiles/getfiles_"+dataset.split('/')[1]+".sh", 'r') as f2:
                        content2 = ""
                        content2 = f2.read()
                        if '--skipexisting "False"' in content2:
                            content2 = content2.replace('--skipexisting "False"','--skipexisting "True"')
                            with open("getfiles/getfiles_"+dataset.split('/')[1]+".sh", 'w') as f2:
                                f2.write(content2)
                else:
                    print "File found"
        os.system("chmod 777 getXsec/getXsec_"+dataset.split('/')[1]+".sh")
        
        # f1=open("xsec_"+dataset.split('/')[1]+"_getfiles.sh", 'w')
        # f1.write('python '+xsec_script_folder+'/compute_cross_section.py -f '+dataset+' -c '+campaign+' -n 100000 -d '+datatier+' --skipexisting "True"')
        # f1.close()
