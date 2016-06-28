"""
<th>Title</th>
<th>S/Bg</th>
<th>T/S</th>
<th>Medium</th>
<th>Dist</th>
<th>Lambda</th>
<th>Temp</th>
"""

dataset = []
for a in ["Porasil","Plat","Alum"]:
    for b in ["Sample","Background","Dual"]:
        for c in ["Transmission","Scattering"]:
            for d in ["D2O","H2O","BCA"]:
                for e in ["6","12"]:
                    for f in ["3","6", "12"]:
                        for g in ["12","18","30"]:
                            title = a #+" "+b+" "+c+" in "+d+" dist="+e+"m Lambda="+f+" T="+g+"C."
                            dataset.append([title,b,c,d,e,f,g])

print dataset
