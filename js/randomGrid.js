// Funktionen um ein Random generiertes Grid zu verwenden
function newGrid(height, length){
    let string = "";
    for(let i = 0; i <height;i++){
        string +=newLine(length);
        if(i <height-1) string += "\n";
    }
    return string;
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

// Ein zufälliges Feld für Grid
function randomField(){
    return Math.round(Math.random()*highestValue);
}