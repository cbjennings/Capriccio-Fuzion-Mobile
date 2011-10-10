//Ready Function
$fh.ready(function() {
  $.mobile.selectmenu.prototype.options.nativeMenu = false;
   var user, pass, company;
  $fh.data({key:'username'}, function(res) {
    user=res.val; 
    $("#txtUsername").val(user);
  });
  $fh.data({key:'password'}, function(res) {
    pass=res.val; 
    $("#txtPassword").val(pass);
    if(pass) $("#chkStorePassword").attr("checked","checked");
  });
  $fh.data({key:'company'}, function(res) {
    company=res.val; 
    $("#txtCompany").val(company);
  });
    

  $("#btnLogin").click(function() {
    if(
      $("#txtUsername").val() && 
      $("#txtPassword").val() && 
      $("#txtCompany").val()
    ) {
      $.mobile.showPageLoadingMsg();
      $fh.act(
        {
          act:'tryLogin',
          secure:true, 
          req:{
            'username':$("#txtUsername").val(),
            'password':$("#txtPassword").val(),
            'company':$("#txtCompany").val()
          }
        },
        function(res) {
          if(res.success) {
            $fh.data({act:'save', key:'username', val:$("#txtUsername").val()});
            $fh.data({act:'save', key:'company', val:$("#txtCompany").val()});
            if($("#chkStorePassword").attr("checked")) {
              $fh.data({act:'save', key:'password', val:$("#txtPassword").val()}); 
            } else {
              $fh.data({act:'save', key:'password', val:''});
            }
            $.mobile.hidePageLoadingMsg();
            $.mobile.changePage($("#DayViewCalendar"));
          }
        },
        function(res) {
          alert('f:'+res); 
        }
      );
    } else {
      alert('missing field'); 
    } 
  });
  if(user&&pass&&company) $("#btnLogin").click(); 
  $( '#DayViewCalendar' ).live( 'pageinit',function(event){ });
});