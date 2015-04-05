"use strict";
//css
function loadcss(stylesheet)
{
	var css = document.createElement("link");
	css.rel = "stylesheet";
	css.type = "text/css";
	css.href = "css/" + stylesheet +".css";
	document.head.appendChild(css);
}

function spindiv()
{
	var spinner = document.createElement("div");
	spinner.id = "spindiv";
	spinner.innerHTML = "<div id=\"spinner-div\"><img src=\"img/ajax-loader.gif\" alt=\"Loading...\" /></div><br /><font id=spinner-text>REPLACE_GAME_NAME</font>";
	document.body.appendChild(spinner);
	//jQuery("spinner-div").spin("large");
	/*var opts = {
		lines: 17, // The number of lines to draw
		length: 20, // The length of each line
		width: 6, // The line thickness
		radius: 60, // The radius of the inner circle
		corners: 0, // Corner roundness (0..1)
		rotate: 0, // The rotation offset
		direction: 1, // 1: clockwise, -1: counterclockwise
		color: '#000', // #rgb or #rrggbb or array of colors
		speed: 1, // Rounds per second
		trail: 60, // Afterglow percentage
		shadow: true, // Whether to render a shadow
		hwaccel: true, // Whether to use hardware acceleration
		className: 'spinner', // The CSS class to assign to the spinner
		zIndex: 2e9, // The z-index (defaults to 2000000000)
		top: 'auto', // Top position relative to parent in px
		left: 'auto' // Left position relative to parent in px
	};
	//var target = document.getElementById('foo');
	var spinner = new Spinner(opts).spin(document.getElementById("spinner-div"));*/
}

function unspindiv()
{
	jQuery("#spindiv").remove();
}

function spindivtext(text)
{
	jQuery("#spinner-text").html(text);
}

loadcss("spindiv");
spindiv();
