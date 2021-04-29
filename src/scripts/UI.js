
"use strict";
// SelectionController ist eine abstrakte Basisklasse für die konkreten Controller, die zur Anbindung der select Elemente dienen
// Abstrakte Methoden sind
// getValue(key) - muss das Datenobjekt liefern, das zu einer ausgewählten option gehört.
// Als key wird der Wert des value-Attributs dieser Option übergeben.
// getValueList(dataSource) - muss Daten für die option-Elemente liefern, die im select 
// Element einzutragen sind. Ergebnis muss ein Array aus Objekten sein, jedes Objekt muss
// die Properties value (für das value-Attribut) und text (für den Inhalt des option Elements) enthalten
