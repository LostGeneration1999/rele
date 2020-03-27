// This is a JavaScript file
//Jquery mobileの不具合修正
jQuery(document).bind("mobileinit", function(){
  jQuery.mobile.ajaxEnabled = false;
  $.mobile.pushStateEnabled = false;
  jQuery.mobile.ajaxLinksEnabled = false;
  jQuery.mobile.ajaxFormsEnabled = false;
  jQuery.mobile.hashListeningEnabled = false;
});

$('#LoginPage').live('pagecreate', function() {
    var table = $('.ui-login-content')
    console.log('height: ' + table.height());
    // header, footerの高さが取れない
});
 
$('#LoginPage').live('pageinit', function() {
    console.log("page init");
    var table = $('#LoginPage')
    console.log('height: ' + table.height());
    // header, footerの高さが取れない
});
 
$('#LoginPage').live('pageshow', function() {
    var table = $('.ui-login-content')
    console.log('height: ' + table.height());
    setHeight();
});
 
function setHeight() {
    var page_height = $(window).height();
    console.log("page height: " + page_height);
    var header_height = $('#home [data-role="header"]').height();
    console.log("header height: " + header_height);
    var footer_height = $('#home [data-role="footer"]').height();
    console.log("footer height: " + footer_height);
 
    var table_height = page_height - header_height - footer_height;
    $('.ui-login-content').css({
        height: table_height
        });
}