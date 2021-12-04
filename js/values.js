let start = undefined;
let end = undefined;

function getStart() {
    if (start === undefined) {
        return null;
    }
    return start;
}
function setStart(obj) {
    start = obj;
}

function getEnd() {
    if (end === undefined) {
        return null;
    }
    return end;
}
function setEnd(obj) {
    end = obj;
}



let maxWidth = undefined;
let maxHeight = undefined;

let showSearch = false;



let openList = [];
let closedList = [];

let solutionPath = [];
let parents = new Map();


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