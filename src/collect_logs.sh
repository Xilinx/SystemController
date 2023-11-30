#!/bin/bash
##
# Copyright (c) 2023 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##

rm -rf static/tmp
LOGNAME=log_$(date +"%d_%m_%Y-%H_%M")
LOGDIR=/tmp/${LOGNAME}
mkdir -p $LOGDIR
cp -ar /var/volatile/log $LOGDIR
journalctl > ${LOGDIR}/journal.log
journalctl -u system_controller > ${LOGDIR}/sc_appd.log
dmesg > ${LOGDIR}/dmesg.log
ps aux > ${LOGDIR}/pslist.log

cd /tmp
tar czf ${LOGNAME}.tar.gz ${LOGNAME}
rm -rf ${LOGNAME}

cd /usr/share/scweb
mkdir -p static/tmp/
mv /tmp/${LOGNAME}.tar.gz ./static/tmp/
echo "static/tmp/"${LOGNAME}".tar.gz"
