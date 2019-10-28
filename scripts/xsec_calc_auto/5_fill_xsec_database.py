import os, sys

campaign="Moriond17"
datatier="MINIAODSIM"

xsecdb_folder = "/your/folder/to/xsecdb/scripts" # change this folder
json_output_folder="/your/folder/to/public/xsecdb/json/"

os.system("mkdir -p "+os.getcwd()+"../update_logs")

for filename in os.listdir(json_output_folder):
    
    if not filename.endswith(".json"): 
        continue
    primary_dataset_name = filename.split("xsec_")[1].replace(".json","")
    print primary_dataset_name
    # print filename
        
    if os.path.isfile(xsecdb_folder+"/update_logs/filldb_"+primary_dataset_name+".log"):
        with open(xsecdb_folder+"/update_logs/filldb_"+primary_dataset_name+".log", 'r') as f:
                    content = f.read()
                    if '{"status": "new"' in content and campaign in content: 
                        print 'filldb report existing and valid, skipping dataset'
                        continue
    if os.path.isfile(xsecdb_folder+"/update_logs/filldb_"+primary_dataset_name+"_"+campaign+".log"):
        with open(xsecdb_folder+"/update_logs/filldb_"+primary_dataset_name+"_"+campaign+".log", 'r') as f:
                    content = f.read()
                    if '{"status": "new"' in content and campaign in content: 
                        print 'filldb report existing and valid, skipping dataset'
                        continue
    
    with open(json_output_folder+filename, 'r') as f:
        content = f.read()
        if not 'REPLACE_' in content: 
            print "json OK, uploading"
        else:
            print "json corrupted, skipping"
            continue
    
    os.system(" cd "+xsecdb_folder+"/wrapper;\
            python "+xsecdb_folder+"/xsdb_insert_file.py --file "+json_output_folder+"/xsec_"+primary_dataset_name+".json \
            2>&1 | tee "+xsecdb_folder+"/update_logs/filldb_"+primary_dataset_name+"_"+campaign+".log ; \
            cd -; \
            \n\n")

