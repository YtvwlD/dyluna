def check(cur, uid):
	cur.execute("SELECT first_login FROM users WHERE uid=%s", (str(uid),))
	result = cur.fetchall()
	if len(result) == 0:
		return ("This was not found in the database.", 412)
	return (str(result[0][0]), 200)

def get(cur, uid, jsonenc):
	cur.execute("SELECT * FROM users WHERE uid=%s", (str(uid),))
	result = cur.fetchall()
	if len(result) == 0:
		return ("This was not found in the database.", 412)
	username = result[0][1]
	email = result[0][3]
	jsonresp = jsonenc.encode({"username": username, "email": email})
	return (jsonresp, 200)
