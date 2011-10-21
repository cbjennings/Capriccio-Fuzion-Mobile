var sessionId;
//string, (json)object, function(data), function(data) OR 'DisplayMessages' 
function CallService(ServiceName, Data, Success, Error) {
	$.ajax({
		type:"POST",
		contentType: "application/json; charset=utf-8",
		data:Data,
		dataType:"jsonp",
		jsonpCallback:"testCallback",
		crossDomain:"true",
		url:"https://www.capricciofuzion.com/"+$("#txtCompany").val()+"/web/webservices/MobileService.asmx/"+ServiceName,
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
		},
		error:function(jqXHR, textStatus, errorThrown) {
			alert(JSON.stringify({'XHR':jqXHR,'status':textStatus,'error':errorThrown}))
		}
	});
}