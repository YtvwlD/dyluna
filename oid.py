#!/usr/bin/env python
from werkzeug.wrappers import Request, Response
from werkzeug.urls import Href
from openid.consumer.consumer import Consumer, SUCCESS, CANCEL, SETUP_NEEDED
from openid.sreg import SRegResponse

from get_html import get_html, choose_lang
import SQLcon


@Request.application
def run(request):
	lang = choose_lang(request)
	sid = request.args.get("sid")
	consumer = Consumer({"sid": sid}, None)
	href = Href(request.url)
	url = href("../oid.py", {"sid": sid})
#	try:
	info = consumer.complete(request.args, url) # <-- It crashes here. (When using an OpenID from Yahoo!)
	#print info.status
#	except Exception as e:
#	info = openid.consumer.consumer.Response()
#	info.status = e
	if info.status == CANCEL:
		return Response(get_html("oid_failure", lang), 401, mimetype="text/html")
	if info.status ==  SETUP_NEEDED:
		html = get_html("oid_setup_needed", lang)
		html = html.replace("<!-- URL -->", info.setup_url)
		return Response(html, 423, mimetype="text/html")
	if info.status == SUCCESS:
		display_identifier =  info.getDisplayIdentifier()
		sregresp = SRegResponse.fromSuccessResponse(info)
		realoid = display_identifier
		if info.endpoint.canonicalID:
			realoid = info.endpoint.canonicalID
		try:
			nickname = sregresp.data["nickname"]
		except (AttributeError, KeyError):
			nickname = ""
		try:
			email = sregresp.data["email"]
		except (AttributeError, KeyError):
			email = ""
		con = SQLcon.con()
		cur = con.cursor()
		cur.execute("SELECT * FROM users WHERE openid=%s", (realoid,))
		result = cur.fetchall()
		if result.__len__() == 0:
			cur.execute("INSERT INTO users (username, openid, email, first_login) VALUES (%s, %s, %s, true)", (nickname, realoid, email))
		#log in
		cur.execute("SELECT uid FROM users WHERE openid=%s", (realoid,))
		result = cur.fetchall()
		uid = result[0][0]
		#print result
		cur.execute("UPDATE sessions SET uid=%s WHERE sid=%s", (str(uid), sid))
		cur.execute("UPDATE sessions SET oid=%s WHERE sid=%s", (realoid, sid))
		con.close()
		return Response(get_html("oid_success", lang), 200, mimetype="text/html")
	#Something went wrong.
	#TODO: More investigation.
	return Response(get_html("oid_failure", lang), 500, mimetype="text/html")

if __name__ == "__main__":
	import CGI
	CGI.app = run
	CGI.run()
