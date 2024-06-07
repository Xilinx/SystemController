/*
* Copyright (c) 2020 - 2021 Xilinx, Inc. and Contributors. All rights reserved.
*
* SPDX-License-Identifier: MIT
*/
function getlocallink (){
var url = window.location.href;
return "http://"+url.split(":")[1].substring(2);
}
function getlocallinkwithport (portno){
var url = window.location.href;
return "http://"+url.split(":")[1].substring(2).split("/")[0]+":"+portno
}
