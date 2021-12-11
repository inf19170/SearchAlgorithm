/**
 * randomGrid.js
 *
 * Mit Hilfe dieser JavaScript-Datei kann ein zufällig generiertes Grid erstellt werden
 *
 */

// Ein zufälliges Feld für Grid
function randomField(){
    return Math.round(Math.random()*highestValue);
}

// Neue Zeile für Grid
function newLine(length){
    let string = "";
    for(let i = 0; i <length;i++){
        string +=randomField().toString();
        if(i <length-1) string += ";";
    }

    return string;
}

// Funktionen um ein Random generiertes Grid zu verwenden
function newGrid(height, length){
    let string = "";
    for(let i = 0; i <height;i++){
        string +=newLine(length);
        if(i <height-1) string += "\n";
    }
    return string;
}


function randomPosition(){
    const height = maxHeight-1;
    const width = maxWidth-1;

    let randomHeight = Math.round(Math.random()*height);
    let randomWidth = Math.round(Math.random()*width);

    const start = randomWidth+":"+randomHeight;
    displayOption(start, true);
    setStartAndEnd(start);

    randomHeight = Math.round(Math.random()*height);
    randomWidth = Math.round(Math.random()*width);
    const end = randomWidth+":"+randomHeight;

    displayOption(end, true);
    setStartAndEnd(end);
}