def create_partei():
    parteid = (
        "Eestimaa Mustad",
        "Eestimaa Sinised",
        "Eestimaa Ruudulised",
        "Eestimaa Joonelised",
        "Eestimaa Kollased",
        "Eestimaa Kohukesed")
    for partei in parteid:
        print "INSERT INTO partei (Nimi) VALUES ('%s');" % (partei)
