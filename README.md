# pusher-d3-demo

Demo of a real-time updating chart in a web page.

Data is pushed from a Python server to [Pusher](http://pusher.com/), recieved in the web page and rendered using[D3.js](http://mbostock.github.com/d3/).

## Usage

Install the Tweepy and Pusher libraries (pip install tweepy, pip install pusher), and create a config.json file in the python folder with these fields:

    {
        "username": "",
        "password": "",
        "consumer_key": "",
        "consumer_secret": "",
        "access_key": "",
        "access_secret": "",
        "track_list": "bieber",
        "pusher": {
            "app_id": "",
            "key": "",
            "secret": ""
        }
    }

You'll need a Twitter account and a registered app to get those keys. Now open client/index.html and replace the app key with your own from Pusher.

Finally, open index.html a browser and run twitter_stream_server.py

## Thanks

Based on [Mike Bostock's](http://bost.ocks.org/mike) [d3 bar chart tutorial](http://mbostock.github.com/d3/tutorial/bar-2.html)

Uses the [Tweepy](http://tweepy.github.com/) Twitter library.