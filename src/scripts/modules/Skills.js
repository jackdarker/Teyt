"use strict";

class SkillInspect extends Skill {
    constructor() {
        super("Inspect");
        this.msg = '';
    }
    toJSON() {return window.storage.Generic_toJSON("SkillInspect", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillInspect, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    get desc() { return("Check out your foe.");}
    previewCast(targets){
        var result = new SkillResult();
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        this.msg = '';
        if(this.isValidTarget(targets)) {
            result.OK = true;
            result.msg = this.msg = window.gm.printBodyDescription(targets[0],true);
            //todo display stats dependign on skill
        }
        return result
    }
    getCastDescription(result) {
        return(this.msg);
    }
}
//execute simple attack with active weapon or claws
class SkillAttack extends Skill {
    constructor() {
        super("Attack");
        this.msg = '';
    }
    toJSON() {return window.storage.Generic_toJSON("SkillAttack", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillAttack, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    get desc() { return("Use weapon or claws to deal damage.");}
    previewCast(targets){
        var result = new SkillResult();
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        this.msg = '';
        if(this.isValidTarget(targets)) {
            result.OK = true;
            for(var target of targets) {
                let attack = this.__estimateAttack()
                let result2 = window.gm.combat.calcAttack(this.caster,target,attack);
                this.msg+=result2.msg;
                result.effects = result.effects.concat(attack.effects); 
            }
        }
        return result;
    }
    __estimateAttack() {
        let attack =window.gm.combat.defaultAttackData();
        let lHand=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.LHand);
        let rHand=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.RHand);
        let lHDmg=0,rHDmg=0;
        if(rHand) { //get weapon damage info
            rHDmg = rHand.pDamage || 0;
        }
        if(lHand) { 
            lHDmg = lHand.pDamage || 0;
        }
        if(!lHand && ! rHand) { //if has no weapon get body damage
            rHand=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bHands);
            if(rHand) {
                rHDmg = (rHand.data!=='undefined')?rHand.data.pDamage || 0:0;
            }
        }
        if(lHand===rHand) {
            attack.value=lHDmg;
        } else {
            attack.value=lHDmg+rHDmg;
        }
        attack.value+=this.caster.Stats.get('pAttack').value;
        attack.total = attack.value;
        return(attack);
    }
    getCastDescription(result) {
        return(this.msg);
    }
}

/*    __estimateAttack() {
        let attack =window.gm.combat.defaultAttackData();
        let lHand=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.LHand);
        let rHand=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.RHand);
        let rHDmg;
        if(rHand) { //get weapon damage info
            rHDmg = rHand.attack;
        } else if(lHand) { 
            rHDmg = lHand.attack;
        }
        if(!lHand && ! rHand) { //if has no weapon get body damage
            rHand=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bHands);
            if(rHand) {
                rHDmg = (rHand.data!=='undefined')?rHand.data.attack || 0:0;
            }
        }
        attack.input=rHDmg;
        return(attack);
    }
    getCastDescription(result) {
        return(this.msg);
    }
*/
class SkillUltraKill extends SkillAttack {
    constructor() {
        super();
        this.id=this.name='UltraKill'
        this.msg = '';
    }
    toJSON() {return window.storage.Generic_toJSON("SkillUltraKill", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillUltraKill, value.data));}
    __estimateAttack() {
        let attack =window.gm.combat.defaultAttackData();
        attack.value= 99999;
        attack.total = attack.value;
        return(attack);
    }
}
//execute attack with Face
class SkillBite extends SkillAttack {
    constructor() {
        super();
        this.id=this.name='Bite'
        this.msg = '';
    }
    toJSON() {return window.storage.Generic_toJSON("SkillBite", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillBite, value.data));}
    get desc() { return("Use your maw to bite the foe.");}
    __estimateAttack() {
        let attack =window.gm.combat.defaultAttackData();
        let mouth=this.caster.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bMouth);
        let mouthDmg =0;
        if(mouth) { //get teeth damage info
            mouthDmg = mouth.data.pDamage || 0;
        }
        attack.value+= mouthDmg+ this.caster.Stats.get('pAttack').value;
        attack.total = attack.value;
        return(attack);
    }
}
class SkillChainLightning  extends Skill {
    constructor() {
        super('ChainLightning');
        this.msg = '';
    }
    toJSON() {return window.storage.Generic_toJSON("SkillChainLightning", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillChainLightning, value.data));}
    get desc() { return("Throw some sparks at your foes.");}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    previewCast(targets){
        var result = new SkillResult();
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        this.msg = '';
        if(this.isValidTarget(targets)) {
            result.OK = true;
            let target = targets[0];
            let attack =window.gm.combat.defaultAttackData();
            // attack.effects.push(effDamage.setup(15,'spark'))
            //calc hit-chance
            //cause spark-dmg
            //chance to hit secondary target
            let secTarget = window.story.state.combat.playerParty.concat(window.story.state.combat.enemyParty);
            secTarget = this.targetFilterEnemy(this.targetFilterAlive(secTarget));
            let secTarget2=[];

            while(secTarget.length>_i) {
                let target2 = secTarget.pop()[0]; //[[mob1]]
                if(target2!==target) {
                    secTarget2.push(target2);
                }
                if(secTarget2.length>=2) break;
            }
            //spark-dmg to secondary target
            let result2 = window.gm.combat.calcTeaseAttack(this.caster,target,attack);
            this.msg+=result2.msg;
            result.effects = result.effects.concat(attack.effects); 
        }
        return result;
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
    toJSON() {return window.storage.Generic_toJSON("SkillTease", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillTease, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    previewCast(targets){
        var result = new SkillResult();
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
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
    constructor() {  super("Stun");  
    this.cost.energy =20;
    }
    toJSON() {return window.storage.Generic_toJSON("SkillStun", this); }
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
    get desc() { return("A successful stun lowers the foes chance to evade and might disable them for some time. "+this.getCost().asText());}
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
    toJSON() {return window.storage.Generic_toJSON("SkillPoisonCloud", this); }
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
    constructor() { super("Heal");   
    this.cost.will =20; 
    }
    toJSON() {return window.storage.Generic_toJSON("SkillHeal", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillHeal, value.data));}
    targetFilter(targets){
        return(this.targetFilterAlly(this.targetFilterAlive(targets)));
    }
    get desc() { return("Restore some health. "+this.getCost().asText());}
    previewCast(targets){
        var result = new SkillResult()
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)) {   //todo  consume energy
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
    constructor() { 
        super("Flee"); 
        this.msg = '';   }
    toJSON() {return window.storage.Generic_toJSON("SkillFlee", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillFlee, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    previewCast(targets){
        var result = new SkillResult()
        this.msg = '';
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
            this.msg = result.msg;
        }
        return result
    }
    getCastDescription(result) {
        return(this.msg);
    }
}
class SkillSubmit extends Skill {
    constructor() { 
        super("Submit"); 
        this.msg = '';   }
    toJSON() {return window.storage.Generic_toJSON("SkillSubmit", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillSubmit, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    previewCast(targets){
        var result = new SkillResult()
        this.msg = '';
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
            this.msg = result.msg;
        }
        return result
    }
    getCastDescription(result) {
        return(this.msg);
    }
}
class SkillGrapple extends Skill {
    constructor() { 
        super("Grapple");
        this.msg = ''; }
    toJSON() {return window.storage.Generic_toJSON("SkillGrapple", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillGrapple, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    get desc() { return("Grapple the opponent to restrict his movement.");}
    previewCast(targets){
        var result = new SkillResult();
        this.msg = '';
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            var target=targets[0];
            var rnd = _.random(0,100);
            if(rnd>30) { //todo chance to grapple depends on?
                let x = effGrappled.factory();
                //let grappled = new effGrappled(2), grappling= new effGrappling();
                //let x = new effCombined([grappled,grappling ]);
                result.effects.push( {target:this.caster,eff:[x.sourceEff]});//,heal,leeching]
                result.effects.push( {target:target,eff:[x.targetEff]});
            } 
        }
        this.msg = result.msg;
        return result
    }
    getCastDescription(result) {
        return(this.msg);
    }
}
//char attaches itself to target and sucks health
class SkillLeechHealth extends Skill {
    constructor() { 
        super("Leech");
        this.msg = ''; }
    toJSON() {return window.storage.Generic_toJSON("SkillLeechHealth", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillLeechHealth, value.data));}
    targetFilter(targets){
        return(this.targetFilterEnemy(this.targetFilterAlive(targets)));
    }
    get desc() { return("Grapple the opponent and suck the life from him.");}
    previewCast(targets){
        var result = new SkillResult();
        this.msg = '';
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            var target=targets[0];
            var rnd = _.random(0,100);
            if(rnd>30) { //todo chance to grapple depends on?
                let x = effGrappled.factory();
                this.__combineGrabAndLeech(x.targetEff,x.sourceEff);
                result.effects.push( {target:this.caster,eff:[x.sourceEff]});//,heal,leeching]
                result.effects.push( {target:target,eff:[x.targetEff]}); //im
            } 
        }
        this.msg = result.msg;
        return result
    }
    __combineGrabAndLeech(grabEff,grapplingEff) {
        grapplingEff.onTurnStart = (function(me){
            let eff = grapplingEff;
            let _old = eff.onTurnStart.bind(eff); 
            let foo = function() {
                _old(); //override  but call orignial fct
                eff.parent.parent.Stats.increment('health',5);  //todo scale by ??
            }
            return(foo);
        } (this));
        grabEff.onTurnStart = (function(me){
            let eff = grabEff;
            let _old = eff.onTurnStart.bind(eff); 
            let foo = function() {
                _old(); //override  but call orignial fct
                eff.parent.parent.Stats.increment('health',-5);
            }
            return(foo);
        } (this));
    }
    getCastDescription(result) {
        return(this.msg);
    }
}
//try to ungrapple
class SkillStruggle extends Skill {
    //todo improves defense
    constructor() { 
        super("Struggle");
        this.msg = '';}
    toJSON() {return window.storage.Generic_toJSON("SkillStruggle", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillStruggle, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    get desc() { return("Try to escape a grapple.");}
    isEnabled() {
        let res= super.isEnabled();
        if(res.OK===false) return(res);
        let x = !(this.parent.parent.Effects.countItem(effGrappled.name)<=0);
        return({OK:x,msg:''});
    }
    previewCast(targets){
        var result = new SkillResult();
        this.msg = '';
        result.skill =this;
        result.source = this.caster;
        result.targets = targets;
        if(this.isValidTarget(targets)) {
            result.OK = true;
            for(var target of targets) {
                if(target.Effects.countItem(effGrappled.name)>0) {
                var rnd = _.random(0,100);
                var eff = target.Effects.get(effGrappled.name);
                result.msg = "Attempts to escape the grapple failed.";
                if(rnd>30) { //todo chance to ungrapple increase over time
                    result.effects.push( {target:target,
                      eff:[new effUngrappling(eff)]});
                    result.msg = this.caster.name+" was able to escape from "+eff.source.parent.parent.name+".";
                }
                }
                
            }
        }
        this.msg = result.msg;
        return result
    }
    getCastDescription(result) {
        return(this.msg);
    }
}
class SkillGuard extends Skill {
    //todo improves defense; 
    constructor() { super("Guard");}
    toJSON() {return window.storage.Generic_toJSON("SkillGuard", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkillGuard, value.data));}
    targetFilter(targets){
        return(this.targetFilterSelf(targets));
    }
    get desc() { return("Boosts your defense.");}  
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
    toJSON() {return window.storage.Generic_toJSON("SkillUseItem", this); }
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
    get desc() { return("Summon "+this.item);}
    toJSON() {return window.storage.Generic_toJSON("SkillCallHelp", this); }
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
    getCastDescription(result) {
        return("Calls some "+this.item+" as reinforcement.");
    }
}
window.gm.SkillsLib = (function (Lib) {
    window.storage.registerConstructor(SkillAttack);
    window.storage.registerConstructor(SkillBite);
    window.storage.registerConstructor(SkillCallHelp);
    window.storage.registerConstructor(SkillGrapple);
    window.storage.registerConstructor(SkillFlee);
    window.storage.registerConstructor(SkillGuard);
    window.storage.registerConstructor(SkillHeal);
    window.storage.registerConstructor(SkillInspect);
    window.storage.registerConstructor(SkillPoisonCloud);
    window.storage.registerConstructor(SkillStun);
    window.storage.registerConstructor(SkillSubmit);
    window.storage.registerConstructor(SkillStruggle);
    window.storage.registerConstructor(SkillTease);
    window.storage.registerConstructor(SkillUltraKill);
    window.storage.registerConstructor(SkillUseItem);
    //    Lib['SkillAttack'] = function () { return new SkillAttack();};
    return Lib; 
}(window.gm.SkillsLib || {}));

/*todo 
Slash: (weapontype) causes slash-damage; chance to cause bleed on critical (on non-constructs/conjuration)

Stoneskin: (passive) if a slash-attack would cause bleed; attackers weapon gets blunted for rest of fight

GolemCrusher: increased blunt-damage against golems

LifeDrain: soul-damage; restores health equal to fraction of damage caused on living

Supraconductor: incoming ice-damage has chance to increase spark-damage output for some turns; but fire-damage has the oposite effect

BladeMace: deals slash or blunt-damage depending which would cause more damage

PoisonCloud: small damage over time to lifing  
 */