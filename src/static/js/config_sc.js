/*
* Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
*
* SPDX-License-Identifier: MIT
*/
/**
*   Spec to create json
*   top level tab creates left tab.
*   tab:    tabname
*   subtype:    tab or list.    -- Tab creates one tab at top of the screen under outer tab.
                                -- list creates screen for the particular div with all components
*   components:     a list of components with json object for each component described. can be a tab or list sub type.
*       subtype:    each component should contain subtype for the type of under lying objects
*       name:       equivalent to tab name. displays the name.
*       components: same as components at the top level. can be a list or tab.
*
*       objects under component can contain below items to display.
                    ,"components" : ["C,L0,V0,V1,V2,B0"]    // the order of keys to display in row.
                    ,"L0": "VCCINT"                         // c for checkbox
                    ,"V0": "- W"                            // L for label and 0 is label id
                    ,"V0V": "power"                         // V for value display label. 0 is label id
                    ,"V1" : "- V"                           // V*V stands for the key inside response obtained from ajax
                    ,"V1V": "voltage"                       //              = objectresponse.data[V*V]
                    ,"V1N": "V"                             // V*N stands for notation: V, W or amps etc
                    ,"V2": "- a"                            // B stands for button. 0 is button id.
                    ,"V2V": "current"                       //B*A : stands for request url.
                    ,"B0": "Get"                            // B0sc_cmd : stands for command type.
                    ,"B0A": "/cmdquery"                     // B0target : stands for target under the command type.
                    ,"B0sc_cmd":"getpower"                 // B0params : for additional parameters to send.
                    , "B0target":"vccint"
                    , "B0params":""
                    ,"E0": "configuration"                  // Edit field with key to send as parameter in ajay req.
                    ,"E0K": "W"                             // Notation of key. Not required.

*/
var listResponseDictionary = {
    "test":"a"
};
var boardsettingsTab = [];
var toplevelbstabjson = [
    "listpower"
    ,"listclock"
];
function requestLists(comp){
    return $.ajax({
                url: "cmdquery",
                type: 'GET',
                dataType: 'json',
                sync: false,
                data:{"sc_cmd":comp, "target":"", "params":""}
    });
}
function requestListsdummy(comp){

            // load the list and store in a dictionary for next use.
            var resData;
            $.ajax({

                success: function (res){
                    return res.data;
                },
                error: function(){
                }
            });
    return resData;
}
function addPowerTab(){
        var innComps = [];
        jQuery.each(listsjson_sc["listpower"] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,V1,V2,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"V0": "- W"
            ,"V0N": "W"
            ,"V0V": "power"
            ,"V1" : "- V"
            ,"V1N": "V"
            ,"V1V": "voltage"
            ,"V2": "- A"
            ,"V2N": "A"
            ,"V2V": "current"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getpower"
            , "B0target": tds
            , "B0params":""
        };
        innComps.push(eachcomp);
    });
var headcomps = {
            "headcomponents":["C,L0,L1,L2,L3,B0"]
            ,"L0": "Rail Name"
            , "L1" : "Power"
            , "L2" : "Voltage"
            , "L3" : "Current"
            , "B0" : "Get All"
    }
    var dict = {"tab": "Power"
    ,"subtype":"tab"
        ,"components":[
            // Power :: get "use default configuration"
            {
            "subtype":"list"
            ,"name": "Use Default Calibration"
            ,"components": innComps
            , "headcomponents" : headcomps

            }
            // Power :: get "use custom configuration"
//            ,{
//            "subtype":"list",
//            "name": "Use Custom Calibration",
//            "components": [
//
//            ]
//            }
            ]
            };
    boardsettingsTab.push(dict);
}

