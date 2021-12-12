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
let childs = new Map();


function addChilds(key, value) {
    let array = [];
    if (childs.get(key) !== null && childs.get(key) !== undefined) {
        array = childs.get(key);
    }
    array.push(value);
    childs.set(key, array);
}

function removeChilds(key, value) {
    let array = [];
    if (childs.get(key) !== null && childs.get(key) !== undefined) {
        array = childs.get(key);
        array = removeArrayElement(array, value);
    }
    childs.set(key, array);
}

let startTime = undefined;
let diffMilliseconds = undefined;

function initDiffMilliseconds() {
    return diffMilliseconds = new Date().getTime() - startTime.getTime();
}

function displayDiffMilliseconds() {
    let time = initDiffMilliseconds();
    let minutes = roundLower(time / (1000 * 60));
    time -= minutes * (1000 * 60);
    let seconds = roundLower(time / (1000));
    time -= seconds * (1000);
    let milliseconds = time;
    document.getElementById("minutes").innerHTML = minutes;
    document.getElementById("seconds").innerHTML = seconds;
    document.getElementById("milliseconds").innerHTML = milliseconds;
}


// Setzt die Pfadkosten für die schon gelaufenen Felder (Wert ist ohne Heuristische Funktion)
function setPathCosts(pos, value) {
    pos = pos.toString();
    document.getElementById(pos).setAttribute("pathCost", value);
    document.getElementById(pos).setAttribute("title", FieldDescriptionToString(pos, undefined, value, undefined));
}

// Setze, ob er das Boot hat oder nicht
function setHasBoat(/*ID of field*/ pos, value) {
    document.getElementById(pos.toString()).setAttribute("hasBoat", value);
}