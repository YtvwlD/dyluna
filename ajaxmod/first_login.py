def check(cur, uid):
	cur.execute("SELECT first_login FROM users WHERE uid=%s", (str(uid),))
	result = cur.fetchall()
	if len(result) == 0:
		return ("This was not found in the database.", 412)
	return (str(result[0][0]), 200)
