/*
* Copyright (c) 2020 - 2022 Xilinx, Inc.  All rights reserved.
* Copyright (c) 2022 - 2023 Advanced Micro Devices, Inc.  All rights reserved.
*
* SPDX-License-Identifier: MIT
*/
var app_strings = {
	"tab_title":"BOARD EVALUATION AND MANAGEMENT (BEAM) TOOL",
	"app_title":"BOARD EVALUATION AND MANAGEMENT (BEAM) TOOL",
	"xilinx_icon":"../images/icon.png",
	"home_tab":{
		"title":"Welcome & Get Started with Versal AI Core Series VCK190 Evaluation Kit",
		"left_pane":[
			{
				"image":"../static/images/VersalSilicon.png",
				"text":"",
				"button_title":"LEARN MORE",
				"button_link":"https://www.xilinx.com/products/silicon-devices/acap/versal.html",
			},
			{
				"image":"../static/images/AICore.png",
				"text":"",
				"button_title":"LEARN MORE",
				"button_link":"https://www.xilinx.com/products/silicon-devices/acap/versal-ai-core.html#productTable",
			}
		],
		"center_pane":{
			"image":"../static/images/VCK190_home.png",
			"text":"",
			"button_title":"VISIT PRODUCT PAGE",
			"button_link":"https://www.xilinx.com/products/boards-and-kits/vck190.html",
		},
	},
	"test_board":{
		"title":"",
		"center_pane":{
			"image":"../static/images/vck190.jpg",
			"text":"For more information regarding Hardware, Documentation, Tools & IP and Training & Support",
			"button_title":"VISIT PRODUCT PAGE",
			"button_link":"https://www.xilinx.com/products/boards-and-kits/vck190.html",
		},

	},
	"powertool":{
		"title":"Versal Power Tool",
		"pane":[
			{
				"title":"",
				"image":"../static/images/xilinx_banner.png",
				"text":"",
				"button_title":"RUN",
                "button_link_type":1,
				"button_link": "jnurllink",
				"learnmore_link":"https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/1299251214/Versal+ACAP+Power+Tool+part+1+-+Introduction+to+the+Power+Tool",
			},
		],

	},
	"cockpit":{
		"title":"ACAP Cockpit",
		"pane":[
			{
                                "title":"",
                                "image":"../static/images/xilinx_banner.png",
                                "text":"",
                                "button_title":"RUN",
                                "button_link_type":1,
                                "button_link": "launchacap",
                                "learnmore_link":"https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/1544192059/ACAP+Cockpit",
                        },
		],

	},
	"design_examples":{
		"title":"Target Reference Designs",
		"pane":[
			{
				"title":"",
				"image":"../static/images/xilinx_banner.png",
				"text":"",
				"button_title":"Product Page",
				"button_link":"https://www.xilinx.com/products/boards-and-kits/vck190.html",
				"learnmore_link":"https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/2232385541/Versal+Targeted+Reference+Designs+TRDs",
			},
		],

	},
        "help_content":{
                "title":"Help",
                "content":[
                        {
                                "heading":"",
                                "content_type":0,	// 0: paragraph, 1: bullet points
                                "content":["The Board Evaluation & Management Tool (BEAM) is currently in production ("+listsjson_sc.version+")"]
                        },
                        {
                                "heading":"Known Issues and Bugs",
                                "content_type":1,	
                                "content":["Some webpage links may be broken or non-functional. This may happen because the webpage may not exist or is moved to a different location/address. These links will be fixed in subsequent release of the Board Evaluation & Management Tool (BEAM).","The Board Evaluation & Management Tool (BEAM) can execute one particular action/task only at a time. For example, you cannot run the Board Settings and Board Interface Test at the same time. Please wait till a particular task is complete and then proceed."]
                        },
                        {
                                "heading":"Jupyter Notebook",
                                "content_type":1,
                                "content":["Logout from jupyter notebook before exiting. Failing doing so may show login screen for next notebook launch.",
					"Run jupyter notebook command in linux prompt to use from Board Evaluation & Management Tool if \"no jupyter notebook is running\" error message is shown.",
					"Jupyter notebook and BITs/SCUI tabs cannot be run at a time. Shut down any jupyter notebook kernels to use BIT or SCUI tabs components.",
					"Run jupyter notebook command in system controller prompt to start jupyter notebook server if system controller is set with static ip and notebook web page is not launching from BEAM Tool.",
				]
                        },
			{
                                "heading":"WIKI Links:",
                                "content_type":1,
                                "content":["Versal Adaptive SoCs : <a href='https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/1381400737/Versal+Adaptive+SoCs' target='_blank' style='color: wheat;'>wiki</a>","System Controller Landing Page : <a href='https://xilinx-wiki.atlassian.net/wiki/spaces/A/pages/2273738753/Versal+Evaluation+Board+-+System+Controller' target='_blank' style='color: wheat;'>wiki</a>"]
                        },
                ],

        },
        "about_content":{
                "title":"About",
                "content":[
                        {
                                "heading":"",
                                "content_type":0,       // 0: paragraph, 1: bullet points
                                "content":["The Board Evaluation & Management Tool (BEAM) is the main menu of the System Controller. It primarily serves as a launcher for demos and designs, running the board interface test and to set/change/read board parameters.",
                                           "The purpose of the Board Evaluation & Management Tool is to provide Versal users a much easier and far more intuitive experience with Xilinx Evaluation Board products. The goal is to help users get started faster and have all the available resources at one place for easy access.",
                                           "The Board Evaluation & Management Tool (BEAM) offers multiple navigation options for users. Depending on the persona type (Hardware, Software or Embedded developer) users can choose to start with either testing the board, use the Versal power tool, download Versal reference designs or learn more above the latest tools and libraries. ",
                                           "More features will be added in the next releases and existing features will be enhanced for a better out-of-box experience to users."]
                        },
                ],

        },

};

