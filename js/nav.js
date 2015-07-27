"use strict";
function runNav()
{
	jQuery("#nav").show();
	jQuery("#page").show();
	jQuery(".loggedin").hide();
	jQuery(".landing").show();
}

var empty = " - leer - ";

function logout()
{
	spindiv();
	var logoutreq = jQuery.get("ajax.py?do=session|destroy|" + sid);
	logoutreq.always(function(data) {
		if (data.status == 412)
		{
			alert("Diese Sitzung existiert nicht mehr!");
		}
		else if (data.status >= 400 && data.status <= 600)
		{
			setTimeout(function() { unspindiv(); logout(); }, 5000);
			return;
		}
		sid = "";
		jQuery(".loggedin").hide();
		jQuery(".landing").show();
		unspindiv();
		loadpage("landing");
	});
}

function progress(element, percent)
{
	var obj = jQuery("#" + element).children();
	obj.attr("aria-valuenow", percent);
	obj.attr("style", "width: "+percent+"%;");
	obj.children().children().text(percent+"%");
}
