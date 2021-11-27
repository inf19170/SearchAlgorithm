/*
Mit Mausklick Start & Ziel definieren mit Reset-Button

An der Seite folgende Merkmale aufgelistet:

Anzahl Felder durchlaufen

Anzahl Kosten durchlaufen

Boot genutzt? Ja / Nein

{EVENTUELL NICHT ERFORDERLICH: Zeilen und Spalten der Felder nummerieren (wie Schachbrett, Excel-Tabelle, ..}

In GRÜN alle Felder NACHEINANDER markieren lassen, welche mitberücksichtigt werden. Anschließend in ROT den tatsächlich gewählten Weg

Eventuell nicht Endergebnis direkt aufzeigen, sondern den gelaufenen Feldweg Schritt für Schritt rot markieren

Button, um grüne Felder nach Abschluss des A*-Algorithmus zu aktivieren/deaktivieren

Das gleiche für roten Pfad

BONUS: Zeitstrahl (als X-Achse) mit Scroll-Funktion, dass man den ganzen Suchverlauf chronologisch sehen kann

Nach Beendigung des Durchlaufens, grüne Felder deaktivieren



* */

function displayTime(){

    document.querySelector("#time").addEventListener ("input", function () {
        document.getElementById("outputTime").innerHTML = (1000-parseFloat(this.value)).toString();
    });

}

// Zeigt die Auswahl, ob Start oder Ziel definiert werden soll.
function displayOption(id, showOption){
    let element = document.getElementById(id);
    if(showOption){
        if(getStart() == null){
            element.style.backgroundColor = color["startBegin"];
            element.innerHTML = "S";
        }else if(getEnd() == null){
            element.style.backgroundColor = color["endBegin"];
            element.innerHTML = "E";
        }

    }else{
        if(id != getStart() && id != getEnd() && !closedList.includes(id)){
            let type = element.getAttribute("type")
            element.innerHTML = type;
            element.style.backgroundColor = color[type];
        }
   }

}

function showMoreDetails(){

    // Display gelaufene Felder
    let current = getEnd();

    let amount = {
        "all":0,
        "forest":0,
        "river":0,
        "mountain":0,
        "way":0,
        "flat":0,
    };
    while(current != getStart()){
        let tmpType = document.getElementById(current).getAttribute("type");
        //console.log(tmpType);
        //console.log(type[tmpType]);
        amount["all"] = amount["all"] + 1;
        amount[type[tmpType]] = amount[type[tmpType]] + 1;
        current = parents.get(current);
    }
    document.getElementById("runnedFields").innerHTML = amount["all"].toString();
    document.getElementById("runnedFieldsFlat").innerHTML = amount["flat"].toString();
    document.getElementById("runnedFieldsRiver").innerHTML = amount["river"].toString();
    document.getElementById("runnedFieldsForest").innerHTML = amount["forest"].toString();
    document.getElementById("runnedFieldsMountain").innerHTML = amount["mountain"].toString();
    document.getElementById("runnedFieldsWay").innerHTML = amount["way"].toString();
    //console.log(amount);

    // Zeitkosten darstellen
    document.getElementById("runnedCosts").innerHTML = roundFloat(parseFloat(document.getElementById(getEnd()).getAttribute("pathCost")), 3);
    if(document.getElementById(getEnd()).getAttribute("hasBoat") == "true" && document.getElementById(getEnd()).getAttribute("type") != "0"){
        document.getElementById("usedBoat").innerHTML = "nein";
    }else{
        document.getElementById("usedBoat").innerHTML = "ja";
    }
}