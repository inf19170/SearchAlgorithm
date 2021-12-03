// Für Benutzerfreundlichkeit: Suchgeschwindigkeit
// Fügt die ausgewählte Suchzeit in den localStorage, um beim neuladen die Informationen zu speichern!
function setSearchTimeToLocalStorage(){

    document.querySelector("#time").addEventListener ("input", function () {
        localStorage.setItem("searchTime", this.value);
    });

}



// Für Auswertung: Mehr Details
// Berechnet zusätzliche Informationen zu dem gelaufenen Grid
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


    let tmpType;

    while(current != getStart()){
        tmpType = document.getElementById(current).getAttribute("type");
        let tmpThrowBoat = document.getElementById(current).getAttribute("throwBoat");

        if(tmpThrowBoat == "true"){
            throwBoat = true;
            costs = document.getElementById(current).getAttribute("pathCost");
        }
        if(current != getEnd()){
            amount["all"] = amount["all"] + 1;
            amount[type[tmpType]] = amount[type[tmpType]] + 1;
        }
        current = parents.get(current);
    }

    // Durchlaufene Wege für Startfeld addieren
    tmpType = document.getElementById(getStart()).getAttribute("type");
    amount["all"] = amount["all"] + 1;
    amount[type[tmpType]] = amount[type[tmpType]] + 1;
    // Überprüfe, ob Boot direkt am Start weggeworfen wurde
    if(document.getElementById(getStart()).getAttribute("throwBoat") == "true"){
        throwBoat = true;
        costs = document.getElementById(getStart()).getAttribute("pathCost");
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
    if(roundFloat(diff, roundFactor) > 0){
        document.getElementById("diffRunnedCosts").innerHTML = ' -' + roundFloat(diff, roundFactor);
    }
    else {
    document.getElementById("diffRunnedCosts").innerHTML = roundFloat(diff, roundFactor);
    }

    console.log(throwBoat);
    console.log(document.getElementById(getEnd()).getAttribute("hasBoat"));
    console.log(document.getElementById(getEnd()).getAttribute("type"));

    // Wurde das Boot weggeworfen?
    if(throwBoat === true){
        document.getElementById("throwBoat").innerHTML = '<i class="fas fa-check"></i>';
        document.getElementById("throwBoat").setAttribute("style", "color: lightgreen");

        document.getElementById("usedBoat").innerHTML = '<i class="fas fa-times"></i>';
        document.getElementById("usedBoat").setAttribute("style", "color: rgb(255, 73, 73)");
    }else {

        document.getElementById("throwBoat").innerHTML = '<i class="fas fa-times"></i>';
        document.getElementById("throwBoat").setAttribute("style", "color: rgb(255, 73, 73)");

        if(document.getElementById(getEnd()).getAttribute("hasBoat") == "true" && document.getElementById(parents.get(getEnd()).toString()).getAttribute("type") == "0" || document.getElementById(getEnd()).getAttribute("hasBoat") == "false"){
            document.getElementById("usedBoat").innerHTML = '<i class="fas fa-check"></i>';
            document.getElementById("usedBoat").setAttribute("style", "color: lightgreen");

        }else{
            document.getElementById("usedBoat").innerHTML = '<i class="fas fa-times"></i>';
            document.getElementById("usedBoat").setAttribute("style", "color: rgb(255, 73, 73)");
        }


    }



}
