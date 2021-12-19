/**
 * extraFunc.js
 *
 * Funktionen die extra Funktionalitäten bieten:
 *      - Auswertung des Weges
 *      - Dauer des Algorithmus bis der Algorithmus beendet wurde
 *      - Algorithmus pausieren
 */


// Für Benutzerfreundlichkeit: Suchgeschwindigkeit
// Fügt die ausgewählte Suchzeit in den localStorage, um beim neu laden die Informationen zu speichern!
function setSearchTimeToLocalStorage() {

    document.querySelector("#time").addEventListener("input", function () {
        localStorage.setItem("searchTime", this.value);
    });

}


// Für Auswertung: Mehr Details
// berechnet zusätzliche Informationen zu dem gelaufenen Pfad
function showMoreDetails() {
    // Display gelaufene Felder
    let current = getEnd(); // Weg wird von Ende zum Start zurück verfolgt
    let throwBoat = false; // Wurde das Boot auf dem Weg weggeworfen?
    let posLostBoat = undefined;
    let amount = {
        "all": 0,
        "forest": 0,
        "water": 0,
        "mountain": 0,
        "way": 0,
        "meadow": 0,
    };
    let costs = 0; // Kosten, die bis zum Wegwerfen des Bootes entstanden sind


    while (current.toString() !== getStart().toString()) {
        let tmpType = document.getElementById(current).getAttribute("type");
        let tmpThrowBoat = document.getElementById(current).getAttribute("throwBoat");
        let hasBoat = document.getElementById(current).getAttribute("hasBoat");

        if (tmpThrowBoat.toString() === "true") {
            throwBoat = true;
            posLostBoat = current;
            costs = document.getElementById(current).getAttribute("pathCost");
        }

        if (throwBoat === false && hasBoat.toString() === "false") {
            posLostBoat = current;
        }

        if (current.toString() !== getEnd()) {
            amount["all"] = amount["all"] + 1;
            amount[type[tmpType]] = amount[type[tmpType]] + 1;
        }
        current = parents.get(current);
    }
    // Durchlaufene Wege für Startfeld addieren
    let tmpType = document.getElementById(getStart()).getAttribute("type");
    amount["all"] = amount["all"] + 1;
    amount[type[tmpType]] = amount[type[tmpType]] + 1;
    // Überprüfe, ob Boot direkt am Start weggeworfen wurde
    if (document.getElementById(getStart()).getAttribute("throwBoat").toString() === "true") {
        throwBoat = true;
        posLostBoat = current;
        costs = document.getElementById(getStart()).getAttribute("pathCost");
    }


    // Feldkosten anzeigen lassen
    document.getElementById("runnedFieldsTotal").innerHTML = amount["all"].toString();
    document.getElementById("runnedFieldsFlat").innerHTML = amount["meadow"].toString();
    document.getElementById("runnedFieldsRiver").innerHTML = amount["water"].toString();
    document.getElementById("runnedFieldsForest").innerHTML = amount["forest"].toString();
    document.getElementById("runnedFieldsMountain").innerHTML = amount["mountain"].toString();
    document.getElementById("runnedFieldsWay").innerHTML = amount["way"].toString();


    // Zeitkosten darstellen
    let roundFactor = 3; // Nachkommastelle zu dem die Zeitkosten gerundert werden sollen

    // Gelaufene Zeitkosten
    let runnedCosts = roundFloat(parseFloat(document.getElementById(getEnd()).getAttribute("pathCost")), roundFactor);
    document.getElementById("runnedCosts").innerHTML = runnedCosts;

    // Gelaufene Zeitkosten, wenn Boot direkt zu Anfang weggeworfen wurde
    let lowerRunnedCosts = roundFloat(parseFloat(document.getElementById(getEnd()).getAttribute("pathCost")) - costs + costs * (1 - reduction), roundFactor);
    document.getElementById("lowerRunnedCosts").innerHTML = lowerRunnedCosts;

    let diff = runnedCosts - lowerRunnedCosts;
    if (roundFloat(diff, roundFactor) > 0) {
        document.getElementById("diffRunnedCosts").innerHTML = ' -' + roundFloat(diff, roundFactor);
    } else {
        document.getElementById("diffRunnedCosts").innerHTML = roundFloat(diff, roundFactor);
    }

    // Wurde das Boot weggeworfen?
    if (throwBoat === true) {
        document.getElementById("throwBoat").innerHTML = '<i class="fas fa-check" id="throwBoatSymbol"></i> ' + "[" + posLostBoat + "]";
        document.getElementById("throwBoatSymbol").setAttribute("style", "color: lightgreen");

        document.getElementById("usedBoat").innerHTML = '<i class="fas fa-times"></i>';
        document.getElementById("usedBoat").setAttribute("style", "color: rgb(255, 73, 73)");
    } else {

        document.getElementById("throwBoat").innerHTML = '<i class="fas fa-times"></i>';
        document.getElementById("throwBoat").setAttribute("style", "color: rgb(255, 73, 73)");

        if (document.getElementById(getEnd()).getAttribute("hasBoat").toString() === "true" && document.getElementById(parents.get(getEnd()).toString()).getAttribute("type").toString() === "0" || document.getElementById(getEnd()).getAttribute("hasBoat").toString() === "false") {
            document.getElementById("usedBoat").innerHTML = '<i class="fas fa-check" id="usedBoatSymbol"></i> '
            if (posLostBoat !== undefined || document.getElementById(getEnd().toString()).getAttribute("type").toString() !== "0" && posLostBoat.toString() === getEnd()) {
                document.getElementById("usedBoat").innerHTML += "[" + posLostBoat + "]";
            }
            document.getElementById("usedBoatSymbol").setAttribute("style", "color: lightgreen");

        } else {
            document.getElementById("usedBoat").innerHTML = '<i class="fas fa-times"></i>';
            document.getElementById("usedBoat").setAttribute("style", "color: rgb(255, 73, 73)");
        }


    }


}


function changePause(){
    pauseAlgo = !pauseAlgo;
}

function setPause(){
    document.addEventListener("keypress", function(event){
        let code = event.code;
        if(code.toString() === "KeyP"){
            changePause();
        }
    });

}
