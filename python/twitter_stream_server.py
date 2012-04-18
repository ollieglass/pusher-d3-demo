import json
import os
import sys
from pprint import pprint

import tweepy
import tweepy_helpers

import pusher

def handle_data(data):
    jdata = json.loads(data)
    if type(jdata) == dict:
        if 'text' in jdata:
            try:
                p['my-channel'].trigger('my-event', jdata)
            except Exception,e:
                print e

config = json.loads(open(os.path.dirname(sys.argv[0]) + "/config.json", 'r').read())

# prepare Pusher object
pusher.app_id = config['pusher']['app_id'].encode('ascii')
pusher.key = config['pusher']['key'].encode('ascii')
pusher.secret = config['pusher']['secret'].encode('ascii')
p = pusher.Pusher()

print "Recording filter %s..." % config['search_terms']
tweepy_helpers.stream('filter', config, handle_data)


