##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2023 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##
from flask import render_template
from flask_restful import Resource, request
from enum import Enum
from config_app import *
from term import *
from parse import *
from jnservice import *
##
# TODO :: Change parse data static to dynamic class for realtime data.
#parse = ParseDataStatic()
parse = ParseData()
deviname = ""

sc_app_path = app_config["sc_app_path"]
class BootMode:
    active_bootmode = "-"
    @staticmethod
    def getActiveBootMode():
        return BootMode.active_bootmode
    @staticmethod
    def setBootMode(mode):
        BootMode.active_bootmode = mode
        SysFactory.exec_cmd(sc_app_path +" -c setbootmode -t "+mode + " -v alternate",SysFactory.TERMINAL) 
        res = SysFactory.exec_cmd(sc_app_path +" -c reset",SysFactory.TERMINAL)           
        if res.startswith("ERROR") or "ERROR" in res:
            resp_json = {
                "status":"error"
                ,"data":res
            }
        else :
            resp_json = {
                "status":"success"
                ,"data":res
            } 
        return resp_json
class ReqFunctions:
    global sc_app_path
    @staticmethod
    def polls(params):
        gtemp_targ = ""
        if len(params) > 0:
            gtemp_targ = params[0]
        try:
            result = {"temp":"-"}
            stat = "error"
            if checkJNK() == 0:
                stat = "success"
                response = Term.exec_cmd(sc_app_path+" -c gettemp -t "+gtemp_targ)
                result = parse.temperature(response)
            result["active_bootmode"] = BootMode.getActiveBootMode()
            resp_json = {
                "status":stat
                ,"data":result
            }
            return resp_json,200
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
    def bootmode_set(mode):
        res = BootMode.setBootMode(mode);
        return res,200
    def jnlink():
        jnu = jnurl()
        return {"status":"success","data":jnu},200
class FuncReq(Resource):
    def get(self,):
        req = request.args.get('func')
        tar = request.args.get('params')
        params_req = request.args.get('params')
        params = params_req.split(",")
        
        if req.startswith('poll'):
            
            return ReqFunctions.polls(params)
        if req.startswith('jnlink'):
            return ReqFunctions.jnlink()
        if req.startswith('setbootmode'):
            if checkJNK() >= 1: 
                resp_json = { 
                    "status":"error"
                    ,"data": "Notebook kernel is running. Please stop running kernel."
                }                       
                return resp_json,200

            if len(params):
                return ReqFunctions.bootmode_set(params[0])
        resp_json = {
            "status":"error"
            ,"data":{"error":"Fail"}
        }
        return resp_json,500
class Poll(Resource):
    def get(self,):
        try:
            if checkJNK() >= 1: 
                resp_json = { 
                    "status":"error"
                    ,"data": "Notebook kernel is running. Please stop running kernel."
                }                       
                return resp_json,200
            response = Term.exec_cmd(sc_app_path+" -c gettemp -t MDIO")
            result = parse.temperature(response)
            result["active_bootmode"] = "jtag"
            resp_json = {
                "status":"success"
                ,"data":result
            }
            return resp_json,200
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
class EEPROMDetails(Resource):
    def get(self,):
        try:
            response = ""
            if checkJNK() == 0: 
                response = Term.exec_cmd(sc_app_path+" -c eeprom")
            result = parse.dashboard_eeprom(response)
            resp_json = {
                "status":"success"
                ,"data":result
            }
            return resp_json,200
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500

class ClockFilesList(Resource):
    def get(self,):
        try:
            req = request.args.get('func')
            if req == "clock":
                tcs_files = []
                txt_files = []
                bin_files = []
                for c in os.listdir(app_config["8A34001_clk_files_path"]):
                    if c.endswith(".tcs"):
                        tcs_files.append(os.path.splitext(c)[0])
                    if c.endswith(".txt"):
                        txt_files.append(os.path.splitext(c)[0])
                    if c.endswith(".bin"):
                        bin_files.append(os.path.splitext(c)[0])
                final_list = list(set(tcs_files+txt_files))
                bin_files = list(set(bin_files))
                upload_tcs_files = []
                upload_txt_files = []
                upload_bin_files = []
                if (os.path.exists(app_config["uploaded_files_path"])):
                    for c in os.listdir(app_config["uploaded_files_path"]):
                        if c.endswith(".tcs"):
                            upload_tcs_files.append(os.path.splitext(c)[0])
                        if c.endswith(".txt"):
                            upload_txt_files.append(os.path.splitext(c)[0])
                        if c.endswith(".bin"):
                            upload_bin_files.append(os.path.splitext(c)[0])
                final_upload_list = list(set(upload_txt_files+upload_tcs_files))
                upload_bin_files = list(set(upload_bin_files))
                resp_json = {
                    "status": "success"
                    , "data": {
                        "default": {
                            "finallist": final_list
                            , "binfiles": bin_files
                        }
                        , "user": {
                            "finaluploadlist": final_upload_list
                            , "binfiles": upload_bin_files
                        }
                    }
                }
                return resp_json, 200
            elif req == "pdi":
                pdifiles = os.listdir(app_config["PDIFilePath"]+app_config["deviname"]) if os.path.exists(app_config["PDIFilePath"]+app_config["deviname"]) else []
                resp_json = {
                    "status": "success"
                    , "data": {
                        "pdi": {
                            "pdi_files": pdifiles
                        }
                    }
                }
                return resp_json,200
            else:
                resp_json = {
                    "status": "error",
                    "data": {"error": "Invalid function requested"}
                }
                return resp_json, 400
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            print('e',e)
            return resp_json,500
