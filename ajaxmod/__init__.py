from werkzeug.wrappers import Response

from . import *

def run(request, jsonenc, jsondec, cur):
	do = request.args.get("do", "nothing").split("|");
	res = ("Wrong parameters.", 400)
	if do[0] == "session":
		if do[1] == "create":
			res = session.create(cur)
		if do[1] == "check":
			res = session.check(do, cur)
		if do[1] == "destroy":
			res = session.destroy(do, cur)
	if do[0] == "openid":
		if do[1] == "do":
			res = oid.do(do, cur, request)
		if do[1] == "check":
			res = oid.check(do, cur)
	if do[0] == "first_login":
		if not do[2]:
			return Response("No SID has been passed.", 400)
		uid = get_uid_from_sid(cur, do[2])
		if not uid:
			return Response("This was not found in the database.", 412)
		if do[1] == "check":
			res = first_login.check(cur, uid)
		if do[1] == "get":
			res = first_login.get(cur, uid, jsonenc)
		if do[1] == "save":
			res = first_login.save(do, jsondec, cur, uid)
		if do[1] == "do":
			res = first_login.do(cur, uid)
	return Response(*res)

def get_uid_from_sid(cur, sid):
	cur.execute("SELECT uid FROM sessions WHERE sid=%s", (sid,))
	result = cur.fetchall()
	if len(result) != 0:
		uid = result[0][0]
	else:
		uid = None
	return uid
