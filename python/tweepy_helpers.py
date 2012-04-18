import ssl
import httplib
import tweepy
import smtplib

def try_and_catch_errors(func):
    err_count = 0
    while err_count < 5:
        try:
            func()

        except httplib.IncompleteRead, e:
            print e
            err_count += 1
        except ssl.SSLError, e:
            print e
            err_count += 1
        except (KeyboardInterrupt, SystemExit), e:
            print e
            raise

        time.sleep(5)

    print "5 errors, quitting"
    s = smtplib.SMTP('localhost')
    s.sendmail(config['error_email']['from'], config['error_email']['to'], "UH OH! The pusher app is down")
    s.quit()
    exit()

def stream(stream_type, config, handle_data):
    if stream_type == 'userstream':
        auth = get_oauth(config['twitter_auth'])
        stream = tweepy.Stream(auth, StreamHandler(handle_data), secure=True)
        try_and_catch_errors(stream.userstream)

    if stream_type == 'filter':
        auth = tweepy.BasicAuthHandler(config['twitter_auth']['username'], config['twitter_auth']['password'])
        stream = tweepy.Stream(auth, StreamHandler(handle_data))
        try_and_catch_errors(stream.filter(track=config['search_terms']))

def get_oauth(config):
    auth = tweepy.OAuthHandler(config['consumer_key'], config['consumer_secret'])
    auth.set_access_token(config['access_key'], config['access_secret'])
    return auth

class StreamHandler(tweepy.StreamListener):
    def __init__(self, process_data):
        self.process_data = process_data

    def on_data(self, data):
        if not data:
            return True

        self.process_data(data)
        return True

    def on_status(self, status):
        return True

    def on_error(self, status_code):
        print 'An error has occured! Status code = %s' % status_code
        stream.disconnect()
        exit()

    def on_timeout(self):
        print 'Timeout'
        stream.disconnect()
        exit()

    def on_delete(self, status_id, user_id):
        print "delete notice recieved %s %s" % (status_id, user_id)
        return True

    def on_limit(self, track):
        print 'limit notice received'
        print track
        stream.disconnect()
        exit()
