import json
import os
import sys
import signal
import time
from pprint import pprint
from threading import Timer

import tweepy
import tweepy_helpers

import pusher

count = 0

def handle_data(data):
    global count
    
    try:
        count = count + 1
    except Exception,e:
        print e

def send_data():
    global count
    try:
        print "Sending: " + str(count)
        p['my-channel'].trigger('my-event', {'count': count})
    except Exception,e:
        print e

    count = 0

    Timer(1.0, send_data).start()

config_path = os.path.dirname(sys.argv[0]) + "/config.json"
# config_path = "config.json"
print "Getting config from %s" % config_path
config = json.loads(open(config_path, 'r').read())

# prepare Pusher object
pusher.app_id = config['pusher']['app_id'].encode('ascii')
pusher.key = config['pusher']['key'].encode('ascii')
pusher.secret = config['pusher']['secret'].encode('ascii')
p = pusher.Pusher()

print "Recording filter %s..." % config['search_terms']
thread = Timer(1.0, send_data).start()
tweepy_helpers.stream('filter', config, handle_data)