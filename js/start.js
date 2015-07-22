"use strict";
//scripts
function loadscript(script)
{
	var js = document.createElement("script");
	js.src = "js/" + script + ".js";
	js.type = "text/javascript";
	document.head.appendChild(js);
}

//pages
function loadpage(ppage)
{
	console.log("Loading page " + ppage + "...");
	spindiv();
	//spindivtext(ppage);
	page = ppage;
	jQuery(".active").toggleClass("active");
	jQuery("#" + page).toggleClass("active");
	jQuery("#page-css")[0].href = "/css/" + page + ".css";
	translate(page, function() {
		jQuery("#page").html(translated[page]);
		jQuery.getScript("js/" + page + ".js", function() {
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
		jQuery.getJSON("/html/lang/" + lang + "/" + page + ".json", function(translation) {
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
		jQuery.get("/html/" + page + ".htm", function(template) {
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
					jQuery.extend(translation, translations[page]);
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

jQuery("b").remove();
var page;
var translations = {};
var templates = {};
var translated = {};
var sid = "";
var lang = document.documentElement.lang; //|| "None";

jQuery(document.head).append("<title>REPLACE_GAME_NAME</title>");
jQuery(document.head).append("<meta name=\"viewport\" content=\"width=device-width, initial-scale=1.0\">");
document.body.onunload = function () {
		if(sid != "")
		{
			var sidreq = jQuery.get("ajax.py?do=session|destroy|" + sid);
		}
	};
loadcss("bootstrap");
loadcss("bootstrap-theme");
loadcss("font-awesome");
jQuery.ajaxSetup({ cache: true });
jQuery(document.head).append("<link id=\"page-css\" rel=\"stylesheet\" type=\"text/css\"></style>");
jQuery.getScript("js/bootstrap.js");
jQuery.getScript("js/sentry.js", function () {
	jQuery.getScript("js/raven.js", function() {
		Raven.config((("https:" == document.location.protocol) ? "https" : "http") + get_sentry_dsn(), {
			whitelistUrls: ["REPLACE_DOMAIN"], //escape it: "/sub\.domain.\tld/"
			logger: "web",
			site: document.baseURI
		}).install();
		Raven.setUser(); //anonymous
	});
});
jQuery("body").append("<div id=nav></div>");
jQuery("body").append("<div id=page class=container style=\"padding-top: 70px; padding-bottom: 30px; display: none;\"></div>");
//jQuery.getScript("js/handlebars-runtime.js"); //TODO: Precompile?
jQuery.getScript("js/handlebars.js", function() {
	translate("nav", function() {
		jQuery("#nav").html(translated["nav"]);
		jQuery.getScript("js/nav.js", function() {
			runNav();
		});
	});
	unspindiv();
	loadpage("landing");
});
