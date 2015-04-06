#!/usr/bin/env python
from werkzeug.wrappers import Request
from json import JSONEncoder, JSONDecoder

import SQLcon
import ajaxmod

@Request.application
def run(request):
	jsonenc = JSONEncoder()
	jsondec = JSONDecoder()
	con = SQLcon.con()
	cur = con.cursor()
	response = ajaxmod.run(request, jsonenc, jsondec, cur)
	con.close()
	return response

if __name__ == "__main__":
	import CGI
	CGI.app = run
	CGI.run()
