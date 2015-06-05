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
	spindivtext("Seite");
	page = ppage;
	jQuery(".active").toggleClass("active");
	jQuery("#" + page).toggleClass("active");
	loadcss(page);
	jQuery("#page").load("html/" + lang + "/" + page + ".htm");
	setTimeout(function() {
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
	}, 1000);
}

jQuery("b").remove();
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
jQuery.getScript("js/bootstrap.js");
jQuery.getScript("js/sentry.js", function () {
	jQuery.getScript("js/raven.js", function() {
		Raven.config((("https:" == document.location.protocol) ? "https" : "http") + get_sentry_dsn(), {
			whitelistUrls: [REPLACE_DOMAIN], //escape it: "/sub\.domain.\tld/"
			logger: "web",
			site: document.baseURI
		}).install();
		Raven.setUser(); //anonymous
	});
});
jQuery("body").append("<div id=nav></div>");
jQuery("#nav").load("html/" + lang + "/nav.htm");
setTimeout(function() {
	jQuery.getScript("js/nav.js", function() {
		runNav();
	});
}, 1000);

jQuery("body").append("<div id=page class=container style=\"padding-top: 70px; padding-bottom: 30px; display: none;\"></div>");
var page;

unspindiv();
loadpage("landing");
