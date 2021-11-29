// Für Benutzerfreundlichkeit: Suchgeschwindigkeit
// Fügt die ausgewählte Suchzeit in den localStorage, um beim neuladen die Informationen zu speichern!
function setSearchTimeToLocalStorage(){

    document.querySelector("#time").addEventListener ("input", function () {
        localStorage.setItem("searchTime", this.value);
    });

}

// Für Auswahl: Start und Ziel
// Zeigt die Auswahl, ob Start oder Ziel im Gride an
function displayOption(id, showOption){
    let element = document.getElementById(id);
    // Wahr, wenn Maus auf Feld geht & // Falsch, wenn Maus das Feld verlässt
    if(showOption){
        if(getStart() == null){
            element.style.backgroundColor = color["startBegin"];
            element.innerHTML = "S";
            element.style.textAlign = "center";
            element.style.fontWeight = "bold";
        }else if(getEnd() == null){
            element.style.backgroundColor = color["endBegin"];
            element.innerHTML = "E";
            element.style.textAlign = "center";
            element.style.fontWeight = "bold";
        }

    }else{
        // Feld nur ändern, wenn es nicht das Start-, Endfeld oder besuchte Felder (Closedlist) ist
        if(id != getStart() && id != getEnd() && !closedList.includes(id)){
            let type = element.getAttribute("type");
            element.innerHTML = type;
            element.style.backgroundColor = color[type];
            element.style.textAlign = "";
            element.style.fontWeight = "";
        }
   }

}

// Für Auswertung: Mehr Details
// Berechnet zusätzliche Informationen zu dem gelaufenen Gride
function showMoreDetails(){
  // Display gelaufene Felder
    let current = getEnd(); // Weg wird von Ende zum Start zurück verfolgt
    let throwBoat = false; // Wurde das Boot auf dem Weg weggeworfen?

    let amount = {
        "all":0,
        "forest":0,
        "river":0,
        "mountain":0,
        "way":0,
        "flat":0,
    };
    let costs = 0; // Kosten, die bis zum Wegwerfen des Bootes entstanden sind
    while(current != getStart()){
        let tmpType = document.getElementById(current).getAttribute("type");
        let tmpThrowBoat = document.getElementById(current).getAttribute("throwBoat");

        if(tmpThrowBoat == "true"){
            throwBoat = true;
            costs = document.getElementById(current).getAttribute("pathCost");
        }

        amount["all"] = amount["all"] + 1;
        amount[type[tmpType]] = amount[type[tmpType]] + 1;
        current = parents.get(current);
    }


    // Feldkosten anzeigen lassen
    document.getElementById("runnedFields").innerHTML = amount["all"].toString();
    document.getElementById("runnedFieldsFlat").innerHTML = amount["flat"].toString();
    document.getElementById("runnedFieldsRiver").innerHTML = amount["river"].toString();
    document.getElementById("runnedFieldsForest").innerHTML = amount["forest"].toString();
    document.getElementById("runnedFieldsMountain").innerHTML = amount["mountain"].toString();
    document.getElementById("runnedFieldsWay").innerHTML = amount["way"].toString();


    // Zeitkosten darstellen
    let roundFactor = 3; // Nachkommastelle zu dem die Zeitkosten gerundert werden sollen

    // Gelaufene Zeitkosten
    let runnedCosts = roundFloat(parseFloat(document.getElementById(getEnd()).getAttribute("pathCost")), roundFactor);
    document.getElementById("runnedCosts").innerHTML = runnedCosts;

    // Gelaufene Zeitkosten, wenn Boot direkt zu Anfang weggeworfen wurde
    let lowerRunnedCosts = roundFloat(parseFloat(document.getElementById(getEnd()).getAttribute("pathCost"))-costs +costs*(1-reduze), roundFactor);
    document.getElementById("lowerRunnedCosts").innerHTML = lowerRunnedCosts;

    let diff = runnedCosts -lowerRunnedCosts;
    document.getElementById("diffRunnedCosts").innerHTML = roundFloat(diff, roundFactor);


    // Wurde ein Fluss überquert
    if(throwBoat == true || document.getElementById(getEnd()).getAttribute("hasBoat") == "true" && document.getElementById(getEnd()).getAttribute("type") != "0"){
        document.getElementById("usedBoat").innerHTML = '<i class="fas fa-times"></i>';
        document.getElementById("usedBoat").setAttribute("style", "color: rgb(255, 73, 73)");
    }else{
        document.getElementById("usedBoat").innerHTML = '<i class="fas fa-check"></i>';
        document.getElementById("usedBoat").setAttribute("style", "color: lightgreen");
    }

    // Wurde das Boot weggeworfen
    if(throwBoat == true){
        document.getElementById("throwBoat").innerHTML = '<i class="fas fa-check"></i>';
        document.getElementById("throwBoat").setAttribute("style", "color: lightgreen");
    }else{
        document.getElementById("throwBoat").innerHTML = '<i class="fas fa-times"></i>';
        document.getElementById("throwBoat").setAttribute("style", "color: rgb(255, 73, 73)");
    }

}
