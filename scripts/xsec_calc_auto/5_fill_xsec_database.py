import os, sys

campaign="Moriond17"
datatier="MINIAODSIM"

crab_word = "" # put here your crab password
crab_user = "" # put here your crab user (the one that gets returned after voms etc etc)
xsecdb_folder = "/your/folder/to/xsecdb/scripts" # change this folder

xsec_script_folder="/your/folder/to/genproductions/test/calculateXSectionAndFilterEfficiency/" # change this folder

with open('datasets.txt') as f:
    for dataset in f:
        dataset = dataset.rstrip('\n')
        primary_dataset_name = dataset.split("/")[1]
        os.system(" cd "+xsecdb_folder+"/wrapper;\
                python "+xsecdb_folder+"/xsdb_insert_file.py --file "+xsec_script_folder+"xsec_"+primary_dataset_name+".json \
                2>&1 | tee "+xsec_script_folder+"filldb_"+primary_dataset_name+".log ; \
                cd -; \
                ")
        
