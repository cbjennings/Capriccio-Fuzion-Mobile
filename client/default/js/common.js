var sessionId;
//string, (json)object, function(data), function(data) OR 'DisplayMessages' 
function CallService(ServiceName, Data, Success, Error) {
	//alert(JSON.stringify(Data));

	
	$.ajax({
		url:"http://localhost:59703/WebServices/MobileService.asmx/"+ServiceName,
		data:Data,
		dataType:"jsonp",
		success:function(d) {
			var data=JSON.parse(d.d);
			if(data.success===false && Error==="DisplayMessages") {
				//Common error/validation message popup
				$("#errorList").html("");

				for ( var i in res.messages) {
					$("<li>" + res.messages[i] + "</li>")
							.appendTo($("#errorList"));
				}
				if(res.messages.length>0) {
					$.mobile.changePage($("#Validation"), {
						transition : "pop"
					});	
				}
			} else if (data.success===false) {
				Error(data);
			} else {
				Success(data);
			}
			return false;
		},
		error:function(jqXHR, textStatus, errorThrown) {
			$("#errorList").html("");

		
			$("<li><b>Unable to connect to Server</b></li>")
					.appendTo($("#errorList"));
			$("<li>Please verify data service, double check your Company Id, and try again.</li>")
				.appendTo($("#errorList"));
			
		
			$.mobile.changePage($("#Validation"), {
				transition : "pop"
			});	
			
		}
	});
}

$(document).bind("mobileinit", function(){
	  $.extend(  $.mobile , {
	    loadingMessage: "Loading..."
	  });
	});