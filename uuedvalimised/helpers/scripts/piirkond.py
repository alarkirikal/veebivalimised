
def create_piirkond():
    piirkonnad = (
        "Haabersti, Pohja-Tallinn, Kristiine",
        "Kesklinn, Lasnamae, Pirita",
        "Mustamae, Nomme",
        "Harjumaa, Raplamaa",
        "Laanemaa, Saaremaa, Hiiumaa",
        "Laane-Virumaa",
        "Ida-Virumaa",
        "Viljandimaa, Jarvamaa",
        "Jogevamaa, Tartumaa",
        "Tartu",
        "Polvamaa, Valgamaa, Vorumaa",
        "Kogu Eesti",)
    for piirkond in piirkonnad:
        print "INSERT INTO piirkond(Nimi) VALUES ('%s');" % (piirkond, )
