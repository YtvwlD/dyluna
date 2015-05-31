from crypt import crypt

def login(do, cur):
	if len(do) != 5:
		return("Wrong number of arguments.", 400)
	sid = do[2]
	user = do[3]
	password = do[4]
	cur.execute ("SELECT pass, uid FROM users WHERE username = %s", (user,))
	userpass = cur.fetchall()
	if len(userpass) != 1:
		return ("", 406)
	if password == crypt(userpass[0][0]): #hash the password
		cur.execute ("UPDATE sessions SET uid = %s WHERE sid = %s", (userpass[0][1], sid))
		return ("", 202)
	else:
		return ("", 406)

#TODO: register