function addClockTab(){
        var innCompsget = [];
        jQuery.each(listsjson_sc["listclock"] , function(i, tds){
        if(tds.localeCompare("8A34001 FMC2") == 0) {
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"V0": "-"
            ,"V0N": ""
            ,"V0V": "frequency"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getclock"
            , "B0target": tds
            , "B0params":""
        };
        innCompsget.push(eachcomp);

        }else{
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"V0": "- MHz"
            ,"V0N": "MHz"
            ,"V0V": "frequency"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getclock"
            , "B0target": tds
            , "B0params":""
        };
        innCompsget.push(eachcomp);
        }
    });
     var innCompsset = [];
        jQuery.each(listsjson_sc["listclock"] , function(i, tds){
        if(tds.localeCompare("8A34001 FMC2") == 0) {
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,F0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"F0": "value"
            ,"F0N": ""
            ,"F0V": [listsjson_sc["8A34001_clk_tcs_files"],listsjson_sc["8A34001_clk_txt_files"]]
            ,"B0": "Set"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"setclock"
            , "B0target": tds
            , "B0params":""
        };
        innCompsset.push(eachcomp);

        }else{
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,E0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"E0": "value"
            ,"E0K": "-v"
            ,"B0": "Set"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"setclock"
            , "B0target": tds
            , "B0params":""
        };
        innCompsset.push(eachcomp);
        }
    });
     var innCompssetboot = [];
        jQuery.each(listsjson_sc["listclock"] , function(i, tds){
        if(tds.localeCompare("8A34001 FMC2") == 0) {
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,F0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"F0": "value"
            ,"F0N": ""
            ,"F0V": [listsjson_sc["8A34001_clk_tcs_files"],listsjson_sc["8A34001_clk_txt_files"]]
            ,"B0": "Set"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"setbootclock"
            , "B0target": tds
            , "B0params":""
        };
        innCompssetboot.push(eachcomp);

        }else{
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,E0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"E0": "value"
            ,"E0K": "-v"
            ,"B0": "Set"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"setbootclock"
            , "B0target": tds
            , "B0params":""
        };
        innCompssetboot.push(eachcomp);
        }
    });

     var innCompsreset = [];
        jQuery.each(listsjson_sc["listclock"] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"B0": "Restore"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"restoreclock"
            , "B0target": tds
            , "B0params":""
        };
        innCompsreset.push(eachcomp);
    });
    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Clock Name"
            , "L1" : "Frequency"
            , "B0" : "Get All"
    };
    var headcompsset = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Clock Name"
            , "L1" : "Frequency"
            , "B0" : "Set All"
    };
    var headcompssetboot = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Clock Name"
            , "L1" : "Frequency"
            , "B0" : "Set All"
    };
    var headcompsreset = {
            "headcomponents":["C,L0,B0"]
            ,"L0": "Clock Name"
            , "B0" : "Restore All Clocks"
    };
    var dict = {"tab": "Clock"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"list"
            ,"name": "Get Clock"
            ,"components": innCompsget
            , "headcomponents" : headcompsget

            }
            ,{
            "subtype":"list"
            ,"name": "Set Clock"
            ,"components": innCompsset
            , "headcomponents" : headcompsset

            }
            /*,{
            "subtype":"list"
            ,"name": "Set Boot Clock"
            ,"components": innCompssetboot
            , "headcomponents" : headcompssetboot

            }*/
            ,{
            "subtype":"list"
            ,"name": "Restore Clock"
            ,"components": innCompsreset
            , "headcomponents" : headcompsreset
            }
            ]
            };
    boardsettingsTab.push(dict);
}
function addVoltageTab(){
        var innCompsget = [];
        jQuery.each(listsjson_sc["listvoltage"] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"V0": "- V"
            ,"V0N": "V"
            ,"V0V": "voltage"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getvoltage"
            , "B0target": tds
            , "B0params":""
        };
        innCompsget.push(eachcomp);
    });

    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Voltage Name"
            , "L1" : "Volts"
            , "B0" : "Get All"
    };
    var dict = {"tab": "Voltage"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"list"
            ,"name": "Get Voltage"
            ,"components": innCompsget
            , "headcomponents" : headcompsget

            }
            ]
            };
    boardsettingsTab.push(dict);
}
function addVadjTab(){
        var innCompsget = [];
        var getv = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": "Get VADJ_FMC"
            ,"V0": "- V"
            ,"V0N": "V"
            ,"V0V": "voltage"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getvoltage"
            , "B0target": "VADJ_FMC"
            , "B0params":""
        };
        innCompsget.push(getv);

     var setv = {
            "type":"list" 
            ,"components" : ["C,L0,D0,B0"]    // Checkbox, Label, dropdown, info, button, Action
            ,"L0": "Set VADJ_FMC"
            ,"D0": "value"
            ,"D0N": "V"
            ,"D0V": ["0.0","1.2","1.5"]
            ,"B0": "Set"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"setvoltage"
            , "B0target": "VADJ_FMC"
            , "B0params":""
        };
        innCompsget.push(setv);
        var innCompsboot = [];

     var bootv = {
            "type":"list"
            ,"components" : ["C,L0,D0,B0"]    // Checkbox, Label, dropdown, info, button, Action
            ,"L0": "Set On-Boot VADJ"
            ,"D0": "value"
            ,"D0N": "V"
            ,"D0V": ["0.0","1.2","1.5"]
            ,"B0": "Set"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"setbootvoltage"
            , "B0target": "VADJ_FMC"
            , "B0params":""
        };
        innCompsboot.push(bootv);

    var headcompsset = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Voltage Name"
            , "L1" : "Volts"
            , "B0" : "Set All"
    };
    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Voltage Name"
            , "L1" : "Volts"
            , "B0" : "Run All"
    };

    var headcompsgethspc = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Name"
            , "L1" : "Info"
            , "B0" : "Get All"
    };
