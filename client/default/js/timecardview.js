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
						$.mobile.showPageLoadingMsg();
						var starton = new Date($("#TimecardFullDate").val()
								+ " " + $("#txtStartOn").val());
						var endon = new Date($("#TimecardFullDate").val() + " "
								+ $("#txtEndOn").val());
						// alert($("#TimecardFullDate").val());
						if ($("#txtStartOn").val() == "")
							starton = "";
						if ($("#txtEndOn").val() == "")
							endon = "";

						var comments = $("#txtComments").text();
						if (comments == "")
							comments = $("#txtComments").val()

						var req = {
							"id" : $("#txtId").val(),
							"starton" : starton.getTime(),
							"endon" : endon.getTime(),
							"comments" : comments,
							"chargenumber" : $("#txtChargeNumber").val(),
							"reason" : $("#txtChargeNumber").val()
						};
						$fh.act({
							act : 'saveTimecard',
							secure : true,
							req : req
						}, function(res) {
							if (res.success)
								$.mobile.changePage($("#DayViewCalendar"), {
									reverse : true
								});
							else {
								$("#errorList").html("");

								for ( var i in res.messages) {
									$("<li>" + res.messages[i] + "</li>")
											.appendTo($("#errorList"));
								}
								$.mobile.changePage($("#Validation"), {
									transition : "pop"
								});
								$("#Validation .ui-header a:jqmData(icon='delete')").remove();
							}
							$.mobile.hidePageLoadingMsg();
						});
					});
		});

function loadTimecard(id) {
	$.mobile.changePage($("#TimecardDetail"));
	$.mobile.showPageLoadingMsg();
	var winheight;
	$fh.env({/* none */}, function(envprops) {
		winheight = envprops.height;
	}, function(code, errorprops, params) { /* none */
	});

	
	if (!id.getHours) {
		$("#txtId").val(id);
		$fh.act({
			act : 'getTimecard',
			secure : true,
			req : {
				id : id
			}
		}, function(res) {
			var starton = new Date(res.timecard.starton);
			// alert(starton);
			$("#TimecardFullDate").val(
					(starton.getMonth() + 1) + "/" + starton.getDate() + "/"
							+ starton.getFullYear());
			// alert($("#TimecardFullDate").val());
			
			var endon=new Date(res.timecard.endon);
			var one_hour = 1000 * 60 * 60;
			var TimeSpan = roundNumber(
					(endon.getTime() - starton.getTime())
							/ (one_hour), 2);
			$("#txtStartOn").val(formatTime(starton));
			$("#txtEndOn").val(formatTime(endon));
			
			$("#TimecardDetailHeader h1").text(TimeSpan + " hours - " + res.timecard.comments)
			
			$("#txtComments").text(res.timecard.comments);

			$("#txtChargeNumber").html("").append(
					$('<option value=""></option>'));
			for ( var i in res.chargenumbers) {
				var opt = $("<option />");
				opt.val(res.chargenumbers[i].id)
						.text(res.chargenumbers[i].name);
				$("#txtChargeNumber").append(opt);
			}

			$("#txtChargeNumber").val(res.timecard.chargenumber);
			$("#txtChargeNumber").selectmenu('refresh', true);

			$("#txtReason").html("").append($('<option value=""></option>'));
			for ( var i in res.reasons) {
				var opt = $("<option />");
				opt.val(res.reasons[i].id).text(res.reasons[i].name);
				$("#txtReason").append(opt);
			}

			$("#txtReason").val(res.timecard.reason);
			$("#txtReason").selectmenu('refresh', true);

			$("#mileageList").live('click', function() {
				loadMileage($("#txtId").val());
			});
			
			$("#btnDeleteTimecard").show();
			$.mobile.hidePageLoadingMsg();
		});
	} else {
		$("#TimecardFullDate").val(
				(id.getMonth() + 1) + "/" + id.getDate() + "/"
						+ id.getFullYear())
		$fh.act({
			act : 'newTimecard',
			secure : true,
			req : {
				date : id.getTime()
			}
		}, function(res) {
			$("#txtChargeNumber").html("").append(
					$('<option value=""></option>'));
			for ( var i in res.chargenumbers) {
				var opt = $("<option />");
				opt.val(res.chargenumbers[i].id)
						.text(res.chargenumbers[i].name);
				$("#txtChargeNumber").append(opt);
			}
			$("#txtChargeNumber").selectmenu('refresh', true);

			$("#txtReason").html("").append($('<option value=""></option>'));
			for ( var i in res.reasons) {
				var opt = $("<option />");
				opt.val(res.reasons[i].id).text(res.reasons[i].name);
				$("#txtReason").append(opt);
			}
			$("#txtReason").selectmenu('refresh', true);

			$("#txtId").val(res.guid);

			$("#txtStartOn").val("");
			$("#txtEndOn").val("");
			$("#txtComments").text("");
			$("#TimecardDetailHeader h1").text("New Timecard");
			$("#btnDeleteTimecard").hide();
			$.mobile.hidePageLoadingMsg();
		});
	}
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