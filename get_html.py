#!/usr/bin/env python

from os import listdir

def get_html(html_file, lang):
	with open("inc/html/{}/{}.htm".format(lang, html_file)) as handle:
		content = handle.read()
	return(content)

def choose_lang(request):
	lang_avail = listdir("inc/html")
	assert request.accept_languages.best == list(request.accept_languages.values())[0]
	lang = request.accept_languages.best_match(lang_avail)
	if not lang:
		lang = "en"
	return lang
