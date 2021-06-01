"use strict";

class SkillAttack extends Skill {
    //execute simple attack with active weapon
    constructor() {
        super("Attack");
        this.msg = '';
    }
    toJSON() {return window.storage.Generic_toJSON("SkillAttack", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillAttack, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        this.msg = '';
        if(this.isValidTarget(targets)) {
            result.OK = true;
            for(var target of targets) {
                let attack =window.gm.combat.defaultAttackData();
                let result2 = window.gm.combat.calcAttack(this.caster,target,attack);
                this.msg+=result2.msg;
                result.effects = result.effects.concat(attack.effects); 
            }
        }
        return result
    }
    getCastDescription(result) {
        return(this.msg);
    }
}
class SkillTease extends Skill {
    //execute simple attack with active weapon
    constructor() {
        super("Tease");
        this.msg = '';
    }
    toJSON() {return window.storage.Generic_toJSON("SkillTease", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillTease, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this,result.source = this.caster,result.targets = targets;
        this.msg = '';
        if(this.isValidTarget(targets)) {
            result.OK = true;
            for(var target of targets) {
                let attack =window.gm.combat.defaultAttackData();
                let result2 = window.gm.combat.calcTeaseAttack(this.caster,target,attack);
                this.msg+=result2.msg;
                result.effects = result.effects.concat(attack.effects); 
            }
        }
        return result
    }
    getCastDescription(result) {
        return(this.msg);
    }
}
class SkillStun extends Skill {
    //execute stun attack
    constructor() {  super("Stun");  }
    toJSON() {return window.storage.Generic_toJSON("SkillStun", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillStun, value.data));}
    targetFilter(targets){
        var possibletarget = this.targetFilterFighting(this.targetFilterEnemy(targets));
        //[[mole1],[mole2]]
        var multi = [];
        multi.name = "all";
        for(var el of possibletarget) {
            if(el.length===1)   //dont stack multi-targets
                multi.push(el[0]);
        }
        if(multi.length>1) possibletarget.push(multi);  //if there is only [[mole]] we dont want [[mole],[mole]]
        return(possibletarget);//[[mole1],[mole2],[mole1,mole2]]
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            for(var target of targets) {
                result.effects.push( {target:target,
                    eff:[new effStunned()]})
                }
        }
        return result
    }
    getCastDescription(result) {
        //update msg after sucessful cast
        return(this.caster.name +" stunned " + ((result.targets.length>1)?result.targets.name:result.targets[0].name)+".");
    }
}
class SkillPoisonCloud extends Skill {
    constructor() {  super("PoisonCloud");  }
    toJSON() {return window.storage.Generic_toJSON("SkillPoisonCloud", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillPoisonCloud, value.data));}
    targetFilter(targets){
        return(this.targetFilterFighting(this.targetFilterEnemy(targets)));
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            for(var target of targets) {
                result.effects.push( {target:target,
                    eff:[new effPoisoned()]})
                }
        }
        return result
    }
    getCastDescription(result) {
        //update msg after sucessful cast
        return(this.caster.name +" poisons " + result.targets.name+".");
    }
}
class SkillHeal extends Skill {
    constructor() { super("Heal");    }
    toJSON() {return window.storage.Generic_toJSON("SkillHeal", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillHeal, value.data));}
    targetFilter(targets){
        return(this.targetFilterAlly(this.targetFilterAlive(targets)));
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            for(var target of targets) {
                result.effects.push( {target:target,
                    eff:[new effHeal(10)]})
                }
        }
        return result
    }
}
class SkillFlee extends Skill {
    constructor() { super("Flee");    }
    toJSON() {return window.storage.Generic_toJSON("SkillFlee", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillFlee, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this,result.source = this.caster, result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            let rnd = _.random(1,100);
            if(rnd >40) { //Todo fleeing chance calculation
              result.msg += "You escaped the fight.";
              window.story.state.combat.playerFleeing = true;  //just setting the flag, you have to take care of handling!
            } else {
              result.msg += "Your attempts to escape failed.";
              //result.OK=false;
            }
        }
        return result
    }
}
class SkillSubmit extends Skill {
    constructor() { super("Submit");    }
    toJSON() {return window.storage.Generic_toJSON("SkillSubmit", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillSubmit, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this,result.source = this.caster, result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            let rnd = _.random(1,100);
            if(rnd >0) { //Todo fleeing chance calculation
                result.msg += "You submit to your foe.";
                window.story.state.combat.playerSubmitting = true;  //just setting the flag, you have to take care of handling!
            } else {
                result.msg += "Your attempts to submit failed.";
                //result.OK=false;
            }
        }
        return result
    }
}
class SkillGuard extends Skill {
    //todo improves defense
    constructor() { super("Guard");}
    toJSON() {return window.storage.Generic_toJSON("SkillGuard", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillGuard, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
      previewCast(targets){
          var result = new SkillResult()
          result.skill =this;
          result.source = this.caster;
          result.targets = targets;
          if(this.isValidTarget(targets)) {
              result.OK = true;
              for(var target of targets) {
                  /*result.effects.push( {target:target,
                      eff:[new effHeal(10)]})*/
                  }
          }
          return result
      }
}
class SkillUseItem extends Skill {
    constructor() {super("UseItem");
        this.item='';
        this.msg = '';
    }
    toJSON() {return window.storage.Generic_toJSON("SkillUseItem", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillUseItem, value.data));}
// first item has to be set
// then when targetFilter is called, forward the filterrequest to the item
// the item has to implement targetFilter and also check if the item is valid for use in combat    
    targetFilter(targets){
        return(this.caster.Inv.getItem(this.item).targetFilter(targets,this));
    }
    get item() {return this._item;}
    set item(item) {
        this._item=item;
        this.msg = '';
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            this.msg = result.msg = this.caster.Inv.use(this.item,targets).msg;    //Todo preview shouldnt call use !
        }
        return result
    }
    getCastDescription(result) {
        return(this.msg);
    }
}
//calls reinforcement; set item before casting to the mob-name to spawn
class SkillCallHelp extends Skill {
    static setup(item) {
        let sk = new SkillCallHelp();
        sk.item = item;
        //todo delay and cooldown
        return(sk);
    }
    constructor() {
        super("CallHelp");
        this.item='';
    }
    toJSON() {return window.storage.Generic_toJSON("SkillCallHelp", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillCallHelp, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this,result.source = this.caster,result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            for(var target of targets) {
                let eff = new effCallHelp();
                eff.configureSpawn(this.item,this.caster.faction);
                result.effects.push( {target:target,eff:[eff]});
            }
        }
        return result
    }
    isDisabled() { //Todo cooldown
        return({OK:false,msg:''});
    }
    getCastDescription(result) {
        return("Calls some "+this.item+" as reinforcement.");
    }
}
window.gm.SkillsLib = (function (Lib) {
    window.storage.registerConstructor(SkillAttack);
    window.storage.registerConstructor(SkillCallHelp);
    window.storage.registerConstructor(SkillFlee);
    window.storage.registerConstructor(SkillGuard);
    window.storage.registerConstructor(SkillHeal);
    window.storage.registerConstructor(SkillPoisonCloud);
    window.storage.registerConstructor(SkillStun);
    window.storage.registerConstructor(SkillSubmit);
    window.storage.registerConstructor(SkillTease);
    window.storage.registerConstructor(SkillUseItem);
    //.. and Wardrobe
    Lib['SkillAttack'] = function () { return new SkillAttack();};
    return Lib; 
}(window.gm.SkillsLib || {}));