##
# Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
# Copyright (c) 2022 - 2024 Advanced Micro Devices, Inc.  All rights reserved.
#
# SPDX-License-Identifier: MIT
##

##  @systemcontroller.py
#   This file contains main. Initiates and starts server.
#

# imports
from flask import Flask, render_template, request
from flask import Response  ,jsonify
from flask_restful import Resource, Api , reqparse
from werkzeug.utils import secure_filename
import shutil

from logg import *
from restserv import *
from parse import *
from config_app import *
from jnservice import *
import restserv
##  Main that calls other functions and launches the server.
#
#
app = Flask(__name__)
api = Api(app)
app.config['PDI_UPLOAD_FOLDER'] = app_config["PDIFilePath"]
app.config['UPLOAD_FOLDER'] = app_config["uploaded_files_path"]
app.config['MAX_CONTENT_LENGTH'] = 1 * 1024 * 1024 * 1024 # 1 GB
ALLOWED_CLK_EXTENSIONS = set(app_config["allowed_clock_files"])
#ALLOWED_PDI_EXTENSIONS = set(app_config["allowed_pdi_files"])

def allowed_clk_file(filename):
    return '.' in filename and filename.rsplit('.', 1)[1].lower() in ALLOWED_CLK_EXTENSIONS
def allowed_pdi_file(filename):
    return True
def allowed_rauc_file(filename):
    return True

@app.route('/')
def index():
    if not os.path.exists(app_config["uploaded_files_path"]):
        os.makedirs(app_config["uploaded_files_path"])
    # returning template.
    generate_gen_sc_file(sc_app_path, app_config)
    return render_template("index.html", versioning = ""+ app_config["major_version"]+"."+app_config["minor_version"] + "." + app_config["dev_for_major_ver"]+"."+app_config["dev_minor_ver"])	
## Resources
api.add_resource(Poll,"/poll")
api.add_resource(FuncReq,"/funcreq")
api.add_resource(CmdQuery,"/cmdquery")
api.add_resource(MultiCmdQuery,"/multicmdquery")
api.add_resource(EEPROMDetails,"/eeprom_details")
api.add_resource(ClockFilesList,"/clock_files")
api.add_resource(Banner,"/notif")
api.add_resource(ScriptRunner, "/scriptrunner")
api.add_resource(InstallBoard, "/installboard")
api.add_resource(exportCSV, "/exportcsv")
api.add_resource(RaucUpdate, "/raucupdate")
## Resources
import threading
req_lock = threading.Lock()

@app.before_request
def lock_next_requests():
    #if  "cmdquery" in request.path or "eeprom_details" in request.path or "funcreq" in request.path:
    #    if checkJNK() >= 1:
    #        return {"key":"A jupyter notebook kernel is running"},204
    if  "cmdquery" in request.path or "eeprom_details" in request.path or "funcreq" in request.path:
        global req_lock
        req_lock.acquire()
        Logg.log("************* Request locked",Logg.DEBUG)
@app.after_request
def unlock_for_next_req(response):
    global req_lock
    if req_lock.locked():
        req_lock.release()
        Logg.log("************* Released lock",Logg.DEBUG)
    return response

