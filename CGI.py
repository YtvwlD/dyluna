#!/usr/bin/env python
from wsgiref.handlers import CGIHandler
from werkzeug.wrappers import Request, Response

from get_html import get_html, choose_lang

app = None

try:
	from sentry import Client
	client = Client()
except:
	client = None

def run():
	CGIHandler().run(runSentry)

def runSentry(environ, start_response):
	lang = choose_lang(Request(environ))
	try:
		return (app(environ, start_response))
	except:
		html = get_html("500", lang)
		try:
			client.captureException()
			html = html.replace("<!-- log >", "").replace("< /log -->", "")
		except:
			html = html.replace("<!-- nolog >", "").replace("< /nolog -->", "")
		response = Response(html, 500, mimetype="text/html")
		return response(environ, start_response)
