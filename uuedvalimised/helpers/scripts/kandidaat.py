import random

def create_kandidaat(ppl):
    counter = 1
    cands = 0
    candidates = {}
    isik_list = []
    while counter != 40:
        candidate = {}

        candidate['partei_ID'] = random.randint(1, 6)
        candidate['piirkond_ID'] = random.randint(1, 11)
        candidate['isik_ID'] = random.randint(1, ppl)

        candidates[str(counter)] = candidate
        counter += 1


    counter = 1
    while counter != 40:
        candidate = candidates[str(counter)]
        if candidate['isik_ID'] not in isik_list:
            isik_list.append(candidate['isik_ID'])
            print("Insert into kandidaat (partei_ID, piirkond_ID, isik_ID) VALUES (%s, %s, %s);" % (candidate['partei_ID'], candidate['piirkond_ID'], candidate['isik_ID'])) 
            cands += 1
        counter += 1
    
    return cands
