/**
 * 
 */
function loadCurrentTimecardApproval() {
	var adjusteddate = new Date($("#fkDate").val());
	adjusteddate.setDate(adjusteddate.getDate() - 1);

	CallService('getCurrentTimecardApproval', {
		date : adjustedDate,
		sessionId : sessionId
	}, function(res) {
		// alert(JSON.stringify(res));
		$("#totalHoursReq").val(res.timecardApproval.totalHoursReq);
		$("#totalHours").val(res.timecardApproval.totalHours);
		$("#totalChargeHours").val(res.timecardApproval.totalHours);
		$("#totalExclHours").val(res.timecardApproval.totalExclHours);
		$.mobile.changePage($("#TimecardApprovalDetail"));
	}, "DisplayMessages");

}

$("#TimecardApprovalDetail")
		.live(
				'pagecreate',
				function() {
					$("#btnCloseTimecardApproval").click(function() {
						$.mobile.changePage($("#DayViewCalendar"), {
							reverse : true
						});
					});

					// alert('approval detail create firing');
					$("#btnSubmitTimecardApproval")
							.click(
									function() {
										// alert('submit approval clicked');
										$.mobile.changePage(
												$("#TimecardApprovalDialog"), {
													transition : "pop"
												});
										$(
												"#TimecardApprovalDialog .ui-header a:jqmData(icon='delete')")
												.remove();
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
										$.mobile.changePage(
												$("#DayViewCalendar"), {
													reverse : true
												});
									else {
										$("#errorList").html("");

										for ( var i in res.messages) {
											$(
													"<li>" + res.messages[i]
															+ "</li>")
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