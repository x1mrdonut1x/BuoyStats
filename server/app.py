import pyrebase
from datetime import datetime
import re
import sys
import twitter
from auth import *

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

api = twitter.api.Api(consumer_key='kBhyW26wLxAZSh7t3wpAUoWV1',
                      consumer_secret='bmok5hhJWUAXgMVlBZpZlNJ4B5m0M4EMf9dD9zm0pUNW6r51tD',
                      application_only_auth=True)

config = {
    "apiKey": "AIzaSyB6p_PpV2XCuIRYM9Zx3YRh_zEyNQ7Hc6g",
    "authDomain": "buoystats.firebaseapp.com",
    "databaseURL": "https://buoystats.firebaseio.com",
    "storageBucket": "buoystats.appspot.com",
    "serviceAccount": "./key.json"
}

def extractData(data):
    string, key, date = data['text'].partition(' at ')
    print(data['user']['id'], date, string)
    string = string.split(', ')
    try:    
        date = (datetime.strptime(date, "%d/%m/%Y %H:%M:%S") - datetime(1970,1,1)).total_seconds()
        # date = utc_time.replace(tzinfo=timezone.utc).timestamp()
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

    time = int(date*1000)
    entry['time'] = time

    print(entry)
    print()
    
    return time, entry

def main():
    global account
    global password
    
    # Firebase auth
    firebase = pyrebase.initialize_app(config)

    auth = firebase.auth()
    user = auth.sign_in_with_email_and_password(account, password)
    db = firebase.database()
    
    for account in accounts:
        results = api.GetUserTimeline(account, count=2)
        results.reverse()
        for result in results:
            data = {
                'text': result.text,
                'user':{
                    'id': result.user.id,
                },
            }
            time, entry = extractData(data)
            user = result.user.id

            if entry != False:
                db.child("buoys").child(user).child(time).set(entry)
            else:
                print('FAIL')