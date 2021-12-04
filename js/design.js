/**
 * design.js
 *
 * Funktionen für optische Effekte auf der Webseite
 *
 */

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


// Zeigt oder entfernt Suchbereich in der grafischen Oberfläche
function switchVisibilitySearchArea() {
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
    }
    showSearch = !showSearch;

}
