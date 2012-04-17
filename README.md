# pusher-d3-demo

Demo of a real-time updating chart in a web page.

Data is pushed from a Python server to [Pusher](http://pusher.com/), recieved in the web page and rendered using [D3.js](http://mbostock.github.com/d3/).

Live tracker showing Bieber tweets per second running at http://bieber.nixonmcinnes.co.uk

## Usage

Install the [Tweepy](http://tweepy.github.com/) and [Pusher](https://github.com/pusher/pusher_client_python) libraries with `pip install -r requirements.txt`.

In the Python folder, copy `config.example.json` to `config.json` and add your API keys from Twitter and Pusher, a from and to email address for server error alerts, and your search terms.

Open client/index.html and enter your Pusher app key.

Finally, open index.html in a browser and run twitter_stream_server.py

![pusher-d3-demo screenshot](http://i.imgur.com/YjcTil.png)

## Thanks

Based on [Mike Bostock's](http://bost.ocks.org/mike) [d3 bar chart tutorial](http://mbostock.github.com/d3/tutorial/bar-2.html)