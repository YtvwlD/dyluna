#!/usr/bin/env python2.7
from werkzeug.wrappers import Request, Response

from get_html import get_html, choose_lang

@Request.application
def run(request):
	lang = choose_lang(request)
	if request.url.startswith("https://") or request.args.get("forcenossl") == "true":
		html = get_html("launch", lang)
	else:
		html = get_html("nossl", lang)
	return Response(html, mimetype="text/html")

if __name__ == "__main__":
	import CGI
	CGI.app = run
	CGI.run()
