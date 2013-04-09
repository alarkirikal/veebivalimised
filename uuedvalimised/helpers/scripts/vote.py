import random

def create_vote(ppl, cands):
    for x in range(ppl):
        print "INSERT INTO vote (kandidaat_ID, isik_ID) VALUES (%s, %s);" % (random.randint(1, cands), x+1)
