"use strict";
function runPage()
{
	$(document).ready('bootstrap_buttons', resetFirstLoginForm);
	setTimeout(check_first_login, 500);
}

function check_first_login()
{
	spindiv();
	spindivtext("erste Anmeldung");
	var req = $.get("ajax.py?do=first_login|check|"+sid);
	req.error(check_first_login);
	req.success(function(data) {
			if (data == 1)
			{
				$("#username-right")[0].onchange = function () {
					$("#username").removeClass("text-danger");
					$("#username").addClass("text-success");
					$("#username-correct").hide("fast");
					$("#username-label").show("slow");
				};
				$("#username-wrong")[0].onchange = function () {
					$("#username").addClass("text-danger");
					$("#username").removeClass("text-success");
					$("#username-label").hide("fast");
					$("#username-correct").show("slow");
					setTimeout(function() {$("#username-correct-text").focus();}, 500);
				};
				$("#email-right")[0].onchange = function () {
					$("#email").removeClass("text-danger");
					$("#email").addClass("text-success");
					$("#email-correct").hide("fast");
					$("#email-label").show("slow");
				};
				$("#email-wrong")[0].onchange = function () {
					$("#email").addClass("text-danger");
					$("#email").removeClass("text-success");
					$("#email-label").hide("fast");
					$("#email-correct").show("slow");
					setTimeout(function() {$("#email-correct-text").focus();}, 500);
				};
				get_first_login();
			}
			else
			{
				unspindiv();
			}
		});
}

function get_first_login()
{
	var req = $.get("ajax.py?do=first_login|get|"+sid);
	req.error(get_first_login);
	req.success(function (data) {
		var json = JSON.parse(data);
		if (json.username != "")
		{
			var username = json.username;
		}
		else
		{
			var username = empty;
		}
		if (json.email != "")
		{
			var email = json.email;
		}
		else
		{
			var email = empty;
		}
		$("#username").html(username);
		$("#email").html(email);
		unspindiv();
		$("#first_login").modal("show");
	});
}

function first_login()
{
	var username;
	var email;
	if($("#username-right")[0].checked == false && $("#username-wrong")[0].checked == true)
	{
		username = $("#username-correct").children().val();
	}
	else
	{
		username = $("#username").text();
	}
	if($("#email-right")[0].checked == false && $("#email-wrong")[0].checked == true)
	{
		email = $("#email-correct").children().val();
	}
	else
	{
		email = $("#email").text();
	}
	if (username != empty && username != "" && email != empty && email != "")
	{
		$("#first_login-save").button("loading");
		$("#first_login-noInput").hide();
		$("#first_login-error").hide();
		$("#username-correct").attr("disabled", true);
		$("#username-right").attr("disabled", true);
		$("#username-wrong").attr("disabled", true);
		$("#email-correct").attr("disabled", true);
		$("#username-right").attr("disabled", true);
		$("#username-wrong").attr("disabled", true);
		var jsonobj = { "username": username, "email": email };
		var json = JSON.stringify(jsonobj);
		var req = $.get("ajax.py?do=first_login|save|"+sid+"|"+json);
		req.error(function() { $("#first_login-error").show(); });
		req.success(function() {
			$("#first_login-success").show();
			req = $.get("ajax.py?do=first_login|do|"+sid);
			req.error(function() {
				$("#first_login-error").show();
				resetFirstLoginForm();
			});
			req.success(function() {
				$("#first_login-success").show();
				setTimeout(function() {
					$("#first_login").modal("hide");
				}, 2500);
			});
		});
	}
	else
	{
		$("#first_login-noInput").show();
	}
}

function resetFirstLoginForm()
{
	$("#first_login-save").button("reset");
	$("#username-correct").attr("disabled", false);
	$("#username-right").attr("disabled", false);
	$("#username-wrong").attr("disabled", false);
	$("#email-correct").attr("disabled", false);
	$("#email-right").attr("disabled", false);
	$("#email-wrong").attr("disabled", false);
}
