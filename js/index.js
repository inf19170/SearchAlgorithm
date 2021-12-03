let start;
function getStart() {
    if (start == null) {
        return null;
    }
    return start;
}
function setStart(obj) {
    start = obj;
    document.getElementById(getStart()).style.textAlign = "center";
    document.getElementById("startPoint").innerHTML = '<i style="color: lightgreen" class="fas fa-check"></i> ' + document.getElementById("startPoint").innerHTML;
    document.getElementById("startSelect").innerHTML = '[' + getStart() + ']';
}


let end;
function getEnd() {
    if (end == null) {
        return null;
    }
    return end;
}
function setEnd(obj) {
    end = obj;
    document.getElementById(getEnd()).style.textAlign = "center";
    document.getElementById("endPoint").innerHTML = '<i style="color: lightgreen" class="fas fa-check"></i> ' + document.getElementById("endPoint").innerHTML;
    document.getElementById("endSelect").innerHTML = '[' + getEnd() + ']';

}


let maxWidth;
let maxHeight;



let showSearch = false; // Bei false wird der Suchweg (grün) nicht angezeigt.



let openList = [];
let closedList = [];

let solutionPath = [];
let parents = new Map();




// Beim Starten der Seite soll das Gride auf der Seite platziert werden und die Suchzeit auf vorigen Wert angepasst werden
window.onload = function () {
    displayGrid();
    let time = localStorage.getItem("searchTime");
    if (time != null) {
        document.getElementById("time").setAttribute("value", time);
    }
}

// Es wurde KEINE Lösung gefunden
function noSolutionFound() {
    document.getElementsByTagName("body")[0].style.cursor = "auto";
    document.getElementById("solutionTxt").setAttribute("style", "border: outset 3px; border-color: darkred; margin-bottom: 10px; background-color: rgb(220, 18, 18); text-align: center;");
    document.getElementById("solutionTxt").innerHTML = 'Suche nicht erfolgreich!&ensp;<i style ="color: black" class="fas fa-exclamation-triangle"></i>';
}
// Es wurde EINE Lösung gefunden
function solutionFound() {
    document.getElementsByTagName("body")[0].style.cursor = "auto";
    document.getElementById("solutionTxt").setAttribute("style", "border: outset 3px; border-color: darkgreen; margin-bottom: 10px; background-color: green; text-align: center;");
    document.getElementById("solutionTxt").innerHTML = 'Suche erfolgreich!&ensp;<i class="fas fa-check"></i>';
}


// Fügt Gride in Webseite hinzu
function displayGrid() {
    document.getElementById("grid").innerHTML = createGrid(getData());
}

// initiiere Start, Ende, openList und starte den Algorithmus
function init_grid(start, end) {

    document.getElementById(getStart()).style.backgroundColor = "yellow";
    document.getElementById(getStart()).innerHTML = "S";
    setPathCosts(getStart(), 0);

    document.getElementById(getEnd()).style.backgroundColor = "yellow";
    document.getElementById(getEnd()).innerHTML = "E";

    openList.push(getStart());
    startAlgorithmus();
}