var hspctabs = [];
jQuery.each(listsjson_sc["listFMC"] , function(j, tag){
     if (tag.length == 0) { return; }
     var innCompsgethspc = [];
     jQuery.each([["All","all"],["Common","common"],["Board","board"],["Multirecord","multirecord"]] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds[0]
            ,"V0": "-"
            ,"V0N": ""
            ,"V0V": "io"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getFMC"
            , "B0target": tag
            , "B0params":tds[1]
        };
        innCompsgethspc.push(eachcomp);
    });
    var altb = {
     "subtype":"list"
    ,"name": tag
    ,"components": innCompsgethspc
    , "headcomponents" : headcompsgethspc

     };
     hspctabs.push(altb);
});
var hspc = 
            {
             "subtype":"tab"
            ,"name": "HSPC"
            , "components":hspctabs
            };

    var dict = {"tab": "FMC"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"tab"
            ,"name": "Set VADJ"
            ,"components": [
            {
            "subtype":"list"
            ,"name": "Current"
            ,"components": innCompsget
            , "headcomponents" : headcompsget

            },
            /*{
            "subtype":"list"
            ,"name": "Boot-up"
            ,"components": innCompsboot
            , "headcomponents" : headcompsset

            }*/

            ]

            },
            ]
            };
    if(hspctabs.length){
        dict.components.push(hspc);
    }
    boardsettingsTab.push(dict);
}

function addPowerDomainTab(){
        var innCompsget = [];
        jQuery.each(listsjson_sc["listpowerdomain"] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"V0": "- W"
            ,"V0N": "W"
            ,"V0V": "voltage"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"powerdomain"
            , "B0target": tds
            , "B0params":""
        };
        innCompsget.push(eachcomp);
    });

    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Power Domain"
            , "L1" : "Power(W)"
            , "B0" : "Get All"
    };
    var dict = {"tab": "Power Domain"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"list"
            ,"name": "Get Power Domain"
            ,"components": innCompsget
            , "headcomponents" : headcompsget

            }
            ]
            };
    boardsettingsTab.push(dict);
}

function addgpioTab(){

        var innCompsget = [];
        jQuery.each(listsjson_sc["listgpio"] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds
            ,"V0": "-"
            ,"V0N": ""
            ,"V0V": "gpio"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getgpio"
            , "B0target": tds
            , "B0params":""
        };
        innCompsget.push(eachcomp);
    });

    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "GPIO Name"
            , "L1" : "State"
            , "B0" : "Get All"
    };
    var dict = {"tab": "Sys Ctlr Bank IO"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"list"
            ,"name": "Get GPIO"
            ,"components": innCompsget
            , "headcomponents" : headcompsget

            }
            ]
            };
    boardsettingsTab.push(dict);

}

