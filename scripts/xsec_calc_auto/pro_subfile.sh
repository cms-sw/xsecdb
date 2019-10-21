#! /bin/bash
#------name--------
process_name=$1
#------name--------
#------dic-------
dic=`pwd`
dic_executable=${dic}\/getXsec\/getXsec
dic_output=${dic}\/output\/${process_name}_\/
dic_proxy=${dic}\/
#------dic-------
cat > condor.sub <<EOF 
universe              = vanilla
executable            = ${dic_executable}_$process_name.sh
output                = ${dic_output}$process_name.out
error                 = ${dic_output}$process_name.err
log                   = ${dic_output}$process_name.log
+MaxRuntime           = 432000
transfer_input_files  = ${dic_proxy}x509up_u123238
x509userproxy         = \$ENV(X509_USER_PROXY)
+JobFlavour           = "espresso"
queue
EOF
chmod 777 condor.sub
mv condor.sub ${dic_output}
