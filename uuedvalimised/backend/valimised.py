from models import User

import models
import sys
import cgi
import webapp2
import os
import json
import facebook
import urllib2
import jinja2
import logging

from webapp2_extras import sessions
from google.appengine.api import users
from google.appengine.api import rdbms
from google.appengine.api import channel
from google.appengine.ext.webapp import template

FACEBOOK_APP_ID = "555712221116753"
FACEBOOK_APP_SECRET = "22923f7fb835ae8eb1d34404bc060d21"

config = {}
config['webapp2_extras.sessions'] = dict(secret_key='')
_INSTANCE_NAME = "veebivalimiseddb:veebidb"

""" Facebook tests BEGIN """

class BaseHandler(webapp2.RequestHandler):
    @property
    def current_user(self):
        if self.session.get("user"):
            return self.session.get("user")
        else:
            cookie = facebook.get_user_from_cookie(self.request.cookies,
                                                   FACEBOOK_APP_ID,
                                                   FACEBOOK_APP_SECRET)
            
            if cookie:
                user = User.get_by_key_name(cookie["uid"])
                if not user:
                    graph = facebook.GraphAPI(cookie["access_token"])
                    profile = graph.get_object("me")
                    user = User(
                        key_name = str(profile["id"]),
                        id = str(profile["id"]),
                        name = profile["name"],
                        profile_url = profile["link"],
                        access_token = cookie["access_token"]
                    )
                    user.put()
                elif user.access_token != cookie["access_token"]:
                    user.access_token = cookie["access_token"]
                    user.put()
            
                self.session["user"] = dict(
                    name = user.name,
                    profile_url = user.profile_url,
                    id = user.id,
                    access_token = user.access_token
                )
                return self.session.get("user")
        return None

    def dispatch(self):
        self.session_store = sessions.get_store(request=self.request)
        try:
            webapp2.RequestHandler.dispatch(self)
        finally:
            self.session_store.save_sessions(self.response)

    @webapp2.cached_property
    def session(self):
        return self.session_store.get_session()


class HomeHandler(BaseHandler):
    def get(self):
        template = jinja_environment.get_template('example.html')
        self.response.out.write(template.render(dict(
            facebook_app_id=FACEBOOK_APP_ID,
            current_user=self.current_user
        )))

    def post(self):
        url = self.request.get('url')
        file = urllib2.urlopen(url)
        graph = facebook.GraphAPI(self.current_user['access_token'])
        response = graph.put_photo(file, "Test Image")
        photo_url = ("http://www.facebook.com/photo.php?fbid={0}".format(response['id']))
        self.redirect(str(photo_url))


class LogoutHandler(BaseHandler):
    def get(self):
        if self.current_user is not None:
            self.session['user'] = None
        self.redirect('/')

""" Facebook tests END """

class IndexPage(webapp2.RequestHandler):
    def get(self):
        if self.request.get("action"):
            action = self.request.get("action")
            self.redirect("/?action=" + action)
        else:
            template_values = {}
            path = os.path.join(os.path.dirname(__file__), "index.html")
            self.response.out.write(template.render(path, template_values))

class MainPageParameters(BaseHandler):
    def get(self):

        canCandidate = False
        canVote = False
        userId = ""
        userName = ""
        cand_data = ""
        vote_data = ""
        cand_party = ""
        cand_region = ""
        vote_isik = ""
        vote_party = ""
        vote_region = ""
        x = ""
        token = ""
                
        try:
            # Logged in
            canCandidate, canVote, cand_data, vote_data = self.get_rights2(self.current_user['id'])
            userId = self.current_user['id']
            userName = self.current_user['name']
           

        except TypeError:

            pass

        try:
            cand_party = cand_data[0]
            cand_region = cand_data[1]
        except IndexError:
            cand_party = ""
            cand_region = ""
        
        try:
            vote_isik = vote_data[0] + vote_data[1]
            vote_party = vote_data[2]
            vote_region = vote_data[3]
        except (TypeError, IndexError):
            vote_isik = ""
            vote_party = ""
            vote_region = ""

        template_values = {
            'token': token,
            "facebook_app_id" : FACEBOOK_APP_ID,
            "current_user_id" : userId,
            "current_user_name" : userName,
            "canCandidate" : canCandidate,
            "canVote" : canVote,
            "cand_party" : cand_party,
            "cand_region" : cand_region,
            "vote_isik" : vote_isik,
            "vote_party" : vote_party,
            "vote_region" : vote_region,
        }

        self.response.out.write(json.dumps(template_values, sort_keys=True))
        
    def get_rights2(self, id):
        cand_data = ""
        vote_data = ""
        conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM kandidaat WHERE isik_ID = %s", (id,))
        if cursor.fetchone() == None:
            canCandidate = True
        else:
            canCandidate = False
            cursor.execute("""
                SELECT 
                    partei.nimi, piirkond.nimi, kandidaat.isik_id
                FROM
                    partei, piirkond, kandidaat
                WHERE 
                    kandidaat.isik_ID = %s 
                AND
                    kandidaat.partei_ID = partei.ID
                AND
                    kandidaat.piirkond_ID = piirkond.ID
            """, (id, ))
            cand_data = cursor.fetchone()


        cursor.execute("SELECT * FROM vote WHERE isik_ID = %s", (id, ))
        if cursor.fetchone() == None:
            canVote = True
        else:
            canVote = False
            cursor.execute("""
            SELECT
                isik.Nimi, isik.perenimi, partei.Nimi, piirkond.Nimi
            FROM
                isik, partei, piirkond, vote, kandidaat
            WHERE
                vote.isik_ID = %s
            AND
                vote.kandidaat_ID = kandidaat.ID
            AND
                kandidaat.isik_ID = isik.ID
            AND
                kandidaat.piirkond_ID = piirkond.ID
            AND
                kandidaat.partei_ID = partei.ID
            """, (id, ))
            vote_data = cursor.fetchone()
        conn.close()

        return canCandidate, canVote, cand_data, vote_data

        