// Startet den A* Algorithmus
async function startAlgorithmus() {

    document.getElementById("solutionTxt").innerHTML = 'Suchvorgang läuft! <i class="far fa-clock"></i>';
    document.getElementsByTagName("body")[0].style.cursor = "progress";
    while (openList.length > 0) {


        // Ermittle das mögliche Feld aus der OpenList mit dem kürzesten Weg
        let shortestPath = undefined;
        let shortestPathArray = [];
        for (let i = 0; i < openList.length; i++) {
            let tmpPath = openList[i];
            let tmpType = parseInt(document.getElementById(tmpPath).getAttribute("type"));
            let tmpHasBoat = document.getElementById(tmpPath).getAttribute("hasBoat");

            if ((tmpType == 0 && tmpHasBoat.includes("false"))) {
                openList = removeArrayElement(openList, tmpPath);
                continue; // Für Schleife mit nächsten Element aus!
            }

            // Wenn Berg und man kein Boot hat                    Wenn Wasser und man noch Boot hat                alle anderen Fälle
            if ((tmpType == 3 && tmpHasBoat.includes("false")) || (tmpType == 0 && tmpHasBoat.includes("true")) || (tmpType != 3 && tmpType != 0)) {
                if (shortestPath == undefined) {
                    shortestPath = tmpPath;
                } else {

                    let tmpPathCost = parseFloat(document.getElementById(tmpPath).getAttribute("cost")) + parseFloat(document.getElementById(tmpPath).getAttribute("pathCost")) + heuristFunction(tmpPath);
                    let shortestPathCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost")) + parseFloat(document.getElementById(shortestPath).getAttribute("pathCost")) + heuristFunction(shortestPath);
                    if (tmpPathCost < shortestPathCost) {
                        shortestPath = tmpPath;
                        shortestPathArray.push(tmpPath);
                    } else if (tmpPathCost <= shortestPathCost) {
                        shortestPathArray.push(tmpPath);
                    }
                }

            } else if (tmpType == 3) {

                // Falls das nächste kürzere Feld ein Berg ist, soll das Boot weg geworfen werden, sofern dies kostengünstiger ist!
                if (shortestPath == undefined) {
                    shortestPath = tmpPath;
                }
                let tmpPathCost = parseFloat(document.getElementById(tmpPath).getAttribute("cost")) * (1 - reduze) + parseFloat(document.getElementById(tmpPath).getAttribute("pathCost")) + heuristFunction(tmpPath);
                let shortestPathCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost")) + parseFloat(document.getElementById(shortestPath).getAttribute("pathCost")) + heuristFunction(shortestPath);
                if (tmpPathCost < shortestPathCost) {
                    shortestPath = tmpPath;
                    shortestPathArray.push(tmpPath);
                    document.getElementById(tmpPath).setAttribute("hasBoat", false.toString());
                    document.getElementById(tmpPath).setAttribute("throwBoat", true.toString());
                } else if (tmpPathCost <= shortestPathCost) {
                    shortestPathArray.push(tmpPath);
                    document.getElementById(tmpPath).setAttribute("hasBoat", false.toString());
                    document.getElementById(tmpPath).setAttribute("throwBoat", true.toString());
                }
            }



        }

        // Falls es mehrere Felder gibt, die eine gleichen Wert für die Entfernung vom Start+Wegkosten+Heuristische zur jetzigen Stelle hat, dann nehme man das Element, dass die kürzeste Diagonale zum Ziel hat!
        if (shortestPathArray.length > 1) {
            let shortDiagonale = undefined;
            for (let i = 0; i < shortestPathArray.length; i++) {
                let pos = shortestPathArray[i];
                if (shortDiagonale == undefined || heuristFunction(pos) < shortDiagonale) {
                    shortestPath = pos;
                }
            }
        }

        // Es konnte kein Feld gefunden werden! Möglicher Versuch ist es, dass alle noch offenen Felder die auf einen Berg führen ohne Boot (Boot wird abgeworfen) genommen werden!
        if (shortestPath === undefined) {
            console.error("Es konnte kein 'shortestPath' gefunden werden!");
            let alreadyChanged = true;
            for (let i = 0; i < openList.length; i++) {
                let id = openList[i];
                if (document.getElementById(id).getAttribute("hasBoat") === "true") {
                    alreadyChanged = false;
                    document.getElementById(id).setAttribute("hasBoat", false.toString());
                    document.getElementById(id).setAttribute("throwBoat", true.toString());
                }
            }


            if (alreadyChanged) {
                noSolutionFound();
                break;
            }
            return;
        } else { // Wenn shortestPath definiert ist, werden alle nicht mehr notwendigen Felder aus der openList entfernt


            // Entferne das Feld mit dem kürzesten Weg aus der OpenList, weil dieses erweitert wird
            openList = removeArrayElement(openList, shortestPath);

            if (document.getElementById(shortestPath).innerHTML !== "S") {
                document.getElementById(shortestPath).style.backgroundColor = color["searchField"];
            }

            // Füge das entfernte Feld (aus der openList) in die ClosedList
            closedList.push(shortestPath);

            /* Berechne die Schritte für die Zellen außenrum */

            let fieldsAround = getFieldsAround(shortestPath);

            // Feldkosten für das Feld davor
            let fieldCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost"));

            // Falls Boot abgelegt wurde, reduziert sich die Wegzeit
            if (document.getElementById(shortestPath).getAttribute("hasBoat").includes("false")) fieldCost = fieldCost * (1 - reduze);
            if (parents.get(shortestPath) != null) {
                let parentPath = shortestPath;
                fieldCost += parseFloat(document.getElementById(parentPath).getAttribute("pathCost"));
            }

            /* Setze für jedes Element, das um das ausgewählte Feld liegt, die Kosten */
            for (let i = 0; i < fieldsAround.length; i++) {
                let pos = fieldsAround[i];
                if (document.getElementById(pos).getAttribute("pathCost") == null || parseFloat(document.getElementById(pos).getAttribute("pathCost")) > fieldCost) {
                    let type = document.getElementById(pos).getAttribute("type");
                    setPathCosts(pos, fieldCost);

                    // Setze, dass das Boot abgelegt wurde, wenn Wasser überquert wurde oder das Feld zuvor schon kein Boot mehr hatte
                    if (type != 0 && document.getElementById(shortestPath).getAttribute("type") == 0 || document.getElementById(shortestPath).getAttribute("hasBoat") == "false") { setHasBoat(pos, false) }
                    openList.push(pos);
                    parents.set(pos, shortestPath);
                }

            }

            // Wartezeit zwischen den Suchschritten
            await Sleep(getSleepTime());

            /* Überprüfe, ob Ziel erreicht wurde. Falls ja, soll die Lösung angezeigt werden! */
            if (finished()) {
                openList = [];
                document.getElementById("showSolution").removeAttribute("hidden");
                await Sleep(250);
                showSolution();
            }
        }

    }
    /* Falls das Ziel nciht erreicht wurde und es keine offenen Felder mehr gibt, hat der Algorithmus keine Lösung gefunden! */
    if (!finished() && openList.length == 0) {
        noSolutionFound();
    }

}

