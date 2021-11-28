/* Quellcode wurde aus https://code.tutsplus.com/tutorials/parsing-a-csv-file-with-javascript--cms-25626 kopiert und für die Aufgabe angepasst */

// Funktionen um ein Random generiertes Gride zu verwenden

function newGride(height, length){
    let string = "";
    for(let i = 0; i <height;i++){
        string +=newLine(length);
        if(i <height-1) string += "\n";
    }
    return string;
}

function newLine(length){
    let string = "";
    for(let i = 0; i <length;i++){
        string +=randomField().toString();
        if(i <length-1) string += ";";
    }

    return string;
}


function randomField(){
    let highestValue = 4; // Gibt die höchste Zahl der Felder an 4 --> Wald
    return Math.round(Math.random()*highestValue);
}


function getData(){
   // return newGride(100,100);
    let data =
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
    return data;
}

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
