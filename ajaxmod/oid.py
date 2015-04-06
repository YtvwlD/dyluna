from werkzeug.urls import Href
from openid.consumer.consumer import Consumer
from openid.consumer.discover import DiscoveryFailure
from openid.sreg import SRegRequest

def do(do, cur, request):
	if len(do) != 4:
		return ("Exactly four parameters are needed.", 400)
	sid = do[2]
	oid = do[3]
	cur.execute("SELECT * FROM sessions WHERE sid=%s", (sid,))
	result = cur.fetchall()
	if len(result) == 0:
		return ("This sid was not found in the database.", 412)
	if len(result) > 1:
		return ("This sid exists. Multiple times. What?!", 500)
	try:
		consumer = Consumer({"sid": sid}, None)
		authreq = consumer.begin(oid)
		sregreq = SRegRequest(required=["nickname", "email"]) #TODO: Perhaps declare this as optional and ask the user later if it's right?
		authreq.addExtension(sregreq)
		myURL = request.url
		href = Href(myURL)
		baseURL = href("../")
		oidURL = href("../oid.py", {"sid": sid}) #Should work now.
		rurl = authreq.redirectURL(baseURL, oidURL) #TODO implement redirect
		return (rurl, 202)
	except DiscoveryFailure:
		return ("This is no OpenID.", 417)

def check(do, cur):
	if len(do) != 3:
		return ("The sid is missing.", 400)
	sid = do[2]
	cur.execute("SELECT * FROM sessions WHERE sid=%s", (sid,))
	result = cur.fetchall()
	if len(result) == 0:
		return ("This sid was not found in the database.", 412)
	if len(result) > 1:
		return ("This sid exists. Multiple times. What?!", 500)
	if result[0][2] != "":
		return ("SUCCESS", 202)
	return ("FAILURE", 401)
