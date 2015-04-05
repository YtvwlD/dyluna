#!/usr/bin/env python
from mysql.connector import connect
if __name__ == "__main__":
	import sys
	sys.exit()

def con():
	return connect(user="REPLACE_SQL_USER", password="REPLACE_SQL_PASSWORD",
			host="REPLACE_SQL_HOST", database="REPLACE_SQL_DB")
