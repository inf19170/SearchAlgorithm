class Field {
    constructor(type) {
        this.type = type;
        this.costs = cost[type];
        this.color = color[type];
        this.hasBoat = true;
    }

    createHTML(x,y){
        const id = x+":"+y;
           return "<td style='border: solid 0.1px black;background-color:"+this.color+"; width: 20px; height: 10px; font-size: 8.5px;' cost='"+this.costs+"' id='"+id+"' type='"+this.type+"' hasBoat='"+this.hasBoat+"'  onclick='setStartAndEnd(\""+id+"\");' onmouseover='displayOption(\""+id+"\", true);' onmouseleave='displayOption(\""+id+"\", false);' throwBoat='false' title='"+FieldDescriptionToString(id, this.type,null, null)+"'>"+this.type+"</td>"
    }

}
