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
					res = first_login.get(cur, uid, jsonenc)
					response = Response(*res)
				if do[1] == "save":
					res = first_login.save(do, jsondec, cur)
					response = Response(*res)
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
