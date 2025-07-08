#!/usr/bin/env python3
import os, json


def parse_condor_output_to_json(infile = 'datasets.txt', condor_dir = './condor', json_dir = './json'):
    os.system(f'rm -rf {json_dir}')
    os.makedirs(json_dir, exist_ok=True)
    output_dir = os.path.join(condor_dir, 'output')
    with open(infile) as f:
        datasets = f.read().splitlines()
    with open('xsdb_record_template.json', 'r', encoding='utf-8') as f:
        record_template = json.load(f)

    for dataset in datasets:
        process_name = dataset.split('/')[1]
        print(process_name)
        condor_output = os.path.join(output_dir, f'{process_name}.output')
        json_file = os.path.join(json_dir, f'{process_name}.json')

        if not os.path.exists(condor_output):
            print(f"Input file not found: {condor_output}")
            continue
        with open(condor_output, 'r', encoding='utf-8') as f:
            log = f.read()

        if not os.path.exists(json_file):
            if 'final cross section' not in log: 
                print("Cross section computation not correctly performed, skipping")
                os.system("rm -rf dataset_noxsec.txt")
                os.system(f"echo {process_name} >> dataset_noxsec.txt")
                if 'Successfully opened file' not in log:
                    os.system("rm -rf dataset_filenotfound.txt")
                    os.system(f"echo {process_name} >> dataset_filenotfound.txt")
                continue
        else:
            with open(json_file, 'r') as f:
                content = f.read()
            if '$' not in content:
                print("json OK, skipping")
                continue
            else:
                print("json corrupted, reproducing")

        record = record_template['records'][0].copy()
        record['DAS'] = dataset
        record['process_name'] = process_name

        xsec_info = log.split('final cross section = ')[1].split(' pb')[0].split(' +- ')
        record['cross_section'] = float(xsec_info[0])
        if record['cross_section'] == 0.0:
            continue
        record['total_uncertainty'] = float(xsec_info[1])

        equivalent_lumi = log.split('final equivalent lumi for 1M events (1/fb) = ')[1].split(' +- ')[0]
        record['equivalent_lumi'] = float(equivalent_lumi)

        fraction_negative_weight = log.split('final fraction of events with negative weights = ')[1].split(' +- ')[0]
        record['fraction_negative_weight'] = float(fraction_negative_weight)

        if 'TeV' in process_name:
            energy = process_name.split("TeV")[-2].split("_")[-1].split('-')[-1].replace('p', '.')
        elif '20UL18' in dataset:
            energy = '13'
        if process_name == 'VBF_HToInvisible_M125_TuneCP5_PSweights13TeV_powheg_pythia8':
            energy = '13'
        # ToDo
        allowed_energy = ['0.9', '7', '8', '13', '13.6', '14']
        if energy not in allowed_energy:
            continue
            raise ValueError(f"energy of {process_name} is {energy}: not in {allowed_energy}!")
        record['energy'] = energy
        
        matrix_element, accuracy, shower = "none", "unknown", "none"
        process_name = process_name.lower()
        if "powheg" in process_name:
            matrix_element, accuracy = "Powheg", "NLO"
        elif "madgraph" in process_name:
            matrix_element, accuracy = "Madgraph", "LO"
        elif "amcnlo" in process_name or "amcatnlo" in process_name:
            matrix_element, accuracy = "Madgraph", "NLO"
        elif "sherpa" in process_name:
            matrix_element, accuracy, shower = "Sherpa", "NLO", "Sherpa"
        if "pythia8" in process_name:
            shower = "Pythia8"
            if matrix_element == "none":
                matrix_element, accuracy = "Pythia8", "LO"
        if accuracy not in ['LO', 'NLO', 'NNLO', 'NNNLO', 'unknown']:
            raise ValueError(f"accuracy of {process_name} is {accuracy}: not in ['LO', 'NLO', 'NNLO', 'NNNLO', 'unknown']!")
        record['matrix_generator'] = matrix_element
        record['accuracy'] = accuracy
        record['shower'] = shower

        mcm_prepid = os.popen(f'/cvmfs/cms.cern.ch/common/dasgoclient -query="mcm dataset={dataset}"').read().rstrip()
        record['MCM'] = mcm_prepid

        with open(json_file, 'w', encoding='utf-8') as f:
            json.dump({'records': [record]}, f)


if __name__ == "__main__":
    parse_condor_output_to_json(infile = 'datasets.txt', condor_dir = './condor', json_dir = './json')
