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
	
	if (curr_date.toString().length == 1)
		curr_date = "0" + curr_date.toString();
	if (curr_month.toString().length == 1)
		curr_month = "0" + curr_month.toString();
	$("#fkDate").val(curr_month + "/" + curr_date + "/" + curr_year);
	$("#HeaderDate").text(curr_month + "/" + curr_date + "/" + curr_year);

}

function goDay(date) {
	
	setDate(date);
	$("#entryList-contain").html("");
	var adjusteddate = new Date(date);
	adjusteddate.setDate(adjusteddate.getDate());
	CallService(
			'getDate', 
			{
				date:JSON.stringify(adjusteddate.toDateString()),
				sessionId:JSON.stringify(sessionId)},
			function(res) {
				var hourHeight=600/24;
				var d = new Date(parseInt(res.date.substr(6)));
				d.setDate(d.getDate());
				setDate(d);
				$("#entryList-contain")
						.html(
								'<ul data-role="listview" data-theme="e" id="entryList" style="width:85%;float:right;margin-right:1px;margin-top:0;"></ul>')
						.css(
								"background-size",
								"auto " + 600 + "px");
				var float = "right";
				for ( var i in res.timecards) {

					var starton = new Date(parseInt(res.timecards[i].starton.substr(6)));
					var endon = new Date(parseInt(res.timecards[i].endon.substr(6)));

					var one_hour = 1000 * 60 * 60;
					var TimeSpan = roundNumber(
							(endon.getTime() - starton.getTime())
									/ (one_hour), 2);
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
													$("<span />")
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
																	"1px solid #666")
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
									(Math.round(hourHeight * TimeSpan)-2)
											+ "px").css("top",
									Math.round(margintop+69) + "px")
							.css("position", "absolute").data("id",
									res.timecards[i].Id)
							.click(function() {

								loadTimecard($(this).data("id"));

							});

					if (float == "right") {
						float = "left";
						li.css("left", "15%");
					} else {
						float = "right";
						li.css("right", "-2px");
					}

					if ((res.timecards[(parseInt(i) - 1)] && res.timecards[(parseInt(i) - 1)].endon > res.timecards[i].starton)
							|| (res.timecards[(parseInt(i) + 1)] && res.timecards[(parseInt(i) + 1)].starton < res.timecards[i].endon)) {
						li.css("width", "40%");
					} else {
						li.css("width", "85%");
					}
					$("#entryList").append(li);
				}
				if(res.timecards.length>0) $("#entryList").listview();
				$.mobile.changePage($("#DayViewCalendar"));
			},
			"DisplayMessages"
	);
}

$('#DayViewCalendar').live('pagecreate', function(event) {

	
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

	$("#btnViewTimecardApproval").click(function() {
		loadCurrentTimecardApproval();
	});
	
	$(document).scrollTop(150);

});