#!/usr/bin/env python
from werkzeug.wrappers import Request, Response

@Request.application
def run(request):
	if request.args.has_key("page"):
		page = request.args["page"]
	else:
		page = None
	if request.args.has_key("action"):
		action = request.args["action"]
	else:
		action = None

	return Response("" , 200)

if __name__ == "__main__":
	import CGI
	CGI.app = run
	CGI.run()
