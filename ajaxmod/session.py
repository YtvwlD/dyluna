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
	return sid