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

def save(do, jsondec, cur, uid):
	if not do[3]:
		return ("No JSON has been passed.", 400)
	jsonreq = jsondec.decode(do[3])
	email = jsonreq["email"]
	username = jsonreq["username"]
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
		return ("This username is already taken.", 412);
	if email_already_in_use:
		return ("This email is already in use.", 412);
	cur.execute("UPDATE users SET email=%s WHERE uid=%s", (email, str(uid)))
	cur.execute("UPDATE users SET username=%s WHERE uid=%s", (username, str(uid)))
	return ("", 202)
	#TODO save the data, confirm the email and so on

def do(cur, uid):
	cur.execute("UPDATE users SET first_login = false WHERE uid=%s", (str(uid),))
	return ("", 202)