function addDDRDIMMTab(){
        var innCompsget = [];
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": "DIMM Slot 1"
            ,"V0": "-"  		//"DDR4 SDRAM? -Size(Gb): -Temp. Sensor? -"
            ,"V0N": ""
            ,"V0V": "info"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getddr"
            , "B0target": ""+listsjson_sc.listddr[0]
            , "B0params":"spd"
        };
        innCompsget.push(eachcomp);
        eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": "DDR4 Temp 1"
            ,"V0": "-°C"
            ,"V0N":  " °C"
            ,"V0V": "temp"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getddr"
            , "B0target": ""+listsjson_sc.listddr[0]
            , "B0params":"temp"
        };
        innCompsget.push(eachcomp);

    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Name"
            , "L1" : "Info"
            , "B0" : "Get All"
    };
    var dict = {"tab": "DDR DIMM"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"list"
            ,"name": "DDR DIMM"
            ,"components": innCompsget
            , "headcomponents" : headcompsget

            }
            ]
            };
    boardsettingsTab.push(dict);
}
function addEEPROMDataTab(){
        var innCompsget = [];
     jQuery.each([["All","all"],["Common","common"],["Board","board"],["Multirecord","multirecord"]] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds[0]
            ,"V0": "-"
            ,"V0N": ""
            ,"V0V": "io"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"geteeprom"
            , "B0target": tds[1]
            , "B0params":""
        };
        innCompsget.push(eachcomp);
    });
    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Name"
            , "L1" : "Info"
            , "B0" : "Get All"
    };
    var dict = {"tab": "EEPROM Data"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"list"
            ,"name": "Get EEPROM"
            ,"components": innCompsget
            , "headcomponents" : headcompsget

            }
            ]
            };
    boardsettingsTab.push(dict);
}
function addEBMTab(){
        var innCompsget = [];
     jQuery.each([["All","all"],["Common","common"],["Board","board"],["Multirecord","multirecord"]] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds[0]
            ,"V0": "-"
            ,"V0N": ""
            ,"V0V": "io"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getEBM"
            , "B0target": tds[1]
            , "B0params":""
        };
        innCompsget.push(eachcomp);
    });
    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Name"
            , "L1" : "Info"
            , "B0" : "Get All"
    };
    var dict = {"tab": "EBM Data"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"list"
            ,"name": "Get EBM"
            ,"components": innCompsget
            , "headcomponents" : headcompsget

            }
            ]
            };
    boardsettingsTab.push(dict);
}



