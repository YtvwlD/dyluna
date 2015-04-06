#!/usr/bin/env python
from werkzeug.wrappers import Request, Response
from werkzeug.urls import Href
from openid.consumer.consumer import Consumer, SUCCESS #, CANCEL, SETUP_NEEDED
from openid.sreg import SRegResponse

from get_html import get_html, choose_lang
import SQLcon


@Request.application
def run(request):
	response = Response("This didn't succeed.", 500)
	lang = choose_lang(request)
	
	sid = request.args.get("sid")
	consumer = Consumer({"sid": sid}, None)
	#url = request.args.get("openid.return_to") #TODO: compute the URL in a better way -> Should be done now.
	href = Href(request.urls)
	url = href("../oid.py", {"sid": sid})
#	try:
	info = consumer.complete(request.args, url) # <-- It crashes here. (When using an OpenID from Yahoo!)
	#print info.status
#	except Exception as e:
#	info = openid.consumer.consumer.Response()
#	info.status = e
	if info.status == SUCCESS:
		#print "SUCCESS" #TODO: do something here
		display_identifier =  info.getDisplayIdentifier()
		sregresp = SRegResponse.fromSuccessResponse(info)
		realoid = display_identifier
		if info.endpoint.canonicalID:
			realoid = info.endpoint.canonicalID
		#print "The real OID is " + realoid + "."
		#print "We have gotten the following data: "
		#print sregresp.data

		try:
			nickname = sregresp.data["nickname"]
		except:
			nickname = ""

		try:
			email = sregresp.data["email"]
		except:
			email = ""

		#TODO:
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


		response = Response(get_html("oid_success", lang), 200, mimetype="text/html")


	#elif info.status == CANCEL:
	#	pass
		#print "CANCEL" #TODO: be angry

	#elif info.status ==  SETUP_NEEDED:
	#	pass
		#print "setup needed for: "  + info.setup_url #TODO: Tell the users that they have got something to do.

	else:
		#print "something went wrong." #TODO: something went wrong.
		response = Response(get_html("oid_failure", lang), 500, mimetype="text/html")


	#TODO
	return response

if __name__ == "__main__":
	import CGI
	CGI.app = run
	CGI.run()
