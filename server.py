#!/usr/bin/env python
from os import path
from werkzeug.serving import run_simple
from werkzeug.wsgi import SharedDataMiddleware, DispatcherMiddleware

import index
import ajax
import oid
import nojs

app = SharedDataMiddleware(DispatcherMiddleware(index.run,
	{
	"/index.py":	index.run,
	"/ajax.py":		ajax.run,
	"/oid.py":		oid.run,
	"/nojs.py":		nojs.run
	}),
	{
	"/css":		path.join(path.dirname(__file__), "css"),
	"/js":		path.join(path.dirname(__file__), "js"),
	"/img":		path.join(path.dirname(__file__), "img"),
	"/html":	path.join(path.dirname(__file__), "html"),
	"/fonts":	path.join(path.dirname(__file__), "fonts")
	})

if __name__ == "__main__":
	run_simple('localhost', 4000, app)
