
let start;
let end;

let maxWidth;
let maxHeight;

let hasBoat = true;




let openList = [];
let closedList = [];

let parents = new Map();

function getStart(){
    if(start == null){
        return null;
    }
    return start;
}
function setStart(obj){
    start = obj;
}


function getEnd(){
    if(end == null){
        return null;
    }
    return end;
}
function setEnd(obj){
    end = obj;
}



window.onload = function(){
    displayGrid();
}

function displayGrid(){
    document.getElementById("grid").innerHTML = createGrid(getData());
}

// Init grid
function init_grid(start, end){
    setStart(start);
    setEnd(end);
    document.getElementById(getStart()).style.backgroundColor = "yellow";
    document.getElementById(getStart()).innerHTML = "S";
    setPathCosts(getStart(), 0);

    document.getElementById(getEnd()).style.backgroundColor = "yellow";
    document.getElementById(getEnd()).innerHTML = "E";

    openList.push(getStart());
    startAll();
}

async function startAll(){
    let counter = 0;
    while(openList.length > 0 && counter <1700){


        // Ermittle die Zelle aus der OpenList mit dem kürzesten Weg
        let shortestPath = undefined;
        let shortestPathArray = [];
        for(let i = 0; i < openList.length; i++){
            let tmpPath = openList[i];
            let tmpType = parseInt(document.getElementById(tmpPath).getAttribute("type"));
            let tmpHasBoat = document.getElementById(tmpPath).getAttribute("hasBoat");
            //console.log("Abfrage Zeile 79: "+tmpPath);
            //console.log(tmpHasBoat.includes("true"));
            //console.log(typeof tmpHasBoat);
            // Wennn Berg und kein Boot hat                         Wenn Wasser und hat noch Boot                   alle anderen Fälle
            if((tmpType == 3 && tmpHasBoat.includes("false")) || (tmpType == 0 && tmpHasBoat.includes("true")) || (tmpType != 3 && tmpType != 0)){
                if(shortestPath == undefined){
                    shortestPath = tmpPath;
                }else{

                    let tmpPathCost = parseFloat(document.getElementById(tmpPath).getAttribute("cost"))+parseFloat(document.getElementById(tmpPath).getAttribute("pathCost"))+heuristFunction(tmpPath);
                    let shortestPathCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost"))+parseFloat(document.getElementById(shortestPath).getAttribute("pathCost"))+heuristFunction(shortestPath);
                    if(tmpPathCost < shortestPathCost){
                        shortestPath = tmpPath;
                        shortestPathArray.push(tmpPath);
                    }else if(tmpPathCost <= shortestPathCost){
                        shortestPathArray.push(tmpPath);
                    }
                }

            }else if(tmpType == 3){
                // Falls das nächste kürzere Feld ein Berg ist, soll das Boot weg geworfen werden!
                if(shortestPath == undefined){
                    shortestPath = tmpPath;
                }
                let tmpPathCost = parseFloat(document.getElementById(tmpPath).getAttribute("cost"))*0.9+parseFloat(document.getElementById(tmpPath).getAttribute("pathCost"))+heuristFunction(tmpPath);
                let shortestPathCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost"))+parseFloat(document.getElementById(shortestPath).getAttribute("pathCost"))+heuristFunction(shortestPath);
                if(tmpPathCost < shortestPathCost){
                    shortestPath = tmpPath;
                    shortestPathArray.push(tmpPath);
                    document.getElementById(tmpPath).setAttribute("hasBoat", false.toString());
                }else if(tmpPathCost <= shortestPathCost){
                    shortestPathArray.push(tmpPath);
                    document.getElementById(tmpPath).setAttribute("hasBoat", false.toString());
                }
            }



        }

        // Falls es mehrere Felder gibt, die eine gleich Entfernung vom Start zur jetzigen Stelle hat, dann nehme man das Element, dass die kürzeste Diagonale zum Ziel hat!
        if(shortestPathArray.length > 1){
            //console.info("Es gibt mehre Felder mit derselben Entfernung!");
            let shortDiagonale = undefined;
            for(let i = 0; i< shortestPathArray.length; i++){
                let pos = shortestPathArray[i];
                if(shortDiagonale == undefined || heuristFunction(pos) < shortDiagonale){
                    shortestPath = pos;
                }
            }
        }

        // Es konnte kein passendes Feld gefunden werden!
        if(shortestPath === undefined){
            console.error("Es konnte kein 'shortestPath' gefunden werden!");
            let alreadyChanged = true;
            for(let i = 0; i< openList.length; i++){
                let id = openList[i];
               if(document.getElementById(id).getAttribute("hasBoat") === "true"){
                   alreadyChanged = false;
               }
                document.getElementById(id).setAttribute("hasBoat", false.toString());
            }


            if(alreadyChanged){
                alert("Es konnte mit den Regel kein Weg gefunden werden!");break;
            }
            return;
        }else{
            // Entferne die Zelle mit dem kürzesten Weg aus der OpenList
            openList = removeArrayElement(openList, shortestPath);
            //console.log("Kürzester Weg: " +shortestPath);

            if(document.getElementById(shortestPath).innerHTML !== "S"){
                document.getElementById(shortestPath).style.backgroundColor = color["searchField"];
            }

            // Füge die Zelle mit dem kürzesten Weg in die ClosedList
            closedList.push(shortestPath);

            // Berechne die Schritte für die Zellen außenrum
            let fieldsAround = getFieldsAround(shortestPath);

            // Feldkosten für das Feld davor
            let fieldCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost"));

            // Falls Boot abgelegt wurde, reduziert sich die Wegzeit
            if(document.getElementById(shortestPath).getAttribute("hasBoat").includes("false")) fieldCost = fieldCost*0.9;
            if(parents.get(shortestPath) != null){
                let parentPath = shortestPath;
                fieldCost += parseFloat(document.getElementById(parentPath).getAttribute("pathCost"));
            }

            for(let i = 0; i < fieldsAround.length; i++){
                let pos = fieldsAround[i];
                if(document.getElementById(pos).getAttribute("pathCost") == null || parseFloat(document.getElementById(pos).getAttribute("pathCost")) > fieldCost){
                    let type = document.getElementById(pos).getAttribute("type");
                    setPathCosts(pos, fieldCost);

                    // Setze, dass das Boot abgelegt wurde
                    if(type != 0 &&  document.getElementById(shortestPath).getAttribute("type") == 0 || document.getElementById(shortestPath).getAttribute("hasBoat") == "false"){ setHasBoat(pos, false)}
                    openList.push(pos);
                    parents.set(pos,shortestPath);
                }

            }

            //console.log("Openlist: ");
            //console.log(openList);

            counter++;
            await Sleep(getSleepTime());
            if(finished()){
                openList = [];
                //alert("Ziel erreicht!");
                document.getElementById("showSolution").removeAttribute("hidden");
                await Sleep(250);
                showSolution();
            }
        }




    }

}
function getSleepTime(){
    return 1000-document.querySelector("#time").value;
}

