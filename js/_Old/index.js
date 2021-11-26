
let start;
let end;

let maxWidth;
let maxHeight;

let hasBoat = true;


let openList = new Array();
let closedList = new Array();
let erweiterungsListe = new Array();

function getStart(){
    if(start == null){
        console.error("Startfeld wurde nicht definiert!");
        return null;
    }
    return start;
}
function setStart(obj){
    start = obj;
}


function getEnd(){
    if(end == null){
        console.error("Zielfeld wurde nicht definiert!");
        return null;
    }
    return end;
}
function setEnd(obj){
    end = obj;
}

window.onload = new function(){

}

function startGame(){
    init_grid("4:4", "17:28");

}

// Init grid
function init_grid(start, end){
    document.getElementById("grid").innerHTML = createGrid(getData());
    setStart(start);
    setEnd(end);
    document.getElementById(getStart()).style.borderColor = "red";
    document.getElementById(getStart()).style.fontSize = "13px";
    document.getElementById(getStart()).innerHTML = "S";
    setPathCosts(getStart(), heuristFunction(getStart()));

    document.getElementById(getEnd()).style.borderColor = "red";
    document.getElementById(getEnd()).style.fontSize = "13px";
    document.getElementById(getEnd()).innerHTML = "E";
}

function startAll(){
    if(openList.includes(getStart())){
        let position = getStart();
        erweiterungsListe.push(position);
        dieseFunktionFuehrtDieWegkostenZuDenAnderenPunkten(position);

    }
    let counter = 0;
    while(finished() == false && erweiterungsListe.length >0 && counter <10000){

        // Derzeitiger kürzesten Weg erhalten
        let posOfMinimalCosts = undefined;
        console.log("Erweiterungsliste: ");
        console.log(erweiterungsListe);
        for(let i = 0; i< erweiterungsListe.length;i++){
            let posErweiterungsliste = erweiterungsListe[i];
            let tmpPathCost = document.getElementById(posErweiterungsliste).getAttribute("pathCost");
            if(posOfMinimalCosts == undefined || tmpPathCost < document.getElementById(posOfMinimalCosts).getAttribute("pathCost")){
                posOfMinimalCosts = posErweiterungsliste;

            }
        }
        console.log("Position mit den minimalen Kosten: " + posOfMinimalCosts);
        dieseFunktionFuehrtDieWegkostenZuDenAnderenPunkten(posOfMinimalCosts);
        document.getElementById(posOfMinimalCosts).innerHTML = "X";
        counter++;
    }

    if(finished()){
        alert("Das Ziel wurde erreicht!");
    }else if(erweiterungsListe.length == 0){
        alert("Das Ziel konnte nicht erreicht werden!")
    }
}

function dieseFunktionFuehrtDieWegkostenZuDenAnderenPunkten(position){
    let tmpfieldArounds = getFieldsAround(position);
    console.log("Felder von "+position+" außenrum sind: ");
    console.log(tmpfieldArounds);
    let costFieldCurrent = parseFloat(getCostOfField(position));
    let posOfMinimalCosts = undefined;
    let minimalCost = undefined;
    for(let i = 0; i< tmpfieldArounds.length;i++){
        let newPos = tmpfieldArounds[i];

            //if(document.getElementById(newPos).getAttribute("type") !== "3" && hasBoat || document.getElementById(newPos).getAttribute("type") === "0" && hasBoat){
                if(hasBoat == false){
                    costFieldCurrent = costFieldCurrent-(costFieldCurrent*reduze);
                }
                let tmpPathCost = costFieldCurrent+heuristFunction(newPos);
                if(document.getElementById(newPos).getAttribute("pathCost") != null){
                    if(tmpPathCost > document.getElementById(newPos).getAttribute("pathCost")){
                        tmpPathCost = document.getElementById(newPos).getAttribute("pathCost");
                    }
                }else{
                    setPathCosts(newPos, tmpPathCost);
                    erweiterungsListe.push(newPos);
                }
                if((posOfMinimalCosts == undefined && minimalCost == undefined)|| tmpPathCost < minimalCost){
                    posOfMinimalCosts = newPos;
                    minimalCost = tmpPathCost;

                }
            //}


    }
    try{
        openList = removeArrayElement(openList, position);
    }catch{
    }

    erweiterungsListe = removeArrayElement(erweiterungsListe,position);
    closedList.push(position);


}

function finished(){
    if(document.getElementById(getEnd()).getAttribute("pathCost") != null){
        return true;
    }
    return false;
}


