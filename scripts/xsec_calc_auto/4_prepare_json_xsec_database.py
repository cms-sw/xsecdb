import os, sys

campaign="Moriond17"
datatier="MINIAODSIM"

crab_word = "" # put here your crab password
crab_user = "" # put here your crab user (the one that gets returned after voms etc etc)

xsec_script_folder="/your/folder/to/genproductions/test/calculateXSectionAndFilterEfficiency/" # change this folder

with open('datasets.txt') as f:
    for dataset in f:
        dataset = dataset.rstrip('\n')
        primary_dataset_name = dataset.split("/")[1]
        os.system("cp test_xsecdb_insert.json xsec_"+primary_dataset_name+".json")
        print primary_dataset_name
        os.system("sed -i -e 's/REPLACE_PRIMARY_DATASET_NAME/"+primary_dataset_name+"/g' xsec_"+primary_dataset_name+".json")
        os.system("sed -i -e 's/REPLACE_FULL_DATASET_NAME/"+dataset.replace("/","\/")+"/g' xsec_"+primary_dataset_name+".json")
        cross_section = os.popen("grep final\ cross\ section xsec_"+primary_dataset_name+".log").read().replace("pb","").replace(" ","").rstrip().split("=")[1].split("+-")
        os.system("sed -i -e 's/REPLACE_CROSS_SECTION/"+str(float(cross_section[0]))+"/g' xsec_"+primary_dataset_name+".json")
        # xsec_uncertainty = float(cross_section[1])/float(cross_section[0])*100. # percent
        xsec_uncertainty = float(cross_section[1]) # absolute in pb
        os.system("sed -i -e 's/REPLACE_TOTAL_UNCERTAINTY/"+str(xsec_uncertainty)+"/g' xsec_"+primary_dataset_name+".json")
        equivalent_lumi = float(os.popen("grep equivalent\ lumi xsec_"+primary_dataset_name+".log").read().replace("pb","").replace(" ","").rstrip().split("=")[1].split("+-")[0])
        os.system("sed -i -e 's/REPLACE_EQUIVALENT_LUMI/"+str(equivalent_lumi)+"/g' xsec_"+primary_dataset_name+".json")
        negative_weights = float(os.popen("grep fraction\ of\ events\ with\ negative\ weights xsec_"+primary_dataset_name+".log").read().replace("pb","").replace(" ","").rstrip().split("=")[1].split("+-")[0])
        os.system("sed -i -e 's/REPLACE_FRACTION_NEGATIVE_WEIGHT/"+str(negative_weights)+"/g' xsec_"+primary_dataset_name+".json")
        center_of_mass_energy = primary_dataset_name.split("TeV")[0].rsplit("_",1)[1]
        os.system("sed -i -e 's/REPLACE_ENERGY/"+str(center_of_mass_energy)+"/g' xsec_"+primary_dataset_name+".json")
        matrix_element = "none"
        accuracy = "none"
        shower = "none"
        if "powheg" in primary_dataset_name:
            matrix_element = "Powheg"
            accuracy = "NLO"
        elif "madgraph" in primary_dataset_name:
            matrix_element = "Madgraph"
            accuracy = "LO"
        elif "amcnlo" in primary_dataset_name:
            matrix_element = "Madgraph"
            accuracy = "NLO"
        elif "sherpa" in primary_dataset_name:
            matrix_element = "Sherpa"
            shower = "Sherpa"
            accuracy = "NLO"
        if "pythia8" in primary_dataset_name:
            shower = "Pythia8"
            if matrix_element == "":
                matrix_element = "Pythia8"
                accuracy = "LO"
                
        os.system("sed -i -e 's/REPLACE_MATRIX_ELEMENT/"+str(matrix_element)+"/g' xsec_"+primary_dataset_name+".json")
        os.system("sed -i -e 's/REPLACE_PARTON_SHOWER/"+str(shower)+"/g' xsec_"+primary_dataset_name+".json")
        os.system("sed -i -e 's/REPLACE_ACCURACY/"+str(accuracy)+"/g' xsec_"+primary_dataset_name+".json")
        mcm_prepid = os.popen('echo "'+crab_word+'" | voms-proxy-init -voms cms; \
          /cvmfs/cms.cern.ch/common/das_client --query="mcm dataset='+dataset+'" \
          ').read().rsplit('\n',2)[1]
        os.system("sed -i -e 's/REPLACE_MCM_PREPID/"+str(mcm_prepid)+"/g' xsec_"+primary_dataset_name+".json")
        
        os.system("sed -i -e 's/REPLACE_MCM_PREPID/"+str(mcm_prepid)+"/g' xsec_"+primary_dataset_name+".json")
        

