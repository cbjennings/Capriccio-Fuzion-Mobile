//Ready Function
$(function() {

	$.mobile.selectmenu.prototype.options.nativeMenu = true;
	var user, pass, company;
	$fh.data({
		key : 'username'
	}, function(res) {
		user = res.val;
		$("#txtUsername").val(user);
	});
	$fh.data({
		key : 'password'
	}, function(res) {
		pass = res.val;
		$("#txtPassword").val(pass);
		if (pass)
			$("#chkStorePassword").attr("checked", "checked");
	});
	$fh.data({
		key : 'company'
	}, function(res) {
		company = res.val;
		$("#txtCompany").val(company);
	});

	// $.mobile.changePage($("#Login"));
	$("#btnLogin").click(
			function() {
				if ($("#txtUsername").val() && $("#txtPassword").val()
						&& $("#txtCompany").val()) {

					CallService('Login', {
						username : JSON.stringify($("#txtUsername").val()),
						password : JSON.stringify($("#txtPassword").val())
					}, function(res) {
						$fh.data({
							act : 'save',
							key : 'username',
							val : $("#txtUsername").val()
						});
						$fh.data({
							act : 'save',
							key : 'company',
							val : $("#txtCompany").val()
						});
						if ($("#chkStorePassword").attr("checked")) {
							$fh.data({
								act : 'save',
								key : 'password',
								val : $("#txtPassword").val()
							});
						} else {
							$fh.data({
								act : 'save',
								key : 'password',
								val : ''
							});
						}
						sessionId = res.sessionId
						$.mobile.hidePageLoadingMsg();
						goDay(new Date());
						// $.mobile.changePage($("#DayViewCalendar"));
					}, "DisplayMessages");
				}
			});
	if (user && pass && company)
		$("#btnLogin").click();

	$("#Validation").live('pagecreate', function() {
		$.mobile.fixedToolbars.setTouchToggleEnabled(false)
	});
});