/**
 * Timecard view.
 */

$("#TimecardDetail").live(
		'pagecreate',
		function() {
			$("#btnCloseTimecard").click(function() {
				$.mobile.changePage($("#DayViewCalendar"), {
					reverse : true
				});
			});


			$("#btnSaveTimecard").click(
					function() {
						var starton = new Date($("#TimecardFullDate").val() + " " + $("#txtStartOn").val());
						var endon = new Date($("#TimecardFullDate").val() + " " + $("#txtEndOn").val());
//						alert($("#TimecardFullDate").val());
						if ($("#txtStartOn").val() == "")
							starton = "";
						if ($("#txtEndOn").val() == "")
							endon = "";

						var comments = $("#txtComments").text();
						if (comments == "")
							comments = $("#txtComments").val();

						var req = {
								"id" : $("#txtId").val(),
								"starton" : starton.getTime(),
								"endon" : endon.getTime(),
								"comments" : comments,
								"chargenumber" : $("#txtChargeNumber").val(),
								"reason" : $("#txtReason").val()
						};
						CallService( 
								'saveTimecard', 
								req, 
								function(res) {
									$.mobile.changePage($("#DayViewCalendar"), {
										reverse : true
									});
								}, 
								"DisplayMessages"
						);
					}
			);
		});

function loadTimecard(id) {
	
	$.mobile.showPageLoadingMsg();
	
	var serviceName, req, success, error;
	if(id.getHours) {
		$("#TimecardFullDate").val(
				(id.getMonth() + 1) + "/" + id.getDate() + "/"
						+ id.getFullYear())
		serviceName="newTimecard";
		req={
				date : JSON.stringify(id.toDateString()), 
				sessionId:JSON.stringify(sessionId)
		};
		success=function(res) {
			$("#txtChargeNumber").selectmenu();
			$("#txtChargeNumber").html("").append(
					$('<option value=""></option>'));
			for ( var i in res.chargenumbers) {
				var opt = $("<option />");
				opt.val(res.chargenumbers[i].id)
						.text(res.chargenumbers[i].name);
				$("#txtChargeNumber").append(opt);
			}
			$("#txtChargeNumber").selectmenu('refresh');

			$("#txtReason").selectmenu();
			$("#txtReason").html("").append($('<option value=""></option>'));
			for ( var i in res.reasons) {
				var opt = $("<option />");
				opt.val(res.reasons[i].id).text(res.reasons[i].name);
				$("#txtReason").append(opt);
			}
			$("#txtReason").selectmenu('refresh');

			$("#txtId").val(res.guid);

			$("#txtStartOn").val("");
			$("#txtEndOn").val("");
			$("#txtComments").text("");
			$("#TimecardDetailHeader h1").text("New Timecard");
			$("#btnDeleteTimecard").hide();
			$.mobile.hidePageLoadingMsg();
			$.mobile.changePage($("#TimecardDetail"));
		};
		error="DisplayMessages";
	} else {
		serviceName="GetTimecard";
		req={
				Id : JSON.stringify(id), 
				sessionId:JSON.stringify(sessionId)
		};
		success=function(res) {
			var starton = new Date(parseInt(res.timecard.starton.substr(6)));
			// alert(starton);
			$("#TimecardFullDate").val(
					(starton.getMonth() + 1) + "/" + starton.getDate() + "/"
							+ starton.getFullYear());
			// alert($("#TimecardFullDate").val());
			
			var endon=new Date(parseInt(res.timecard.endon.substr(6)));
			var one_hour = 1000 * 60 * 60;
			var TimeSpan = roundNumber(
					(endon.getTime() - starton.getTime())
							/ (one_hour), 2);
			$("#txtStartOn,#txtEndOn").datebox();
			$("#txtStartOn").val(formatTime(starton));
			$("#txtEndOn").val(formatTime(endon));
			$("#txtStartOn,#txtEndOn").datebox('refresh');
			
			
			$("#TimecardDetailHeader h1").text(TimeSpan + " hours - " + res.timecard.comments)
			
			$("#txtComments").text(res.timecard.comments);

			$("#txtChargeNumber").selectmenu();
			$("#txtChargeNumber").html("").append(
					$('<option value=""></option>'));
			for ( var i in res.chargenumbers) {
				var opt = $("<option />");
				opt.val(res.chargenumbers[i].id)
						.text(res.chargenumbers[i].name);
				$("#txtChargeNumber").append(opt);
			}

			$("#txtChargeNumber").val(res.timecard.chargenumber);
			$("#txtChargeNumber").selectmenu('refresh');

			$("#txtReason").selectmenu();
			$("#txtReason").html("").append($('<option value=""></option>'));
			for ( var i in res.reasons) {
				var opt = $("<option />");
				opt.val(res.reasons[i].id).text(res.reasons[i].name);
				$("#txtReason").append(opt);
			}

			$("#txtReason").val(res.timecard.reason);
			$("#txtReason").selectmenu('refresh');

			$("#mileageList").live('click', function() {
				loadMileage($("#txtId").val());
			});
			
			$("#btnDeleteTimecard").show();
			$.mobile.hidePageLoadingMsg();
			$.mobile.changePage($("#TimecardDetail"));
		};
		error="DisplayMessages";
	}
	
	CallService(serviceName, req, success, error);
	
}

function formatTime(time) {
	var ret = "";
	if (time.getHours() > 12) {
		ret += (time.getHours() - 12) + ":";
	} else {
		ret += (time.getHours()) + ":";
	}

	if (time.getMinutes() < 10)
		ret += "0";
	ret += time.getMinutes();

	if (time.getHours() >= 12)
		ret += " PM";
	else
		ret += " AM";
	return ret;
}