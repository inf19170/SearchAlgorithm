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

// Funktion wartet eingegebe Millisekunden bis Code weiter läuft
function Sleep(milliseconds) {
    return new Promise(resolve => setTimeout(resolve, milliseconds));
}

// Rundet eine Kommazahl auf deci Nachstellen
function roundFloat(float, deci){
    let factor = Math.pow(10, deci);
    return (Math.round(float*factor))/factor;
}