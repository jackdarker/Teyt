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
constructor(id) {
    this.id=this.name = id;
}
//_parent will be added dynamical
get parent() {return this._parent();}
get caster() {return this.parent.parent;}
//implement this for description
get desc() { return(this.name);}
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

getCost(){ //Todo
    //returns information about the cost to execute the skill
    return {}
}
getName(){
    //returns name of the skill for listboxes/labels"""
    return this.name;
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
                    X.target.addEffect(Y.id,Y);
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
                if(this.caster != targ) valid=false;
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
    multi.name = "all"; //there has to be a name for display
    for(var el of possibletarget) {
        if(el.length===1)   //dont stack multi-targets
            multi.push(el[0]);
    }
    if(multi.length>0) possibletarget.push(multi);
    //[[mole1],[mole2],[mole1,mole2]]
    return(possibletarget);
}
}