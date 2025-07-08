#!/bin/bash

# Script to create SSO cookie file for xsdb with CERN permissions
#
# Usage: ./getCookie.sh

env -i KRB5CCNAME="$KRB5CCNAME" cern-get-sso-cookie -u https://xsecdb-xsdb-official.app.cern.ch/ -o ~/private/xsdbdev-cookie.txt --krb  -r
