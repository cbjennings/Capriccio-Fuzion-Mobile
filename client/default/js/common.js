var sessionId;


// fn to handle jsonp with timeouts and errors
// hat tip to Ricardo Tomasi for the timeout logic
$.getJSONP = function(s) {
    s.dataType = 'jsonp';
    $.ajax(s);

    // figure out what the callback fn is
    var $script = $(document.getElementsByTagName('head')[0].firstChild);
    var url = $script.attr('src') || '';
    var cb = (url.match(/callback=(\w+)/)||[])[1];
    if (!cb)
        return; // bail
    var t = 0, cbFn = window[cb];

    $script[0].onerror = function(e) {
        $script.remove();
        handleError(s, {}, "error", e);
        clearTimeout(t);
    };

    if (!s.timeout)
        return;

    window[cb] = function(json) {
        clearTimeout(t);
        cbFn(json);
        cbFn = null;
    };

    t = setTimeout(function() {
        $script.remove();
        handleError(s, {}, "timeout");
        if (cbFn)
            window[cb] = function(){};
    }, s.timeout);
    
    function handleError(s, o, msg, e) {
        // support jquery versions before and after 1.4.3
        ($.ajax.handleError || $.handleError)(s, o, msg, e);
    }
};
//string, (json)object, function(data), function(data) OR 'DisplayMessages' 
function CallService(ServiceName, Data, Success, Error) {
	//alert(JSON.stringify(Data));
	$.mobile.showPageLoadingMsg();
	
	$.getJSONP({
		//url:"https://capricciofuzion.com/"+$("#txtCompany").val()+"/web/WebServices/MobileService.asmx/"+ServiceName,
		url:"http://localhost:63727/WebServices/MobileService.asmx/"+ServiceName,
		data:Data,
		timeout:15000,
		success:function(d) {
			var data=JSON.parse(d.d);
			//TODO:if NoSession message, try logging in again.
			if(data.success===false && Error==="DisplayMessages") {
				//Common error/validation message popup
				$("#errorList").html("");

				for ( var i in data.messages) {
					$("<li>" + data.messages[i] + "</li>")
							.appendTo($("#errorList"));
				}
				if(data.messages.length>0) {
					$.mobile.changePage($("#Validation"), {
						transition : "pop"
					});	
					$("#Validation .ui-header a:jqmData(icon='delete')").remove();
				}
			} else if (data.success===false) {
				Error(data);
			} else {
				Success(data);
			}
			$.mobile.hidePageLoadingMsg();
			return false;
			
		},
		error:function(jqXHR, textStatus, errorThrown) {
			$("#errorList").html("");

		
			$("<li><b>Unable to connect to Server</b></li>")
					.appendTo($("#errorList"));
			$("<li>Please verify data service, double check your Company Id, and try again.</li>")
				.appendTo($("#errorList"));
			
			$.mobile.hidePageLoadingMsg();
			
			$.mobile.changePage($("#Login"), {
				transition : "pop"
			});	
			$.mobile.changePage($("#Validation"), {
				transition : "pop"
			});	
			$("#Validation .ui-header a:jqmData(icon='delete')").remove();
			
		}
	});
}

$(document).bind("mobileinit", function(){
	  $.extend(  $.mobile , {
	    loadingMessage: "Loading..."
	  });
	  $(".selected .tab:jqmData(icon='expense')").click(function() {
		  $.mobile.changePage($("#ExpenseList"));
	  });
	  $(".selected .tab:jqmData(icon='timecard')").click(function() {
		  $.mobile.changePage($("#DayViewCalendar"));
	  });
	});