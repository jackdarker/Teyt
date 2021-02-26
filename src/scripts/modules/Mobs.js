"use strict";

class Mole extends Character {
    constructor() {
        super();
        this.name = 'Mole';
        this.pic= 'assets/mole.jpg';
    }
    calcCombatMove(){
        var rnd = _.random(1,100);
        var result = {OK:true,msg:''};
        if(rnd>30) {
            result.msg +=this.name+" try to attack you.</br>";
            result.msg +=window.gm.execCombatCmd('Attack');
        } else {
            result.msg +=this.name+" takes a defensive stance.</br>";
            result.msg +=window.gm.execCombatCmd('Guard');
        }
        return(result);
    }
};
//this looks weird but works; use this as template how to add more mobs
window.gm.Mobs = (function (Mobs) {
    // Private Objekte
    /*var privateVariable = "privat";
    function privateFunktion () {
        alert("privateFunktion wurde aufgerufen\n" +
            "Private Variable: " + privateVariable);
    }*/

    Mobs.Mole = function () { return new Mole();  };    //add Mole-constructor to Mob-ollection
    return Mobs; 
}(window.gm.Mobs || {}));
