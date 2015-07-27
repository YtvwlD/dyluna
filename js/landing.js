"use strict";
function runPage()
{
	$(document).ready('bootstrap_buttons', function() {
		$("#login").button("reset");
		$("#oid_url").attr("disabled", false);
		} );
	$("#loginOrRegister").bind("shown.bs.modal", function() { $("#oid_url").focus(); });
	spindivtext("Fertig.");
}

var oid_win;

function oid_modal()
{
	$("#loginOrRegister").modal("show");
}
function openiderror(data)
{
	progress("oid_progress", "100");
	$("#oid_progress").children().removeClass("progress-bar-info");
	if (data.status != 417)
	{
		$("#oid_progress").children().addClass("progress-bar-warning");
		$("#oid_general_error").show();
	}
	else
	{
		$("#oid_progress").children().addClass("progress-bar-danger");
		$("#oid_no_oid").show();
	}
	//Do something if this isn't a valid OpenID.
	$(".oid_inProgress").hide();
	$("#login").button("reset");
	$("#oid_url").attr("disabled", false);
}

function openid()
{
	$(".oid_error").hide();
	$("#oid_progress").children().addClass("progress-bar-info");
	$("#oid_progress").children().removeClass("progress-bar-danger");
	$("#oid_progress").children().removeClass("progress-bar-warning");
	$("#oid_progress").show();
	progress("oid_progress", "20");
	var oid = $("#oid_url").val();
	if (oid.search("http") != 0)
	{
		$("#noURL").show();
		progress("oid_progress", "100");
		$("#oid_progress").children().addClass("progress-bar-danger");
		$("#oid_progress").children().removeClass("progress-bar-info");
	}
	else
	{
		$("#oid_url").attr("disabled", true);
		$("#login").button("loading");
		if (sid == "")
		{
			$("#creatingSession").show();
			var sidreq = $.get("ajax.py?do=session|create");
			sidreq.error(openiderror);
			sidreq.success(function (data) {
				$("#creatingSession").hide();
				sid = data;
				localStorage.setItem("sid", sid);
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
	$("#gettingRURL").show();
	var rurlreq = $.get("ajax.py?do=openid|do|" + sid + "|" + oid)
	rurlreq.error(openiderror);
	rurlreq.success(oid_rurlisready);
}

function oid_rurlisready(rurl)
{
	progress("oid_progress", "60");
	$("#gettingRURL").hide();
	$("#oid_window_didnt_open").attr("href", rurl);
	$("#winOpened").show();
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
	$("#winOpened").hide();
	$("#checking").show();
	var oid_check_req = $.get("ajax.py?do=openid|check|"+sid)
	oid_check_req.error(openiderror);
	oid_check_req.success(openidsuccess);
}

function openidsuccess()
{
	$(".oid_inProgress").hide();
	$("#oid_success").show();
	progress("oid_progress", "100");
	$("#oid_progress").children().addClass("progress-bar-success");
	$("#oid_progress").children().removeClass("progress-bar-info");
	$("#loginOrRegister").bind("hidden.bs.modal",function()  {
		$(".landing").hide();
		$(".loggedin").show();
		loadpage("home");
	});
	setTimeout(function() { $("#loginOrRegister").modal("hide"); }, 2500);
}
