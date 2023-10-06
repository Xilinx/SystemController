#!/bin/bash
rm -rf static/tmp
LOGNAME=log_$(date +"%d_%m_%Y-%H_%M")
LOGDIR=/tmp/${LOGNAME}
mkdir -p $LOGDIR
cp -ar /var/volatile/log $LOGDIR
journalctl > ${LOGDIR}/journal.log
dmesg > ${LOGDIR}/dmesg.log

cd /tmp
tar czf ${LOGNAME}.tar ${LOGNAME}
rm -rf ${LOGNAME}

cd /usr/share/scweb
mkdir -p static/tmp/
mv /tmp/${LOGNAME}.tar ./static/tmp/
echo "static/tmp/"${LOGNAME}".tar"
