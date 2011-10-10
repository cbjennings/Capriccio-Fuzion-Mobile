/**
 * JavaScript Code for day view.
 */

function roundNumber(num, dec) {
	var result = Math.round(num * Math.pow(10, dec)) / Math.pow(10, dec);
	return result;
}

function setDate(d) {
	var curr_date = d.getDate();
	var curr_month = d.getMonth();
	$("#DayViewCalendar").data("currdate", d);
	curr_month++;
	var curr_year = d.getFullYear();
	$("#fkDate").val(curr_year + "-" + curr_month + "=" + curr_date);
	if (curr_date.toString().length == 1)
		curr_date = "0" + curr_date.toString();
	if (curr_month.toString().length == 1)
		curr_month = "0" + curr_month.toString();
	$("#HeaderDate").text(curr_month + "/" + curr_date + "/" + curr_year);

}

function goDay(date) {
	$.mobile.showPageLoadingMsg();
	setDate(date);
	$("#entryList-contain").html("");
	var adjusteddate = new Date(date);
	adjusteddate.setDate(adjusteddate.getDate() - 1);
	$fh
			.act(
					{
						act : 'getDate',
						secure : true,
						req : {
							date : adjusteddate.getTime()
						}
					},
					function(res) {
						var winheight;
						$fh.env({/* none */}, function(envprops) {
							winheight = envprops.height;
						}, function(code, errorprops, params) { /* none */
						});

						var listheight = winheight - 90;
						var hourHeight = listheight / 24;
						var d = new Date(res.date);
						d.setDate(d.getDate() + 1);
						setDate(d);
						$("#entryList-contain")
								.html(
										'<ul data-role="listview" id="entryList" style="width:85%;float:right;margin-right:1px;margin-top:0;"></ul>')
								.css("height", listheight + "px").css(
										"background-size",
										"auto " + listheight + "px");
						var float = "right";
						for ( var i in res.timecards) {

							var starton = new Date(res.timecards[i].starton);
							var endon = new Date(res.timecards[i].endon);

							var one_hour = 1000 * 60 * 60;
							var TimeSpan = roundNumber(
									(endon.getTime() - starton.getTime())
											/ (one_hour), 2)
							var prevEnd;

							prevEnd = new Date(starton);
							prevEnd.setHours(0);
							prevEnd.setMinutes(0);

							var margintop = roundNumber(
									((starton.getTime() - prevEnd.getTime()) / one_hour),
									2)
									* hourHeight;

							var li = $("<li />");
							li
									.append(
											$("<a />")
													.attr("href", "#")
													.css("paddingTop", "0")
													.append(
															$("<h6 />")
																	.text(
																			res.timecards[i].chargenumber)
																	.css(
																			"marginTop",
																			"0"))
													.append(
															$("<span>")
																	.addClass(
																			"ui-li-aside")
																	.text(
																			TimeSpan
																					+ " hours")
																	.css(
																			"marginTop",
																			"0"))
													.append(
															$("<p />")
																	.text(
																			res.timecards[i].comments)
																	.css(
																			"border",
																			"1px solid #ddd")
																	.css(
																			"border-width",
																			"1px 0 0 0")
																	.css(
																			"overflow",
																			"hidden")
																	.css(
																			"margin-top",
																			"-5px")
																	.css(
																			"padding-top",
																			"4px"))

									).css(
											"height",
											Math.round(hourHeight * TimeSpan)
													+ "px").css("top",
											Math.round(margintop + 43) + "px")
									.css("position", "absolute").data("id",
											res.timecards[i].id)
									.click(function() {

										loadTimecard($(this).data("id"));

									});

							if (float == "right") {
								float = "left";
								li.css("left", "10%");
							} else {
								float = "right";
								li.css("right", "00");
							}

							if ((res.timecards[(parseInt(i) - 1)] && res.timecards[(parseInt(i) - 1)].endon > res.timecards[i].starton)
									|| (res.timecards[(parseInt(i) + 1)] && res.timecards[(parseInt(i) + 1)].starton < res.timecards[i].endon)) {
								li.css("width", "45%");
							} else {
								li.css("width", "90%");
							}
							$("#entryList").append(li);
						}
						$("#entryList").listview();
						$.mobile.hidePageLoadingMsg();
					});
}

$('#DayViewCalendar').live('pagecreate', function(event) {
	
	goDay(new Date());
	$('#DayViewCalendar').live('swiperight', function(event) {
		var d = $("#DayViewCalendar").data("currdate");
		d.setDate(d.getDate() - 1);
		goDay(d);
	});
	
	$('#DayViewCalendar').live('swipeleft', function(event) {
		var d = $("#DayViewCalendar").data("currdate");
		d.setDate(d.getDate() + 1);
		goDay(d);
	});

	$("#btnDayPrev").click(function() {
		var d = $("#DayViewCalendar").data("currdate");
		d.setDate(d.getDate() - 1);
		goDay(d);
	});
	
	$("#btnDayNext").click(function() {
		var d = $("#DayViewCalendar").data("currdate");
		d.setDate(d.getDate() + 1);
		goDay(d);
	});

	$("#HeaderDate").click(function() {
		$("#fkDate").datebox("open");
	});
	
	$('#fkDate').bind('datebox', function(e, p) {
		if (p.method === 'set') {

			$('#fkDate').datebox('close');
			var d = new Date(p.value);
			d.setDate(d.getDate() + 1);
			goDay(d);
		}
	});
	
	$("#btnNewTimecard").click(function() {
		loadTimecard(new Date($("#fkDate").val()));
	});
	
	$("#btnSubmitTimecardApproval").click(
			function()
			{
				$.mobile.changePage($("#submitTimecardApprovalDialog"));
			});
	
	$("#btnConfirmNo").click(
			function()
			{
				$.mobile.changePage($("#DayViewCalendar"));
			});
	
	$("#btnConfirmYes").click(
			function()
			{
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