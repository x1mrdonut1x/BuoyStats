import unittest
from app import listener, extractData

text = "Avg Wind:19kts, Gust:26kts, Wave Height:0.9m, Wave Period:4s, Wind Dir:140 °(SE), Gust Dir:135 °(SE) at 15/04/2018 09:18:00"
data = {
    "created_at": "Sun Apr 15 08:24:27 +0000 2018",
    "id": 985433660416495616,
    "id_str": "985433660416495616",
    "text": text,
    "source": "<a href=\"http: //www.cil.ie\" rel=\"nofollow\">CILBallybunionTweeter</a>",
    "truncated": False,
    "in_reply_to_status_id": None,
    "in_reply_to_status_id_str": None,
    "in_reply_to_user_id": None,
    "in_reply_to_user_id_str": None,
    "in_reply_to_screen_name": None,
    "user": {
        "id": 2359608031,
        "id_str": "2359608031",
        "name": "Ballybunion Buoy",
        "screen_name": "BallybunionBuoy",
        "location": "52.54213,-9.7824",
        "url": "http://irishlights.ie/technology-data-services/metocean-charts.aspx",
        "description": "The Ballybunion Buoy is a Type 1 North Cardinal Mark. It also monitors local weather & sea state in real time. Email: metocean@irishlights.ie",
        "translator_type": "none",
        "protected": False,
        "verified": False,
        "followers_count": 370,
        "friends_count": 2,
        "listed_count": 6,
        "favourites_count": 7,
        "statuses_count": 92006,
        "created_at": "Mon Feb 24 14:40:02 +0000 2014",
        "utc_offset": None,
        "time_zone": None,
        "geo_enabled": False,
        "lang": "en",
        "contributors_enabled": False,
        "is_translator": False,
        "profile_background_color": "C0DEED",
        "profile_background_image_url": "http://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_image_url_https": "https://abs.twimg.com/images/themes/theme1/bg.png",
        "profile_background_tile": False,
        "profile_link_color": "1DA1F2",
        "profile_sidebar_border_color": "C0DEED",
        "profile_sidebar_fill_color": "DDEEF6",
        "profile_text_color": "333333",
        "profile_use_background_image": True,
        "profile_image_url": "http://pbs.twimg.com/profile_images/537175052769193984/pSNCJc1D_normal.jpeg",
        "profile_image_url_https": "https://pbs.twimg.com/profile_images/537175052769193984/pSNCJc1D_normal.jpeg",
        "profile_banner_url": "https://pbs.twimg.com/profile_banners/2359608031/1496409279",
        "default_profile": True,
        "default_profile_image": False,
        "following": None,
        "follow_request_sent": None,
        "notifications": None
    },
    "geo": None,
    "coordinates": None,
    "place": None,
    "contributors": None,
    "is_quote_status": False,
    "quote_count": 0,
    "reply_count": 0,
    "retweet_count": 0,
    "favorite_count": 0,
    "entities": {
        "hashtags": [],
        "urls": [],
        "user_mentions": [],
        "symbols": []
    },
    "favorited": False,
    "retweeted": False,
    "filter_level": "low",
    "lang": "en",
    "timestamp_ms": 1523780667772
}

class TestListener(unittest.TestCase):

    def test1(self):
        self.assertEqual(extractData(data), {'Avg_Wind':19.0, 'Gust':26.0, 'Wave_Height':0.9, 'Wave_Period':4.0, 'Wind_Dir':140.0, 'Gust_Dir':135.0, 'time':1523783880000.0})

if __name__ == '__main__':
    unittest.main()