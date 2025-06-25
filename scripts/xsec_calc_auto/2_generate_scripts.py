#!/usr/bin/env python3
# THIS SCRIPT REQUIRES CMSSW AND VOMS ENVIRONMENT
import os, yaml

# For RunIII
cmssw = "CMSSW_15_0_2"
# For Run3
#cmssw = "CMSSW_13_0_16"
# For RunII
#cmssw = "CMSSW_10_6_0"

def generate_executable_scripts(indir='./fetch_files', outdir='./executable_script'):
    os.system(f'rm -rf {outdir}')
    os.makedirs(outdir, mode=0o755, exist_ok=True)

    for fetch_file in os.listdir(indir):
        process_name = fetch_file.split('.')[0]
        print(process_name)
        fetch_file = os.path.join(indir, fetch_file)
        executable_script = os.path.join(outdir, f"{process_name}.sh")
        if not os.path.isfile(executable_script):
            print("Creating file")
            os.system(f"sh {fetch_file} 2>&1 > {executable_script}")
        else:
            check_executable_script(fetch_file, executable_script)
        os.system(f"chmod 777 {executable_script}")


def check_executable_script(fetch_file, executable_script):
    with open(executable_script, 'r') as f:
        command = f.read()

    if '/store' in command:
        print("File found")
    else:
        with open(fetch_file, 'r', encoding='utf-8') as f:
            fetch_file_command = f.read()

        # change skipexisting option and re-generate
        if '--skipexisting True' in fetch_file_command:
            print(f"File corrupted, setting skipexisting to False, recreating file: {fetch_file}")
            with open(fetch_file, 'w') as f:
                f.write(fetch_file_command.replace('--skipexisting True', '--skipexisting False'))

        os.system(f"sh {fetch_file} 2>&1 > {executable_script}")

        # change back skipexisting option
        if '--skipexisting True' in fetch_file_command:
            with open(fetch_file, 'w') as f:
                f.write(fetch_file_command)


def generate_condor_scripts(indir='./executable_script', condor_dir='./condor', mode='condor'):
    if mode not in ('condor', 'local'):
        raise ValueError("mode should be 'condor' or 'local'!")
    elif mode == 'condor':
        for sub_dir in ('executable', 'submit', 'log', 'error', 'output'):
            os.system(f'rm -rf {os.path.join(condor_dir, sub_dir)}')
            os.makedirs(os.path.join(condor_dir, sub_dir), mode=0o755, exist_ok=True)

    condor_dir = os.path.abspath(condor_dir)
    if not os.path.exists('genproductions'):
        os.system("git clone git@github.com:cms-sw/genproductions.git")
    genXsec_cfg = os.path.abspath("./genproductions/Utilities/calculateXSectionAndFilterEfficiency/genXsec_cfg.py")
    with open('user_config.yaml') as f:
        user_config = yaml.safe_load(f)
    proxy_path = user_config['proxy_path']

    for executable_script in os.listdir(indir):
        process_name = executable_script.split('.')[0]
        print(process_name)

        executable_script = os.path.join(indir, executable_script)
        if not os.path.exists(executable_script):
            print(f"\tInput file not found: {executable_script}")
            continue
        with open(executable_script, 'r') as f:
                command = f.read().split('|')[0]
        if '/store' not in command:
            print("\tInput script corrupted, skipping")
            continue

        if mode == 'local':
            print("Computing cross section for process")
            os.system(f"cmsrel {cmssw}; cd {cmssw}/src; eval `scramv1 runtime -sh`; cd -; sh {executable_script}")
        elif mode == 'condor':
            print("Generating condor files")
            log_file = os.path.join(condor_dir, f'log/{process_name}.log')
            if os.path.exists(log_file):
                with open(log_file) as f:
                    log = f.read()
                if 'final cross section' in log:
                    print(f"Cross section already computed, skipping")
                    continue

            # create executable script
            exec_script = os.path.join(condor_dir, f'executable/{process_name}.sh')
            with open(exec_script, 'w+', encoding='utf-8') as f:
                f.seek(0, 0)
                f.write("#!/usr/bin/env bash\n")
                f.write("export X509_USER_PROXY=$1\n")
                f.write("voms-proxy-info -all -file $1\n")
                f.write("source /cvmfs/cms.cern.ch/cmsset_default.sh\n")
                f.write(f"cmsrel {cmssw}; cd {cmssw}/src; eval `scramv1 runtime -sh`; cd - \n\n")
                f.write(command)
                f.seek(0, 2)
            os.system(f"chmod 777 {exec_script}")

            # create file for submit
            submit_file = os.path.join(condor_dir, f"submit/{process_name}.submit")
            with open(submit_file, 'w+', encoding='utf-8') as f:
                f.write("universe = vanilla\n")
                f.write("+JobFlavour = testmatch\n")
                f.write(f"arguments = {proxy_path}\n")
                f.write(f"executable = {exec_script}\n")
                #f.write("requirements = (OpSysAndVer =?= \"CentOS7\")\n")
                f.write("should_transfer_files = YES\n")
                f.write("when_to_transfer_output = ON_EXIT_OR_EVICT\n")
                f.write(f"transfer_input_files = {genXsec_cfg}\n")
                f.write('transfer_output_files = ""\n')
                f.write("RequestCpus = 1\n")
                f.write(f"error = error/{process_name}.err\n")
                f.write(f"output = output/{process_name}.output\n")
                f.write(f"log = log/{process_name}.log\n")
                f.write("queue 1")

            os.system(f"cd {condor_dir}; condor_submit {submit_file}")


if __name__ == "__main__":
    generate_executable_scripts(indir='./fetch_files', outdir='./executable_script')
    generate_condor_scripts(indir='./executable_script', condor_dir='./condor', mode='condor')
