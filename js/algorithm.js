// Beginnt den optimierten und angepassten A* Algorithmus
async function startAlgorithmus() {
    startTime = new Date();
    while (openList.length > 0) {


        // Ermittle das mögliche Feld aus der OpenList mit dem kürzesten Weg
        let shortestPath = undefined;
        let shortestPathArray = [];

        /*
            Alle offenen Felder (openList) werden durchgegangen. Was genau im einzelnen gemacht wird,
            kann in Kommentaren weiter unten gelesen werden.

         */
        for (let i = 0; i < openList.length; i++) {
            let tmpPath = openList[i];
            let tmpType = parseInt(document.getElementById(tmpPath).getAttribute("type"));
            let tmpHasBoat = document.getElementById(tmpPath).getAttribute("hasBoat");

            /*
                Hier werden alle Felder aus der openListe entfernt, die keine Relevanz mehr haben. Dazu zählen Wasserfelder
                bei denen kein Boot mehr vorhanden ist
             */
            if (tmpType.toString() === "0" && tmpHasBoat.toString() === "false") {
                openList = removeArrayElement(openList, tmpPath);
                i--; // Dadurch, dass ein Element aus der Liste entfernt wurde, ist das nächste Element an derselben i. Stelle wie gerade eben.
                continue; // Für Schleife mit nächsten Element aus!
            }

            /*
                Nachfolgend wird ermittelt, welche Felder nach der gegebene Logik betretbar sind

                Bei jeder Abfrage wird anfangs "shortestPath" mit dem ersten Wert initialisiert. Falls es Felder gibt,
                die dieselben Kosten aufweisen, wie "shortestPath", so werden diese Elemente in eine Liste mitaufgenommen,
                um später den "idealsten" Wert aus dieser Liste zu nehmen. Diese Funktion dient der Optimierung der Auswahl
                des kürzesten Weges!

                1. If-Abfrage:
                    - Berge, bei denen das Boot nicht mehr im Besitz ist
                    - Wasser, bei denen noch ein Boot vorhanden ist
                    - Alle anderen Felder, die zuvor nicht abgefragt wurden (hier: Berg & Wasser)

                2. If-Abfrage:
                    - Falls die erste Abfrage fehlschlägt (hier speziell: Berg und Boot ist nicht im Besitz) und das Feld
                      ein Berg ist wird überprüft, ob es günstiger ist, dass Boot weg zu werfen und den Berg nehmen.

                Einen "Else"-Fall gibt es nicht!

             */

            if ((tmpType.toString() === "3" && tmpHasBoat.toString() === "false") || (tmpType.toString() === "0" && tmpHasBoat.toString() === "true") || (tmpType.toString() !== "3" && tmpType.toString() !== "0")) {
                if (shortestPath === undefined) {
                    shortestPath = tmpPath;
                } else {

                    let tmpPathCost = parseFloat(document.getElementById(tmpPath).getAttribute("cost")) + parseFloat(document.getElementById(tmpPath).getAttribute("pathCost")) + heuristFunction(tmpPath);
                    let shortestPathCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost")) + parseFloat(document.getElementById(shortestPath).getAttribute("pathCost")) + heuristFunction(shortestPath);
                    if (tmpPathCost <= shortestPathCost) {
                        if (tmpPathCost < shortestPathCost){
                            shortestPath = tmpPath;
                            shortestPathArray = []; // Array leeren, weil ein kürzer Weg gefunden wurde
                        }
                        if(!shortestPathArray.includes(tmpPath)) shortestPathArray.push(tmpPath);
                    }
                }

            } else if (tmpType.toString() === "3") {

                // Falls das nächste kürzere Feld ein Berg ist, soll das Boot weg geworfen werden (Damit der Berg bestiegen werden kann), sofern dies kostengünstiger ist!
                if (shortestPath === undefined) {
                    shortestPath = tmpPath;
                }
                let tmpPathCost = parseFloat(document.getElementById(tmpPath).getAttribute("cost")) * (1 - reduction) + parseFloat(document.getElementById(tmpPath).getAttribute("pathCost")) + heuristFunction(tmpPath);
                let shortestPathCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost")) + parseFloat(document.getElementById(shortestPath).getAttribute("pathCost")) + heuristFunction(shortestPath);

                if (tmpPathCost <= shortestPathCost) {
                    if (tmpPathCost < shortestPathCost){
                        shortestPath = tmpPath;
                        shortestPathArray = []; // Array leeren, weil ein kürzer Weg gefunden wurde
                    }
                    if(!shortestPathArray.includes(tmpPath)) shortestPathArray.push(tmpPath);
                }
            }



        }

        /*
            Wie weiter oben beschrieben, kann es den Fall geben, dass mehrere Felder gleichwertig sind (Gleiche Kosten).
            Damit hier der "idealste" Wert genommen wird, werden alle Felder auf ihren Abstand zum Ziel untersucht.
            Danach wird das Feld mit dem kleinsten Abstand als "shortPath" gewählt.

         */
        if (shortestPathArray.length > 1) {
            let shortDiagonale = undefined;
            for (let j = 0; j < shortestPathArray.length; j++) {
                let pos = shortestPathArray[j];
                let diagonal = diagonalValue(pos);
                if (shortDiagonale === undefined || diagonal < shortDiagonale) {
                    shortestPath = pos;
                    shortDiagonale = diagonal;
                }
            }
        }
        /*
            Falls es dazu kommen sollte, dass es keinen kürzesten Weg ("shortestPath") gefunden werden konnte,
            und / oder die openList leer ist und dazu das Ziel nicht erreicht wurde, so wurde keine Lösung gefunden.

         */
        if ((shortestPath === undefined || openList.length === 0) && !finished()) {
            console.error("Es konnte kein 'shortestPath' gefunden werden!");
            break;
        }
        // Wenn shortestPath definiert ist, werden alle nicht mehr notwendigen Felder aus der openList entfernt
        /*
            Ist "shortestPath" definiert, wird dieses Feld aus der openList entfernt, expandiert und in die closedList hinzugefügt.
         */
        if(shortestPath !== undefined) {
            if(document.getElementById(shortestPath).getAttribute("type").toString() === "3" && document.getElementById(shortestPath).getAttribute("hasBoat").toString() === "true"){
                document.getElementById(shortestPath).setAttribute("hasBoat", false.toString());
                document.getElementById(shortestPath).setAttribute("throwBoat", true.toString());
                setPathCosts(shortestPath,  document.getElementById(shortestPath).getAttribute("pathCost"));
            }
            // Entferne das Feld mit dem kürzesten Weg aus der OpenList, weil dieses erweitert wird
            openList = removeArrayElement(openList, shortestPath);

            // Feld wird grün eingefärbt, wenn es nicht das Startfeld ist
            if (shortestPath.toString() !== getStart().toString()) {
                document.getElementById(shortestPath).style.backgroundColor = color["searchField"];
            }

            // Füge das entfernte Feld in die ClosedList
            closedList.push(shortestPath);

            /* Berechne die Schritte für die Zellen außen rum */
            /*
                Expandiere den Knotenpunkt:
                Für alle Felder die sich neben dem Knoten befinden, werden die Kosten ermittelt. Sofern für dieses
                noch keine Pfadkosten definiert wurden (Bedeutet, dass dieses Feld noch von keiner anderen Stelle aus erreicht wurde)

             */
            let fieldsAround = getFieldsAround(shortestPath);

            // Feldkosten für den expandierten Knoten davor
            let fieldCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost"));

            // Falls Boot abgelegt wurde, muss die Wegzeit reduziert werden
            if (document.getElementById(shortestPath).getAttribute("hasBoat").includes("false")) fieldCost = fieldCost * (1 - reduction);

            // Addiere zu den Feldkosten die Pfadkosten des expandierten Knotens dazu.
            //TODO Abfrage macht keinen Sinn
            if (parents.get(shortestPath) != null) {
                fieldCost += parseFloat(document.getElementById(shortestPath).getAttribute("pathCost"));
            }

            /*
                Für jedes Feld, dass um das gegebene Feld liegt, werden die Pfadkosten gesetzt.

                Sofern der Elternknoten des Feldes von Typ "Wasser" war und das jetzige Feld nicht mehr, so wird bei diesem der Wert
                "hasBoat" auf "false" gesetzt. Dasselbe gilt, wenn das Elternteil schon selbst kein Boot mehr hatte.

                Zuletzt wird das Feld in openList eingefügt und in der Map "parents" der Elternknoten des Feldes gesetzt.
             */
            for (let j = 0; j < fieldsAround.length; j++) {
                let pos = fieldsAround[j];
                //TODO Darf hier das Feld über eine kürzere Strecke erreicht werden und dies genutzt werden?
                if (document.getElementById(pos).getAttribute("pathCost") == null || parseFloat(document.getElementById(pos).getAttribute("pathCost")) > fieldCost) {
                    let type = document.getElementById(pos).getAttribute("type");

                    // Setze, dass das Boot abgelegt wurde, wenn Wasser überquert wurde oder das Feld zuvor schon kein Boot mehr hatte
                    if (type.toString() !== "0" && document.getElementById(shortestPath).getAttribute("type").toString() === "0" || document.getElementById(shortestPath).getAttribute("hasBoat").toString() === "false") {
                        setHasBoat(pos, false);

                        /*
                            Wert für "throwBoat" auf false setzen, sofern bei unserem neuen Weg throwBoat schon mal true ist (Das Boot wurde schon früher weggeworfen!)
                         */
                        if(document.getElementById(pos).getAttribute("throwBoat").toString() === "true"){
                            let anotherWay = shortestPath;
                            let anotherWayThrowBoat = false;

                            while (anotherWay.toString() !== getStart().toString()){
                                if(document.getElementById(anotherWay).getAttribute("throwBoat").toString() === "true"){
                                    anotherWayThrowBoat = true;
                                    anotherWay = getStart(); // Abbruch Bedingung einleiten
                                }else{
                                    anotherWay = parents.get(anotherWay);
                                }
                            }
                            // Überprüfe dieselbe Abfrage noch für den Start:
                            if(document.getElementById(getStart().toString()).getAttribute("throwBoat").toString() === "true"){
                                anotherWayThrowBoat = true;
                            }

                            if(anotherWayThrowBoat === true) document.getElementById(pos).setAttribute("throwBoat", false.toString());
                        }
                    }
                    openList.push(pos);
                    parents.set(pos, shortestPath);
                    setPathCosts(pos, fieldCost);
                }

            }

            // Wartezeit zwischen den Suchschritten (kann von Benutzer manuell verändert werden)
            await Sleep(getSleepTime());

            /*
                Nachdem alle Knoten expandiert sind, wird überprüft, ob das Ziel erreicht wurde. Falls dies der Fall ist,
                wird die Lösung angezeigt und die Algorithmus wird abgebrochen.
            */
            if (finished()) {
                displayDiffMilliseconds();
                document.getElementById("showSolution").removeAttribute("hidden");
                await Sleep(250);
                showSolution();
                break;
            }
        }

    }
    /*
        Falls innerhalb des Algorithmus das Ziel nicht erreicht bzw. erkannt wurde, die "openList" leer ist wird ausgegeben,
        dass keine Lösung gefunden werden konnte.
        Dieser Fall dient als reine Sicherheitsvorkehrung. Es sollte in keinem Falle möglich sein, dass die Abfrage anschlägt.
     */

    if (!finished() && openList.length === 0) {
        noSolutionFound();
        displayDiffMilliseconds();
    }

}


// Gibt den Wert für die heuristische Funktion für die gegeben Position
function heuristFunction(pos) {
    let diagonal = diagonalValue(pos);
    if(diagonal !== undefined){
        return 2*diagonal; // 2 für die geringste mögliche Feldkosten
    }
    return diagonal;
}
// Gibt den Diagonalen-Wert für die gegebene Position
function diagonalValue(pos) {
    // Diagonale kann nur bestimmt werden, wenn "Ende" definiert ist!
    if (getEnd() == null) return undefined;

    let posX = parseInt(pos.split(":")[0]);
    let posY = parseInt(pos.split(":")[1]);
    let endX = parseInt(getEnd().split(":")[0]);
    let endY = parseInt(getEnd().split(":")[1]);

    let diff = 0;
    diff += Math.abs(posX - endX);
    diff += Math.abs(posY - endY);
    return diff;
}
// Überprüft, ob das Ziel erreicht wurde
function finished() {
    return openList.includes(getEnd());
}

