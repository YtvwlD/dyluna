import random

def create(cur):
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
	return (sid, 201)

def destroy(do, cur):
	if len(do) != 3:
		return ("Exactly three parameters are needed.", 400)
	sid = do[2]
	cur.execute("SELECT * FROM sessions WHERE sid=%s", (sid,))
	result = cur.fetchall()
	if len(result) == 0:
			return ("This sid was not found in the database.", 412)
	cur.execute ("DELETE FROM sessions WHERE sid=%s", (sid,))
	return ("", 200)