function addioexpTab(){
     var innCompsget = [];
     var innCompsset = [];
     var innCompsreset = [];
     jQuery.each([["IO Expander","all"],["Input","input"],["Output","output"]] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds[0]
            ,"V0": "-"
            ,"V0N": ""
            ,"V0V": "io"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"getioexp"
            , "B0target": tds[1]
            , "B0params":""
        };
        innCompsget.push(eachcomp);
    });
     jQuery.each([["Direction","direction"],["Output","output"]] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,E0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds[0]
            ,"E0": "value"
            ,"E0K": "-"
            ,"B0": "Set"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"setioexp"
            , "B0target": tds[1]
            , "B0params":""
        };
        innCompsset.push(eachcomp);
    });
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": "Restore IO Expander"
            ,"B0": "Restore"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"restoreioexp"
            , "B0target": ""
            , "B0params":""
        };
        innCompsreset.push(eachcomp);
    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "GPIO Expander"
            , "L1" : "State"
            , "B0" : "Get All"
    };
    var headcompsset = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "GPIO Expander"
            , "L1" : "State"
            , "B0" : "Set All"
    };
    var headcompsreset = {
            "headcomponents":["C,L0,B0"]
            ,"L0": "GPIO Expander"
            , "L1" : "State"
            , "B0" : "Restore All"
    };
    var dict = {"tab": "GPIO Expander"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"list"
            ,"name": "Get GPIO Expander"
            ,"components": innCompsget
            , "headcomponents" : headcompsget

            },
            {
            "subtype":"list"
            ,"name": "Set GPIO Expander"
            ,"components": innCompsset
            , "headcomponents" : headcompsset

            },
            {
            "subtype":"list"
            ,"name": "Restore IO Expander"
            ,"components": innCompsreset
            , "headcomponents" : headcompsreset

            }
            ]
            };
    boardsettingsTab.push(dict);

}
function addqsfpTab(){
        var innCompsget = [];
        var innCompsset = [];
        jQuery.each(listsjson_sc["listQSFP"] , function(i, tds){
        jQuery.each([["QSFP","getQSFP"],["PWM QSFP","getpwmQSFP"],["PWMO QSFP","getpwmoQSFP"]] , function(j, tdsd){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0":  tdsd[0] + " " + tds
            ,"V0": "-"
            ,"V0N": ""
            ,"V0V": "io"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":tdsd[1]
            , "B0target": tds
            , "B0params":""
        };
        innCompsget.push(eachcomp);
    });
    });
        jQuery.each(listsjson_sc["listQSFP"] , function(i, tds){
        jQuery.each([["PWM QSFP","setpwmQSFP"],["PWMO QSFP","setpwmoQSFP"]] , function(j, tdsd){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,E0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds + " " + tdsd[0]
            ,"E0": "value"
            ,"E0K": "-"
            ,"B0": "Set"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":tdsd[1]
            , "B0target": tds
            , "B0params":""
        };
        innCompsset.push(eachcomp);
    });
    });
    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Name"
            , "L1" : "Info"
            , "B0" : "Get All"
    };
    var headcompsset = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Name"
            , "L1" : "Value"
            , "B0" : "Set All"
    };
    var dict = {"tab": "zQSFP Data"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"list"
            ,"name": "Get QSFP"
            ,"components": innCompsget
            , "headcomponents" : headcompsget
            }
            ,{
            "subtype":"list"
            ,"name": "Set QSFP"
            ,"components": innCompsset
            , "headcomponents" : headcompsset
            }
            ]
            };
    boardsettingsTab.push(dict);

}
function addsfpTab(){
        var innCompsget = [];
        var innCompsset = [];
        jQuery.each(listsjson_sc["listSFP"] , function(i, tds){
        jQuery.each([["SFP","getSFP"],["PWM SFP","getpwmSFP"]] , function(j, tdsd){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,V0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0":  tdsd[0] + " " + tds
            ,"V0": "-"
            ,"V0N": ""
            ,"V0V": "io"
            ,"B0": "Get"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":tdsd[1]
            , "B0target": tds
            , "B0params":""
        };
        innCompsget.push(eachcomp);
    });
    });
        jQuery.each(listsjson_sc["listSFP"] , function(i, tds){
        var eachcomp = {
            "type":"list"
            ,"components" : ["C,L0,E0,B0"]    // Checkbox, Label, editfield, info, button, Action
            ,"L0": tds + " PWM SFP"
            ,"E0": "value"
            ,"E0K": "-"
            ,"B0": "Set"
            ,"B0A": "/cmdquery"
            ,"B0sc_cmd":"setpwmSFP"
            , "B0target": tds
            , "B0params":""
        };
        innCompsset.push(eachcomp);
    });
    var headcompsget = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Name"
            , "L1" : "Info"
            , "B0" : "Get All"
    };
    var headcompsset = {
            "headcomponents":["C,L0,L1,B0"]
            ,"L0": "Name"
            , "L1" : "Value"
            , "B0" : "Set All"
    };
    var dict = {"tab": "zSFP Data"
    ,"subtype":"tab"
        ,"components":[
            {
            "subtype":"list"
            ,"name": "Get SFP"
            ,"components": innCompsget
            , "headcomponents" : headcompsget
            }
            ,{
            "subtype":"list"
            ,"name": "Set SFP"
            ,"components": innCompsset
            , "headcomponents" : headcompsset
            }
            ]
            };
    boardsettingsTab.push(dict);

}
function isSupported(tabname){
    if(listsjson_sc["listfeature"].indexOf(tabname) == -1){
        return false;
    }
    return true;
}
function generateBoardSettingsTabJSON(){

    console.log(isSupported("listvoltage"))

    if(isSupported("listclock"))    addClockTab();
    if(isSupported("listvoltage"))    addVoltageTab();
    if(isSupported("listpower"))    addPowerTab();
//    addPowerDomainTab();
    if(isSupported("listddr"))    addDDRDIMMTab();
    if(isSupported("listioexp"))    addioexpTab();
    if(isSupported("listgpio"))    addgpioTab();
    if(isSupported("listSFP") && listsjson_sc["listSFP"].length && listsjson_sc["listSFP"][0] != ""){
        addsfpTab();
    }
    if(isSupported("listQSFP") && listsjson_sc["listQSFP"].length && listsjson_sc["listQSFP"][0] != ""){
        addqsfpTab();
    }
    if(isSupported("listEBM"))    addEBMTab();
    if(isSupported("listFMC"))    addVadjTab();
    if(isSupported("listeeprom"))    addEEPROMDataTab();
}


