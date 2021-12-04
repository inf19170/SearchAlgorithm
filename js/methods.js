// Entfernt element "value" aus dem Array und gibt das Array ohne das Element zurück
function removeArrayElement(array, value){
    let length = array.length;
    let pos = array.indexOf(value);
    if(pos === 0){
        return array.slice(1,length);
    }else{
        return array.slice(0,pos).concat(array.slice(pos+1, length));
    }
}

// Funktion wartet eingegebenen Millisekunden bis Code weiter läuft
function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// Rundet eine Kommazahl auf deci Nachstellen
function roundFloat(float, deci){
    let factor = Math.pow(10, deci);
    return (Math.round(float*factor))/factor;
}

// Gibt alle Felder zurück, die um das gegebene Feld liegen
function getFieldsAround(/*ID of field*/ pos) {
    let list = new Array();
    let posX = parseInt(pos.split(":")[0]);
    let posY = parseInt(pos.split(":")[1]);

    let newX = posX;
    let newY = posY - 1;
    let newPos = newX + ":" + newY;
    //up
    if (newX >= 0 && newY >= 0 && newX <= maxWidth && newY <= maxHeight && document.getElementById(newX + ":" + newY) != null) {
        list.push(newPos);
    }


    newX = posX;
    newY = posY + 1;
    newPos = newX + ":" + newY;
    //down
    if (newX >= 0 && newY >= 0 && newX <= maxWidth && newY <= maxHeight && document.getElementById(newX + ":" + newY) != null) {
        list.push(newPos);
    }


    newX = posX - 1;
    newY = posY;
    newPos = newX + ":" + newY;
    //left
    if (newX >= 0 && newY >= 0 && newX <= maxWidth && newY <= maxHeight && document.getElementById(newX + ":" + newY) != null) {
        list.push(newPos);
    }


    newX = posX + 1;
    newY = posY;
    newPos = newX + ":" + newY;
    //right
    if (newX >= 0 && newY >= 0 && newX <= maxWidth && newY <= maxHeight && document.getElementById(newX + ":" + newY) != null) {
        list.push(newPos);
    }
    return list;
}
