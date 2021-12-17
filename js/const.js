const highestValue = 4; // Gibt die höchste Nummer der Felder an 4 --> Wald. Erhöhen, falls es Felder mit höhere Wertigkeit gibt

const reduction = 0.1; // Wert, um wie viel die Wegkosten gesenkt werden, wenn das Boot nicht mehr getragen wird

// Erstellt individuell für jedes Feld den Titel (Text, der beim Maus-Hovern erscheint)
function FieldDescriptionToString(cords, fieldType, pathCosts, boat) {
    const fieldDescription = "[cords]\n[type]\n[costs]\n[pathCosts]\n[heuristic]\n[boat]";

    if (fieldType === undefined) fieldType = document.getElementById(cords).getAttribute("type");

    let fieldCosts = cost[fieldType];


    let description = fieldDescription.replace("[cords]", "Position: [" + cords + "]");
    description = description.replace("[type]", "Feldtyp: " + typeGerman[fieldType]);
    if (pathCosts !== null) {
        description = description.replace("[pathCosts]", "Pfadkosten: " + pathCosts + " ZE");
    } else {
        description = description.replace("[pathCosts]", "Pfadkosten: - ZE");
    }
    if (boat !== null || boat === undefined) {
        if (boat === undefined) boat = document.getElementById(cords).getAttribute("hasBoat");
        boat = boat.toString();
        if (boat === "true") {
            description = description.replace("[boat]", "Boot vorhanden: Ja");
            fieldCosts = fieldCosts + " ZE";
        } else if (boat === "false") {
            description = description.replace("[boat]", "Boot vorhanden: Nein");
            fieldCosts = (1 - reduction) * fieldCosts + " ZE (red.)";
        }
    } else {
        description = description.replace("[boat]", "Boot vorhanden: -");
        fieldCosts = fieldCosts + " ZE";
    }
    description = description.replace("[costs]", "Feldkosten: " + fieldCosts);
    let heuristic = heuristFunction(cords);
    if (heuristic === undefined) heuristic = "undefiniert";
    description = description.replace("[heuristic]", "Heuristische Funk.: " + heuristic);
    return description;
}

const type = {
    0: "water",
    1: "meadow",
    2: "way",
    3: "mountain",
    4: "forest"
}
// Übersetzung der Feldbezeichnungen
const typeGerman = {
    0: "Wasser",
    1: "Wiese",
    2: "Weg",
    3: "Berg",
    4: "Wald"
}

// Kosten für die Feldtypen
const cost = {
    0: 5,
    1: 3,
    2: 2,
    3: 20,
    4: 11
}

// Farbcodes für Feldtypen sowie für Start- & Ziel- oder Such-Feld
const color = {
    0: "#9bc2e6",
    1: "#c6efce",
    2: "#d6dce4",
    3: "#806000",
    4: "#548235",
    "startBegin": "yellow",
    "endBegin": "yellow",
    "searchField": "rgb(127,255,0)",
    "openList": "pink"

}
// Symbole für die einzelnen Feldtypen
const symbols = {
    0: "<i class=\"fas fa-water\"></i>",
    1: "<i class=\"fas fa-hiking\"></i>",
    2: "<i class=\"fas fa-road\"></i>",
    3: "<i class=\"fas fa-mountain\"></i>",
    4: "<i class=\"fas fa-tree\"></i>"

}

