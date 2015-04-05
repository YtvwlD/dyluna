"use strict";
function runPage()
{
	jQuery(document).ready('bootstrap_buttons', function() {
		jQuery("#login").button("reset");
		jQuery("#oid_url").attr("disabled", false);
		} );
	jQuery("#loginOrRegister").bind("shown.bs.modal", function() { jQuery("#oid_url").focus(); });
	spindivtext("Fertig.");
}

var oid_win;

function oid_modal()
{
	jQuery("#loginOrRegister").modal("show");
}
function openiderror(data)
{
	progress("oid_progress", "100");
	jQuery("#oid_progress").children().removeClass("progress-bar-info");
	if (data.status != 417)
	{
		jQuery("#oid_progress").children().addClass("progress-bar-warning");
		jQuery("#oid_general_error").show();
	}
	else
	{
		jQuery("#oid_progress").children().addClass("progress-bar-danger");
		jQuery("#oid_no_oid").show();
	}
	//Do something if this isn't a valid OpenID.
	jQuery(".oid_inProgress").hide();
	jQuery("#login").button("reset");
	jQuery("#oid_url").attr("disabled", false);
}

function openid()
{
	jQuery(".oid_error").hide();
	jQuery("#oid_progress").children().addClass("progress-bar-info");
	jQuery("#oid_progress").children().removeClass("progress-bar-danger");
	jQuery("#oid_progress").children().removeClass("progress-bar-warning");
	jQuery("#oid_progress").show();
	progress("oid_progress", "20");
	var oid = jQuery("#oid_url").val();
	if (oid.search("http") != 0)
	{
		jQuery("#noURL").show();
		progress("oid_progress", "100");
		jQuery("#oid_progress").children().addClass("progress-bar-danger");
		jQuery("#oid_progress").children().removeClass("progress-bar-info");
	}
	else
	{
		jQuery("#oid_url").attr("disabled", true);
		jQuery("#login").button("loading");
		if (sid == "")
		{
			jQuery("#creatingSession").show();
			var sidreq = jQuery.get("ajax.py?do=session|create");
			sidreq.error(openiderror);
			sidreq.success(function (data) {
				jQuery("#creatingSession").hide();
				sid = data;
				oid_sidisready(oid);
			});
		}
		else
		{
			oid_sidisready(oid);
		}
	}
}

function oid_sidisready(oid)
{
	progress("oid_progress", "40");
	jQuery("#gettingRURL").show();
	var rurlreq = jQuery.get("ajax.py?do=openid|do|" + sid + "|" + oid)
	rurlreq.error(openiderror);
	rurlreq.success(oid_rurlisready);
}

function oid_rurlisready(rurl)
{
	progress("oid_progress", "60");
	jQuery("#gettingRURL").hide();
	jQuery("#oid_window_didnt_open").attr("href", rurl);
	jQuery("#winOpened").show();
	oid_win = window.open(rurl, "", "height=800px, width=600px");
	setTimeout(check_oid_ready, 1000);
}

function check_oid_ready()
{
	if(oid_win.closed)
	{
		oid_done();
	}
	else
	{
			setTimeout(check_oid_ready, 1000);
	}
}

function oid_done()
{
	progress("oid_progress", "80");
	jQuery("#winOpened").hide();
	jQuery("#checking").show();
	var oid_check_req = jQuery.get("ajax.py?do=openid|check|"+sid)
	oid_check_req.error(openiderror);
	oid_check_req.success(openidsuccess);
}

function openidsuccess()
{
	jQuery(".oid_inProgress").hide();
	jQuery("#oid_success").show();
	progress("oid_progress", "100");
	jQuery("#oid_progress").children().addClass("progress-bar-success");
	jQuery("#oid_progress").children().removeClass("progress-bar-info");
	jQuery("#loginOrRegister").bind("hidden.bs.modal",function()  {
		jQuery(".landing").hide();
		jQuery(".loggedin").show();
		loadpage("home");
	});
	setTimeout(function() { jQuery("#loginOrRegister").modal("hide"); }, 2500);
}
