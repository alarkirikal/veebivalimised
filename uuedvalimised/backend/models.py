from google.appengine.ext import db
import datetime

class User(db.Model):
    id = db.StringProperty(required=True)
    created = db.DateTimeProperty(auto_now=True)
    updated = db.DateTimeProperty(auto_now=True)
    name = db.StringProperty(required=True)
    profile_url = db.StringProperty(required=True)
    access_token = db.StringProperty(required=True)

class Client( db.Model ):
    id = db.StringProperty(required=True)
    name = db.StringProperty(required=True)
    updated = db.DateTimeProperty(auto_now=True)

    @staticmethod
    def add(id, name):
# find and update or add new, remove old
            item = Client.all().filter( "id = ", id ).get()
            if item == None:
                Client( id = id, name = name ).save()
            else:
                item.updated = datetime.datetime.now()
                item.save()

            # remove old
            too_old = datetime.datetime.now() - datetime.timedelta( seconds=600 )
            items = Client.all().filter( "updated <", too_old )
            for item in items:
                item.delete()
