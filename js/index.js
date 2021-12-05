// Beim Starten der Seite soll das Gride auf der Seite platziert werden und die Suchzeit auf vorigen Wert angepasst werden
window.onload = function () {
    displayGrid();
    let time = localStorage.getItem("searchTime");
    if (time != null) {
        document.getElementById("time").setAttribute("value", time);
    }
}


// initiiere openList, setze Pfadkosten für Start auf "0" und starte den Algorithmus
function init_algo() {
    setPathCosts(getStart(), 0);
    openList.push(getStart());
    document.getElementById("solutionTxt").innerHTML = 'Suchvorgang läuft! <i class="far fa-clock"></i>';
    document.getElementById("solutionTxt").setAttribute("style", "color: #F3DC44");
    document.getElementsByTagName("body")[0].style.cursor = "progress";
    startAlgorithmus();
}



// Gibt den Wert für die Wartezeit bei den Suchschritten aus
function getSleepTime() {
    return 1000 - document.querySelector("#time").value;
}




// Gibt den Wert für die heuristische Funktion für die gegeben Position
function heuristFunction(pos) {
    // Heuristische Funktion kann nur verwendet werden, wenn "Ende" definiert ist!
    if (getEnd() == null) return undefined;

    let posX = parseInt(pos.split(":")[0]);
    let posY = parseInt(pos.split(":")[1]);
    let endX = parseInt(getEnd().split(":")[0]);
    let endY = parseInt(getEnd().split(":")[1]);

    let diff = 0;
    diff += Math.abs(posX - endX);
    diff += Math.abs(posY - endY);
    return diff;
}


// Zeigt Lösung & Auswertung
function showSolution() {
    solutionFound();
    showMoreDetails();
}



// Zeigt den Lösungweg des Algorithmus
async function showPathTo(endPos) {
    let current = endPos;
    let posThrowBoat = undefined;

    // Speichern des Weges in ein Array
    let way = [];
    while (current.toString() !== getStart().toString()) {
        way.push(current);
        if (document.getElementById(current).getAttribute("throwBoat").toString() === "true") posThrowBoat = current;
        current = parents.get(current);
    }
    way.push(getStart());

    solutionPath = way;

    // Lösungsweg einfärben
    document.getElementById(getStart()).style.fontWeight = "bold";
    for (let i = way.length - 1; i >= 0; i--) {
        let field = way[i];
        //TODO Optimierte Abfragen! Ggf. Switch-Case
        if (field.toString() === endPos.toString()) {
            document.getElementById(field).style.backgroundColor = "darkred";
            document.getElementById(field).style.color = "white";

            // Feld bei dem das Boot nicht mehr vorhanden ist, wird anders eingefärbt
        } else if (posThrowBoat !== undefined && field.toString() === posThrowBoat.toString() || i <= way.length - 2 && document.getElementById(way[i + 1]).getAttribute("type").toString() === "0" && document.getElementById(field).getAttribute("type").toString() !== "0" && document.getElementById(field).getAttribute("hasBoat").toString() === "false") {
            document.getElementById(field).style.backgroundColor = "blue";
            document.getElementById(field).style.color = "white";
        } else if (field.toString() !== getStart().toString()) {
            document.getElementById(field).style.backgroundColor = "red";
        }
        let sleep = 25;

        // Die letzten 5 Felder des Weges werden langsamer angezeigt
        if (i <= 5) { sleep = 100; }
        await Sleep(sleep);
    }
    await Sleep(100);
    switchVisibilitySearchArea();
    document.getElementById("showSolution").disabled = false;


}

// Nutzer kann Start und Ende festlegen. Hierfür wird diese Funktion verwendet
async function setStartAndEnd(id) {
    if (getStart() == null) {
        setStart(id);
        document.getElementById(getStart()).style.textAlign = "center";
        document.getElementById("startPoint").innerHTML = '<i style="color: lightgreen" class="fas fa-check"></i> ' + document.getElementById("startPoint").innerHTML;
        document.getElementById("startSelect").innerHTML = symbols[document.getElementById(getStart()).getAttribute("type")] + ' [' + getStart() + ']';
        document.getElementById(getStart()).style.backgroundColor = "yellow";
        document.getElementById("resetbtn").disabled = false;
    } else if (getStart().toString() === id.toString()) {
        alert("Das Ziel darf sich nicht auf dem Startfeld befinden!");
    } else if (getEnd() == null) {
        setEnd(id);
        document.getElementById(getEnd()).style.textAlign = "center";
        document.getElementById("endPoint").innerHTML = '<i style="color: lightgreen" class="fas fa-check"></i> ' + document.getElementById("endPoint").innerHTML;
        document.getElementById("endSelect").innerHTML = symbols[document.getElementById(getEnd()).getAttribute("type")] + ' [' + getEnd() + '] ';
        document.getElementById(getStart()).style.backgroundColor = "yellow";
        await Sleep(100);
        init_algo();
    }

}

// Es wurde KEINE Lösung gefunden
function noSolutionFound() {
    document.getElementsByTagName("body")[0].style.cursor = "auto";
    document.getElementById("solutionTxt").setAttribute("style", "border: outset 3px; border-color: darkred; margin-bottom: 10px; background-color: #b60c00; text-align: center;");
    document.getElementById("solutionTxt").innerHTML = '<h5>Suche nicht erfolgreich!&ensp;<i style ="color: black" class="fas fa-exclamation-triangle"></i></h5>';
    document.getElementById("showSolution").checked = "checked";
    document.getElementById("showSolution").disabled = false;
}
// Es wurde EINE Lösung gefunden
function solutionFound() {
    document.getElementsByTagName("body")[0].style.cursor = "auto";
    document.getElementById("solutionTxt").setAttribute("style", "border: outset 3px; border-color: darkgreen; margin-bottom: 10px; background-color: green; text-align: center;");
    document.getElementById("solutionTxt").innerHTML = '<h5>Suche erfolgreich!&ensp;<i class="fas fa-check"></i></h5>';
    showPathTo(getEnd());
}


/* Übeprüfe die Notwendigkeit dieser Funktionen: */

// Returns the cost of the given field
function getFieldCosts(pos) {
    return document.getElementById(pos).getAttribute("cost");
}
