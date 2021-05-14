"use strict";
class SkillResult{
    constructor(){
          this.OK = false,
          this.source = null,
          this.targets = [],
          this.skill = null,
          this.effects = [];
    }
  }
  class Skill {
    constructor(name,descr,caster) {
      this.name = name;
      this.descr = descr;
      this.caster = caster;
      this.targetFilter = this.targetFilterEnemy;
    }
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
          for(var target of targets) {
            var _i = filtered.indexOf(target);
            if(_i<0) return false;
          }
          return true;
          //return ((this.targetFilter(targets))===(targets));//sorted(this.targetFilter()(targets))== sorted(targets))
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
    previewCast(targets){
          var result = new SkillResult();
          return result;
    }
    cast(targets){
          //execute the skill on the targets
          var result = this.previewCast(targets);
          if(result.OK) {
                for(var X of result.effects) {// for each target
                  for(var Y of X.eff) {//...multiple effects
                        X.target.addEffect(Y.name,Y);
                  }
                }
          }
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
      constructor(caster) {
          super("Attack","Attack",caster);
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
                      eff:this.calculateDamage(this.caster,target)})
                  }
          }
          return result
      }
      calculateDamage( caster,target) {
        var att = caster.Stats.get('pAttack').value;
        var def = target.Stats.get('pDefense').value;
        //var result = window.gm.combat.calcAttack(caster,target,{value:att,total:att});
        var x = att-def+5;
              return [new effDamage(x)];
              //return [EffMiss(caster,targets[0],'missed attack')]
      }
    }