/**
 * Timecard view.
 */

$("#TimecardDetail").live(
		'pagecreate',
		function() {
			$("#btnCloseTimecard").click(function() {
				$.mobile.changePage($("#WorkWeekCalendar"), {
					reverse : true
				});
			});
			$("#btnNewTimecard").click(function() {
				loadTimecard(new Date($("#fkDate").val()));
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
								$.mobile.changePage($("#WorkWeekCalendar"), {
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

	var listheight = winheight - 90;
	$("#TimeCardForm").css("height", listheight + "px").css("overflow", "auto");

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
			$("#txtStartOn").val(formatTime(new Date(res.timecard.starton)));
			$("#txtEndOn").val(formatTime(new Date(res.timecard.endon)));
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