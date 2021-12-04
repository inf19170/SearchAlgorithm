// Gibt die Rohdaten für das Grid aus
function getData(){
    //return newGrid(40,40);
    return data;
}/* Nachfolgendet Quellcode wurde aus https://code.tutsplus.com/tutorials/parsing-a-csv-file-with-javascript--cms-25626 kopiert und für die Aufgabe angepasst */
// Create HTML Code for grid
function createGrid(data) {
    let allRows = data.split(/\r?\n|\r/);
    let table = '<table>';
    for (let singleRow = 0; singleRow < allRows.length; singleRow++) {
        table += '<tr>';
        let rowCells = allRows[singleRow].split(',');
        for (let rowCell = 0; rowCell < rowCells.length; rowCell++) {
            let row  = rowCells[rowCell].split(";");
            for (let i = 0; i < row.length; i++) {
                let type = row[i];
                let field = new Field(type);
                table += field.createHTML(i,singleRow);
            }
            maxWidth = row.length;
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
