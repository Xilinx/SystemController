#!/bin/sh
##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2023 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##
## Make sure sc_appd is up and running
COUNT=30
SC_APP_OUT=`/usr/bin/sc_app -c board 2>&1 | grep "ERROR: "`
while [ "$SC_APP_OUT" != "" -a $COUNT -ne 0 ]; do
    sleep 1
    COUNT=`expr $COUNT - 1`
    SC_APP_OUT=`/usr/bin/sc_app -c board 2>&1 | grep "ERROR: "`
done

if [ $COUNT -eq 0 ]; then
    echo "ERROR: sc_appd is not responding!" >/dev/ttyPS0
    exit -1
fi

## Run scweb server
cd /usr/share/scweb/
python3 systemcontroller.py &

## Run Jupyter notebook
dev_eeprom=$(find /sys/bus/i2c/devices/*54/ -name eeprom | head -1)
board=$(ipmi-fru --fru-file=${dev_eeprom} --interpret-oem-data | awk -F": " '/^  *FRU Board Product*/ { print tolower ($2) }')
if [ $board == "vck190" ] || [ $board == "vmk180" ]
then
    HOME=`(cd ~root && pwd) || echo 'none'`
    rm ${HOME}/.local/share/jupyter/runtime/*
    systemctl enable jupyter-setup.service
    systemctl start jupyter-setup.service
else
    ## Run jupyter notebook with non root user
    HOME=`(cd ~petalinux && pwd) || echo 'none'`
    rm ${HOME}/.local/share/jupyter/runtime/*
    sudo su - petalinux -c "systemctl --user enable jupyter-setup.service"
fi

## print ip on console
COUNT=30
IP=`/sbin/ifconfig eth0 | grep 'inet addr' | awk '{print $2}' | awk -F ':' '{print $2}'`
while [ "$IP" == "" -a "$COUNT" != "0" ]; do
    echo -n "." >/dev/ttyPS0
    sleep 1
    COUNT=`expr $COUNT - 1`
    IP=`/sbin/ifconfig eth0 | grep 'inet addr' | awk '{print $2}' | awk -F ':' '{print $2}'`
done

echo >/dev/ttyPS0
if [ "$IP" != "" ]
then

  msge=$(cat <<- EOM                                                      
****************************************
*                                      *
*         BEAM Tool Web Address        *
*                                      *
*      http://$IP:50002                                                                    
*                                      *
****************************************       
EOM
)
                                                                 
var=$(echo "$msge"  | sed -E '5s/(.{39})/&\*/')                                 
                                                   
cat > /dev/ttyPS0 <<- EOM
$var 

EOM

else

    cat >/dev/ttyPS0 <<- EOM
****************************************
*                                      *
*         BEAM Tool Web Address        *
*                                      *
*       No IP address is assigned      *
*                                      *
****************************************
EOM

fi