function setPathCosts(/*ID of field*/ pos, value){
    if(document.getElementById(pos.toString()).getAttribute("pathCost") == null){
        document.getElementById(pos.toString()).setAttribute("pathCost", value) ;
    }
}


function calculatePathCosts(/*ID of field*/ pos ){
    return heuristFunction(pos);
}

// Returns the cost of the given field
function getCostOfField(pos){
    return document.getElementById(pos).getAttribute("cost");
}


// Returns all fiels around given position
function getFieldsAround(/*ID of field*/ pos){
    let list = new Array();
    let posX = parseInt(pos.split(":")[0]);
    let posY = parseInt(pos.split(":")[1]);

    let newX = posX;
    let newY = posY-1;
    let newPos = newX+":"+newY;
    //up
    if(newX >= 0 && newY >=0 && newX <=maxWidth && newY <= maxHeight && document.getElementById(newX+":"+newY) != null){
        list.push(newPos);
    }


    newX = posX;
    newY = posY+1;
    newPos = newX+":"+newY;
    //down
    if(newX >= 0 && newY >=0 && newX <=maxWidth && newY <= maxHeight && document.getElementById(newX+":"+newY) != null){
        list.push(newPos);
    }


    newX = posX-1;
    newY = posY;
    newPos = newX+":"+newY;
    //left
    if(newX >= 0 && newY >=0 && newX <=maxWidth && newY <= maxHeight && document.getElementById(newX+":"+newY) != null){
        list.push(newPos);
    }


    newX = posX+1;
    newY = posY;
    newPos = newX+":"+newY;
    //right
    if(newX >= 0 && newY >=0 && newX <=maxWidth && newY <= maxHeight && document.getElementById(newX+":"+newY) != null){
        list.push(newPos);
    }
    return list;
}


// Returns the value of the heurist function
function heuristFunction(pos){
    let posX = parseInt(pos.split(":")[0]);
    let posY = parseInt(pos.split(":")[1]);

    if(getEnd() == null) return undefined;

    let endX = parseInt(getEnd().split(":")[0]);
    let endY = parseInt(getEnd().split(":")[1]);

    let diff = 0;

    diff += Math.abs(posX-endX);
    diff += Math.abs(posY-endY);



    return diff;
}


// Create HTML Code for grid
function createGrid(data) {
    let allRows = data.split(/\r?\n|\r/);
    let table = '<table>';
    for (let singleRow = 0; singleRow < allRows.length; singleRow++) {
        table += '<tr>';
        let rowCells = allRows[singleRow].split(',');
        for (let rowCell = 0; rowCell < rowCells.length; rowCell++) {
            let row  = rowCells[rowCell].split(";");
            for (let i = 0; i < row.length; i++) {
                let type = row[i];
                let field = new Field(type);
                let ID = i+":"+singleRow;
                openList.push(ID);
                table += field.createHTML(i,singleRow);
            }
            maxWidth = row.length;

        }
        table += '</tr>';
        maxHeight = allRows.length;
    }


    table += '</table>';
    console.log(table);
    return table;
}


function showSolution(){
    let currentPos = getStart();
    let counter = 0;
    while(currentPos != getEnd() && counter <1000){
        let fieldsAround = getFieldsAround(currentPos);
        let posMinimumCost = undefined;
        for(let i =0; i< fieldsAround.length;i++){
            let pos = fieldsAround[i];
            if(document.getElementById(pos).getAttribute("pathCost") != null && document.getElementById(pos).innerHTML === "X" && (posMinimumCost == undefined || document.getElementById(pos).getAttribute("pathCost")<= document.getElementById(posMinimumCost).getAttribute("pathCost"))){
                posMinimumCost = pos;
            }
            console.log("Position: "+pos +" hat diese Pathkosten");
            console.log(document.getElementById(pos).getAttribute("pathCost"));
        }
        if(posMinimumCost == undefined){
            for(let i =0; i< fieldsAround.length;i++){
                let pos = fieldsAround[i];
                if(document.getElementById(pos).getAttribute("pathCost") != null && document.getElementById(pos).innerHTML === "W" && (posMinimumCost == undefined || document.getElementById(pos).getAttribute("pathCost")<= document.getElementById(posMinimumCost).getAttribute("pathCost"))){
                    posMinimumCost = pos;
                }
                console.log("Position: "+pos +" hat diese Pathkosten");
                console.log(document.getElementById(pos).getAttribute("pathCost"));
            }
        }

        console.log("position "+posMinimumCost+" ist am kostengünstigem!");
        currentPos = posMinimumCost;
        document.getElementById(posMinimumCost).style.backgroundColor = "red";
        document.getElementById(posMinimumCost).innerHTML = "W";
        counter++;
    }
}