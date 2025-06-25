#!/usr/bin/env python3
import os, pycurl, json, os, io, yaml


CAMPAIGN = "RunIII"
DATATIER = "MINIAODSIM"
DATASET = f"/*/*{CAMPAIGN}*/{DATATIER}"


def fecth_datasets(outfile='./datasets.txt'):
    with open('user_config.yaml') as f:
        user_config = yaml.safe_load(f)
    password = user_config['password']
    
    # fetch datasets and store them in a file
    os.system(f"echo {password} | voms-proxy-init -voms cms -valid 192:0")
    os.system(f"/cvmfs/cms.cern.ch/common/dasgoclient --query=\"dataset dataset={DATASET}\" --limit=-1 |grep \"^/\"> {outfile}")


def remove_datasets_existed_on_db(infile='./datasets.txt'):
    base_url = 'https://xsecdb-xsdb-official.app.cern.ch'
    api_url = os.path.join(base_url, 'api')

    # you can also create this cookie manually
    #os.remove(os.path.expanduser("~/private/xsdbdev-cookie.txt"))
    #os.system(f"auth-get-sso-cookie -u {base_url} -o ~/private/xsdbdev-cookie.txt")

    c = pycurl.Curl()
    c.setopt(c.FOLLOWLOCATION, 1)
    c.setopt(c.COOKIEJAR, os.path.expanduser("~/private/xsdbdev-cookie.txt"))
    c.setopt(c.COOKIEFILE, os.path.expanduser("~/private/xsdbdev-cookie.txt"))
    c.setopt(c.HTTPHEADER, ['Content-Type:application/json', 'Accept:application/json'])
    c.setopt(c.VERBOSE, True)  # set to True for debug
    c.setopt(c.URL, os.path.join(api_url, 'search'))
    c.setopt(c.POST, True)

    with open(infile) as f:
        datasets = f.read().splitlines()
    undone_datasets = []

    for dataset in datasets:
        process_name = dataset.split('/')[1]
        # if use filename in 1_inquire, the query should also modify
        # on XSDB, e.g. /ADDGravToGG_MS-10000_NED-2_KK-1_M-1000To2000_13TeV-sherpa/RunIISummer16MiniAODv3-PUMoriond17_94X_mcRun2_asymptotic_v3-v2/MINIAODSIM
        #               /ADDGravToGG_MS-10000_NED-2_KK-1_M-1000To2000_13TeV-sherpa/RunIISummer16MiniAODv2-PUMoriond17_80X_mcRun2_asymptotic_2016_TrancheIV_v6-v2/MINIAODSIM
        # The query to seperate them could be e.g. DAS=ADDGravToGG_MS-10000_NED-2_KK-1_M-1000To2000_13TeV-sherpa && DAS=RunIISummer16MiniAODv3-PUMoriond17_94X_mcRun2_asymptotic_v3-v2
        # query = {'process_name':process_name+'*','DAS':dataset.split('/')[2]}
        query = {
            'process_name': process_name,
            # 'createdBy': 'sdeng',
        }
        json_query = json.dumps(query)

        # search on XSDB and find if the dataset has already existed
        c.setopt(c.POSTFIELDS, json_query)
        byte_io = io.BytesIO()
        c.setopt(c.WRITEFUNCTION, byte_io.write)
        c.perform()
        search_result = byte_io.getvalue().decode('UTF-8')
        
        if search_result == '[]':
            undone_datasets.append(dataset)
        elif search_result == '{}':
            raise ValueError("HTTP connection ERROR! Please debug by setting c.setopt(c.VERBOSE, True)")
        else:
            print(f"existed on DB: {dataset}")

    with open(infile, 'w', encoding='utf-8') as f:
        f.write('\n'.join(undone_datasets))


def generate_fetch_files(infile='./datasets.txt', outdir='./fetch_files/'):
    with open(infile) as f:
        lines = f.read().splitlines()
    os.system(f'rm -rf {outdir}')
    os.makedirs(outdir, mode=0o755, exist_ok=True)
    if not os.path.exists('genproductions'):
        os.system("git clone git@github.com:cms-sw/genproductions.git")
    for line in lines:
        process_name = line.split('/')[1]
        print(process_name)

        # use full file name may cause some overlaps. But I think it is necessary. Please contact us if you have any opinion: sdeng@cern.ch
        # e.g. /ADDGravToGG_MS-10000_NED-2_KK-1_M-1000To2000_13TeV-sherpa/RunIISummer16MiniAODv2-PUMoriond17_80X_mcRun2_asymptotic_2016_TrancheIV_v6-v2/MINIAODSIM
        #      /ADDGravToGG_MS-10000_NED-2_KK-1_M-1000To2000_13TeV-sherpa/RunIISummer16MiniAODv3-PUMoriond17_94X_mcRun2_asymptotic_v3-v2/MINIAODSIM
        # this two datasets have the same process name, but one is from 80X and another is from 94X
        # filename = line.split('/')[1]+"__"+line.split('/')[2]

        file_path = os.path.join(outdir, f"{process_name}.sh")
        compute_cross_section = os.path.join(os.getcwd(), "genproductions/Utilities/calculateXSectionAndFilterEfficiency/compute_cross_section.py")

        if os.path.isfile(file_path):
            print(f"File found: {file_path}")
        else:
            print(f"Creating file: {file_path}")
            generate_command = f"python2 {compute_cross_section} -f {line} -c {CAMPAIGN} -n 100000 -d {DATATIER} --skipexisting \"True\""
            os.system(f"echo \"{generate_command}\" > {file_path}")


if __name__ == "__main__":
    fecth_datasets(outfile='./datasets.txt')
    remove_datasets_existed_on_db(infile='./datasets.txt')
    generate_fetch_files(infile='./datasets.txt', outdir='./fetch_files/')
