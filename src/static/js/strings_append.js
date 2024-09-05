/*
 * * Copyright (c) 2024 Advanced Micro Devices, Inc.  All rights reserved.
 * *
 * * SPDX-License-Identifier: MIT
 * */

/* this file is copy github links to all board string files. */
/* this file will be loaded after board_strings files. */

github_links = {
    "heading":"GitHub Links:",
    "content_type":1, // 0: paragraph, 1: bullet points
    "content":["SCWeb - BEAM WebUI : <a href='https://github.com/Xilinx/system-controller-web' target='_blank' style='color: wheat;'>GitHub</a>",
               "sc_app - System Controller backend and cli applications : <a href='https://github.com/Xilinx/system-controller-app' target='_blank' style='color: wheat;'>GitHub</a>",
               "RAFT - Power management backend library and API : <a href='https://github.com/Xilinx/RAFT' target='_blank' style='color: wheat;'>GitHub</a>",
               "Power Management Dashboard : <a href='https://github.com/Xilinx/system-controller-pmtool' target='_blank' style='color: wheat;'>GitHub</a>",
               "DFX Manager - Program PL on boot and load dynamic device tree overlays : <a href='https://github.com/Xilinx/dfx-mgr' target='_blank' style='color: wheat;'>GitHub</a>",
               "LabTools - XVC, hw_manager, cs_server : <a href='https://github.com/Xilinx/systemctl-labtool' target='_blank' style='color: wheat;'>GitHub</a>",
               "ChipScopy : <a href='https://github.com/Xilinx/systemctl-labtool' target='_blank' style='color: wheat;'>GitHub</a>",
               "U-Boot : <a href='https://github.com/Xilinx/u-boot-xlnx' target='_blank' style='color: wheat;'>GitHub</a>",
               "Linux Kernel : <a href='https://github.com/Xilinx/linux-xlnx' target='_blank' style='color: wheat;'>GitHub</a>",
               "Firmware : <a href='https://github.com/Xilinx/embeddedsw' target='_blank' style='color: wheat;'>GitHub</a>",
               "Yocto Manifests : <a href='https://github.com/Xilinx/yocto-manifests' target='_blank' style='color: wheat;'>GitHub</a>",
               "Yocto meta-system-controller : <a href='https://github.com/Xilinx/meta-system-controller' target='_blank' style='color: wheat;'>GitHub</a>"]
},
app_strings["about_content"]["content"].push(github_links);
