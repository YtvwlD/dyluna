#!/usr/bin/env python
from wsgiref.handlers import CGIHandler
from werkzeug.wrappers import Response

from get_html import get_html

app = None

try:
    from sentry import Client
    client = Client()
except:
    client = None

def run():
	CGIHandler().run(runSentry)

def runSentry(environ, start_response):
	try:
		return (app(environ, start_response))
	except:
		try:
			client.captureException()
			response = Response(get_html("inc/html/500").replace("<!-- log >", "").replace("< /log -->", ""), 500, mimetype="text/html")
		except:
			response = Response(get_html("inc/html/500").replace("<!-- nolog>", "").replace("< /nolog -->", ""), 500, mimetype="text/html")
		return response(environ, start_response)
