"use strict";
function runPage()
{
	jQuery(document).ready('bootstrap_buttons', resetFirstLoginForm);
	setTimeout(check_first_login, 500);
}

function check_first_login()
{
	spindiv();
	spindivtext("erste Anmeldung");
	var req = jQuery.get("ajax.py?do=first_login|check|"+sid);
	req.error(check_first_login);
	req.success(function(data) {
			if (data == 1)
			{
				jQuery("#username-right")[0].onchange = function () {
					jQuery("#username").removeClass("text-danger");
					jQuery("#username").addClass("text-success");
					jQuery("#username-correct").hide("fast");
					jQuery("#username-label").show("slow");
				};
				jQuery("#username-wrong")[0].onchange = function () {
					jQuery("#username").addClass("text-danger");
					jQuery("#username").removeClass("text-success");
					jQuery("#username-label").hide("fast");
					jQuery("#username-correct").show("slow");
					setTimeout(function() {jQuery("#username-correct-text").focus();}, 500);
				};
				jQuery("#email-right")[0].onchange = function () {
					jQuery("#email").removeClass("text-danger");
					jQuery("#email").addClass("text-success");
					jQuery("#email-correct").hide("fast");
					jQuery("#email-label").show("slow");
				};
				jQuery("#email-wrong")[0].onchange = function () {
					jQuery("#email").addClass("text-danger");
					jQuery("#email").removeClass("text-success");
					jQuery("#email-label").hide("fast");
					jQuery("#email-correct").show("slow");
					setTimeout(function() {jQuery("#email-correct-text").focus();}, 500);
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
	var req = jQuery.get("ajax.py?do=first_login|get|"+sid);
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
		jQuery("#username").html(username);
		jQuery("#email").html(email);
		unspindiv();
		jQuery("#first_login").modal("show");
	});
}

function first_login()
{
	var username;
	var email;
	if(jQuery("#username-right")[0].checked == false && jQuery("#username-wrong")[0].checked == true)
	{
		username = jQuery("#username-correct").children().val();
	}
	else
	{
		username = jQuery("#username").text();
	}
	if(jQuery("#email-right")[0].checked == false && jQuery("#email-wrong")[0].checked == true)
	{
		email = jQuery("#email-correct").children().val();
	}
	else
	{
		email = jQuery("#email").text();
	}
	if (username != empty && username != "" && email != empty && email != "")
	{
		jQuery("#first_login-save").button("loading");
		jQuery("#first_login-noInput").hide();
		jQuery("#first_login-error").hide();
		jQuery("#username-correct").attr("disabled", true);
		jQuery("#username-right").attr("disabled", true);
		jQuery("#username-wrong").attr("disabled", true);
		jQuery("#email-correct").attr("disabled", true);
		jQuery("#username-right").attr("disabled", true);
		jQuery("#username-wrong").attr("disabled", true);
		var jsonobj = { "username": username, "email": email };
		var json = JSON.stringify(jsonobj);
		var req = jQuery.get("ajax.py?do=first_login|save|"+sid+"|"+json);
		req.error(function() { jQuery("#first_login-error").show(); });
		req.success(function() {
			jQuery("#first_login-success").show();
			req = jQuery.get("ajax.py?do=first_login|do|"+sid);
			req.error(function() {
				jQuery("#first_login-error").show();
				resetFirstLoginForm();
			});
			req.success(function() {
				jQuery("#first_login-success").show();
				setTimeout(function() {
					jQuery("#first_login").modal("hide");
				}, 2500);
			});
		});
	}
	else
	{
		jQuery("#first_login-noInput").show();
	}
}

function resetFirstLoginForm()
{
	jQuery("#first_login-save").button("reset");
	jQuery("#username-correct").attr("disabled", false);
	jQuery("#username-right").attr("disabled", false);
	jQuery("#username-wrong").attr("disabled", false);
	jQuery("#email-correct").attr("disabled", false);
	jQuery("#email-right").attr("disabled", false);
	jQuery("#email-wrong").attr("disabled", false);
}