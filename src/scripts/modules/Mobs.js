"use strict";
/*
- imp
- nymph
- kobold
- naga
- stagboy
- werwolf

- Giant-Snake
- Giant wasp
- raptor
- gryphon
- drider

 */
class Mole extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Mole';
        this.pic= 'assets/mole.jpg';
        this.Stats.increment('healthMax',-1*(this.health().max-20));
    }
    
};

class Wolf extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Wolf';
        this.pic= 'assets/bw_wolf1.png';
        this.level_min =3;
        this.Outfit.addItem(HandsPaw.factory('dog'));
        this.Outfit.addItem(new FaceWolf());
        this.fconv = window.gm.util.descFixer(this);
    }
    calcCombatMove(enemys,friends){
        let result = this._canAct();
        if(result.OK===false) return(result);
        let rnd = _.random(1,100);
        result.action =result.target= null;
        if(window.story.state.combat.turnCount%2===0) {
            rnd = _.random(0,enemys.length-1);
            result.action = "Bite";
            result.target = [enemys[rnd]];
            result.msg =this.fconv("$[I]$ $[snap]$ at "+result.target[0].name+".</br>")+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
};
class Leech extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Leech';
        this.pic= 'assets/Leech.png';    //todo
        this.level_min =1;
        this.fconv = window.gm.util.descFixer(this);
        this.Skills.addItem(new SkillLeechHealth());
        this.tmp = {grappleCoolDown:1};
    }
    calcCombatMove(enemys,friends){
        let result = this._canAct();
        if(result.OK===false) return(result);
        let rnd = _.random(1,100);
        result.action =result.target= null;
        if(this.Effects.countItem(effGrappling.name)>0) {
            this.tmp.grappleCoolDown=2;
            result.msg =this.fconv(this.name +" sucks blood.</br>")+result.msg;
            return(result);
        } else if(this.tmp.grappleCoolDown<=0){
            this.tmp.grappleCoolDown=2;
            rnd = _.random(0,enemys.length-1);
            result.action = "Leech";
            result.target = [enemys[rnd]];
            result.msg =this.fconv("$[I]$ $[snap]$ at "+result.target[0].name+".</br>")+result.msg;
            return(result);
        } else {
            this.tmp.grappleCoolDown-=1;
        } 
        return(super.calcCombatMove(enemys,friends));
    }
};
class Mechanic extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Mechanic-Guy';
        this.pic= 'assets/mechanic.jpg';
    }
    calcCombatMove(enemys,friends){
        let result = this._canAct();
        if(result.OK===false) return(result);
        let rnd = _.random(1,100);
        result.action =result.target= null;
        if(window.story.state.combat.turnCount<3) {
            rnd = _.random(0,enemys.length-1);
            result.action = "Stun";
            result.target = [enemys[rnd]];
            result.msg =this.name+" trys to hit your head whith his wrench.</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
};
//this looks weird but works; use this as template how to add more mobs
window.gm.Mobs = (function (Mobs) {
    Mobs.Mole = function () { return new Mole();  };    //add Mole-constructor to Mob-ollection
    Mobs.Wolf = function () { return new Wolf();  };    
    Mobs.Leech = function () { return new Leech();  };   
    Mobs.Mechanic = function () {return new Mechanic();};
    return Mobs; 
}(window.gm.Mobs || {}));