// Mit dieser Variable kann das Spielfeld angepasst oder geändert werden
const data =
    "1;1;1;1;4;4;4;4;1;1;1;1;1;1;1;1;1;1;1;1;1;1;4;4;1;1;1;1;3;3;3;3;0;0;4;1;1;1;1;1\n" +
    "1;1;1;4;4;4;4;4;4;1;1;1;1;1;1;1;1;1;1;1;1;4;4;4;4;1;1;1;3;3;0;0;0;4;4;1;1;1;1;1\n" +
    "1;1;1;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;1;3;0;0;0;3;4;4;4;1;1;1;1;1\n" +
    "1;1;1;2;4;4;4;4;4;2;4;4;1;1;1;1;1;1;1;1;1;4;4;4;4;2;0;0;0;3;3;3;4;4;4;1;1;1;1;1\n" +
    "1;1;1;2;4;0;0;0;4;2;4;4;1;1;1;1;1;0;0;0;0;3;4;3;0;2;0;3;3;3;3;3;3;4;4;1;1;1;1;1\n" +
    "1;1;1;2;4;0;0;0;0;2;4;4;1;1;1;1;0;0;0;0;0;0;3;0;0;2;0;0;3;3;3;3;4;4;1;1;1;1;1;1\n" +
    "1;1;1;2;4;4;0;0;0;2;4;4;1;1;1;0;0;0;4;1;0;0;0;0;4;2;0;0;3;3;3;4;4;1;1;1;1;1;1;1\n" +
    "1;1;1;2;4;4;4;0;4;4;4;4;1;1;0;0;0;4;4;4;1;0;0;4;4;2;0;0;0;3;3;4;4;1;1;3;3;1;1;1\n" +
    "1;1;1;2;4;1;4;4;4;4;4;1;1;0;0;0;1;1;4;1;1;1;4;4;2;2;3;0;0;3;3;3;4;4;1;3;3;1;1;1\n" +
    "1;1;4;2;4;1;1;4;1;4;1;1;0;0;0;0;1;1;1;1;1;1;1;4;2;4;3;0;0;3;3;3;3;3;3;3;3;3;3;3\n" +
    "1;1;4;2;4;4;1;1;1;1;0;0;0;0;1;1;1;1;1;1;1;1;1;1;2;4;4;0;0;3;3;3;3;3;3;3;3;3;3;3\n" +
    "1;4;4;2;4;4;4;1;4;1;0;0;0;1;1;1;1;1;1;1;1;1;1;1;2;4;4;0;0;3;3;3;3;3;3;3;3;3;3;3\n" +
    "4;4;4;2;4;4;4;4;4;0;0;4;4;4;1;1;1;1;1;1;1;1;1;1;2;4;4;0;0;0;3;3;3;3;3;3;3;3;3;3\n" +
    "4;4;4;2;4;4;4;4;4;0;0;4;4;4;1;1;1;1;1;1;1;1;1;1;2;4;1;1;0;0;4;3;3;3;3;3;4;4;3;3\n" +
    "4;4;4;2;4;4;4;4;4;0;4;4;4;4;1;1;1;1;1;1;1;1;1;1;2;4;4;1;0;0;4;4;3;3;3;3;4;4;3;3\n" +
    "4;4;4;2;4;4;4;1;0;0;4;4;4;4;1;1;1;1;1;1;1;1;1;1;2;4;4;1;0;0;4;4;3;3;3;4;4;3;3;3\n" +
    "4;4;4;2;4;4;4;0;0;4;4;4;4;1;1;1;1;1;1;1;1;4;4;1;2;4;4;1;1;0;0;0;4;3;3;3;3;3;3;3\n" +
    "4;4;4;2;4;4;4;0;0;4;4;1;1;1;4;4;1;1;1;1;4;4;4;1;2;4;4;4;4;1;0;0;0;4;4;4;4;3;3;3\n" +
    "4;4;4;2;4;4;4;0;4;4;4;4;1;4;4;4;4;4;1;4;4;4;4;4;2;4;4;4;4;4;1;0;0;0;4;3;3;3;3;3\n" +
    "4;4;4;2;4;4;0;0;4;4;4;4;1;4;4;4;4;1;1;1;4;4;4;1;2;4;4;4;4;4;4;1;0;0;4;4;3;3;3;3\n" +
    "4;4;4;2;4;4;0;0;4;4;4;4;1;4;4;4;4;1;1;1;1;4;4;1;2;4;4;4;4;1;4;1;1;0;0;4;3;3;3;3\n" +
    "4;4;4;2;4;4;0;0;1;4;4;4;4;4;4;4;3;3;1;1;1;1;1;1;2;4;4;4;4;1;1;1;1;0;0;0;3;3;3;0\n" +
    "4;4;4;2;4;4;0;0;1;4;4;4;4;4;4;4;3;3;3;1;1;1;1;1;2;4;4;4;4;1;1;1;1;4;0;0;3;3;0;0\n" +
    "1;4;4;2;4;4;0;0;1;4;4;3;3;3;3;3;3;3;3;3;1;1;1;1;2;4;4;4;4;1;1;1;4;4;2;0;0;0;0;0\n" +
    "1;1;4;2;4;4;0;0;4;4;4;3;3;3;3;3;3;3;3;3;1;1;1;1;2;4;4;4;4;1;1;1;4;4;2;0;0;0;0;3\n" +
    "1;1;1;2;4;4;0;0;4;3;3;3;3;4;1;3;3;3;3;3;1;1;1;1;2;1;4;4;4;4;1;1;1;4;2;4;0;0;0;3\n" +
    "1;1;1;2;1;1;0;0;3;3;3;3;4;4;1;1;3;3;3;3;1;1;1;1;2;1;4;4;4;4;4;1;1;1;2;1;1;1;3;3\n" +
    "1;1;1;2;1;0;0;0;3;3;3;3;4;1;1;1;3;3;3;3;1;1;1;1;2;1;1;4;4;4;1;1;1;1;2;1;1;3;3;3\n" +
    "1;1;1;2;1;0;0;3;3;3;3;3;3;3;1;1;4;4;3;3;3;1;1;1;2;1;1;1;1;1;1;1;1;1;2;1;1;3;3;3\n" +
    "1;1;1;2;1;0;0;3;3;3;3;3;3;3;3;3;4;4;3;3;3;4;1;1;2;1;1;1;1;1;1;1;1;1;2;1;1;1;3;3\n" +
    "1;1;1;2;1;0;0;0;3;3;3;3;3;3;3;3;3;4;4;3;3;4;1;1;2;1;1;1;1;1;1;1;1;1;2;1;1;1;1;3\n" +
    "1;1;1;2;1;1;0;0;0;3;3;4;4;4;4;3;3;4;4;3;3;4;4;1;2;1;1;1;1;1;1;1;1;1;2;1;1;1;1;3\n" +
    "1;1;1;2;1;1;0;0;0;4;3;4;4;4;4;3;3;4;4;3;3;4;4;1;2;1;1;1;1;1;1;1;1;1;2;1;1;1;1;1\n" +
    "1;1;1;2;1;1;4;0;0;0;4;4;4;4;4;3;3;4;4;3;3;3;4;1;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2;2\n" +
    "1;1;1;2;1;1;4;4;0;0;4;4;4;4;3;3;3;3;3;3;3;3;4;4;2;4;1;1;1;1;1;1;1;1;1;1;1;1;1;1\n" +
    "1;1;1;2;1;4;4;4;0;0;0;4;4;3;3;3;3;3;3;3;3;3;3;4;2;4;4;1;1;1;1;1;1;1;1;1;1;1;1;1\n" +
    "1;1;1;2;1;4;4;4;4;0;0;4;3;3;3;3;3;3;3;3;3;3;3;4;2;4;4;4;1;1;1;1;1;1;1;1;1;1;1;1\n" +
    "4;4;1;2;2;4;4;4;4;0;0;0;3;3;3;3;3;3;3;3;3;3;3;4;2;1;4;4;1;1;1;1;1;1;1;1;1;1;1;1\n" +
    "3;4;4;4;2;4;4;4;4;0;0;0;3;3;3;3;3;3;3;3;3;3;4;4;2;1;4;4;1;1;1;1;1;1;1;1;1;1;1;1\n" +
    "3;3;3;3;2;2;1;4;1;1;0;0;3;3;3;3;3;3;3;3;4;3;4;4;2;1;1;4;1;1;1;1;1;1;1;1;1;1;1;1\n" +
    "1;3;3;3;4;2;1;1;1;1;0;0;3;3;3;3;3;3;3;3;4;4;4;4;2;1;1;1;1;1;1;1;1;1;1;1;1;1;1;1";

