import isik
import kandidaat
import piirkond
import vote
import partei

ppl = isik.create_isik()
cands = kandidaat.create_kandidaat(ppl)
piirkond.create_piirkond()
vote.create_vote(ppl, cands)
partei.create_partei()