class MainPage(BaseHandler):
    def get(self):        

        token = ""
        
        try:
            # Logged in
            conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
            cursor = conn.cursor()
	    x = self.current_user['name'].split(" ")
            firstname = x[0]
            lastname = x[1]
            cursor.execute("INSERT INTO isik(ID, Nimi, perenimi) VALUES (%s, %s, %s) ON DUPLICATE KEY UPDATE id = id", (self.current_user['id'], firstname.encode('utf-8'), lastname.encode('utf-8')))
            conn.commit()
            conn.close()
	    #Channel for live data
            token = channel.create_channel(self.current_user['id'])
        except (TypeError):
            pass

        #Channel stuff is commented out because, GAE only allows 100 channel creations per 24h
        #token = self.openChannel()
        

        template_values = {
            "token" : token,
            "facebook_app_id" : FACEBOOK_APP_ID,
            "current_user" : self.current_user,
        }


        template = jinja_environment.get_template('mainpage.html')
        self.response.out.write(template.render(template_values))

    def openChannel(self):
        channelId = os.urandom(16).encode('hex')
        token = channel.create_channel(channelId)
        try:
            models.Client.add(channelId, self.current_user['name'])
        except (TypeError):
            models.Client.add(channelId, "UnloggedUser")
        return token

    def notify_all(self):
        logging.info( "notifying of new state" )
        for client in models.Client.all():
            logging.info( "notifying of new state for %s" % client.name)
            channel.send_message( client.id, "Update")
        logging.info( "notifying of new state: done" )

    
    def post(self):
        if self.request.get("toDo") == "delete_candidate":
            conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
            cursor = conn.cursor()
            cursor.execute("""
                DELETE FROM
                    kandidaat
                WHERE
                    isik_ID = %s
            """, (self.current_user['id']))
            conn.commit()
            conn.close()
            self.redirect("/?action=" + self.request.get("action"))
            self.notify_all()

        if self.request.get("toDo") == "delete_vote":
            conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
            cursor = conn.cursor()
            cursor.execute("""
                DELETE FROM
                    vote
                WHERE
                    isik_ID = %s
            """, (self.current_user['id']))
            conn.commit()
            conn.close()
            self.redirect("/?action=" + self.request.get("action"))
            self.notify_all()
        if self.request.get("toDo") == "set_candidate":
            conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO
                    kandidaat (partei_ID, piirkond_ID, isik_ID)
                VALUES
                    (%s, %s, %s)
            """ % (self.request.get("Party"), self.request.get("Area"), self.current_user['id']))
            conn.commit()
            conn.close()
            self.redirect('/?action=' + self.request.get("action"))
            self.notify_all()
        if self.request.get("toDo") == "make_vote":
            conn=rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO
                    vote (kandidaat_ID, isik_ID)
                VALUES
                    (%s, %s)
            """ % (self.request.get("selected_candidate"), self.current_user['id']))

            conn.commit()
            conn.close()
            self.redirect("/?action=" + self.request.get("action"))
            self.notify_all()

    def get_rights(self, id):
        cand_data = ""
        vote_data = ""
        conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM kandidaat WHERE isik_ID = %s", (id,))
        if cursor.fetchone() == None:
            canCandidate = True
        else:
            canCandidate = False
            cursor.execute("""
                SELECT 
                    partei.nimi, piirkond.nimi, kandidaat.isik_id
                FROM
                    partei, piirkond, kandidaat
                WHERE 
                    kandidaat.isik_ID = %s 
                AND
                    kandidaat.partei_ID = partei.ID
                AND
                    kandidaat.piirkond_ID = piirkond.ID
            """, (id, ))
            cand_data = cursor.fetchone()


        cursor.execute("SELECT * FROM vote WHERE isik_ID = %s", (id, ))
        if cursor.fetchone() == None:
            canVote = True
        else:
            canVote = False
            cursor.execute("""
            SELECT
                isik.Nimi, isik.perenimi, partei.Nimi, piirkond.Nimi
            FROM
                isik, partei, piirkond, vote, kandidaat
            WHERE
                vote.isik_ID = %s
            AND
                vote.kandidaat_ID = kandidaat.ID
            AND
                kandidaat.isik_ID = isik.ID
            AND
                kandidaat.piirkond_ID = piirkond.ID
            AND
                kandidaat.partei_ID = partei.ID
            """, (id, ))
            vote_data = cursor.fetchone()
        conn.close()

        return canCandidate, canVote, cand_data, vote_data

    def get_candnames(self):
        conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
        cursor = conn.cursor()
        cursor.execute("""
        SELECT
            isik.perenimi, isik.nimi
        FROM
            kandidaat, isik
        WHERE
            kandidaat.isik_ID = isik.ID
        """)
        names = []
        for row in cursor.fetchall():
            names.append(row)

        return names



