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
    this.targetFilter = this.targetFilterEnemy;
}
//_parent will be added dynamical
get parent() {return this._parent();}
get caster() {return this.parent.parent;}
getMaxTargetCount() {return 1;}
/*targetFilter(){
        //returns a function to filter a list of possible targets for targets that this skill can cast on
        //myFilter(targets)->targets   teams is a array of party; targets is a list of character
        return this.targetFilterEnemy;
}*/
isValidPhase() {
        //returns True if the skill can be used in tha actual game-phase (combatPhase,explorePhase)
        return true;
}

isDisabled() {
    //returns True and text if the skill cannot be used because its temporary disabled (silenced mage, blinded)
    //the text should indicate why and how long it is disabled
    return ({OK:false,msg:''});
}

isValidTarget(targets) {
        //returns True if the skill can be used on the target(s)
        var filtered = this.targetFilter(targets);
todo filtered can be [mole1,mole2] or [dragon,[mole1,mole2]]
targets is dragon or [mole1,mole2]
    if(targets.length>1) {
        for(var filt of filtered) {
            if(targets===filt) return true;
        }
        return false;
    }else {
        for(var target of targets) {
            var _i = filtered.indexOf(target);
            if(_i<0) return false;
        }
        return true;
    }
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
previewCast(targets){
        var result = new SkillResult();
        result.msg = this.caster.name +" will use "+ this.name +" on " + targets[0].name;
        return(result);
}
cast(targets){
    //execute the skill on the targets
    var result = this.previewCast(targets);
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
            if(this.caster == target)
                possibleTarget.push(target);
        }
        return possibleTarget;
}
targetFilterAlly(targets){
        var possibleTarget = [];
        for(var target of targets){
            if(this.caster.faction == target.faction)
                possibleTarget.push(target);
        }
        return possibleTarget;
}
targetFilterEnemy(targets){
        var possibleTarget = [];
        for(var target of targets){
            if(this.caster.faction != target.faction)
                possibleTarget.push(target);
        }
        return possibleTarget;
}
targetFilterFighting(targets){
        //chars that are not inhibited"""
        var possibleTarget = [];
        for(var target of targets){
            if(target._canAct().OK)
                possibleTarget.push(target);
        }
        return possibleTarget
}
targetFilterDead(targets){
    //chars that are dead"""
        var possibleTarget = [];
        for(var target of targets){
            if(!target.isDead()) 
                possibleTarget.push(target);
        }
        return possibleTarget;
}
}
  
class SkillAttack extends Skill {
    //execute simple attack with active weapon
    constructor() {
        super("Attack","Attack");
        this.targetFilter = (function(targets) { return(this.targetFilterEnemy(targets));});
    }
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            for(var target of targets) {
                var eff = this.calculateDamage(this.caster,target);
                result.effects.push( {target:target,
                    eff:eff});
            }
        }
        return result
    }
    calculateDamage( caster,target) {
    var att = caster.Stats.get('pAttack').value;
    var def = target.Stats.get('pDefense').value;
    var blunt = caster.Outfit.countItem("Shovel");
    //var result = window.gm.combat.calcAttack(caster,target,{value:att,total:att});
    var x = att-def+5;
    var eff = [new effDamage(x)];
    if(blunt>0) eff.push(new effStunned());
    return(eff);
            //return [EffMiss(caster,targets[0],'missed attack')]
    }
}
class SkillStun extends Skill {
    //execute stun attack
    constructor() {
        super("Stun","Stun");
        this.targetFilter = (function(targets) { 
            var prefiltered = this.targetFilterFighting(this.targetFilterEnemy(targets));
            prefiltered.name = "all";
            var possibletarget = [prefiltered];
            return(possibletarget);});
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
        return(this.caster.name +" stunned " + result.targets[0]+".");
    }
}
class SkillPoisonCloud extends Skill {
    constructor() {
        super("PoisonCloud","PoisonCloud");
        this.targetFilter = (function(targets) { return(this.targetFilterFighting(this.targetFilterEnemy(targets)));});
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
        return(this.caster.name +" poisons " + result.targets[0]+".");
    }
}
class SkillHeal extends Skill {
      //execute stun attack
      constructor() {
          super("Heal","Heal");
          this.targetFilter = (function(targets) { return(targets);});
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
          this.targetFilter = (function(targets) { return(this.targetFilterSelf(targets));});
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