/**
 * design.js
 *
 * Funktionen für optische Effekte auf der Webseite
 *
 */

// Für Auswahl: Start und Ziel
// Zeigt die Auswahl, ob Start oder Ziel im Grid an
function displayOption(id, showOption) {
    let element = document.getElementById(id);
    // Wahr, wenn Maus auf Feld geht & // Falsch, wenn Maus das Feld verlässt
     if (showOption) {
        if (getStart() == null) {
            document.getElementById("grid").style.cursor = "pointer";
            element.style.backgroundColor = color["startBegin"];
            element.innerHTML = "S";
            element.style.textAlign = "center";
            element.style.textOverflow = "clip";
            element.style.fontWeight = "bold";
        } else if (getEnd() == null && id.toString() !== getStart().toString()) {
            document.getElementById("grid").style.cursor = "pointer";
            element.style.backgroundColor = color["endBegin"];
            element.innerHTML = "Z";
            element.style.textAlign = "center";
            element.style.textOverflow = "clip";
            element.style.fontWeight = "bold";
        } else {
            document.getElementById("grid").style.cursor = "auto";
        }

    } else {
        // Feld nur ändern, wenn es nicht das Start-, Endfeld oder besuchte Felder (closedList) ist
        if (getStart() === null || getEnd() === null && id.toString() !== getStart().toString() ||(id.toString() !== getStart().toString() && id.toString() !== getEnd().toString() && !closedList.includes(id))) {
            let type = element.getAttribute("type");
            element.innerHTML = type;
            element.style.backgroundColor = color[type];
            element.style.textAlign = "";
            element.style.fontWeight = "";
        }
    }

}


// Zeigt oder entfernt Suchbereich in der grafischen Oberfläche
function switchVisibilitySearchArea() {
    for (let i = 0; i < closedList.length; i++) {
        let value = closedList[i];
        let element = document.getElementById(value);
        if (value.toString() !== getStart().toString() && !solutionPath.includes(value)) {
            if (showSearch) {
                element.style.backgroundColor = color["searchField"];
            } else {
                element.style.backgroundColor = color[element.getAttribute("type")];
            }

        }
    }
    showSearch = !showSearch;

}

const color = {
    0:"#9bc2e6",
    1:"#c6efce",
    2:"#d6dce4",
    3:"#806000",
    4:"#548235",
    "startBegin":"yellow",
    "endBegin":"yellow",
    "endFinishedBackground":"darkred",
    "endFinishedText":"white",
    "posThrowBoatBackground":"blue",
    "posThrowBoatText":"white",
    "waySolution":"red",
    "searchField":"rgb(127,255,0)",
    "waiting":"#F3DC44",
    "check_mark": "lightgreen",
    "x-symbol":"rgb(255, 73, 73)"
}