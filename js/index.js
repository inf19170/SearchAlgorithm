/**
 * index.js
 *
 * Generelle Funktion(-en) für die es keine gesonderte Kategorie gibt
 *      - Window.onload - Function
 */
// Beim Starten der Seite soll das Grid auf der Seite platziert werden und die Wartezeit zwischen den einzelnen Suchschritten auf vorigen Wert angepasst werden
window.onload = function () {
    displayGrid();
    let time = localStorage.getItem("searchTime");
    if (time != null) {
        document.getElementById("time").setAttribute("value", time);
    }
    if (localStorage.getItem("debug") !== null && localStorage.getItem("debug").toString() === "true") randomPosition();
}


// initiiere openList, setze Pfadkosten für Start auf "0" und starte den Algorithmus
function init_algo() {
    setPathCosts(getStart(), 0);
    openList.push(getStart());
    document.getElementById("solutionTxt").innerHTML = '<h5>Suchvorgang läuft! <i class="far fa-clock"></i></h5>';
    document.getElementById("solutionTxt").setAttribute("style", "color: #F3DC44; animation-name: none;");
    document.getElementsByTagName("body")[0].style.cursor = "progress";
    displayDiffMilliseconds("...","...","...");
    startAlgorithmus();
}


// Gibt den Wert für die Wartezeit zwischen den Suchschritten zurück
function getSleepTime() {
    return 1000 - document.querySelector("#time").value;
}


// Nutzer kann selber Start- und Zielfeld festlegen.
async function setStartAndEnd(id) {
    if (getStart() == null) {
        setStart(id);
        document.getElementById(getStart()).style.textAlign = "center";
        document.getElementById("startPoint").innerHTML = '<i style="color: lightgreen" class="fas fa-check"></i> ' + document.getElementById("startPoint").innerHTML;
        document.getElementById("startSelect").innerHTML = symbols[document.getElementById(getStart()).getAttribute("type")] + ' [' + getStart() + ']';
        document.getElementById(getStart()).style.backgroundColor = "yellow";
        document.getElementById("resetbtn").disabled = false;
        document.getElementById(getStart()).setAttribute("title", FieldDescriptionToString(getStart().toString(), undefined, 0, undefined).toString());
    } else if (getStart().toString() === id.toString() && getEnd() === null) {
        alert("Das Ziel darf sich nicht auf dem Startfeld befinden!");
    } else if (getEnd() == null) {
        setEnd(id);
        document.getElementById(getEnd()).setAttribute("title", FieldDescriptionToString(getEnd().toString(), undefined, undefined, undefined).toString());
        document.getElementById(getStart()).setAttribute("title", FieldDescriptionToString(getStart().toString(), undefined, 0, undefined).toString());
        document.getElementById(getEnd()).style.textAlign = "center";
        document.getElementById("endPoint").innerHTML = '<i style="color: lightgreen" class="fas fa-check"></i> ' + document.getElementById("endPoint").innerHTML;
        document.getElementById("endSelect").innerHTML = symbols[document.getElementById(getEnd()).getAttribute("type")] + ' [' + getEnd() + '] ';
        document.getElementById(getStart()).style.backgroundColor = "yellow";
        await Sleep(100);
        init_algo();
    }

}


// Zeigt Lösung & Auswertung
function showSolution() {
    document.getElementById("showSolution").removeAttribute("hidden");
    solutionFound();
    showMoreDetails();
}
// Es wurde KEINE Lösung gefunden
function noSolutionFound() {
    document.getElementsByTagName("body")[0].style.cursor = "auto";
    document.getElementById("solutionTxt").setAttribute("style", "border: outset 3px; border-color: darkred; margin-bottom: 10px; background-color: #b60c00; text-align: center; color: white; animation-name: none;");
    document.getElementById("solutionTxt").innerHTML = '<h5>Suche nicht erfolgreich!&ensp;<i style ="color: black" class="fas fa-exclamation-triangle"></i></h5>';
    document.getElementById("showSolution").checked = "checked";
    document.getElementById("showSolution").disabled = false;
}

// Es wurde eine Lösung gefunden
function solutionFound() {
    document.getElementsByTagName("body")[0].style.cursor = "auto";
    document.getElementById("solutionTxt").setAttribute("style", "border: outset 3px; border-color: darkgreen; margin-bottom: 10px; background-color: green; text-align: center; color: white; animation-name: none;");
    document.getElementById("solutionTxt").innerHTML = '<h5>Suche erfolgreich!&ensp;<i class="fas fa-check"></i></h5>';
    showPathTo(getEnd());
}

// Zeigt den Lösungsweg von Start zum angegeben Feld
// Hier: Zielfeld
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
        if (i <= 5) {
            sleep = 100;
        }
        await Sleep(sleep);
    }
    await Sleep(100);
    switchVisibilitySearchArea();
    document.getElementById("showSolution").disabled = false;


}



