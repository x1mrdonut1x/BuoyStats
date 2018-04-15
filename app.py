import csv
import pyrebase
from datetime import datetime, timezone
import re
from tweepy import Stream
from tweepy import OAuthHandler
from tweepy import Stream
from tweepy.streaming import StreamListener
import json
import sys
from auth import *
import twitter

api = twitter.api.Api(consumer_key='kBhyW26wLxAZSh7t3wpAUoWV1',
                      consumer_secret='bmok5hhJWUAXgMVlBZpZlNJ4B5m0M4EMf9dD9zm0pUNW6r51tD',
                      application_only_auth=True)

# @fastnetlhouse => 3302829610
# @kishlhouse => 4016028339
# @ballybunionbuoy => 2359608031
# @coningbegbuoy => 632847568
# @dublinbaybuoy => 2320627075
# @finnisbuoy => 2800302088
# @foylebuoy => 3055900497
# @splaughbuoy => 2359535845
# @southhunterbuoy => 3055873233
# @southrockbuoy => 869880030444310529

accounts = ['3302829610', '4016028339', '2359608031', '632847568', '2320627075',
            '2800302088', '3055900497', '2359535845', '3055873233', '869880030444310529']
config = {
    "apiKey": "AIzaSyB6p_PpV2XCuIRYM9Zx3YRh_zEyNQ7Hc6g",
    "authDomain": "buoystats.firebaseapp.com",
    "databaseURL": "https://buoystats.firebaseio.com",
    "storageBucket": "buoystats.appspot.com",
    "serviceAccount": "./key.json"
}

access_token = "35464847-0ZjetObV5IX6c4C76TmQIG0CG2yKPaX4T7qI5ZMVf"
access_token_secret = "Qua186tVlHsCWpVUSslwm5fMVbggBKrMzA1WlQAhx7yHu"
consumer_key = "kBhyW26wLxAZSh7t3wpAUoWV1"
consumer_secret = "bmok5hhJWUAXgMVlBZpZlNJ4B5m0M4EMf9dD9zm0pUNW6r51tD"


def extractData(data):
    string, key, date = data['text'].partition(' at ')
    print(data['user']['id'], date, string)
    string = string.split(', ')
    try:    
        utc_time = datetime.strptime(date, "%d/%m/%Y %H:%M:%S")
        date = utc_time.replace(tzinfo=timezone.utc).timestamp()
    except ValueError:
        return False

    entry = dict((item.split(':', 1)[0].replace(' ', '_'),
                  item.split(':', 1)[1].encode("ascii", errors="ignore").decode())
                 for item in string)

    for key in entry:
        try:
            entry[key] = float(re.search(r'^\d*[.]?\d*', entry[key]).group())
        except ValueError:
            return False


    entry['time'] = date*1000

    print(entry)
    print()
    return entry


class listener(StreamListener):
    def __init__(self):
        self.tweet_data = []

    def on_data(self, data):
        data = json.loads(data)
        user = data['user']['id']
        entry = extractData(data)
        if entry is not False:
            db.child("buoys").child(user).push(entry)

    def on_error(self, status):
        print(status)


if __name__ == '__main__':
    global db
    global stream
    

    # Firebase auth
    firebase = pyrebase.initialize_app(config)

    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password(account, password)
    db = firebase.database()

    for account in accounts:
        results = api.GetUserTimeline(account, count=200)
        results.reverse()
        for result in results:
            data = {
                'text': result.text,
                'user':{
                    'id': result.user.id,
                },
            }
            entry = extractData(data)
            user = result.user.id
            db.child("buoys").child(user).push(entry)

    # # Twitter auth
    l = listener()
    auth = OAuthHandler(consumer_key, consumer_secret)
    auth.set_access_token(access_token, access_token_secret)
    stream = Stream(auth, l)

    try:
        stream.filter(follow=accounts)
    except:
        e = sys.exc_info()
        print('Error!')
        print(e)