var boardsettingsTabReference = [
// Clocks tab

//
//    {"tab": "Clocks"
//        ,"subtype":"tab"
//        ,"components":[{
//            "subtype":"list",
//            "name": "Set Clock",
//            "components": [
//                {
//                    "type":"list",
//                    "components" : ["C,L,E,I,BA"]  ,  // Checkbox, Label, editfield, info, button, Action
//                    "L": "zSFP Si570 Frequency",
//                    "E": "zSFP Si570 Frequency",
//                    "I" : "(Between 10 and 810 MHz)",
//                    "B": "Set Frequency",
//                    "A": "/getvoltage"
//                }
//            ]
//            }
//            ,{
//            "subtype":"list",
//            "name": "Read Clock",
//            "components": [
//                {
//                    "type":"list",
//                    "components" : ["CLEIB"]  ,
//                    "title": "zSFP Si570 Frequency",
//                    "info" : "(Between 10 and 810 MHz)",
//                    "buttonTitle": "Set Frequency"
//                }
//            ]
//            }
//            ,{
//            "subtype":"list",
//            "name": "Restore Clock",
//            "components": [
//                {
//                    "type":"list",
//                    "components" : ["CLEIB"]  ,
//                    "title": "zSFP Si570 Frequency",
//                    "info" : "(Between 10 and 810 MHz)",
//                    "buttonTitle": "Set Frequency"
//                }
//            ]
//            }
//        ]
//        }

// Voltages tab

//    , {"tab": "Voltages"
//    , "subtype":"list"
//    ,"components":[{
//
//                "components" : ["CLEIB"]  ,
//                "title": "zSFP Si570 Frequency",
//                "info" : "(Between 10 and 810 MHz)",
//                "buttonTitle": "Set Frequency"
//            }
//           ]
//    }

// Power Tab
    {"tab": "Power"
    ,"subtype":"tab"
        ,"components":[
            // Power :: get "use default configuration"
            {
            "subtype":"list"
            ,"name": "Use Default Calibration"
            ,"components": [
                {
                    "type":"list"
                    ,"components" : ["C,L0,V0,V1,V2,B0"]    // Checkbox, Label, editfield, info, button, Action
                    ,"L0": "VCCINT"
                    ,"V0": "- W"
                    ,"V0N": "W"
                    ,"V0V": "power"
                    ,"V1" : "- V"
                    ,"V1N": "V"
                    ,"V1V": "voltage"
                    ,"V2": "- a"
                    ,"V2N": "a"
                    ,"V2V": "current"
                    ,"B0": "Get"
                    ,"B0A": "/cmdquery"
                    ,"B0sc_cmd":"getpower"
                    , "B0target":"vccint"
                    , "B0params":""
                }
                ,{
                    "type":"list"
                    ,"components" : ["C,L0,V0,V1,V2,B0"]    // Checkbox, Label, editfield, info, button, Action
                    ,"L0": "VCCINT_SOC"
                    ,"V0": "- W"
                    ,"V0N": "W"
                    ,"V0V": "power"
                    ,"V1" : "- V"
                    ,"V1N": "V"
                    ,"V1V": "voltage"
                    ,"V2": "- a"
                    ,"V2N": "a"
                    ,"V2V": "current"
                    ,"B0": "Get"
                    ,"B0A": "/cmdquery"
                    ,"B0sc_cmd":"getpower"
                    , "B0target":"vccint_soc"
                    , "B0params":""
                }
                ,{
                    "type":"list"
                    ,"components" : ["C,L0,V0,V1,V2,B0"]    // Checkbox, Label, editfield, info, button, Action
                    ,"L0": "VCCINT_AUX"
                    ,"V0": "- W"
                    ,"V0N": "W"
                    ,"V0V": "power"
                    ,"V1" : "- V"
                    ,"V1N": "V"
                    ,"V1V": "voltage"
                    ,"V2": "- a"
                    ,"V2N": "a"
                    ,"V2V": "current"
                    ,"B0": "Get"
                    ,"B0A": "/cmdquery"
                    ,"B0sc_cmd":"getpower"
                    , "B0target":"vccint_aux"
                    , "B0params":""
                }
            ]
            }
            // Power :: get "use custom configuration"
            ,{
            "subtype":"list",
            "name": "Use Custom Calibration",
            "components": [

            ]
            }
            // Power :: get "INA226 Registers"
            ,{
            "subtype":"list",
            "name": "Get INA226 Registers",
            "components": [

            ]
            }
            // POWER :: Set ina 226 registers
            ,{
            "subtype":"list",
            "name": "Set INA226 Registers",
            "components": [
                {
                    "type":"list"
                    ,"components" : ["C,L0,E0,E1,E2,E3,B0"]    // Checkbox, Label, editfield, info, button, Action
                    ,"L0": "VCCINT"
                    ,"E0": "configuration"
                    ,"E0K": "W"
                    ,"E1" : "calibration"
                    ,"E1K": "V"
                    ,"E2": "mask_enable"
                    ,"E2K": "a"
                    ,"E3": "alert_limit"
                    ,"E3K": "a"
                    ,"B0": "Set"
                    ,"B0A": "/cmdquery"
                    ,"B0sc_cmd":"setpower"
                    , "B0target":"vccint"
                    , "B0params":""
                }
            ]
            }
        ]

    }
];
