"use strict";

//pages
function loadpage(ppage)
{
	console.log("Loading page " + ppage + "...");
	spindiv();
	page = ppage;
	$(".active").toggleClass("active");
	$("#" + page).toggleClass("active");
	$("#page-css")[0].href = "css/" + page + ".css";
	translate(page, function() {
		$("#page").html(translated[page]);
		$.get("js/" + page + ".js", function(data) {
			$("#page-js").html(data);
			try
			{
				runPage();
			}
			catch (err)
			{
				try
				{
					Raven.captureException(err);
				}
				catch (err2) {}
			}
			unspindiv();
		});
	});
}

function getTranslation(page, callback)
{
	if (translations[page] == undefined)
	{
		$.getJSON("html/lang/" + lang + "/" + page + ".json", function(translation) {
				translations[page] = translation;
				callback();
		});
	}
	else
	{
		callback();
	}
}

function getTemplate(page, callback)
{
	if (templates[page] == undefined)
	{
		$.get("html/" + page + ".htm", function(template) {
				templates[page] = Handlebars.compile(template);
				callback();
		});
	}
	else
	{
		callback();
	}
}

function translate(page, callback)
{
	if (translated[page] == undefined)
	{
		getTemplate(page, function() {
			getTranslation(page, function() {
				getTranslation("general", function() {
					var translation = translations["general"];
					$.extend(translation, translations[page]);
					translated[page] = templates[page](translation);
					callback();
				});
			});
		});
	}
	else
	{
		callback();
	}
}

function apierror(data) {} //stub

$("b").remove();
var page;
var translations = {};
var templates = {};
var translated = {};
var sid = "";
var lang = document.documentElement.lang; //|| "None";

$(document.head).append("<title>REPLACE_GAME_NAME</title>");
$(document.head).append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
document.body.onunload = function () {
		if(sid != "")
		{
			var sidreq = $.get("ajax.py?do=session|destroy|" + sid);
		}
	};
loadcss("bootstrap");
loadcss("bootstrap-theme");
loadcss("font-awesome");
$.ajaxSetup({ cache: true });
$(document.head).append("<link id=\"page-css\" rel=\"stylesheet\" type=\"text/css\"></style>");
$.getScript("js/bootstrap.js");
$.getScript("js/sentry.js", function () {
	$.getScript("js/raven.js", function() {
		Raven.config((("https:" == document.location.protocol) ? "https" : "http") + get_sentry_dsn(), {
			whitelistUrls: ["REPLACE_DOMAIN"], //escape it: "/sub\.domain.\tld/"
			logger: "web",
			site: document.baseURI
		}).install();
		Raven.setUser(); //anonymous
	});
});
$("body").append("<div id=nav></div>");
$("body").append("<script id=\"page-js\"></script>");
$("body").append("<div id=page class=container style=\"padding-top: 70px; padding-bottom: 30px; display: none;\"></div>");
//$.getScript("js/handlebars-runtime.js"); //TODO: Precompile?
$.getScript("js/handlebars.js", function() {
	translate("nav", function() {
		$("#nav").html(translated["nav"]);
		$.getScript("js/nav.js", function() {
			runNav();
		});
	});
	unspindiv();
	loadpage("landing");
});

//get the SID
if (localStorage.getItem("sid") != undefined)
{
	var sid = localStorage.getItem("sid");
	$.get("ajax.py?do=session|check|" + sid).always(function(data) {
		if (data.status == 200) //already logged in
		{
			loadpage("home");
		}
		else if (data.status == 302) {} //SID exists, but is not logged in. Nothing to do here.
		else if (data.status == 412) //SID doesn't exist anymore.
		{
			sid = "";
		}
		else
		{
			apierror(data);
		}
	});
}
