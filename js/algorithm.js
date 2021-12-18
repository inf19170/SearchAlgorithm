/**
 * algorithm.js
 *
 * Funktion(-en) für den eigentlichen Algorithmus
 *      - Algorithmus an sich
 *      - Heuristische Funktion
 *      - Wert für die Diagonale zwischen 2 Punkten
 *      - Funktion zur Überprüfung, ob das Ziel erreicht wurde
 *
 */
//TODO Überprüfe alle Felder ob die neben an in der ClosedList sind und einen kürzeren Weg haben, dann diesen auf Elternteil setzen

// Beginnt den optimierten und angepassten A* Algorithmus
async function startAlgorithmus() {

    startTime = new Date(); // Setzt die Startzeit für den Beginn der Suche des Algorithmus

    // Algorithmus läuft solange, wie die openList noch Elemente enthält
    while (openList.length > 0) {


        // Ermittle das Feld aus der OpenList mit dem kürzesten Kosten (Pfadkosten + Feldkosten + Heuristische Funktion)
        let shortestPath = undefined; // Kürzestes Element
        let shortestPathArray = []; // Kürzeste Elemente, die dieselben Kosten aufweisen


        /*
            Solange tryMountain "false" ist, wird kein Boot auf einem Berg weggeworfen.
            Sollte die Algorithmus kein Feld ermitteln können, den er gehen kann, wird tryMountain auf "true" gesetzt, um zu überprüfen,
            ob es möglich ist, dass mit Hilfe von "Boot wegwerfen" auf einem Bergfeld ein Weg gefunden werden kann.

         */
        let tryMountain = false;

        /*
            Alle offenen Felder (openList) werden durchgegangen.

         */
        for (let i = 0; i < openList.length; i++) {
            /*
                Variablen definieren für das i-Element aus der openList
                    - Feld-ID
                    - Feld-Typ
                    - Boolean, ob Boot vorhanden ist oder nicht
             */
            let tmpPath = openList[i];
            let tmpType = parseInt(document.getElementById(tmpPath).getAttribute("type"));
            let tmpHasBoat = document.getElementById(tmpPath).getAttribute("hasBoat");


            /*
                Nachfolgend wird ermittelt, welche Felder nach der gegebene Logik betretbar sind

                Bei jeder Abfrage wird anfangs "shortestPath" mit dem ersten Wert initialisiert. Falls es Felder gibt,
                die dieselben Kosten (Pfadkosten + Feldkosten + Heuristische Funktion) aufweisen, wie "shortestPath", so werden diese Elemente in eine Liste mitaufgenommen,
                um später den "idealsten" Wert aus dieser Liste zu nehmen. Diese Funktion dient der Optimierung der Auswahl
                des kürzesten Weges!

                1. If-Abfrage:
                    - Berge, bei denen das Boot nicht mehr im Besitz ist
                    - Wasser, bei denen noch ein Boot vorhanden ist
                    - Alle anderen Felder, die zuvor nicht abgefragt wurden
                    - Felder wie Berge mit Boot oder Wasser ohne Boot werden hier nicht berücksichtigt!

                2. If-Abfrage:
                    - Falls durch die erste Abfrage kein Feld ermittelt werden konnte, wird überprüft, ob ein Feld ermittelt werden kann,
                      wenn dafür ein Boot auf einem Berg weggeworfen wird.

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
                i = -1; // Variable i wird beim Beginn der for-schleife um 1 erhöht. Um daher beim Neudurchlauf die For-Schleife von Anfang (Position "0") an läuft, muss i auf "-1" gesetzt werden.
            }
        }

        /*
            Wie weiter oben beschrieben, kann es den Fall geben, dass mehrere Felder gleichwertig sind (gleiche Kosten).
            Damit hier das "idealste" Feld expandiert wird, werden alle Felder auf ihren Abstand zum Ziel untersucht.
            Danach wird das Feld mit dem kleinsten Abstand als "shortPath" gewählt.
            Falls es gleiche Felder gibt, die denselben Abstand haben, wird das zuerst gefundene Element genommen.

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
            Der nachfolgende Code-Abschnitt kommt zustande, falls durch die zu vorigen Abfragen kein Element für shortestPath ermittelt werden konnte.
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

                // Alle Elemente in der OpenList durchgehen
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
                        // Die Felder, die um das neue Wasserfeld mit Boot liegen müssen ggf. in die openList eingefügt werden (Wenn nicht in der ClosedList oder openList schon vorhanden):
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

        /*
            Ist "shortestPath" definiert, wird dieses Feld aus der openList entfernt, expandiert und in die closedList hinzugefügt.
         */
        if (shortestPath !== undefined) {

            // Falls das ausgewählte Feld ein Berg ist, auf dem das Boot weggeworfen werden muss, wir diese Attribute sowie dessen Kosten direkt hier gesetzt
            if (document.getElementById(shortestPath).getAttribute("type").toString() === "3" && document.getElementById(shortestPath).getAttribute("hasBoat").toString() === "true") {
                document.getElementById(shortestPath).setAttribute("hasBoat", false.toString());
                document.getElementById(shortestPath).setAttribute("throwBoat", true.toString());
                setPathCosts(shortestPath, document.getElementById(shortestPath).getAttribute("pathCost"));
            }

            // Entferne das Feld mit dem kürzesten Weg aus der OpenList, weil dieses erweitert wird
            openList = removeArrayElement(openList, shortestPath);

            // Alle expandierten Felder werden grün eingefärbt. Ausnahme: Startfeld
            if (shortestPath.toString() !== getStart().toString()) {
                document.getElementById(shortestPath).style.backgroundColor = color["searchField"];
            }

            // Füge das Feld in die ClosedList
            closedList.push(shortestPath);


            /* Berechne die Schritte für die Zellen außen rum */
            /*
                Expandiere den Knotenpunkt:
                Für alle Felder die sich neben dem Knoten befinden, werden die Kosten ermittelt. Sofern für dieses
                noch keine Pfadkosten definiert wurden (Bedeutet, dass dieses Feld noch von keiner anderen Stelle aus erreicht wurde)
                oder es einen günstigeren Weg gibt.

             */

            // Felder, die um das Feld liegen
            let fieldsAround = getFieldsAround(shortestPath);

            // Berechnen der Feldkosten für die nachfolgenden Felder
            let fieldCost = calculatePathCost(shortestPath);

            /*
                Für jedes Feld, dass um das gegebene Feld liegt, werden die Pfadkosten gesetzt.

                Sofern der Elternknoten des Feldes von Typ "Wasser" war und das jetzige Feld kein Wasserfeld mehr ist, so wird bei diesem der Wert
                "hasBoat" auf "false" gesetzt. Dasselbe gilt, wenn das Elternteil schon selbst kein Boot mehr hatte.

                Zuletzt wird das Feld in openList eingefügt und in der Map "parents" der Elternknoten des Feldes gesetzt.
             */
            for (let j = 0; j < fieldsAround.length; j++) {
                let pos = fieldsAround[j];

                // Werte nur ändern, falls noch keine Pfadkosten exsisiteren oder ein kürzerer Weg gefunden wurde
                if (document.getElementById(pos).getAttribute("pathCost") == null || parseFloat(document.getElementById(pos).getAttribute("pathCost")) > fieldCost) {
                    let type = document.getElementById(pos).getAttribute("type");

                    // Setze, dass das Boot nicht mehr vorhanden ist, wenn Wasser überquert wurde & jetziges Feld kein Wasser ist oder das Feld zuvor schon kein Boot mehr hatte
                    if (type.toString() !== "0" && document.getElementById(shortestPath).getAttribute("type").toString() === "0" || document.getElementById(shortestPath).getAttribute("hasBoat").toString() === "false") {
                        setHasBoat(pos, false);
                        document.getElementById(pos).setAttribute("throwBoat", false.toString());
                    }

                    /*
                        Überprüfen, ob ein neuer kürzer Weg gefunden wurde
                        --> Ja:
                            - Ggf. throwBoat anpassen
                            - Element in die openList wieder aufnehmen und aus closedList nehmen
                     */
                    /*
                        Falls ein kürzer Weg gefunden wurde, muss ein paar Änderungen vorgenommen werden:
                     */
                    if (parseFloat(document.getElementById(pos).getAttribute("pathCost")) > fieldCost) {
                        // Falls Element in der closedList ist, muss es aus dieser entfernt werden, weil es wieder in die openList hinzugefügt wird.
                        if(closedList.includes(pos)) closedList = removeArrayElement(closedList, pos);

                        /*
                            Wert für "throwBoat" auf false setzen, sofern bei unserem neuen Weg throwBoat schon mal true ist (Das Boot wurde schon früher weggeworfen!)
                            und unser Feld das Attribute "throwBoat" auf "true" hat.
                         */
                        //TODO überprüfe, ob es diesen Fall überhaupt gibt!
                        //TODO Dieser Fall sollte eigentlich nicht exsisitieren
                        if (document.getElementById(pos).getAttribute("throwBoat").toString() === "true") {
                            let anotherWay = shortestPath;
                            let anotherWayThrowBoat = false;

                            /*
                                Überprüfung, ob das Boot auf dem neuen Weg schon früher weggeworfen wurde
                             */

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
                    }

                    /*
                        Element in die openList setzen und optisch einfärben

                        Elternknoten für dieses Feld setzen

                        Kinder für die Elternknoten erweitern

                        Pfadkosten setzen
                     */
                    openList.push(pos);
                    if(pos.toString() !== getEnd().toString()) document.getElementById(pos).style.backgroundColor = color["openList"];
                    parents.set(pos, shortestPath);
                    setPathCosts(pos, fieldCost);
                    addChilds(shortestPath, pos);



                }

            }

            // Wartezeit zwischen den Suchschritten (kann von Benutzer verändert werden)
            await Sleep(getSleepTime());


        }
        /*
            Nachdem der Knoten expandiert wurde, wird überprüft, ob das Ziel erreicht wurde. Falls dies der Fall ist,
            wird die Lösung angezeigt und die Algorithmus wird abgebrochen.
        */
        if (finished()) {
            setDiffMilliseconds(); // Zeitanspruch setzen
            await Sleep(250); // Kurze Verzögerung, bis Lösung angezeigt wird
            showSolution();
            break; // While-Schleife soll abgebrochen werden
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


// Kostenberechnung für die Pfadkosten
function calculatePathCost(parent) {
    // Feldkosten für den expandierte Knoten
    let fieldCost = parseFloat(document.getElementById(parent).getAttribute("cost"));

    // Falls Boot abgelegt wurde, muss die Wegzeit reduziert werden
    if (document.getElementById(parent).getAttribute("hasBoat").includes("false")) fieldCost = fieldCost * (1 - reduction);

    // Addiere zu den Feldkosten die Pfadkosten des expandierten Knotens dazu.
    if (parents.get(parent) != null) {
        fieldCost += parseFloat(document.getElementById(parent).getAttribute("pathCost"));
    }
    return fieldCost;
}

// Gibt den Wert für die heuristische Funktion für die gegeben Position
// Hier: Diagonal-Wert * 2 (2 für die geringste mögliche Feldkosten)
function heuristFunction(pos) {
    let diagonal = diagonalValue(pos);
    if (diagonal !== undefined) {
        return diagonal * 2;
    }
    return diagonal;
}

// Gibt den Diagonalen-Wert für die gegebene Position zum Ziel zurück
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
// Hier: Wenn Ziel in der openList / closedList enthalten ist. Das letztere kommt zum Einsatz,wenn die Wasserfelder expandiert werden
function finished() {
    return (openList.includes(getEnd()) || closedList.includes(getEnd()));
}

