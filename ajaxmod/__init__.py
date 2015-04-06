from werkzeug.wrappers import Response
from werkzeug.urls import Href
import random
from openid.consumer.consumer import Consumer
from openid.consumer.discover import DiscoveryFailure
from openid.sreg import SRegRequest

def run(request, jsonenc, jsondec, cur):
	do = request.args.get("do", "nothing").split("|");
	response = Response("Wrong parameters.", 400)
	if do[0] == "session":
		if do[1] == "create":
			#taken from http://love-python.blogspot.de/2010/04/python-code-to-generate-random-string.html
			sid = ''
			randstr = "abcdefghijklmnopqrstuvwxyz"
			randstr += randstr.upper()
			randints = ""
			for n in range(10):
				randints += str(n)
			randstr += randints * 17
			for i in range(32):
				sid += random.choice(randstr)
			#end taken
			cur.execute ("INSERT INTO sessions (sid, uid, oid) VALUES (%s, NULL, '')", (sid,))

			response = Response(sid, 201)



		if do[1] == "destroy":
			if len(do) != 3:
				response = Response("Exactly three parameters are needed.", 400)
			else:
				sid = do[2]
				cur.execute("SELECT * FROM sessions WHERE sid=%s", (sid,))
				result = cur.fetchall()
				if len(result) == 0:
					response = Response("This sid was not found in the database.", 412)
				else:
					cur.execute ("DELETE FROM sessions WHERE sid=%s", (sid,))
					response = Response("", 200)

	if do[0] == "openid":
		if do[1] == "do":
			if len(do) != 4:
				response = Response("Exactly four parameters are needed.", 400)
			else:
				sid = do[2]
				oid = do[3]
				cur.execute("SELECT * FROM sessions WHERE sid=%s", (sid,))
				result = cur.fetchall()
				if len(result) == 0:
					response = Response("This sid was not found in the database.", 412)
				elif len(result) > 1:
					response = Response("This sid exists. Multiple times. What?!", 500)
				else:
					try:
						consumer = Consumer({"sid": sid}, None)
						authreq = consumer.begin(oid)
						sregreq = SRegRequest(required=["nickname", "email"]) #TODO: Perhaps declare this as optional and ask the user later if it's right?
						authreq.addExtension(sregreq)
						myURL = request.url
						print "myURL: " + myURL
						href = Href(myURL)
						baseURL = href("../")
						print "baseURL: " + baseURL
						oidURL = href("../oid.py", {"sid": sid}) #Should work now.
						print "oidURL: " + oidURL
						rurl = authreq.redirectURL(baseURL, oidURL) #TODO implement redirect
						print "rurl: " + rurl
						response = Response(rurl, 202)
					except DiscoveryFailure:
						response = Response("This is no OpenID.", 417)

		if do[1] == "check":
			if len(do) != 3:
				response = Response("The sid is missing.", 400)
			else:
				sid = do[2]
				cur.execute("SELECT * FROM sessions WHERE sid=%s", (sid,))
				result = cur.fetchall()
				if len(result) == 0:
					response = Response("This sid was not found in the database.", 412)
				elif len(result) > 1:
					response = Response("This sid exists. Multiple times. What?!", 500)
				else:
					if result[0][2] != "":
						response = Response("SUCCESS", 202)
					else:
						response = Response("FAILURE", 401)

	if do[0] == "first_login":
		if do[2]:
			uid = get_uid_from_sid(cur, do[2])
			if uid != None:
				if do[1] == "check":
					cur.execute("SELECT first_login FROM users WHERE uid=%s", (str(uid),))
					result = cur.fetchall()
					if len(result) != 0:
						response = Response(str(result[0][0]), 200)
					else:
						response = Response("This was not found in the database.", 412)

				if do[1] == "get":
					cur.execute("SELECT * FROM users WHERE uid=%s", (str(uid),))
					result = cur.fetchall()
					if len(result) != 0:
						username = result[0][1]
						email = result[0][3]
						jsonresp = jsonenc.encode({"username": username, "email": email})
						response = Response(jsonresp, 200)
					else:
						response = Response("This was not found in the database.", 412)


				if do[1] == "save":
					if do[3]:
						print do[3]
						jsonreq = jsondec.decode(do[3])
						print jsonreq
						email = jsonreq["email"]
						print email
						username = jsonreq["username"]
						print username
						cur.execute("SELECT uid FROM users WHERE username=%s", (username,))
						results = cur.fetchall()
						username_already_taken = False
						for result in results:
							if result[0] != uid:
								username_already_taken = True
						cur.execute("SELECT uid FROM users WHERE email=%s", (email,))
						results = cur.fetchall()
						email_already_in_use = False
						for result in results:
							if result[0] != uid:
								email_already_in_use = True

						if username_already_taken:
							response = Response("This username is already taken.", 412);
						elif email_already_in_use:
							response = Response("This email is already in use.", 412);
						else:
							cur.execute("UPDATE users SET email=%s WHERE uid=%s", (email, str(uid)))
							cur.execute("UPDATE users SET username=%s WHERE uid=%s", (username, str(uid)))
							response = Response("", 202)
							#TODO save the data, confirm the email and so on

				if do[1] == "do":
					cur.execute("UPDATE users SET first_login = false WHERE uid=%s", (str(uid),))
					response = Response("", 202)

			else:
				response = Response("This was not found in the database.", 412)

		else:
			response = Response("A sid is needed." , 400)
	return response

def get_uid_from_sid(cur, sid):
	cur.execute("SELECT uid FROM sessions WHERE sid=%s", (sid,))
	result = cur.fetchall()
	if len(result) != 0:
		uid = result[0][0]
	else:
		uid = None
	return uid
