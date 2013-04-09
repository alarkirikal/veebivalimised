import random

def create_isik():
    eesnimi = ["Siim", "Robert", "Martin", "Maria",
           "Rainer", "Triin", "Andres", "Madis",
           "Martin", "Toomas", "Rein", "Anna",
           "Tiina", "Sirje", "Nikita", "Sebastian",
           "Oliver", "Rasmus", "Sander", "Kaspar",
           "Kristofer", "Mattias", "Artur", "Daniel",
           "Karl", "Sten", "Markus", "Marcus",
           "Isabel", "Maria", "Laura", "Sofia",
           "Emma", "Sandra", "Diana", "Veronika",
           "Uuno", "Feliks", "Rene", "Ruth",
           "Paavo", "Vilja", "Meelitu", "Meelis",
           "Enno", "Aneta", "Agnes", "Elle",
           "Tuuli", "Karita", "Vallo", "Mehis",
           "Egle", "Leila", "Laila", "Karina"]

    perekonnanimi = ["Orav", "Kruus", "Meri", "Tiik",
                 "Post", "Vihm", "Tamm", "Saar",
                 "Sepp", "Koobas", "Petrov", "Kask",
                 "Kukk", "Rebane", "Noor", "Kirikal",
                 "Plangi", "Laanekoor", "Kilplane", "Oja",
                 "Karge", "Leebe", "Koort", "Adamson",
                 "Abner", "Annoson", "Golding", "Ohakas",
                 "Letner", "Leppik", "Pihlak", "Paas",
                 "Laas", "Laan", "Tamman", "Tasa",
                 "Saks", "Sander", "Roosileht", "Reinart",
                 "Valtin", "Vendelin", "Tammiste", "Kirikal",
                 "Treff", "Tari", "Karv", "Korv"]

    nimilist = []
    i = 2

    while (i<10000):
        nimi = eesnimi[random.randint(0,55)] + " " + perekonnanimi[random.randint(0,47)]
        kaslistis = False;
        for j in nimilist:
            if (j==nimi):
                kaslistis = True
                break
        if (kaslistis != True):
            nimilist.append(nimi)
        i = i+1
    
    ppl = 0
    for i in nimilist:
        ppl += 1
        nimi = i.split(" ")
        print("INSERT INTO isik (Nimi, perenimi) VALUES (" + "'" + nimi[0]+ "'" + ', ' + "'" + nimi[1] + "'" + ");") 

    return ppl
