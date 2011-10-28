/**
 * 
 */
function loadCurrentTimecardApproval() {
	var adjusteddate = new Date($("#fkDate").val());
	adjusteddate.setDate(adjusteddate.getDate());

	CallService('GetTimecardApproval', {
		date : JSON.stringify(adjusteddate.toDateString()),
		sessionId : JSON.stringify(sessionId)
	}, function(res) {
		// alert(JSON.stringify(res));
		$("#totalHoursReq").val(res.timecardApproval.totalHoursReq);
		$("#totalHours").val(res.timecardApproval.totalHours);
		$("#totalChargeHours").val(res.timecardApproval.totalChargeHours);
		$("#totalExclHours").val(res.timecardApproval.totalExclHours);
		$("#tcaStatus").val(res.timecardApproval.status);
		$("#tcaId").val(res.timecardApproval.id);
		
		if(res.timecardApproval.status==="Submitted"){
			$("#btnSubmitTimecardApproval").hide();
			$("#btnUnSubmitTimecardApproval").show();
		} else if (res.timecardApproval.status==="Approved") {
			$("#btnSubmitTimecardApproval").hide();
			$("#btnUnSubmitTimecardApproval").hide();
		} else {
			$("#btnSubmitTimecardApproval").show();
			$("#btnUnSubmitTimecardApproval").hide();
		}
		
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
					$("#btnUnSubmitTimecardApproval").click( 
							function() {
								
								CallService(
										"UnSubmitApproval",
										{
												Id:JSON.stringify($("#tcaId").val()),
												sessionId: JSON.stringify(sessionId)
										},
										function() {
											loadCurrentTimecardApproval();											
										},
										"DisplayMessages"								
								);
							}
					);

					$("#btnConfirmYes").click(
							function() {

								CallService(
										"UnSubmitApproval",
										{
												Id:JSON.stringify($("#tcaId").val()),
												sessionId: JSON.stringify(sessionId)	
										},
										function() {
											loadCurrentTimecardApproval();											
										},
										"DisplayMessages"								
								);
							});

				});