def crstring():
    return '''/*
* Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
* Copyright (c) 2022 - 2024 Advanced Micro Devices, Inc.  All rights reserved.
*
* SPDX-License-Identifier: MIT
*/
'''
def generate_gen_sc_file(sc_app_path, app_config):
    # Creating a config file which contains a list of each tab type.
    f = open("./static/js/gen_sc.js", "w")
    p = ParseData()
    f.write(crstring())
    f.write("var listsjson_sc = {\n")
    listfeature = p.parse_cmd_resp(Term.exec_cmd(sc_app_path + " -c listfeature\n"), "listfeature")
    finStr = ""
    for k in listfeature:
        if len(finStr):
            finStr = finStr + ","
        finStr = finStr + '"list' + k + '"'
    f.write('"listfeature":[' + finStr + "],\n")

    lisj = app_config["config_sc_list_cmds"]
    for ind, k in enumerate(listfeature):
        ke = "list" + k
        if ind > 0:
            f.write(",\n")
        response = Term.exec_cmd(sc_app_path + " -c " + ke + "\n")
        resp = p.parse_cmd_resp(response, ke)
        finStr = ""
        for k in resp:
            if len(finStr):
                finStr = finStr + ","
            finStr = finStr + '"' + k + '"'
        f.write('"' + ke + '":[' + finStr + "]")

    vers1 = ""+ app_config["major_version"]+"."+app_config["minor_version"]
    vers2 = ""+ p.parse_cmd_resp(Term.exec_cmd(sc_app_path+" -c version"),"version")["version"]
    f.write(',\n"version":"' + vers1 + '/' + vers2 + '"')
    lisk = app_config["config_bit_list_cmds"]
    for ind, k in enumerate(lisk):
        ke = "describeBIT"
        if ind > 0:
            f.write(",\n")
        response = Term.exec_cmd(sc_app_path + " -c " + k + "\n")
        resp = p.parse_cmd_resp(response, k)
        resp = [item.split(' - ')[0] for item in resp]
        finStr = ""
        for k in resp:
            k = '"' + k + '"'
            if len(finStr):
                finStr = finStr + ","
            finStr += '"' + Term.exec_cmd(sc_app_path + " -c " + ke + " -t " + k).strip() + '"'
        f.write(',\n"Description":[' + finStr + ']')
    tcsfiles = ""
    txtfiles = ""
    binfiles = ""
    for c in os.listdir(app_config["8A34001_clk_files_path"]):
        if c.endswith(".tcs"):
            if len(tcsfiles):
                tcsfiles = tcsfiles + ","
            tcsfiles = tcsfiles + '"' + c + '"'
        if c.endswith(".txt"):
            if len(txtfiles):
                txtfiles = txtfiles + ","
            txtfiles = txtfiles + '"' + c + '"'
        if c.endswith(".bin"):
            if len(binfiles):
                binfiles = binfiles + ","
            binfiles = binfiles + '"' + c + '"'

    f.write(',\n"8A34001_clk_tcs_files":[' + tcsfiles + ']')
    f.write(',\n"8A34001_clk_txt_files":[' + txtfiles + ']')
    f.write(',\n"8A34001_clk_bin_files":[' + binfiles + ']')

    f.write("\n};")
    f.close()

    # Check device
    deviname = Term.exec_cmd(sc_app_path + " -c board\n")
    app_config["deviname"] = deviname.strip()
    print("deviname = ", deviname)
    string_file = "./static/js/" + deviname.lower().strip() + "_strings.js"
    print("stringfile = ", string_file)
    if not os.path.exists(string_file):
        string_file = "./static/js/temp_strings.js"
    shutil.copyfile(string_file, "./static/js/beam_strings.js")

    f = open("./static/js/gen_sc.js", "a")
    f.write("\nvar general = {\n")
    deviname = deviname.strip('\n')
    f.write('"boardName":''"' + deviname + '"')
    f.write("\n}")
    f.close()

    # Read Version info
    f = open("./static/js/gen_sc.js", "a")
    f.write("\nvar version = {\n")
    version_info = Term.exec_cmd(app_config["versioninfo"].split('\n'))
    lines = version_info.strip().split('\n')
    f.write('    "version_info": [\n')
    for line in lines:
        line = line.replace('"', '\\"')
        f.write('        "{}",\n'.format(line))
    f.write("    ]\n};\n")
    f.close()

    #   bit tab components
    f = open("./static/js/gen_bit.js", "w")
    p = ParseData()
    f.write(crstring())
    f.write("var listsjson_bit = {\n")
    lisj = app_config["config_bit_list_cmds"]
    for ind, ke in enumerate(lisj):
        if ind > 0:
            f.write(",\n")
        response = Term.exec_cmd(sc_app_path + " -c " + ke + "\n")
        resp = p.parse_cmd_resp(response, ke)
        finStr = ""
        for k in resp:
            if len(finStr):
                finStr = finStr + ","
            finStr = finStr + '"' + k + '"'
        f.write('"' + ke + '":[' + finStr + "]");

    f.write("\n}")
    f.close()
    #   boot mode list
    f = open("./static/js/gen_bm.js", "w")
    f.write(crstring())
    f.write("var listsjson_bm = {\n")
    lisj = app_config["config_bm_list_cmds"]
    for ind, ke in enumerate(lisj):
        if ind > 0:
            f.write(",\n")
        response = Term.exec_cmd(sc_app_path + " -c " + ke + "\n")
        resp = p.parse_cmd_resp(response, ke)
        finStr = ""
        for k in resp:
            if len(finStr):
                finStr = finStr + ","
            finStr = finStr + '"' + k + '"'
        f.write('"' + ke + '":[' + finStr + "]");

    f.write("\n}")
    f.close()

if __name__ == '__main__':
    Notif.notification_load()
    if not len(sc_app_path) or not len(SysFactory.exec_cmd("which " + sc_app_path, SysFactory.TERMINAL)):
        Logg.log("Please check sc_app Path", Logg.RELEASE)
        exit(0)
    # if not len(sensors_app) or not len(SysFactory.exec_cmd("which "+sensors_app,SysFactory.TERMINAL)):
    #    Logg.log("Please check sensors app Path",Logg.RELEASE)
    #    exit(0)

    generate_gen_sc_file(sc_app_path, app_config)
    @app.route('/uploader', methods=['POST'])
    def upload_file():
        req = request.args.get('func')
        if 'file' not in request.files:
            return jsonify({'message': 'No file part in the request'})

        files = request.files.getlist('file')

        errors = False
        for file in files:
            if file.filename == '':
                return jsonify({'message': 'No file selected for uploading'})

            if req == 'clock' and file and allowed_clk_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['UPLOAD_FOLDER'], filename))
            elif req == 'pdi' and file and allowed_pdi_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['PDI_UPLOAD_FOLDER']+app_config["deviname"], filename))
            elif req == 'rauc' and file and allowed_rauc_file(file.filename):
                filename = secure_filename(file.filename)
                file.save(os.path.join(app.config['RAUC_UPLOAD_FOLDER'], filename))
            else:
                errors = True


        if errors:
            return jsonify({'message': 'Some files could not be uploaded. Allowed file types are txt'})

        return jsonify({'message': 'Files successfully uploaded'})
    app.run(host="0.0.0.0", port=80, debug=True)

