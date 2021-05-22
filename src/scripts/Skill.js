"use strict";
class SkillResult{
    constructor(){
          this.OK = false,
          this.source = null,
          this.targets = [],
          this.skill = null,
          this.msg = "",
          this.effects = [];
    }
  }


class Skill {
constructor(name,descr) {
    this.name = name;
    this.descr = descr;
}
//_parent will be added dynamical
get parent() {return this._parent();}
get caster() {return this.parent.parent;}
getMaxTargetCount() {return 1;}

isValidPhase() {
        //returns True if the skill can be used in tha actual game-phase (combatPhase,explorePhase)
        return true;
}

isDisabled() {
    //returns True and text if the skill cannot be used because its temporary disabled (silenced mage, blinded)
    //the text should indicate why and how long it is disabled
    return ({OK:false,msg:''});
}
//this is used to filter possible targets for a skill
//the function returns a array of arrays containing the targets  
//f.e. [[dragon],[mole1,mole2]] to indicate that the skill can be used on dragon or both moles at same time
targetFilter(targets){
    return(this.targetFilterEnemy(targets));
}
//returns True if the skill can be used on the target(s)
isValidTarget(target) {
    // filtered can be [[mole1,mole2]] or [[dragon],[mole1,mole2]]
    //target is [dragon] or [mole1,mole2]
    var filtered = this.targetFilter([target]); //[[]] !
    for(var targ of target) {
        var _i = filtered.indexOf(target);
        if(_i<0) return false;
    }
    return true;
}

getCost(){
        //returns information about the cost to execute the skill
        return {}
}
getName(){
        //returns name of the skill for listboxes/labels"""
        return this.name;
}
getDescription(){
        //returns a description of the skill for tooltip
        return this.descr;
}
getCastDescription(result) {
    //update msg after sucessful cast
    return(this.caster.name +" uses "+ this.name +" on " + result.targets[0].name+".");
}
previewCast(target){
        var result = new SkillResult();
        result.msg = this.caster.name +" will use "+ this.name +" on " + targets.name;
        return(result);
}
cast(target){
    //execute the skill on the targets
    var result = this.previewCast(target);
    if(result.OK) {
        result.msg = "";
        for(var X of result.effects) {// for each target
            for(var Y of X.eff) {//...multiple effects
                    X.target.addEffect(Y.name,Y);
            }
        }
        result.msg += this.getCastDescription(result); 
    }
    return(result)
}

//some predefined filter; chain them to narrow down the targets
targetFilterSelf(targets){
        var possibleTarget = [];
        for(var target of targets) {
            var valid = true;
            for(var targ of target) {
                if(this.caster != target) valid=false;
            }
            if(valid)
                possibleTarget.push(target);           
        }
        return possibleTarget;
}
targetFilterAlly(targets){
        var possibleTarget = [];
        for(var target of targets){
            var valid = true;
            for(var targ of target) {
                if(this.caster.faction != targ.faction) valid=false;
            }
            if(valid)
                possibleTarget.push(target);     
        }
        return possibleTarget;
}
targetFilterEnemy(targets){
        var possibleTarget = [];
        for(var target of targets){
            var valid = true;
            for(var targ of target) {
                if(this.caster.faction == targ.faction) valid=false;
                if(targ.isDead()) valid=false;
            }
            if(valid)
                possibleTarget.push(target);
        }
        return possibleTarget;
}
targetFilterFighting(targets){
        //chars that are not inhibited
        var possibleTarget = [];
        for(var target of targets){
            var valid = true;
            for(var targ of target) {
                if(!targ._canAct().OK) valid=false;
            }
            if(valid)
                possibleTarget.push(target); 
        }
        return possibleTarget
}
targetFilterAlive(targets){
    //chars that are not dead
        var possibleTarget = [];
        for(var target of targets){
            var valid = true;
            for(var targ of target) {
                if(targ.isDead()) valid=false;
            }
            if(valid)
                possibleTarget.push(target); 
        }
        return possibleTarget;
}
targetFilterDead(targets){
    //chars that are dead
        var possibleTarget = [];
        for(var target of targets){
            var valid = true;
            for(var targ of target) {
                if(!targ.isDead()) valid=false;
            }
            if(valid)
                possibleTarget.push(target); 
        }
        return possibleTarget;
}
targetMultiple(targets){
    var possibletarget = targets.slice(0);
    //[[mole1],[mole2]]
    var multi = [];
    multi.name = "all";
    for(var el of possibletarget) {
        if(el.length===1)   //dont stack multi-targets
            multi.push(el[0]);
    }
    if(multi.length>0) possibletarget.push(multi);
    //[[mole1],[mole2],[mole1,mole2]]
    return(possibletarget);
}
}
  
class SkillAttack extends Skill {
    //execute simple attack with active weapon
    constructor() {
        super("Attack","Attack");
        this.msg = '';
    }
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
                //var eff = this.calculateDamage(this.caster,target);
                //result.effects.push( {target:target,eff:eff});
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
    constructor() {
        super("Stun","Stun");
    }
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
    constructor() {
        super("PoisonCloud","PoisonCloud");
    }
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
    //execute stun attack
    constructor() {
        super("Heal","Heal");
    }
    targetFilter(targets){
        return(this.targetFilterAlive(targets));
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
class SkillGuard extends Skill {
    //todo improves defense
    constructor() {
        super("Guard","Guard");
    }
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
    constructor() {
        super("UseItem","UseItem");
        this.item=null;
        this.msg = '';
    }
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