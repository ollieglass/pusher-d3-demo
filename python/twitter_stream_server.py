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

publish_timer = None
tweet_count = 0

def publish_data():
    global tweet_count
    
    print "publish_data: tweet_count: %s" % tweet_count
    
    try:
        p['my-channel'].trigger('my-event', {'tweet_count': tweet_count, "update_interval_secs": config['update_interval_secs']})
    except Exception,e:
        print e
        
    tweet_count = 0
    schedule_next_publish()

def handle_data(data):
    global tweet_count
      
    tweet_count = tweet_count+1
    # print "handle_data: tweet_count=%s" % tweet_count

def schedule_next_publish():
    global publish_timer
    publish_timer = Timer(config['update_interval_secs'], publish_data, ())
    publish_timer.start()

def signal_handler(signal, frame):
    global publish_timer
    publish_timer.cancel()
    sys.exit(0)

# Capture Ctrl+C to stop publish Timer
signal.signal(signal.SIGINT, signal_handler)

#config_path = os.path.dirname(sys.argv[0]) + "/config.json"
config_path = "config.json"
print "Getting config from %s" % config_path
config = json.loads(open(config_path, 'r').read())

# prepare Pusher object
pusher.app_id = config['pusher']['app_id'].encode('ascii')
pusher.key = config['pusher']['key'].encode('ascii')
pusher.secret = config['pusher']['secret'].encode('ascii')
p = pusher.Pusher()

print "Recording filter %s..." % config['search_terms']
tweepy_helpers.stream('filter', config, handle_data)

schedule_next_publish()