// Liest den Wert für die Wartezeit beim Suchen aus
function getSleepTime() {
    return 1000 - document.querySelector("#time").value;
}

// Überprüft, ob das Ziel erreicht wurde
function finished() {
    if (document.getElementById(getEnd()).getAttribute("pathCost") != null) {
        return true;
    }
    return false;
}

// Setzt die Pfadkosten für die schon gelaufenen Felder (Wert ist ohne Heurisitische Funktion)
function setPathCosts(/*ID of field*/ pos, value) {
    if (document.getElementById(pos.toString()).getAttribute("pathCost") == null) {
        document.getElementById(pos.toString()).setAttribute("pathCost", value);
        document.getElementById(pos.toString()).setAttribute("title", value);
    }
}

// Setze, ob er das Boot hat oder nicht
function setHasBoat(/*ID of field*/ pos, value) {
    document.getElementById(pos.toString()).setAttribute("hasBoat", value);
}





// Gibt alle Felder zurück, die um das gegebene Feld liegen
function getFieldsAround(/*ID of field*/ pos) {
    let list = new Array();
    let posX = parseInt(pos.split(":")[0]);
    let posY = parseInt(pos.split(":")[1]);

    let newX = posX;
    let newY = posY - 1;
    let newPos = newX + ":" + newY;
    //up
    if (newX >= 0 && newY >= 0 && newX <= maxWidth && newY <= maxHeight && document.getElementById(newX + ":" + newY) != null) {
        list.push(newPos);
    }


    newX = posX;
    newY = posY + 1;
    newPos = newX + ":" + newY;
    //down
    if (newX >= 0 && newY >= 0 && newX <= maxWidth && newY <= maxHeight && document.getElementById(newX + ":" + newY) != null) {
        list.push(newPos);
    }


    newX = posX - 1;
    newY = posY;
    newPos = newX + ":" + newY;
    //left
    if (newX >= 0 && newY >= 0 && newX <= maxWidth && newY <= maxHeight && document.getElementById(newX + ":" + newY) != null) {
        list.push(newPos);
    }


    newX = posX + 1;
    newY = posY;
    newPos = newX + ":" + newY;
    //right
    if (newX >= 0 && newY >= 0 && newX <= maxWidth && newY <= maxHeight && document.getElementById(newX + ":" + newY) != null) {
        list.push(newPos);
    }
    return list;
}


// Gibt den Wert für die heuristische Funktion für die gegeben Position
function heuristFunction(pos) {
    let posX = parseInt(pos.split(":")[0]);
    let posY = parseInt(pos.split(":")[1]);

    if (getEnd() == null) return undefined;

    let endX = parseInt(getEnd().split(":")[0]);
    let endY = parseInt(getEnd().split(":")[1]);

    let diff = 0;

    diff += Math.abs(posX - endX);
    diff += Math.abs(posY - endY);



    return diff;
}




// Zeigt Lösung & Auswertung
function showSolution() {
    showPathTo(getEnd());
    showMoreDetails();
}

