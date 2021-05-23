"use strict";

class Mole extends Mob {
    constructor() {
        super();
        this.name = 'Mole';
        this.pic= 'assets/mole.jpg';
        this.Stats.increment('healthMax',-1*(this.health().max-20));
    }
    
};
class Wolf extends Mob {
    constructor() {
        super();
        this.name = 'Wolf';
        this.pic= 'assets/bw_wolf1.png';
        //this.Stats.increment('healthMax',-1*(this.health().max+20));
    }
};
class Mechanic extends Mob {
    constructor() {
        super();
        this.name = 'Mechanic-Guy';
        this.pic= 'assets/mechanic.jpg';
    }
    calcCombatMove(enemys,friends){
        let result = this._canAct();
        result.action =result.target= null;
        if(window.story.state.combat.turnCount<3) {
            result.action = "Stun";
            result.target = [enemys[rnd]];
            result.msg =this.name+" trys to hit your head whith his wrench.</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove());
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
    Mobs.Wolf = function () { return new Wolf();  };    
    Mobs.Mechanic = function () {return new Mechanic();};
    return Mobs; 
}(window.gm.Mobs || {}));