// Überprüft, ob das Ziel erreicht wurde
function finished(){
    if(document.getElementById(getEnd()).getAttribute("pathCost") != null){
        return true;
    }
    return false;
}

// Setzt die Zahl für die schon gelaufenen Zellen (ohne Heurisitische Funktion)
function setPathCosts(/*ID of field*/ pos, value){
    if(document.getElementById(pos.toString()).getAttribute("pathCost") == null){
        document.getElementById(pos.toString()).setAttribute("pathCost", value);
        document.getElementById(pos.toString()).setAttribute("title", value);
    }
}

function setHasBoat(/*ID of field*/ pos, value){
    document.getElementById(pos.toString()).setAttribute("hasBoat", value);
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





function showSolution(){
    showPathTo(getEnd());


    showMoreDetails();
}
let showSearch = false;
function hideShowSearch(){
    for(let i = 0; i< closedList.length;i++){
        let value = closedList[i];
        let element = document.getElementById(value);
        if(value != getStart() && !path.includes(value)) {
            if(showSearch){
                element.style.backgroundColor = color["searchField"];
            }else{
                element.style.backgroundColor = color[element.getAttribute("type")];
            }

        }
        //await Sleep(1);
    }
    showSearch = !showSearch;

}
let path = [];
// Returns Anzahl an durchlaufenden Felder
async function showPathTo(pos){
    let current = pos;
    let way = new Array();
    while(current != getStart()){
        way.push(current);
        current = parents.get(current);
    }
    path = way;
    for(let i = way.length-1; i>=0; i--){
        let field = way[i];
        if(field == pos){
            document.getElementById(field).style.backgroundColor = "darkred";
          }else{
            document.getElementById(field).style.backgroundColor = "red";
        }
        await Sleep(100);
    }
    await Sleep(100);
    hideShowSearch();

}

// Nutzer kann Start und Ende festlegen. Hierführ wird diese Funktion verwendet
async function setStartOrEnd(id){
    if(getStart() == null){
        setStart(id);
        document.getElementById(getStart()).style.backgroundColor = "yellow";
    }else if(getEnd() == null){
        setEnd(id);
        document.getElementById(getStart()).style.backgroundColor = "yellow";
        await Sleep(100);
        init_grid(getStart(), getEnd());
    }

}

// Entfernt den Startpunkt aus dem Spielfeld
function removeStart(){
    displayGrid();
    setStart(null);
}