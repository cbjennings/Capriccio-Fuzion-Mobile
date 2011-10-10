/*
  All the functions in main.js are publicly accessible

  The contents of the files in the shared directory are also available.
 */

function tryLogin(req) {
	// $fh.log('tryLogin req',req);
	var ret = {
		'success' : true,
		'sessionid' : 123
	};
	// $fh.log('tryLogin ret',ret);
	return ret;
}

function checkSession(req) {
	// fh.log('checkSession req',req);
	if (req.session === 123)
		return {
			'alive' : true
		};
	var ret = {
		'alive' : false
	};
	// fh.log('checkSession ret',ret);
	return ret;
}

function getDate(req) {
	$fh.log('getDate req', req);
	var starton1 = new Date(req.date);
	starton1.setHours(8);
	var endon1 = new Date(req.date);
	endon1.setHours(12);
	endon1.setMinutes(0);

	var starton2 = new Date(req.date);
	starton2.setHours(13);
	starton2.setMinutes(0);
	var endon2 = new Date(req.date);
	endon2.setHours(17);

	var starton3 = new Date(req.date);
	starton3.setHours(10);
	starton3.setMinutes(0);
	var endon3 = new Date(req.date);
	endon3.setHours(14);
	endon3.setMinutes(0);

	var starton4 = new Date(req.date);
	starton4.setHours(19);
	starton4.setMinutes(0);
	var endon4 = new Date(req.date);
	endon4.setHours(21);
	endon4.setMinutes(0);

	var ret = {
		"date" : req.date,
		"timecards" : [ {
			"id" : 1,
			"starton" : starton1,
			"endon" : endon1,
			"chargenumber" : "REF",
			"reason" : "",
			"comments" : "Coding"
		}, {
			"id" : 2,
			"starton" : starton3,
			"endon" : endon3,
			"chargenumber" : "MCTIMS",
			"reason" : "",
			"comments" : "Coding"
		}, {
			"id" : 3,
			"starton" : starton2,
			"endon" : endon2,
			"chargenumber" : "FUZION",
			"reason" : "",
			"comments" : "DB Design"
		}, {
			"id" : 4,
			"starton" : starton4,
			"endon" : endon4,
			"chargenumber" : "REF",
			"reason" : "",
			"comments" : "DB Design"
		} ]
	};
	// $fh.log('getDate ret',ret);
	return ret;
}

function getTimecard(req) {
	// $fh.log('getTimecard req',req);
	var starton1 = new Date();
	starton1.setHours(8);
	var endon1 = new Date();
	endon1.setHours(12);
	endon1.setMinutes(0);
	var ret = {
		"timecard" : {
			"id" : req.id,
			"starton" : starton1,
			"endon" : endon1,
			"chargenumber" : 1,
			"reason" : "",
			"comments" : "Coding"
		},
		"chargenumbers" : [ {
			"id" : 1,
			"name" : "REF"
		}, {
			"id" : 2,
			"name" : "MCTIMS"
		}, {
			"id" : 3,
			"name" : "Fuzion"
		} ],
		"reasons" : [ {
			"id" : 1,
			"name" : "Forgot"
		}, {
			"id" : 2,
			"name" : "Charge number not available"
		}, {
			"id" : 3,
			"name" : "Out of office"
		} ]
	};
	// $fh.log('getTimecard ret',ret);
	return ret;

}

function saveTimecard(req) {
	$fh.log('saveTimecard req', req);
	var ret = {
		"success" : true,
		"messages" : []
	};

	var starton = new Date(req.starton);
	var endon = new Date(req.endon);

	if (!starton.getHours || req.starton == "") {
		ret.success = false;
		ret.messages.push("You must enter a start time.");
	}

	if (!endon.getHours || req.endon == "") {
		ret.success = false;
		ret.messages.push("You must enter an end time.");
	}

	if (starton && endon && !starton < endon) {
		ret.success = false;
		ret.messages.push("The start time must be before the end time.");
	}

	if (!req.chargenumber) {
		ret.success = false;
		ret.messages.push("You must select a Charge Number.");
	}

	var today = new Date();
	today.setHours(0);
	today.setMinutes(0);
	today.setSeconds(0);
	today.setMilliseconds(0);

	if (!req.reason && starton.getTime() < today.getTime()) {
		ret.success = false;
		ret.messages
				.push("You must supply a reason for a previous day's entry.");
	}

	if (!req.comments) {
		ret.success = false;
		ret.messages.push("You must enter comments.");
	}

	$fh.log('saveTimecard ret', ret);
	return ret;
}

function newTimecard(req) {
	// $fh.log('newTimecard req',req);
	var ret = '';
	if (new Date(req.date))
		ret = {
			"guid" : 5,
			"chargenumbers" : [ {
				"id" : 1,
				"name" : "REF"
			}, {
				"id" : 2,
				"name" : "MCTIMS"
			}, {
				"id" : 3,
				"name" : "Fuzion"
			} ],
			"reasons" : [ {
				"id" : 1,
				"name" : "Forgot"
			}, {
				"id" : 2,
				"name" : "Charge number not available"
			}, {
				"id" : 3,
				"name" : "Out of office"
			} ]
		};
	// $fh.log('newTimecard ret', ret);
	return ret;
}

function submitTimecardApproval(req) {
	$fh.log('saveTimecard req', req);

	/**
	 * Do funky web service magic in here to get a real return value.
	 */
	var ret = {
		"success" : true,
		"messages" : []
	};
	ret.messages.push("Timecard Approval Successfully submitted");
	return ret;
}

function getCurrentTimecardApproval(req) {
	//$fh.log('getTimecardApproval req',req);
	//Do magic web service call here to fill in these values.
	var guid = "42";
	var totalHoursReq = 88;
	var totalHours = 80;
	var totalChargeHours = 75;
	var totalExclHours = 5;

	var ret = {
		"timecardApproval" : {
			"guid" : guid,
			"totalHoursReq" : totalHoursReq,
			"totalHours" : totalHours,
			"totalChargeHours" : totalChargeHours,
			"totalExclHours" : totalExclHours
		}
	};
	//$fh.log('getTimecard ret',ret);
	return ret;

}