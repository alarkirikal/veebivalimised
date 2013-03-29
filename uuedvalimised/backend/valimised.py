import sys
import cgi
import webapp2
import os

from google.appengine.ext import db
from google.appengine.api import users
from google.appengine.api import rdbms
from google.appengine.ext.webapp import template

_INSTANCE_NAME = "veebivalimiseddb:veebidb"

class IndexPage(webapp2.RequestHandler):
    def get(self):

        template_values = {}

        path = os.path.join(os.path.dirname(__file__), "index.html")
        self.response.out.write(template.render(path, template_values))
    def post(self):
        action = self.request.get("action")
        self.redirect("/main?action=" + action)


class MainPage(webapp2.RequestHandler):
    def get(self):
        session = self.request.get("action")

        canCandidate = False
        canVote = False
        party = ""
        region = ""
        andmed = ()

        if session != "login_auth":
            session = "guest"

        if session != "guest":
            canCandidate, canVote, andmed = self.get_rights() #get_rights(id)
            try:
                party = andmed[0].encode('utf-8')
                region = andmed[1].encode('utf-8')
            except IndexError:
                party = ""
                region = ""

        template_values = {
            "x" : "hai world",
            "session" : session,
            "canCandidate" : canCandidate,
            "canVote" : canVote,
            "party" : party,
            "region" : region,
            "andmed" : andmed,
            "candNames" : self.get_candnames()
        }

        path = os.path.join(os.path.dirname(__file__), "mainpage.html")
        self.response.out.write(template.render(path, template_values))
    
    def post(self):
        if self.request.get("toDo") == "delete_candidate":
            conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
            cursor = conn.cursor()
            cursor.execute("""
                DELETE FROM
                    kandidaat
                WHERE
                    isik_ID = '1'
            """)
            conn.commit()
            conn.close()
            self.redirect("/main?action=" + self.request.get("action"))

        if self.request.get("toDo") == "set_candidate":
            conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
            cursor = conn.cursor()
            cursor.execute("""
                INSERT INTO
                    kandidaat (partei_ID, piirkond_ID, isik_ID)
                VALUES
                    (%s, %s, %s)
            """ % (self.request.get("Party"), self.request.get("Area"), self.request.get("person_id")))
            conn.commit()
            conn.close()
            self.redirect('/main?action=' + self.request.get("action"))


    def get_rights(self):
        andmed = ""
        conn = rdbms.connect(instance=_INSTANCE_NAME, database='Veebivalimised')
        cursor = conn.cursor()
        cursor.execute("SELECT * FROM kandidaat WHERE isik_ID = '1'")
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
                    kandidaat.isik_ID = 1 
                AND
                    kandidaat.partei_ID = partei.ID
                AND
                    kandidaat.piirkond_ID = piirkond.ID
            """)
            andmed = cursor.fetchone()


        cursor.execute("SELECT * FROM vote WHERE isik_ID = '1'")
        if cursor.fetchone() == None:
            canVote = True
        else:
            canVote = False

        conn.close()

        return canCandidate, canVote, andmed

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

main = webapp2.WSGIApplication([('/main', MainPage)], debug=True)
index = webapp2.WSGIApplication([('/index', IndexPage)], debug=True)


















