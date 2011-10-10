/**
 * 
 */
function loadCurrentTimecardApproval()
{
	$.mobile.changePage($("#TimecardApprovalDetail"));
	$.mobile.showPageLoadingMsg();
	
	var winheight;
	$fh.env({/* none */}, function(envprops) {
		winheight = envprops.height;
	}, function(code, errorprops, params) { /* none */
	});

	var listheight = winheight - 90;
	$("#TimecardApprovalForm").css("height", listheight + "px").css("overflow", "auto");
	
	$fh.act({
		act : 'getCurrentTimecardApproval',
		secure : true,
		req : {
			id : id
		}
	}, function(res) {
		$("#totalHoursReq").text(res.timecardApproval.totalHoursReq);
		$("#totalHours").text(res.timecardApproval.totalHours);
		$("#totalChargeHours").text(res.timecardApproval.totalHours);
		$("#totalExclHours").text(res.timecardApproval.totalExclHours);
	});
	
	$.mobile.hidePageLoadingMsg();
}

$("#TimecardDetail").live(
		'pagecreate',
		function() {
			$("btnSubmitTimecardApproval").click(function() {
				$.mobile.changePage($("#TimecardApprovalDialog"), {
					transition : "pop"
				});
			});

			$("#btnConfirmYes").click(
					function() {
						$.mobile.showPageLoadingMsg();
						var guid = "somemagicguid";
						var req = {
							"guid" : guid
						};

						$fh.act({
							act : 'submitTimecardApproval',
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
							}
							$.mobile.hidePageLoadingMsg();
						});
					});

		});