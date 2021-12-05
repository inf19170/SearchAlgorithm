const highestValue = 4; // Gibt die höchste Nummer der Felder an 4 --> Wald. Erhöhen, falls es Felder mit höhere Wertigkeit gibt
const reduction = 0.1; // Wert, um wie viel die Wegkosten gesenkt werden, wenn das Boot nicht mehr getragen wird

const boundaryLastFields = 5; // Anzahl der letzten Felder, bei denen "sleepTimeLastFields" anschlagen soll
const sleepTimeLastFields = 100; //in ms: Zeit die zwischen den Feldern gewartet werden soll, wenn die letzten Felder angezeigt werden soll

const waitingSwitchSearchArea = 100; //in ms: Wie lange soll gewartet werden, bis der Suchbereich nicht mehr angezeigt werden soll

const waitingInit_Algo = 100; //in ms: Wie lange soll gewartet werden, bis Algorithmus starten soll

const waitingShowSolution = 250;//in ms: Wie lange soll gewartet werden bis die Lösung angezeigt wird
const type = {
    0:"river",
    1:"flat",
    2: "way",
    3:"mountain",
    4:"forest"
}

const cost = {
    0:5,
    1:3,
    2:2,
    3:20,
    4:11
}



const symbols = {
    0:"<i class=\"fas fa-water\"></i>",
    1:"<i class=\"fas fa-hiking\"></i>",
    2: "<i class=\"fas fa-road\"></i>",
    3:"<i class=\"fas fa-mountain\"></i>",
    4:"<i class=\"fas fa-tree\"></i>",
    "waiting":"<i class=\"far fa-clock\"></i>",
    "check_mark":"<i class=\"fas fa-check\"></i>",
    "x-symbol":"<i class=\"fas fa-times\"></i>"
}

const data =
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

