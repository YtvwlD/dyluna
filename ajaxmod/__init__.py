from werkzeug.wrappers import Response

import session
import oid
import first_login

def run(request, jsonenc, jsondec, cur):
	do = request.args.get("do", "nothing").split("|");
	response = Response("Wrong parameters.", 400)
	if do[0] == "session":
		if do[1] == "create":
			res = session.create(cur)
		if do[1] == "destroy":
			res = session.destroy(do, cur)
		response = Response(*res)
	if do[0] == "openid":
		if do[1] == "do":
			res = oid.do(do, cur, request)
		if do[1] == "check":
			res = oid.check(do, cur)
		response = Response(*res)

	if do[0] == "first_login":
		if do[2]:
			uid = get_uid_from_sid(cur, do[2])
			if uid != None:
				if do[1] == "check":
					res = first_login.check(cur, uid)
					response = Response(*res)
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
