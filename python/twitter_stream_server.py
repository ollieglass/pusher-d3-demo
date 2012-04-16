import json
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

config = json.loads(open("config.json", 'r').read())

pusher.app_id = config['pusher']['app_id']
pusher.key = config['pusher']['key']
pusher.secret = config['pusher']['secret']
p = pusher.Pusher()

print "Recording filter %s..." % config['track_list']
tweepy_helpers.stream('filter', config, handle_data)