class MultiCmdQuery(Resource):
    def get(self,):
        try:
            if checkJNK() >= 1:
                resp_json = {
                    "status":"error"
                    ,"data": "Notebook kernel is running. Please stop running kernel."
                }
                return resp_json,200

            reqa = request.args.get('sc_cmd')
            ereq = json.loads(reqa)
            tara = request.args.get('target')
            etar = json.loads(tara)
            params_req = request.args.get('params')
            eparams = json.loads(params_req)
            result = {}
            isFail = False
            isSuccess = False
            for i,a in enumerate(ereq):

                req = ereq[i]
                tar = etar[i]
                params = eparams[i].split(",")
                paramStr = eparams[i].replace(","," ")

                try:
                    cmd_gen = sc_app_path+" -c " + req
                    if len(tar):
                        cmd_gen = cmd_gen + " -t '" + tar + "'"
                    if len(params) and len(params[0]):
                        cmd_gen = cmd_gen + " -v '" + paramStr + "'"
                    response = Term.exec_cmd(cmd_gen)
                except Exception as d:
                    print(d)
                if req == "getclock":
                    req_display = "<b>Configured Frequency</b>"
                elif req == "getmeasuredclock":
                    req_display = "<b>Measured Frequency</b>"
                else:
                    req_display = "<b>" + req.capitalize() + "</b>"
                if response.startswith("ERROR:") or "ERROR:" in response:
                    if "error" not in result.keys():
                        result["error"] = ""
                    result["error"] += req_display + " : " + response + "<br>"
                    isFail = True

                else :
                    result1 = parse.parse_cmd_resp(response, req, tar, params);
                    result.update(result1)
                    isSuccess = True
                    if "error" not in result.keys():
                        result["error"] = ""
                    result["error"] += req_display + " : Success \n<br>"
            if isFail and isSuccess:
                resp_json = {
                    "status": "partial_success"
                    , "data": result
                }
                return resp_json,200
            elif isSuccess and not isFail:
                resp_json = {
                    "status": "success"
                    , "data": result
                }
                return resp_json,200
            else:
                resp_json = {
                    "status": "error"
                    , "data": result["error"]
                }
                return resp_json, 200
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
class CmdQuery(Resource):
    def get(self,):
        try:
            if checkJNK() >= 1: 
                resp_json = { 
                    "status":"error"
                    ,"data": "Notebook kernel is running. Please stop running kernel."
                }                       
                return resp_json,200

            req = request.args.get('sc_cmd')

            tar = request.args.get('target')
            params_req = request.args.get('params')
            params = params_req.split(",")
            paramStr = params_req.replace(","," ")
            
            try:
                cmd_gen = sc_app_path+" -c " + req
                if len(tar):
                    cmd_gen = cmd_gen + " -t '" + tar + "'"
                if len(params) and len(params[0]):
                    cmd_gen = cmd_gen + " -v '" + paramStr + "'"
                response = Term.exec_cmd(cmd_gen)
            except Exception as d:
                print(d)
            if response.startswith("ERROR:") or "ERROR:" in response:
                dresp = {"message":response}
                resp_json = {
                    "status":"error"
                    ,"data":dresp
                }
            else : 
                result = parse.parse_cmd_resp(response, req, tar, params);
                resp_json = {
                    "status":"success"
                    ,"data":result
                }
            if req.startswith("BIT") or "BIT" in req:
                bitLog=SysFactory.exec_cmd("cat "+app_config["bitlogFilePath"],SysFactory.TERMINAL)
                if bitLog.startswith("cat: can't open") or "cat: can't open" in bitLog:
                    resp_json["data"]["bitlogs"] = ""
                else:
                    resp_json["data"]["bitlogs"] = bitLog
            return resp_json,200
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
class Notif:
    _notifs = []

    Priority = Enum('Priority',
                    ['PDI'
                     ,'TEMP_RANGE_EXCEED'
                     ])

    MODE_REALTIME = 101            # WHEN NEED TO SHOW/HIDE AT REALTIME. eg: show hide pdi loaded state
    MODE_NETWORK = 102             # WHEN NEED TO SHOW A NETWORK NOTIFICATION. eg: a new board is availabe kind of notification from xilinx web site.
    MODE_INFO = 103                # WHEN NEED TO SHOW FOR A APT UPGRADE IS AVAILABLE. THIS WONT BE REALTIME AND WILL NOT BE DISMISSED ONCE THE CONDITION IS SATISFIED

    TYPE_CMD = 201                  # WHEN THE NOTIFICATION CHECK TYPE IS A LOCAL COMMAND EXECUTION.

    def __init__(self,notif_id="",title="",message="",priority=1000,noti_type=0,type_related_info="",command="",conditionsToCompare=None,req_time="", result = "",prev_req_time="",prev_result = "", mode = 0,show = True):
        self.notif_id = notif_id
        self.title = title
        self.message = message
        self.priority = priority
        self.mode= mode
        self.noti_type= noti_type
        self.type_related_info = type_related_info
        self.command = command
        self.conditionsToCompare = conditionsToCompare
        self.req_time = req_time
        self.result = result
        self.prev_req_time = prev_req_time
        self.prev_result = prev_result
        self.show = show
        Notif._notifs.append(self)
    @staticmethod
    # One time loading list of

    def notification_load():
        Notif(notif_id="PDI_NOT_LOADED"
              , command=sc_app_path + " -c gettemp -t Versal"
              , mode=Notif.MODE_REALTIME
              , noti_type=Notif.TYPE_CMD
              , priority=Notif.Priority.PDI.value
              , conditionsToCompare=lambda x: x.startswith("ERROR: temperature is not available")
              , message="⚠ PDI is not programmed. Ensure to program versal to view temperature value and fan control. Please refer to  <a href='https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/2273738753/Versal+Evaluation+Board+-+System+Controller#Vivado-Board-Files-%26-PetaLinux-Versal-DUT-BSPs' target='_blank'>wiki</a>"
              )
    @staticmethod
    def jsonObj(noti_ary):
        jsn_ary = []
        for noti in noti_ary:
            jsn_obj = {}
            jsn_obj["notif_id"] = noti.notif_id
            jsn_obj["message"] = noti.message
            jsn_obj["show"] = noti.show
            jsn_ary.append(jsn_obj)
        return jsn_ary

    def notif_check_realTime(self):
        response = Term.exec_cmd(self.command)
        return response

    def validate_notif(self):
        if self.conditionsToCompare(self.result):
            self.show = True
        else:
            self.show = False
        return self.show

    def check_notif(self):
        if self.noti_type == Notif.TYPE_CMD:
            self.prev_result = self.result
            self.result = self.notif_check_realTime()
            return self.validate_notif()

    @staticmethod
    def getNotifs():
        Notif._notifs.sort(key=lambda x: x.priority)
        return Notif._notifs

    @staticmethod
    def identify_highPrior_notif():
        alerts = []
        all_notifs = Notif.getNotifs()
        for notif in all_notifs:
            result = notif.check_notif()
            if result:
                alerts.append(notif)
                # break
        return alerts

    @staticmethod
    def process_notif(open_notifs):
        alert = []
        # check for open_notifs else take the priority one. only one open notification is allowed.
        em_noti = [a_noti for o_noti in open_notifs for a_noti in Notif.getNotifs() if a_noti.notif_id == o_noti["notif_id"]]
        for noti in em_noti:
            if noti.mode == Notif.MODE_REALTIME:
                if noti.check_notif() == False:
                    alert.append(noti)
                break
        else:
            alert = Notif.identify_highPrior_notif()
            for k in em_noti:
                alert.remove(k)
        return alert