class DataPage(webapp2.RequestHandler):
    
    def connectDb(self):
        self.conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
        self.cursor = self.conn.cursor()


    def closeDb(self):
        self.conn.close()


    def get(self):
        result = {}

        self.connectDb()
        sql = """
            SELECT
                isik.nimi, isik.perenimi, partei.nimi, piirkond.nimi
            FROM
                isik, kandidaat, partei, piirkond
            WHERE
                kandidaat.isik_ID = isik.ID
            AND
                kandidaat.partei_ID = partei.ID
            AND
                kandidaat.piirkond_ID = piirkond.ID
        """
        
        sqlRequestParameters=[];
        if self.request.get("lastname") != "":
            sqlRequestParameters.append("lastname");
            sqlRequestParameters.append("lastname");
            sql += " AND (isik.perenimi LIKE %s OR isik.nimi LIKE %s)"
        elif self.request.get("lastname") != "":
            sqlRequestParameters.append("lastname");
            sql += " AND isik.perenimi LIKE %s"
        elif self.request.get("firstname") != "":
            sqlRequestParameters.append("firstname");
            sql += " AND isik.nimi LIKE %s"
        if self.request.get("area") != "":
            sqlRequestParameters.append("area");
            sql += " AND piirkond.nimi LIKE %s"
        if self.request.get("party") != "":
            sqlRequestParameters.append("party");
            sql += " AND partei.nimi LIKE %s"
           
        if len(sqlRequestParameters)==5:
            self.cursor.execute(sql, (self.request.get(sqlRequestParameters[0]) + "%",
                                      "%" + self.request.get(sqlRequestParameters[1]) + "%",
                                      "%" + self.request.get(sqlRequestParameters[2]) + "%",
                                      "%" + self.request.get(sqlRequestParameters[3]) + "%",
                                      "%" + self.request.get(sqlRequestParameters[4]) +"%"))
        if len(sqlRequestParameters)==4:
            self.cursor.execute(sql, (self.request.get(sqlRequestParameters[0]) + "%",
                                      "%" + self.request.get(sqlRequestParameters[1]) + "%",
                                      "%" + self.request.get(sqlRequestParameters[2]) + "%",
                                      "%" + self.request.get(sqlRequestParameters[3]) +"%"))
                    
        if len(sqlRequestParameters)==3:
            self.cursor.execute(sql, (self.request.get(sqlRequestParameters[0]) + "%",
                                      "%" + self.request.get(sqlRequestParameters[1]) + "%",
                                      "%" + self.request.get(sqlRequestParameters[2]) +"%"))  
       
        if len(sqlRequestParameters)==2:
            self.cursor.execute(sql, (self.request.get(sqlRequestParameters[0]) + "%",
                                      "%" + self.request.get(sqlRequestParameters[1]) +"%"))      
        
        if len(sqlRequestParameters)==1:
            self.cursor.execute(sql, (self.request.get(sqlRequestParameters[0]) + "%")) 
        
        if len(sqlRequestParameters)==0:
            self.cursor.execute(sql, (self.request.get_all("lastname" + "%")))
        

        counter = 1
        for row in self.cursor.fetchall():
            temp = {}
            temp['firstname'] = row[0]
            temp['lastname'] =  row[1]
            temp['party'] = row[2]
            temp['area'] = row[3]
            result[str(counter)] = temp
            counter += 1

        self.conn.close()
        self.response.out.write(json.dumps(result, sort_keys=True))


