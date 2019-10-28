
crab_word="" # put here your crab password
campaign=""
datatier=""
xsec_script_folder="/your/folder/to/genproductions/test/calculateXSectionAndFilterEfficiency/"


echo $xsec_script_folder
# fetch datasets and store them in a file
echo ${crab_word} | voms-proxy-init -voms cms;

/cvmfs/cms.cern.ch/common/dasgoclient --query="dataset dataset=/*/*${campaign}*/${datatier}" --limit=0 |grep "^/"> datasets.txt
mkdir -p getfiles

while read -r dataset
do
        PRIMARY_DATASET_NAME=$(echo $dataset | tr "/" "\n" )
        echo $PRIMARY_DATASET_NAME
        filename=$(echo $PRIMARY_DATASET_NAME | awk '{print $1"__"$2;}')
        PRIMARY_DATASET_NAME=$(echo $PRIMARY_DATASET_NAME | awk '{print $1;}')
        echo $PRIMARY_DATASET_NAME
        
        if [ ! -f getfiles/getfiles_$filename.sh ]; then
            echo "Creating file"
            process_string="python ${xsec_script_folder}/compute_cross_section.py -f ${dataset} -c ${campaign} -n 100000 -d ${datatier} --skipexisting \"True\""
            echo "${process_string}" > getfiles/getfiles_$filename.sh
        else
            echo "File found"
        fi
    
done < "datasets.txt"