// Zeigt oder entfernt Suchbereich in der grafischen Oberfläche
function hideShowSearch() {
    for (let i = 0; i < closedList.length; i++) {
        let value = closedList[i];
        let element = document.getElementById(value);
        if (value != getStart() && !solutionPath.includes(value)) {
            if (showSearch) {
                element.style.backgroundColor = color["searchField"];
            } else {
                element.style.backgroundColor = color[element.getAttribute("type")];
            }

        }
        //await Sleep(1);
    }
    showSearch = !showSearch;

}


// Zeigt den Lösungweg des Algorithmus
async function showPathTo(endPos) {
    document.getElementById(getStart()).style.fontWeight = "bold";
    let current = endPos;
    let posThrowBoat = undefined;

    let way = new Array();
    while (current != getStart()) {
        way.push(current);
        if (document.getElementById(current).getAttribute("throwBoat") == "true") posThrowBoat = current;
        current = parents.get(current);
    }
    solutionFound();
    solutionPath = way;
    way.push(getStart());
    for (let i = way.length - 1; i >= 0; i--) {
        let field = way[i];
        if (field == endPos) {
            document.getElementById(field).style.backgroundColor = "darkred";
            document.getElementById(field).style.color = "white";
            // Boot weggeworfen                                         // Boot nicht mehr vorhanden (nach Wasser) und das Feld ist nicht das Ende!
        } else if (posThrowBoat !== undefined && field == posThrowBoat || i <= way.length - 2 && document.getElementById(way[i + 1]).getAttribute("type") == 0 && document.getElementById(field).getAttribute("type") != 0 && document.getElementById(field).getAttribute("hasBoat") == "false") {
            document.getElementById(field).style.backgroundColor = "blue";
            document.getElementById(field).style.color = "white";
        } else if (field != getStart()) {
            document.getElementById(field).style.backgroundColor = "red";
        }
        let sleep = 25;
        if (i <= 5) { sleep = 100; }
        await Sleep(sleep);
    }
    await Sleep(100);
    hideShowSearch();
    document.getElementById("showSolution").disabled = false;


}

// Nutzer kann Start und Ende festlegen. Hierführ wird diese Funktion verwendet
async function setStartOrEnd(id) {
    if (getStart() == null) {
        setStart(id);
        document.getElementById(getStart()).style.backgroundColor = "yellow";
        document.getElementById("resetbtn").disabled = false;
    } else if (getStart() == id) {
        alert("Das Ziel darf sich nicht auf dem Startfeld befinden!");
    } else if (getEnd() == null) {
        setEnd(id);
        document.getElementById(getStart()).style.backgroundColor = "yellow";
        await Sleep(100);
        init_grid(getStart(), getEnd());
    }

}


/* Übeprüfe die Notwendigkeit dieser Funktionen: */

//let hasBoat = true;

function calculatePathCosts(/*ID of field*/ pos) {
    return heuristFunction(pos);
}

// Returns the cost of the given field
function getCostOfField(pos) {
    return document.getElementById(pos).getAttribute("cost");
}
// Entfernt den Startpunkt aus dem Spielfeld
function removeStart() {
    displayGrid();
    setStart(null);
}

// Für Auswahl: Start und Ziel
// Zeigt die Auswahl, ob Start oder Ziel im Gride an
function displayOption(id, showOption) {
    let element = document.getElementById(id);
    // Wahr, wenn Maus auf Feld geht & // Falsch, wenn Maus das Feld verlässt
    if (showOption) {
        if (getStart() == null) {
            document.getElementById("grid").style.cursor = "pointer";
            element.style.backgroundColor = color["startBegin"];
            element.innerHTML = "S";
            element.style.textAlign = "center";
            element.style.fontWeight = "bold";
        } else if (getEnd() == null && id != getStart()) {
            document.getElementById("grid").style.cursor = "pointer";
            element.style.backgroundColor = color["endBegin"];
            element.innerHTML = "E";
            element.style.textAlign = "center";
            element.style.fontWeight = "bold";
        } else {
            document.getElementById("grid").style.cursor = "auto";
        }

    } else {
        // Feld nur ändern, wenn es nicht das Start-, Endfeld oder besuchte Felder (Closedlist) ist
        if (id != getStart() && id != getEnd() && !closedList.includes(id)) {
            let type = element.getAttribute("type");
            element.innerHTML = type;
            element.style.backgroundColor = color[type];
            element.style.textAlign = "";
            element.style.fontWeight = "";
        }
    }
}