class VotePage(webapp2.RequestHandler):
    def connectDb(self):
        self.conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
        self.cursor = self.conn.cursor()

    def get(self):
        self.connectDb()
        respJSON = {}

        self.cursor.execute("""
            SELECT
                kandidaat.ID, isik.nimi, isik.perenimi, partei.nimi
            FROM
                kandidaat, isik, partei
            WHERE
                kandidaat.isik_ID = isik.ID
            AND
                kandidaat.partei_ID = partei.ID
            AND
                kandidaat.piirkond_ID =  %s
        """, self.request.get("area"))
        counter = 1
        for row in self.cursor.fetchall():
            temp = {}
            temp['cand_id'] = row[0]
            temp['firstname'] = row[1]
            temp['lastname'] = row[2]
            temp['party'] = row[3]
            respJSON[str(counter)] = temp
            counter += 1

        self.response.out.write(json.dumps(respJSON, sort_keys=True))
        self.conn.close()


class StatPage(webapp2.RequestHandler):
    
    def connectDb(self):
        self.conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
        self.cursor = self.conn.cursor()

    def get(self):
        area = self.request.get("area")
        tabname = self.request.get("tabname")
        self.connectDb()
        respJSON = {}

        if self.request.get("tabname") == "Candidates":
            if str(self.request.get("area")) == "12":
                self.cursor.execute("""
                    SELECT
                        isik.nimi, isik.perenimi, partei.nimi, count(kandidaat_ID)
                    FROM
                        vote, isik, kandidaat, partei
                    WHERE
                        vote.kandidaat_ID = kandidaat.ID
                    AND
                        kandidaat.isik_ID = isik.ID
                    AND
                        kandidaat.partei_ID = partei.ID

                    GROUP BY kandidaat_ID
                """)
            else:
                self.cursor.execute("""
                    SELECT
                        isik.nimi, isik.perenimi, partei.nimi, count(kandidaat_ID)
                    FROM
                        vote, isik, kandidaat, partei
                    WHERE
                        vote.kandidaat_ID = kandidaat.ID
                    AND
                        kandidaat.isik_ID = isik.ID
                    AND
                        kandidaat.partei_ID = partei.ID
                    AND
                        piirkond_ID = %s
                    GROUP BY kandidaat_ID
                """, (self.request.get("area")))
            counter = 1
            for row in self.cursor.fetchall():
                temp = {}
                temp['firstname'] = row[0]
                temp['lastname'] = row[1]
                temp['party'] = row[2]
                temp['votes'] = row[3]
                respJSON[str(counter)] = temp
                counter += 1

            self.response.out.write(json.dumps(respJSON, sort_keys=True))

        elif self.request.get("tabname") == "Party":
            if str(self.request.get("area")) == "12":
                self.cursor.execute("""
                    SELECT
                        partei.nimi, count(kandidaat_ID)
                    FROM
                        vote, isik, kandidaat, partei
                    WHERE
                        vote.kandidaat_ID = kandidaat.ID
                    AND
                        kandidaat.isik_ID = isik.ID
                    AND
                        kandidaat.partei_ID = partei.ID

                    GROUP BY partei_ID
                """)
            else:
                self.cursor.execute("""
                    SELECT
                        partei.nimi, count(kandidaat_ID)
                    FROM
                        vote, isik, kandidaat, partei
                    WHERE
                        vote.kandidaat_ID = kandidaat.ID
                    AND
                        kandidaat.isik_ID = isik.ID
                    AND
                        kandidaat.partei_ID = partei.ID
                    AND
                        kandidaat.piirkond_ID = %s
               
                    GROUP BY partei_ID
                """, (self.request.get("area")))

            counter = 1
            for row in self.cursor.fetchall():
                temp = {}
                temp['party'] = row[0]
                temp['votes'] = row[1]
                respJSON[str(counter)] = temp
                counter += 1
            
            self.response.out.write(json.dumps(respJSON, sort_keys=True))

        self.conn.commit()
        self.conn.close()

class ChannelDisconnected(webapp2.RequestHandler):
    def post(self):
        client_id = self.request.get('from')
        items = models.Client.all().filter( "id = ", client_id )
        for item in items:
            logging.info("Disconnect" + item.name)
            item.delete()


jinja_environment = jinja2.Environment(
    loader = jinja2.FileSystemLoader(os.path.dirname(__file__))
)

app = webapp2.WSGIApplication([
    #('/', HomeHandler),
    ('/', MainPage),
    ('/mainpageparameters', MainPageParameters),
    ('/logout', LogoutHandler),
    ('/myjson/vote', VotePage),
    ('/myjson/stat', StatPage),
    ('/myjson', DataPage),
    #('/main', MainPage),
    ('/index', IndexPage),
    ('/_ah/channel/disconnected/', ChannelDisconnected)
    ],
    debug = True,
    config = config
)

















