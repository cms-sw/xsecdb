#!/bin/bash

# Script to create SSO cookie file for xsdb with CERN permissions
#
# Usage: ./getCookie.sh

env -i KRB5CCNAME="$KRB5CCNAME" cern-get-sso-cookie -u https://cms-gen-dev.cern.ch/xsdb -o ~/private/xsdbdev-cookie.txt --krb  -r
