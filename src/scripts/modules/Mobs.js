"use strict";

class Mob extends Character {

    //override to return the next move to execute
    //OK = false if move===null, else true
    //msg should contain a message formatted for view (move description and result) 
    _canAct() {
        var result = {OK:true,msg:''};
        if(this.Effects.findItemSlot("Stunned")) {
            result.OK=false;
            result.msg =this.name+ " is stunned and cannot react."
            return(result);
        }
        return(result);
    }
    calcCombatMove(){
        var rnd = _.random(1,100);
        var result = this._canAct();
        if(result.OK===false) return(result);
        if(rnd>30) {  
            result=window.gm.combat.execCombatCmd(window.gm.combat.movePhysicalAttack);
            result.msg =this.name+" trys to attack you.</br>"+result.msg;
        } else {
            result=window.gm.combat.execCombatCmd(window.gm.combat.moveGuard);
            result.msg =this.name+" takes a defensive stance.</br>"+result.msg;
        }
        return(result);
    }

}

class Mole extends Mob {
    constructor() {
        super();
        this.name = 'Mole';
        this.pic= 'assets/mole.jpg';
    }
    
};
class Mechanic extends Mob {
    constructor() {
        super();
        this.name = 'Mechanic-Guy';
        this.pic= 'assets/mechanic.jpg';
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
    Mobs.Mechanic = function () {return new Mechanic();};
    return Mobs; 
}(window.gm.Mobs || {}));
