from events import *
import sys
import webapp2

from models import Event, Place
from google.appengine.ext import db
from google.appengine.api import users

""" Get lists of places

Get list of places and return them

"""
class Places():
    def getPlaces(self):
        urls = []
        locations = []
        
        l_list = db.GqlQuery("SELECT * FROM Place")

        for l in l_list.run():
            urls.append(l.url)
            locations.append(l.name)
       
        element = "div"
        attribute = "id"
        id = "fbTimelineEvent"
        town = "Tallinn"
        
        return urls, locations, element, attribute, id, town

""" Main Page (will be depriciated)

Main Page of the app - shows collected data of all events
and gets the live
URL: /

"""
class MainPage(webapp2.RequestHandler):
    def get(self):
        x = "hai world"
        template_values = {
            "x" : x
        }

        path = os.path.join(os.path.dirname(__file__), "mainpage.html")
        self.response.out.write(template.render(path, template_values))
        
app = webapp2.WSGIApplication([('/', MainPage)], debug=True)
