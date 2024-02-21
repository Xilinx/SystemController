#!/bin/bash
##
# Copyright (c) 2023 - 2024 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##

rm -rf static/tmp
BOARD=`sc_app -c board`
SN=`sc_app -c geteeprom -t onboard -v summary | grep 'Board Serial Number' | awk '{print $4}'`
LOGNAME=log_${BOARD}_${SN}_$(date +"%d_%m_%Y-%H_%M")
LOGDIR=/tmp/${LOGNAME}
mkdir -p $LOGDIR
cp -ar /var/volatile/log $LOGDIR
journalctl > ${LOGDIR}/journal.log
journalctl -u system_controller > ${LOGDIR}/sc_appd.log
dmesg > ${LOGDIR}/dmesg.log
ps aux > ${LOGDIR}/pslist.log
rpm -qa > ${LOGDIR}/installed_packages.log

for I in `echo summary all common board multirecord`; do
    sc_app -c geteeprom -t onboard -v $I >> ${LOGDIR}/eeprom.log
done

if [ ${BOARD} == "VCK190" -o ${BOARD} == "VMK180" ]; then
    dd if=/sys/bus/i2c/devices/i2c-11/11-0054/eeprom of=${LOGDIR}/eeprom.bin bs=1 count=256
else
    dd if=/sys/bus/i2c/devices/i2c-1/1-0054/eeprom of=${LOGDIR}/eeprom.bin bs=1 count=256
fi

cd /tmp
tar czf ${LOGNAME}.tar.gz ${LOGNAME}
rm -rf ${LOGNAME}

cd /usr/share/scweb
mkdir -p static/tmp/
mv /tmp/${LOGNAME}.tar.gz ./static/tmp/
echo "static/tmp/"${LOGNAME}".tar.gz"
