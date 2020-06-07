import os,sys

with open('.crab_word') as f0:
    crab_word=f0.read()
    crab_word=crab_word.rstrip()

# campaign="RunIIFall17"
campaign="Moriond17"
datatier="MINIAODSIM"
xsec_script_folder=os.getcwd()+"/genproductions/test/calculateXSectionAndFilterEfficiency/" # change this folder

# fetch datasets and store them in a file
os.system("echo "+crab_word+" | voms-proxy-init -voms cms -valid 192:0")
os.system("/cvmfs/cms.cern.ch/common/dasgoclient --query=\"dataset dataset=/*/*$"+campaign+"*/"+datatier+"\" --limit=10 |grep \"^/\"> datasets.txt")
os.system("mkdir -p getfiles")

with open("datasets.txt") as f:
        lines = f.readlines()
for line in lines:
        line = line.rstrip('\n')
        # print line
        PRIMARY_DATASET_NAME = line.split('/')[1]
        print PRIMARY_DATASET_NAME

        # use full file name may cause some overlaps. But I think it is necessary. Please contact us if you have any opinion: sdeng@cern.ch
        # e.g. /ADDGravToGG_MS-10000_NED-2_KK-1_M-1000To2000_13TeV-sherpa/RunIISummer16MiniAODv2-PUMoriond17_80X_mcRun2_asymptotic_2016_TrancheIV_v6-v2/MINIAODSIM
        #      /ADDGravToGG_MS-10000_NED-2_KK-1_M-1000To2000_13TeV-sherpa/RunIISummer16MiniAODv3-PUMoriond17_94X_mcRun2_asymptotic_v3-v2/MINIAODSIM
        # this two datasets have the same process name, but one is from 80X and another is from 94X
        # filename = line.split('/')[1]+"__"+line.split('/')[2]
        
        if os.path.isfile("getfiles/getfiles_"+PRIMARY_DATASET_NAME+".sh"):
            print "File found"
        else:
           print "Creating file"
           process_string="python "+xsec_script_folder+"/compute_cross_section.py -f "+line+" -c "+campaign+" -n 100000 -d "+datatier+" --skipexisting \"True\""
           os.system("echo \""+process_string+"\" > getfiles/getfiles_"+PRIMARY_DATASET_NAME+".sh")
