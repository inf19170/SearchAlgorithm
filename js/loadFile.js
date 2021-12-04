// Gibt die Rohdaten für das Grid aus
function getData(){
    //return newGrid(40,40);
    return data;
}

/* Nachfolgend Quellcode wurde aus https://code.tutsplus.com/tutorials/parsing-a-csv-file-with-javascript--cms-25626 kopiert und für die Aufgabe angepasst */
// Create HTML Code for grid
//TODO Funktion überarbeiten
function createGrid(data) {
    let allRows = data.split(/\r?\n|\r/); // Aufteilen der Daten bei allen möglichen Zeilenumbrüchen
    let table = '<table>';
    /*
        Diese Schleife durchläuft alle Zeilen
     */
    for (let singleRow = 0; singleRow < allRows.length; singleRow++) {
        table += '<tr>';
        let rowCells = allRows[singleRow].split(',');

        for (let rowCell = 0; rowCell < rowCells.length; rowCell++) {
            let row  = rowCells[rowCell].split(";");

            /*
                Diese Schleife durchläuft alle Elemente innerhalb einer Zeile
            */
            for (let i = 0; i < row.length; i++) {
                let type = row[i];
                let field = new Field(type);
                table += field.createHTML(i,singleRow);
            }
            if(maxWidth === undefined || maxWidth > row.length) maxWidth = row.length;
        }
        table += '</tr>';
        maxHeight = allRows.length;
    }
    table += '</table>';
    return table;
}

// Setzt Grid in Webseite hinzu
function displayGrid() {
    document.getElementById("grid").innerHTML = createGrid(getData());
}