class Banner(Resource):
    def get(self, ):
        try:
            result = Notif.process_notif([])
            resp_json = {
                "status": "success"
                , "data": Notif.jsonObj(result)
            }
            return resp_json, 200
        except Exception as e:
            resp_json = {
                "status": "error"
                , "data": {"error": "%s" % e}
            }
            return resp_json, 500
class ScriptRunner(Resource):
    def get(self, ):
        try:
            result = Term.exec_cmd(app_config["scriptfile"])
            resp_jon = {
                "status":"success"
                ,"data": result.strip().split("\n")[-1]
            }
            return resp_jon
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
class InstallBoard(Resource):
    def get(self, ):
        try:
            result = Term.exec_cmd(app_config["boardsetupfile"])
            resp_jon = {
                "status":"success"
                ,"data": result.strip().split("\n")[-1]
            }
            return resp_jon
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
class exportCSV(Resource):
    def get(self, ):
        try:
            sampling_rate = request.args.get('sampling_rate', 5)
            output_dir = "./static/tmp/"
            if not os.path.exists(output_dir):
                os.makedirs(output_dir)
            cmd = f"{app_config['csvFIlePath']} -d {sampling_rate}"
            result = Term.exec_cmd(f"python3 {cmd}")
            resp_json = {
                "status":"success"
                ,"data": result.strip().split(" - ")[-1]
            }
            return resp_json
        except Exception as e:
            resp_json = {
                "status":"error"
                ,"data":{"error":"%s"%e}
            }
            return resp_json,500
