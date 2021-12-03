const reduze = 0.1;

const type = {
    4:"forest",
    0:"river",
    3:"mountain",
    1:"flat",
    2: "way"
}

const cost = {
    4:11,
    0:5,
    3:20,
    1:3,
    2:2
}

const color = {
    4:"#548235",
    0:"#9bc2e6",
    3:"#806000",
    1:"#c6efce",
    2:"#d6dce4",
    "startBegin":"yellow",
    "endBegin":"yellow",
    "searchField":"rgb(127,255,0)"

}

const symbols = {
    4:"<i class=\"fas fa-tree\"></i>",
    0:"<i class=\"fas fa-water\"></i>",
    3:"<i class=\"fas fa-mountain\"></i>",
    1:"<i class=\"fas fa-hiking\"></i>",
    2: "<i class=\"fas fa-road\"></i>"

}
/*

                             Wasser: <span id="runnedFieldsRiver">-</span> FE
                            <br>
                             Wiese: <span id="runnedFieldsFlat">-</span> FE
                            <br>
                             Weg: <span id="runnedFieldsWay">-</span> FE
                            <br>
                             Berg: <span id="runnedFieldsMountain">-</span> FE
                            <br>
                             Wald: <span id="runnedFieldsForest">-</span> FE


 */




class Field {
    constructor(type) {
        this.type = type;
        this.costs = cost[type];
        this.color = color[type];
        this.hasBoat = true;
    }

    createHTML(x,y){
        const id = x+":"+y;
           return "<td style='border: solid 0.1px; border-color: black;background-color:"+this.color+"; width: 20px; height: 10px; font-size: 8px;' cost='"+this.costs+"' id='"+id+"' type='"+this.type+"' hasBoat='"+this.hasBoat+"'  onclick='setStartOrEnd(\""+id+"\");' onmouseover='displayOption(\""+id+"\", true);' onmouseleave='displayOption(\""+id+"\", false);' throwBoat='false'>"+this.type+"</td>"
    }
}
