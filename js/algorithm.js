//TODO Überprüfe alle Felder ob die neben an in der ClosedList sind und einen kürzeren Weg haben, dann diesen auf Elternteil setzen
//TODO Bug Fixen wenn er weg über Wasser sucht

// Beginnt den optimierten und angepassten A* Algorithmus
async function startAlgorithmus() {
    startTime = new Date();
    displayDiffMilliseconds("...","...","...");
    while (openList.length > 0) {


        // Ermittle das mögliche Feld aus der OpenList mit dem kürzesten Weg
        let shortestPath = undefined;
        let shortestPathArray = [];
        /*
            Alle offenen Felder (openList) werden durchgegangen. Was genau im einzelnen gemacht wird,
            kann in Kommentaren weiter unten gelesen werden.

         */
        let tryMountain = false;
        for (let i = 0; i < openList.length; i++) {
            let tmpPath = openList[i];
            let tmpType = parseInt(document.getElementById(tmpPath).getAttribute("type"));
            let tmpHasBoat = document.getElementById(tmpPath).getAttribute("hasBoat");

            /*
                Hier werden alle Felder aus der openListe entfernt, die keine Relevanz mehr haben. Dazu zählen Wasserfelder
                bei denen kein Boot mehr vorhanden ist
             *//*
            if (tmpType.toString() === "0" && tmpHasBoat.toString() === "false") {
                if(i === openList.length-1){ i--; }
                i--; // Dadurch, dass ein Element aus der Liste entfernt wurde, ist das nächste Element an derselben i. Stelle wie gerade eben.
                openList = removeArrayElement(openList, tmpPath);
                continue; // Für Schleife mit nächsten Element aus!
            }*/

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

            if (!tryMountain && ((tmpType.toString() === "3" && tmpHasBoat.toString() === "false") || (tmpType.toString() === "0" && tmpHasBoat.toString() === "true") || (tmpType.toString() !== "3" && tmpType.toString() !== "0"))) {
                if (shortestPath === undefined) {
                    shortestPath = tmpPath;
                } else {

                    let tmpPathCost = parseFloat(document.getElementById(tmpPath).getAttribute("cost")) + parseFloat(document.getElementById(tmpPath).getAttribute("pathCost")) + heuristFunction(tmpPath);
                    let shortestPathCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost")) + parseFloat(document.getElementById(shortestPath).getAttribute("pathCost")) + heuristFunction(shortestPath);
                    if (tmpPathCost <= shortestPathCost) {
                        if (tmpPathCost < shortestPathCost) {
                            shortestPath = tmpPath;
                            shortestPathArray = []; // Array leeren, weil ein kürzer Weg gefunden wurde
                        }
                        if (!shortestPathArray.includes(tmpPath)) shortestPathArray.push(tmpPath);
                    }
                }

            }
            if (tryMountain && tmpType.toString() === "3") {
                // Falls das nächste kürzere Feld ein Berg ist, soll das Boot weg geworfen werden (Damit der Berg bestiegen werden kann), sofern dies kostengünstiger ist!
                if (shortestPath === undefined) {
                    shortestPath = tmpPath;
                }
                let tmpPathCost = parseFloat(document.getElementById(tmpPath).getAttribute("cost")) * (1 - reduction) + parseFloat(document.getElementById(tmpPath).getAttribute("pathCost")) + heuristFunction(tmpPath);
                let shortestPathCost = parseFloat(document.getElementById(shortestPath).getAttribute("cost")) + parseFloat(document.getElementById(shortestPath).getAttribute("pathCost")) + heuristFunction(shortestPath);

                if (tmpPathCost <= shortestPathCost) {
                    if (tmpPathCost < shortestPathCost) {
                        shortestPath = tmpPath;
                        shortestPathArray = []; // Array leeren, weil ein kürzer Weg gefunden wurde
                    }
                    if (!shortestPathArray.includes(tmpPath)) shortestPathArray.push(tmpPath);
                }
            }
            // Falls kein "normaler" Weg zu einem Ziel geführt hat, wird probiert einen Berg zu nehmen und dabei das Boot wegzuwerfen!
            if (i === openList.length - 1 && shortestPath === undefined && tryMountain === false) {
                tryMountain = true;
                i = -1;
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
            Initialisiere Suche mit Optimierung für Wasserfelder, dass dort das Boot erhalten bleibt:
         */

        if (shortestPath === undefined && openList.length > 0) {
            let possiblePath = true;
            // Solange Wasserfelder expandieren, bis es keine Felder mehr gibt oder keine Fehler mehr expandiert werden können
            while (possiblePath) {
                await Sleep(getSleepTime());
                possiblePath = false;

                /* Überprüfe, ob Ziel erreicht wurde, falls ja:
                    Feldkosten setzen und while Schleife abbrechen
                 */
                if (finished()) {
                    if (parents.get(getEnd().toString()) !== undefined) {
                        setPathCosts(getEnd(), calculatePathCost(parents.get(getEnd().toString())));
                        continue;
                    }
                }

                // Alle Elemente in der OpenList durchgehen (Alle möglichen Wasserfelder, die kein Boot haben)
                for (let j = 0; j < openList.length; j++) {
                    let field = openList[j];
                    let tmpType = document.getElementById(field).getAttribute("type");
                    let tmpHasBoat = document.getElementById(field).getAttribute("hasBoat");
                    // Nur Elemente durchgehen, die Wasser sind und kein Boot haben!
                    if (tmpType.toString() === "0" && tmpHasBoat.toString() === "false") {
                        // Felder, die um das Wasserfeld herumliegen
                        let fieldsAround = getFieldsAround(field);
                        let shortestPathFieldAround = undefined;

                        // Umliegende Felder durchgehen
                        for (let z = 0; z < fieldsAround.length; z++) {
                            let fieldAround = fieldsAround[z];

                            // Feld darf nicht in der openList sein (--> Muss schon expandiert sein; in den ClosedList sein!)
                            if (!openList.includes(fieldAround) && closedList.includes(fieldAround)) {

                                // Feld muss Boot vorhanden haben
                                if (document.getElementById(fieldAround).getAttribute("hasBoat").toString() === "true") {
                                    /*
                                        Ermitteln des kürzesten Weges des Feldes, bei dem das Boot noch erhalten ist
                                     */

                                    if (shortestPathFieldAround === undefined) {
                                        shortestPathFieldAround = fieldAround;
                                    } else {
                                        if (document.getElementById(shortestPathFieldAround).getAttribute("pathCost") > document.getElementById(fieldAround).getAttribute("pathCost")) {
                                            shortestPathFieldAround = fieldAround;
                                        }
                                    }
                                }
                            }
                        }
                        // Sofern ein Element gefunden wurde, das in der closedList war und Boot hat
                        if (shortestPathFieldAround !== undefined) {
                            possiblePath = true; // Setze Bedienung, dass While-Schleife erneut durchlaufen soll

                            // Farbe ändern, wenn es nicht das Ziel ist
                            if (field.toString() !== getEnd()) document.getElementById(field).style.backgroundColor = color["searchField"];

                            // Attribute anpassen
                            document.getElementById(field).setAttribute("hasBoat", true.toString());
                            document.getElementById(field).setAttribute("throwBoat", false.toString());
                            parents.set(field, shortestPathFieldAround);
                            addChilds(shortestPathFieldAround, field);
                            openList = removeArrayElement(openList, field);
                            closedList.push(field);
                            let fieldCost = calculatePathCost(shortestPathFieldAround);
                            setPathCosts(field, fieldCost);

                        }
                        // Die Felder die um das neue Wasserfeld mit Boot liegen müssen ggf. in die openList eingefügt werden (Wenn nicht in der ClosedList oder openList schon vorhanden):
                        if (document.getElementById(field).getAttribute("hasBoat").toString() === "true") {
                            fieldsAround = getFieldsAround(field);
                            for (let z = 0; z < fieldsAround.length; z++) {
                                let tmp = fieldsAround[z];
                                if(!closedList.includes(tmp) && !openList.includes(tmp)){
                                    openList.push(tmp);
                                    document.getElementById(tmp).setAttribute("hasBoat", false.toString());
                                    document.getElementById(tmp).setAttribute("throwBoat", false.toString());
                                    possiblePath = true; // Setze Bedienung, dass While-Schleife erneut durchlaufen soll

                                }
                            }
                        }
                    }
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
        if (shortestPath !== undefined) {
            if (document.getElementById(shortestPath).getAttribute("type").toString() === "3" && document.getElementById(shortestPath).getAttribute("hasBoat").toString() === "true") {
                document.getElementById(shortestPath).setAttribute("hasBoat", false.toString());
                document.getElementById(shortestPath).setAttribute("throwBoat", true.toString());
                setPathCosts(shortestPath, document.getElementById(shortestPath).getAttribute("pathCost"));
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
                if (document.getElementById(pos).getAttribute("pathCost") == null || parseFloat(document.getElementById(pos).getAttribute("pathCost")) > fieldCost) {
                    let type = document.getElementById(pos).getAttribute("type");

                    // Setze, dass das Boot abgelegt wurde, wenn Wasser überquert wurde oder das Feld zuvor schon kein Boot mehr hatte
                    if (type.toString() !== "0" && document.getElementById(shortestPath).getAttribute("type").toString() === "0" || document.getElementById(shortestPath).getAttribute("hasBoat").toString() === "false") {
                        setHasBoat(pos, false);
                    }
                    /*
                        Überprüfen, ob ein neuer kürzer Weg gefunden wurde
                        --> Ja:
                            - Ggf. throwBoat anpassen
                            - Element in die openList wieder aufnehmen und aus closedList nehmen
                            - //TODO LÖSCHEN: Für alle Felder danach müssen die "pathCost", "hasBoat" und "throwBoat" angepasst werden

                     */
                    if (parseFloat(document.getElementById(pos).getAttribute("pathCost")) > fieldCost) {
                        if(closedList.includes(pos)) closedList = removeArrayElement(closedList, pos);
                        /*
                            Wert für "throwBoat" auf false setzen, sofern bei unserem neuen Weg throwBoat schon mal true ist (Das Boot wurde schon früher weggeworfen!)
                         */
                        if (document.getElementById(pos).getAttribute("throwBoat").toString() === "true") {
                            let anotherWay = shortestPath;
                            let anotherWayThrowBoat = false;

                            while (anotherWay.toString() !== getStart().toString()) {
                                if (document.getElementById(anotherWay).getAttribute("throwBoat").toString() === "true") {
                                    anotherWayThrowBoat = true;
                                    break;
                                }
                                anotherWay = parents.get(anotherWay);
                            }
                            // Überprüfe dieselbe Abfrage noch für den Start:
                            if (document.getElementById(getStart().toString()).getAttribute("throwBoat").toString() === "true") {
                                anotherWayThrowBoat = true;
                            }
                            if (anotherWayThrowBoat === true) document.getElementById(pos).setAttribute("throwBoat", false.toString());
                        }
                        /*
                            Setze frühzeitig neues Elternteil + Kosten, um die Berechnung für die neuen Felder korrekt durchzuführen
                            Davor muss noch aus dem alten Elternknoten das Kind entfernt werden
                         */
                        removeChilds(parents.get(pos), pos);
                        parents.set(pos, shortestPath);
                        setPathCosts(pos, fieldCost);
                        /*
                            //TODO Löschen! Diese Bedienung wird erfüllt, wenn das Element wieder in die openList hinzugefügt wird!
                            Für alle Nachfolger müssen die "pathCost" und "hasBoat" angepasst werden
                         */
                        /*
                           let hasBoat = document.getElementById(pos).getAttribute("hasBoat"); // Wert für die aktuelle Position (pos) wurde schon angepasst

                           let currentArray = [pos];
                           while (currentArray.length > 0) {
                               let current = currentArray[0];
                               let children = childs.get(currentArray[0]);
                               if (children !== null && children !== undefined && children.length > 0) {
                                   for (let z = 0; z < children.length; z++) {
                                       let child = children[z];
                                       let parent = current;
                                       document.getElementById(child).setAttribute("hasBoat", hasBoat);
                                       if (hasBoat.toString() === "false" && document.getElementById(child).getAttribute("throwBoat").toString() === "true") document.getElementById(child).setAttribute("throwBoat", "false");
                                       let tmpFieldCost = parseFloat(document.getElementById(parent).getAttribute("cost"));

                                       if (document.getElementById(parent).getAttribute("hasBoat").includes("false")) tmpFieldCost = tmpFieldCost * (1 - reduction);

                                       if (parents.get(parent) != null) {
                                           tmpFieldCost += parseFloat(document.getElementById(parent).getAttribute("pathCost"));
                                       }
                                       setPathCosts(child, tmpFieldCost);
                                   }
                               }
                               currentArray = removeArrayElement(currentArray, current);
                           } */
                    }
                    openList.push(pos);
                    if(pos.toString() !== getEnd().toString()) document.getElementById(pos).style.backgroundColor = color["openList"];
                    parents.set(pos, shortestPath);
                    setPathCosts(pos, fieldCost);
                    addChilds(shortestPath, pos);



                }

            }

            // Wartezeit zwischen den Suchschritten (kann von Benutzer manuell verändert werden)
            await Sleep(getSleepTime());


        }
        /*
            Nachdem alle Knoten expandiert sind, wird überprüft, ob das Ziel erreicht wurde. Falls dies der Fall ist,
            wird die Lösung angezeigt und die Algorithmus wird abgebrochen.
        */
        if (finished()) {
            setDiffMilliseconds();
            document.getElementById("showSolution").removeAttribute("hidden");
            await Sleep(250);
            showSolution();
            break;
        }

    }
    /*
        Falls innerhalb des Algorithmus das Ziel nicht erreicht bzw. erkannt wurde, die "openList" leer ist wird ausgegeben,
        dass keine Lösung gefunden werden konnte.
        Dieser Fall dient als reine Sicherheitsvorkehrung. Es sollte in keinem Falle möglich sein, dass die Abfrage anschlägt.
     */

    if (!finished()) {
        noSolutionFound();
        setDiffMilliseconds();
    }

}


// Gibt den Wert für die heuristische Funktion für die gegeben Position
function heuristFunction(pos) {
    let diagonal = diagonalValue(pos);
    if (diagonal !== undefined) {
        return 2 * diagonal; // 2 für die geringste mögliche Feldkosten
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
    return (openList.includes(getEnd()) || closedList.includes(getEnd()));
}

