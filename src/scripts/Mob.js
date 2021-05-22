"use strict";

class Mob extends Character {

    //override to return the next move to execute
    //OK = false if no action, else true
    //msg should contain a message formatted for view (move description )g 
    //this function should decide what actions the mob takes; 
    //query _canAct to check if stunned or otherwise incapaciated, then run execCombatCmd(moveNOP) 
    calcCombatMove(enemys,friends){
        let rnd = _.random(1,100);
        let result = this._canAct();
        result.action =result.target= null;
        if(result.OK===false) {
            //window.gm.Encounter.execCombatCmd(window.gm.combat.moveNOP);
            return(result);
        }
        if(rnd>30) {  
            rnd = _.random(0,enemys.length-1);
            result.action = "Attack";// window.gm.Encounter.execCombatCmd(window.gm.combat.movePhysicalAttack);
            result.target = [enemys[rnd]];
            result.msg =this.name+" trys to attack you.</br>"+result.msg;
        } else {
            //result=window.gm.Encounter.execCombatCmd(window.gm.combat.moveGuard);
            result.msg =this.name+" takes a defensive stance.</br>"+result.msg;
        }
        return(result);
    }
    //override to adjust the mobs attributes to player level
    scaleLevel(lvl) {    };

}


