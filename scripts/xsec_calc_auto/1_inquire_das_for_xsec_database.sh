
crab_word="" # put here your crab password

# campaign="RunIIFall17"
campaign="Moriond17"
datatier="MINIAODSIM"
xsec_script_folder="/your/folder/to/genproductions/test/calculateXSectionAndFilterEfficiency/" # change this folder

# fetch datasets and store them in a file
echo ${crab_word} | voms-proxy-init -voms cms;
/cvmfs/cms.cern.ch/common/dasgoclient --query="dataset dataset=/*/*${campaign}*/${datatier}" --limit=0 |grep "^/"> datasets.txt
mkdir -p getfiles

while read -r dataset
do
        PRIMARY_DATASET_NAME=$(echo $dataset | tr "/" "\n" )
        PRIMARY_DATASET_NAME=$(echo $PRIMARY_DATASET_NAME | awk '{print $1;}')
        echo $PRIMARY_DATASET_NAME
        
        if [ ! -f getfiles/getfiles_$PRIMARY_DATASET_NAME.sh ]; then
            echo "Creating file"
            process_string="python ${xsec_script_folder}/compute_cross_section.py -f ${dataset} -c ${campaign} -n 100000 -d ${datatier} --skipexisting \"True\""
            echo "${process_string}" > getfiles/getfiles_$PRIMARY_DATASET_NAME.sh
        else
            echo "File found"
        fi
    
done < "datasets.txt"
