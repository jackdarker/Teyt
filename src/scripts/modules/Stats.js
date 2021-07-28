"use strict";
//this is special stat used together with Relation-collection
//person is used as id instead of stat-name
class stRelation extends Stat {
    static setup(context, base,max,person) {    //todo Max-Limit
        let _stat = new stRelation();
        let _n = _stat.data;
        _n.id=person+"_Max",_n.base=max, _n.value=max,_n.limits=[{max:999,min:-999}];
        context.addItem(_stat);
        _stat = new stRelation();
        _n = _stat.data;
        _n.id=person+"_Min",_n.base=0, _n.value=0,_n.limits=[{max:999,min:-999}];
        context.addItem(_stat);
        _stat = new stRelation();
        _n = _stat.data;
        _n.id=person,_n.base=base, _n.value=base,_n.limits=[{max:person+"_Max",min:person+"_Min"}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {   super();  }
    toJSON() {return window.storage.Generic_toJSON("stRelation", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stRelation, value.data);};
    formatMsgStatChange(attr,_new,_old) {
        if((_new-_old)>0) {
            return('<statup>Your relation to '+attr.id+" improved by "+(_new-_old).toFixed(1).toString()+"</statup>");
        } else if ((_new-_old)<0) {
            return('<statdown>Your relation to '+attr.id+" worsend by "+(_new-_old).toFixed(1).toString()+"</statdown>");
        } else {
            return('Your relation to '+attr.id+" wasnt affected at all by your behaviour.</br>");
        }
    };
}
//generic class for resistance to damage like blunt, fire, poison,...
// Resistance is modified by effects (applied by equipment/perks/items) and stats
// 0 = no bonus resistance; -20 = 20% weaker ; capped at +-100% ?
class stResistance extends Stat {
    static setup(context, base,kind) {   
        let _stat = new stResistance();
        let _n = _stat.data;
        _n.id="rst"+kind,_n.base=base, _n.value=base,_n.limits=[{max:100,min:-100}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {   super();  }
    toJSON() {return window.storage.Generic_toJSON("stResistance", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stResistance, value.data);};
}
//generic class for armor
class stArmor extends Stat {
    static setup(context, base,name) {   
        let _stat = new stArmor();
        let _n = _stat.data;
        _n.id="arm"+name,_n.base=base, _n.value=base,_n.limits=[{max:999999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {   super();  }
    toJSON() {return window.storage.Generic_toJSON("stArmor", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stArmor, value.data);};
}
class stHealthMax extends Stat {
    static setup(context, max) {
        var _stat = new stHealthMax();
        var _n = _stat.data;
        _n.id='healthMax',_n.base=max, _n.value=max,_n.modifys=[{id:'health'}],_n.limits=[{max:99999,min:0}];
        context.addItem(_stat);
        //_stat.Calc(); cause problem because health not yet present
    }
    constructor() { super();    }
    toJSON() {return window.storage.Generic_toJSON("stHealthMax", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stHealthMax, value.data);};
}
class stHealth extends Stat {
    static setup(context, base,max) {
        stHealthMax.setup(context,max);
        var _stat = new stHealth();
        var _n = _stat.data;
        _n.id='health',_n.base=base, _n.value=base,_n.limits=[{max:'healthMax',min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {  super();   }
    toJSON() {return window.storage.Generic_toJSON("stHealth", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stHealth, value.data);};
}
class stEnergyMax extends Stat {
    static setup(context, max) {
        var _stat = new stEnergyMax();
        var _n = _stat.data;
        _n.id='energyMax',_n.base=max, _n.value=max,_n.modifys=[{id:'energy'}],_n.limits=[{max:99999,min:0}];
        context.addItem(_stat);

    }
    constructor() {  super();    }
    toJSON() {return window.storage.Generic_toJSON("stEnergyMax", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stEnergyMax, value.data);};
}
class stEnergy extends Stat {
    static setup(context, base,max) {
        stEnergyMax.setup(context,max);

        var _stat = new stEnergy();
        var _n = _stat.data;
        _n.id='energy',_n.base=base, _n.value=base,_n.limits=[{max:'energyMax',min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() { super();   }
    toJSON() {return window.storage.Generic_toJSON("stEnergy", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stEnergy, value.data);};
}
class stWillMax extends Stat {
    static setup(context, max) {
        var _stat = new stWillMax();
        var _n = _stat.data;
        _n.id='willMax',_n.base=max, _n.value=max,_n.modifys=[{id:'will'}],_n.limits=[{max:99999,min:0}];
        context.addItem(_stat);
    }
    constructor() {  super();    }
    toJSON() {return window.storage.Generic_toJSON("stWillMax", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stWillMax, value.data);};
}
class stWill extends Stat {
    static setup(context, base,max) {
        stWillMax.setup(context,max);

        var _stat = new stWill();
        var _n = _stat.data;
        _n.id='will',_n.base=base, _n.value=base,_n.limits=[{max:'willMax',min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() { super();   }
    toJSON() {return window.storage.Generic_toJSON("stWill", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stWill, value.data);};
}
class stArousalMax extends Stat {
    static setup(context, max) {
        var _stat = new stArousalMax();
        var _n = _stat.data;
        _n.id='arousalMax',_n.base=max, _n.value=max, _n.hidden=3,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stArousalMax", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stArousalMax, value.data);};
}
class stArousalMin extends Stat {
    static setup(context, max) {
        var _stat = new stArousalMin();
        var _n = _stat.data;
        _n.id='arousalMin',_n.base=0, _n.value=0, _n.hidden=1,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stArousalMin", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stArousalMin, value.data);};
}
class stArousal extends Stat{
    static setup(context, base,max) {
        stArousalMax.setup(context,max);
        stArousalMin.setup(context,0);
        var _stat = new stArousal();
        var _n = _stat.data;
        _n.id='arousal', _n.hidden=3,_n.base=base, _n.value=base,_n.limits=[{max:'arousalMax',min:'arousalMin'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stArousal", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stArousal, value.data);};
}
////    Base-Stats ///////////////////////////////////////////////
class stAgility extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stAgility();
        var _n = _stat.data;
        _n.id='agility',_n.base=base, _n.value=base,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stAgility", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stAgility, value.data);};
    updateModifier() {
        this.parent.addModifier('energyMax',{id:'agility', bonus:this.parent.get('agility').value*2});
    };
}
class stPerception extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stPerception();
        var _n = _stat.data;
        _n.id='perception',_n.base=base, _n.value=base,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stPerception", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stPerception, value.data);};
    updateModifier() {
        this.parent.addModifier('willMax',{id:'perception', bonus:this.parent.get('perception').value*2});
    };
}
class stLuck extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stLuck();
        var _n = _stat.data;
        _n.id='luck',_n.base=base, _n.value=base,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stLuck", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stLuck, value.data);};
    updateModifier() {
    };
}
class stCharisma extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stCharisma();
        var _n = _stat.data;
        _n.id='charisma',_n.base=base, _n.value=base,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stCharisma", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stCharisma, value.data);};
    updateModifier() {
        this.parent.addModifier('energyMax',{id:'charisma', bonus:this.parent.get('charisma').value*2});
    };
}
class stIntelligence extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stIntelligence();
        var _n = _stat.data;
        _n.id='intelligence',_n.base=base, _n.value=base,_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {        super(); }
    toJSON() {return window.storage.Generic_toJSON("stIntelligence", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stIntelligence, value.data);};
    updateModifier() {
        this.parent.addModifier('willMax',{id:'intelligence', bonus:this.parent.get('intelligence').value*2});
    };
}
class stStrength extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stStrength();
        var _n = _stat.data;
        _n.id='strength',_n.base=base, _n.value=base, _n.modifys=[{id:'healthMax'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {        super();}
    toJSON() {return window.storage.Generic_toJSON("stStrength", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stStrength, value.data);};
    updateModifier() {
        this.parent.addModifier('healthMax',{id:'strength', bonus:this.parent.get('strength').value*2});
        //this.parent.addModifier('pAttack',{id:'strength', bonus:Math.floor(this.parent.get('strength').value/4)});
    };
}
class stEndurance extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stEndurance();
        var _n = _stat.data;
        _n.id='endurance',_n.base=base, _n.value=base, _n.modifys=[{id:'healthMax'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {        super();}
    toJSON() {return window.storage.Generic_toJSON("stEndurance", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stEndurance, value.data);};
    updateModifier() {
        this.parent.addModifier('healthMax',{id:'endurance', bonus:this.parent.get('endurance').value*2});
        //this.parent.addModifier('pDefense',{id:'strength', bonus:this.parent.get('endurance').value%4});
    };
}
////////////////////////////////////////////////////////////////////////////////
class stCorruptionMax extends Stat {
    static setup(context, base,max) {
        var _stat = new stCorruptionMax();
        var _n = _stat.data;
        _n.id='corruptionMax', _n.hidden=3,_n.base=base, _n.value=base,_n.limits=[{max:99999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stCorruptionMax", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stCorruptionMax, value.data);};
}
class stCorruption extends Stat {
    static setup(context, base,max) {
        stCorruptionMax.setup(context,max);
        var _stat = new stCorruption();
        var _n = _stat.data;
        _n.id='corruption', _n.hidden=3,_n.base=base, _n.value=base,_n.limits=[{max:'corruptionMax',min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stCorruption", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stCorruption, value.data);};
}
//Fetish
// value >0 means character likes that fetish or <0 hates it  
class stFetish extends Stat {
    static setup(context, base,max,name) { 
        let _stat = new stFetish();
        let _n = _stat.data;
        _n.id=name+"_Max",_n.base=max, _n.value=max,_n.limits=[{max:100,min:-100}];
        context.addItem(_stat);
        _stat = new stFetish();
        _n = _stat.data;
        _n.id=name+"_Min",_n.base=0, _n.value=0,_n.limits=[{max:100,min:-100}];
        context.addItem(_stat);
        _stat = new stFetish();
        _n = _stat.data;
        _n.id=name,_n.base=base, _n.value=base,_n.limits=[{max:name+"_Max",min:name+"_Min"}];
        context.addItem(_stat);
        _stat.Calc();
    }
    static listFetish() {
        let list = [
        'ftZoophil',
        'ftBondage',
        'ftDominant',
        'ftSubmissive',
        'ftreceiveAnal',
        'ftgiveAnal',
        'ftExhibition'];
        return(list);
    }
    constructor() {   super();  }
    toJSON() {return window.storage.Generic_toJSON("stFetish", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stFetish, value.data);};
}
//effects
class effEnergized extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effEnergized.name, this.data.duration = 120;
    }
    toJSON() {return window.storage.Generic_toJSON("effEnergized", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effEnergized, value.data);};
     get desc() {return(effEnergized.name);}

    onTimeChange(time) {
        //+ 10Energy per hour
        var delta = window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        this.data.duration-= delta;
        if(this.data.duration<0) {
            delta = delta+this.data.duration; // if delta is 20 but remaining duration is only 5, delta should be capped to 5
            this.data.duration =0;
        }
        //Effects impact Stats:  Effect->Effects->Character->Stats    is there a prettier wy?
        this.parent.parent.Stats.increment('energy',10*delta/60);
        if(this.data.duration<=0) { //remove yourself
            return(function(me){
                return function(Effects){ Effects.removeItem(me.data.id);}}(this));
        }
        return(null);
    }
    onApply(){
        //+10 energy
        this.data.duration = 120;
        this.data.time = window.gm.getTime();
        this.parent.parent.Stats.increment('energy',10);
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {
            this.onApply(); //refresh 
            return(true);
        }
    }
}
class effNotTired extends Effect {
    constructor() {
        super();
        this.data.id = effNotTired.name,this.data.name="not tired" , this.data.duration = 120, this.data.hidden=4;
    }
    toJSON() {return window.storage.Generic_toJSON("effNotTired", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effNotTired, value.data);};
    get desc() {return(effNotTired.name);}

    onTimeChange(time) {
        //Tired after xxh
        this.data.duration-= window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        if(this.data.duration<=0) {
        return(function(me){
            return (function(Effects){ 
            var newdata =new effTired(); Effects.replace(me.data.id,newdata);});
            }(this));
        }
        return(null);
    }
    onApply(){
        this.data.duration = 120;// todo 600;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {
            this.onApply(); //refresh
            return(true);
        }
    }
}
class effTired extends Effect {
    constructor() {
        super();
        this.data.id = effTired.name, this.data.name="tired", this.data.duration = 0, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effTired", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effTired, value.data);};
    get desc() {return(effTired.name);}

    onTimeChange(time) {  
        //duration not used -> will never expire unless replaced
        var delta = window.gm.getTime()-this.data.time;
        //-10 max energy after 12h, but only up to 3 times
        if(delta>60) this.parent.parent.Stats.addModifier('energyMax',{id:'energyMax:Tired', bonus:-10});
    }
    onApply(){
        this.data.time = window.gm.getTime();
    }
    onRemove(){
        this.parent.parent.Stats.removeModifier('energyMax',{id:'energyMax:Tired'});
    }
    merge(neweffect) {
        if(neweffect.name==='effNotTired') {
            return(function(me){
                return (function(Effects){ 
                var newdata =new effNotTired(); Effects.replace(me.data.id,newdata);});
                }(this));
        }
        if(neweffect.name===this.data.name) {
            //just ignore
            return(true);
        }
    }
}
class effEnergyDrain extends Effect {
    constructor() {
        super();
        this.data.id = effEnergyDrain.name, this.data.name="energy drained", this.data.duration = 0, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effEnergyDrain", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effEnergyDrain, value.data);};
    get desc() {return(effEnergyDrain.name);}

    onTimeChange(time) {  
        var delta = window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        this.parent.parent.Stats.increment('energy',-3*delta/60);
    }
    onApply(){
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {
            return(true);
        }
    }
}
class effMutateCat extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effMutateCat.name, this.data.hidden=0;
        this.data.duration = 60,this.data.cycles = 3, this.data.magnitude = 3;
    }
    toJSON() {return window.storage.Generic_toJSON("effMutateCat", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effMutateCat, value.data);};
    get desc() {return("cat-tastic");}

    onTimeChange(time) {
        //after some time you mutate a bit
        this.data.duration-= window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        if(this.data.duration<=0) {
            this.data.duration = 60;
            return(function(me){
                return (function(Effects){ 
                    if(me.data.cycles<=0) { 
                        Effects.removeItem(me.data.id);
                    }
                    window.gm.pushDeferredEvent("MutateCat",[me.data.magnitude]);
                    //window.gm.pushDeferredEvent("CatHabit");
                    Effects.removeItem(me.data.id);});
                }(this));
            }
        return(null);
    }
    onApply(){
        this.data.duration = 60,this.data.cycles = 3;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {//dont refresh
            return(true);
        }
    }
}
class effMutateWolf extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effMutateWolf.name, this.data.hidden=0;
        this.data.duration = 60,this.data.cycles = 3, this.data.magnitude = 3;
    }
    toJSON() {return window.storage.Generic_toJSON("effMutateWolf", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effMutateWolf, value.data);};
    get desc() {return("wolf-tastic");}

    onTimeChange(time) {
        //after some time you mutate a bit
        this.data.duration-= window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        if(this.data.duration<=0) {
            this.data.duration = 60;
            return(function(me){
                return (function(Effects){ 
                    if(me.data.cycles<=0) { 
                        Effects.removeItem(me.data.id);
                    }
                    window.gm.pushDeferredEvent("MutateWolf",[me.data.magnitude]);
                    //window.gm.pushDeferredEvent("CatHabit");
                    Effects.removeItem(me.data.id);});
                }(this));
            }
        return(null);
    }
    onApply(){
        this.data.duration = 60,this.data.cycles = 3;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {//dont refresh
            return(true);
        }
    }
}
class effMutateHorse extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effMutateHorse.name, this.data.hidden=0;
        this.data.duration = 60,this.data.cycles = 3, this.data.magnitude = 3;
    }
    toJSON() {return window.storage.Generic_toJSON("effMutateHorse", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effMutateHorse, value.data);};
    get desc() {return("horse-tastic");}

    onTimeChange(time) {
        //after some time you mutate a bit
        this.data.duration-= window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        if(this.data.duration<=0) {
            this.data.duration = 60;
            return(function(me){
                return (function(Effects){ 
                    if(me.data.cycles<=0) { 
                        Effects.removeItem(me.data.id);
                    }
                    window.gm.pushDeferredEvent("MutateHorse",[me.data.magnitude]); //todo non-PC can be mutated (if receives timechange !) but the scene will assume its player?!
                    Effects.removeItem(me.data.id);});
                }(this));
            }
        return(null);
    }
    onApply(){
        this.data.duration = 60,this.data.cycles = 3;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {//dont refresh
            return(true);
        }
    }
}
class effHorsePower extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effHorsePower.name, this.data.hidden=0;
        this.data.duration = 120,this.data.cycles = 3, this.data.magnitude = 1;
    }
    toJSON() {return window.storage.Generic_toJSON("effHorsePower", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effHorsePower, value.data);};
     get desc() {return(effHorsePower.name);}

    onTimeChange(time) {
        //+ 10Energy per hour
        var delta = window.gm.getDeltaTime(time,this.data.time);
        this.data.time = time;
        this.data.duration-= delta;
        if(this.data.duration<0) {
            delta = delta+this.data.duration; // if delta is 20 but remaining duration is only 5, delta should be capped to 5
            this.data.duration =0;
        }
        this.parent.parent.Stats.increment('energy',10*delta/60);
        if(this.data.magnitude>2) {
            let _i = this.parent.findItemSlot(this.data.id);
            if(_i<0) { //todo extend if exist?
                this.parent.parent.addEffect(effMutateHorse.id, new effMutateHorse());
            }
        }
        if(this.data.duration<=0) { //remove yourself
            return(function(me){
                return function(Effects){ Effects.removeItem(me.data.id);}}(this));
        }
        return(null);
    }
    onApply(){
        this.data.duration = 120;
        this.data.duration = 3;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.id===this.data.id) {
            this.onApply(); //refresh 
            this.data.magnitude +=1; //bonus effect triggers only if added multiple times
            window.gm.pushDeferredEvent("HorsePowerNotice",[this.data.magnitude]);
            return(true);
        }
    }
}
class effGrowBreast extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effGrowBreast.name, this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 3, this.data.magnitude = 3;
    }
    toJSON() {return window.storage.Generic_toJSON("effGrowBreast", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effGrowBreast, value.data);};
    get desc() {return(effGrowBreast.name);}

    onTimeChange(time) {
        //after some time you mutate a bit
        this.data.duration = Math.max(this.data.duration-window.gm.getDeltaTime(time,this.data.time),0);
        this.data.time = time;
        if(this.data.duration<=0 && this.data.cycles>0) {
            this.data.cycles-=1;
            return(function(me){
                return (function(Effects){ 
                    if(me.data.cycles<=0) { 
                        Effects.removeItem(me.data.id);
                        window.gm.pushDeferredEvent("MutateBreastEnd");
                    }
                    else window.gm.pushDeferredEvent("MutateBreast");
                });
            }(this));
        }
        return(null);
    }
    onApply(){
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {
            this.data.cycles+= neweffect.data.cycles; //prolong the effect
            return(true);
        }
    }
}
class effGrowVulva extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effGrowVulva.name, this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 3, this.data.magnitude = 3;
    }
    toJSON() {return window.storage.Generic_toJSON("effGrowVulva", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effGrowVulva, value.data);};
    get desc() {return(effGrowVulva.name);}

    onTimeChange(time) {
        //after some time you mutate a bit
        this.data.duration = Math.max(this.data.duration-window.gm.getDeltaTime(time,this.data.time),0);
        this.data.time = time;
        if(this.data.duration<=0 && this.data.cycles>0) {
            this.data.cycles-=1;
            return(function(me){
                return (function(Effects){ 
                    if(me.data.cycles<=0) { 
                        Effects.removeItem(me.data.id);
                        window.gm.pushDeferredEvent("MutateVulvaEnd");
                    }
                    else window.gm.pushDeferredEvent("MutateVulva");
                });
            }(this));
        }
        return(null);
    }
    onApply(){
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {
            this.data.cycles+= neweffect.data.cycles; //prolong the effect
            return(true);
        }
    }
}
class effLewdMark extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effLewdMark.name, this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 3, this.data.magnitude = 1;
    }
    toJSON() {return window.storage.Generic_toJSON("effLewdMark", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effLewdMark, value.data);};
    get desc() {return(effLewdMark.name);}
    onTimeChange(time) {
        //todo the mark indicates that you can bear soulgems; the stronger the mark, the better the gem
        //with each birth, the mark grows stronger;
        //while you are pampering the gem, it sucks up your arcana if you dont have sex
        //chance to go into heat if you dont have a gem
        return(null);
    }
    onApply(){
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {
            return(true);
        }
    }
}
class effInHeat extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effInHeat.name, this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 3, this.data.magnitude = 1;
    }
    toJSON() {return window.storage.Generic_toJSON("effInHeat", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effInHeat, value.data);};
    get desc() {return(effInHeat.name);}
    //todo if female, you might go into heat (only when not carrying child/soulgem ?) 
    //more arousal damage by studs
    //succesful impregation or time might end heat
}
class effInRut extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effInRut.name, this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 3, this.data.magnitude = 1;
    }
    toJSON() {return window.storage.Generic_toJSON("effInRut", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effInRut, value.data);};
    get desc() {return(effInRut.name);}
    //todo if male, you might go into rut  
    //more arousal damage by sluts
    //multiple succesful impregations/balldrain or time might end rut
}
class effVaginalFertil extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effVaginalFertil.name, this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 3, this.data.magnitude = 1;
    }
    toJSON() {return window.storage.Generic_toJSON("effVaginalFertil", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effVaginalFertil, value.data);};
    get desc() {return(effVaginalFertil.name);}
    onTimeChange(time) {
        //todo can get pregnant with child,eggs ; natural heat might be triggered
        // if fertility of Vagina is 0, can still bear parasites,soulgem; fertility heat might not trigger 
        return(null);
    }
    onApply(){
        //todo remove infertile,fertileEffect
        this.parent.removeItem(effVaginalPregnant.name);
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) { //no merge
            return(true);
        }
    }
}
class effVaginalPregnant extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= effVaginalPregnant.name, this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 3, this.data.magnitude = 1, this.data.type='';
    }
    toJSON() {return window.storage.Generic_toJSON("effVaginalPregnant", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effVaginalPregnant, value.data);};
    get desc() {return(effVaginalPregnant.name);}
    onTimeChange(time) {
        //todo be pregnant with child,eggs,parasites,soulgem
        //normal pregnancy will grow over time, might be aborted by medicine
        //soulgem grows over time, consumes arcana or sperm
        this.data.duration = Math.max(this.data.duration-window.gm.getDeltaTime(time,this.data.time),0);
        this.data.time = time;
        if(this.data.duration<=0 && this.data.cycles>0) {
            this.data.cycles-=1,this.data.duration = 60;
            window.gm.MutationsLib.vaginaPregnancy(this.parent.parent)
        }
        return(null);
    }
    onApply(){
        //todo remove infertile,fertileEffect
        this.parent.removeItem(effVaginalFertil.name);
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) { //no merge
            return(true);
        }
    }
}
//todo VaginalParasite
class effSpermInWomb extends Effect {   //if you have womb filled with sperm, this handles impregnation and sperm-decay
    constructor() {
        super();
        this.data.id = this.data.name= effSpermInWomb.name, this.data.duration = 60, this.data.hidden=0;
        this.data.cycles = 1, this.data.magnitude = 2;
    }
    toJSON() {return window.storage.Generic_toJSON("effSpermInWomb", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effSpermInWomb, value.data);};
    get desc() {return(effSpermInWomb.name);}
    onTimeChange(time) {
        this.data.duration = Math.max(this.data.duration-window.gm.getDeltaTime(time,this.data.time),0);
        this.data.time = time;
        if(this.data.duration<=0 && this.data.cycles>0) {
            this.data.duration = 60;
            let vagina=this.parent.parent.getVagina();
            if(vagina && vagina.data.sperm>0) {  
                //todo add option to show only big changes/sometime
                window.gm.MutationsLib.vaginaSpermDissolve(this.parent.parent);
            }
        }
        return(null);
    }
    onApply(){
        this.data.duration = 60;
        this.data.time = window.gm.getTime();
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {
            return(true);
        }
    }
}
/////////////// combateffects /////////////////////////
class effHeal extends CombatEffect {
    constructor(amount,duration=0) {
        super();
        this.amount = amount;
        this.data.id = this.data.name= effHeal.name, this.data.startduration = duration, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effHeal", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effHeal, value.data);};
    get desc() {return(effHeal.name);}
    onApply(){
        this.data.duration=this.data.startduration;
        this.parent.parent.Stats.increment('health',this.amount);
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //extends stun
            this.onApply();
            return(true);
        }
    }
    onCombatEnd() {
        this.parent.removeItem(this.data.id);
    }
    onTurnStart() {
        this.data.duration-=1;
        if(this.data.duration<=0) this.parent.removeItem(this.data.id);
        else {
            this.parent.parent.Stats.increment('health',this.amount);
        }
    }
}
class effGuard extends CombatEffect {
    constructor(amount) {
        super();
        this.amount = amount;
        this.data.id = this.data.name= effGuard.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effGuard", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effGuard, value.data);};
    get desc() {return(effGuard.name);}
    onApply(){
        this.data.duration = 2;
        //this.parent.parent.Stats.addModifier('pDefense',{id:'pDefense:Guard', bonus:5}); //Todo percentage
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //extends
            this.onApply();
            return(true);
        }
    }
    onCombatEnd() {
        this.parent.removeItem(this.data.id);
    }
    onTurnStart() {
        this.data.duration-=1;
        if(this.data.duration<=0) this.parent.removeItem(this.data.id);
    }
    onRemove(){
        //this.parent.parent.Stats.removeModifier('pDefense',{id:'pDefense:Guard'});
    }
}
//to combine multiple effects that get dispelled together 
class effCombined extends CombatEffect {
    constructor(EffectsA,EffectsB) {
        super();
        this.effects = EffectsA.concat(EffectsB);
        this.data.id = this.data.name= effCombined.name, this.data.duration = 0, this.data.hidden=0;
        for(el of EffectsA) {
            el.onRemove = (function(me){
                let _old = el.onRemove.bind(el); 
                let foo = function() {
                    _old.call(el); //override onRemove but call orignial fct
                    let i = me.effects.indexOf(el);
                    if(i>=0) me.effects.splice(i,1);
                    me.removeAll();
                }
                return(foo);
            } (this));
        }
    }
    removeAll(){
        for(el of this.effects) {
            if(el) el.parent.removeItem(el.id);
        }
        this.parent.removeItem(this.id);
    }
    toJSON() {return window.storage.Generic_toJSON("effCombined", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effCombined, value.data);};
}
class effDamage extends CombatEffect {
    static setup(amount,type,onHitCB=null) {
        let eff = new effDamage();
        eff.amount = amount;
        eff.type=type;
        eff.onHit=onHitCB;
        return(eff);
    }
    constructor() {
        super();
        this.amount = 8;
        this.data.id = this.data.name= effDamage.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effDamage", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effDamage, value.data);};
    /*??onCast(targets,caster) {
        let result={OK:false,msg:''};
        targets[0].
        if(this.onHitCB) onHitCB(targets,caster);
    }*/
    onApply(){
        this.data.duration = 0;
        this.parent.parent.Stats.increment('health',-1*this.amount);
        if(this.data.duration<1) this.parent.removeItem(this.data.id);  
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //ignore
            return;
        }
    }
    onCombatEnd() { this.parent.removeItem(this.data.id); }
    onTurnStart() { this.data.duration-=1; if(this.data.duration<=0) this.parent.removeItem(this.data.id);    }
}
//damage over time todo affects only bleedable targets 
class effBleed extends CombatEffect {
    constructor(amount) {
        super();
        this.amount = amount;
        this.data.id = this.data.name= effBleed.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effBleed", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effBleed, value.data);};
    onApply(){
        this.data.duration = 3;
        this.parent.parent.Stats.increment('health',-1*this.amount);
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //ignore
            //this.onApply();
            return(true);
        }
    }
    onCombatEnd() { this.parent.removeItem(this.data.id); }
    onTurnStart() { this.data.duration-=1; 
        if(this.data.duration<=0) {
            this.parent.removeItem(this.data.id);   
        } else {
            this.parent.parent.Stats.increment('health',-1*this.amount);
        }
    }
}
//the character is in close combat with whom; 
class effGrappled extends CombatEffect {
    static factory() {
        let grappled = new effGrappled(2), grappling= new effGrappling();
        grappled.source = grappling, grappling.target = grappled;
        return({targetEff:grappled,sourceEff:grappling});
    }
    constructor(amount) {
        super();
        this.source=null;
        this.data.id = this.data.name= effGrappled.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effGrappled", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effGrappled, value.data);};
    onApply(){
        this.data.duration = 5;
        this.data.name = this.data.name+"("+this.source.parent.parent.name+")";
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //ignore
            //this.onApply();
            return(true);
        }
    }
    onRemove(){
        if(this.source) {
            this.source.parent.removeItem(effGrappling.name);
            this.source=null;
        }
    }
    onCombatEnd() { this.parent.removeItem(this.data.id); }
    onTurnStart() { 
        this.data.duration-=1; 
        if(this.data.duration<=0) {this.parent.removeItem(this.data.id);}  
        else {
        }
    }
}
//when a char casts grappling, the target gets effGrappled and the caster gets effGrappling
//if one of the effects got removed, it will also remove the other
class effGrappling extends CombatEffect {
    constructor( targetEffect) {
        super();
        this.target=targetEffect;
        this.data.id = this.data.name= effGrappling.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effGrappling", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effGrappling, value.data);};
    get desc() {return(this.data.name);}
    onApply(){
        this.data.duration = 5;
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //ignore
            //this.onApply();
            return(true);
        }
    }
    onRemove(){
        if(this.target) {
            this.target.parent.removeItem(effGrappled.name);
            this.target=null;
        }
    }
    onCombatEnd() { this.parent.removeItem(this.data.id); }
    onTurnStart() { this.data.duration-=1; 
        if(this.data.duration<=0) {
            this.parent.removeItem(this.data.id); 
        } else {
        }
    }
}
class effUngrappling extends CombatEffect {
    constructor( targetEffect) {
        super();
        this.target=targetEffect;
        this.data.id = this.data.name= effUngrappling.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effUngrappling", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effUngrappling, value.data);};
    get desc() {return(this.data.name);}
    onApply(){ 
        this.parent.removeItem(this.target.id);
        this.parent.removeItem(this.data.id);
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //ignore
            //this.onApply();
            return(true);
        }
    }
    onCombatEnd() { this.parent.removeItem(this.data.id); }
    onTurnStart() { this.data.duration-=1; if(this.data.duration<=0) this.parent.removeItem(this.data.id);    }
}
class effTeaseDamage extends CombatEffect {
    static setup(amount) {
        let eff = new effTeaseDamage();
        eff.amount = amount;
        return(eff);
    }
    constructor(amount) {
        super();
        this.amount = amount;
        this.data.id = this.data.name= effTeaseDamage.name, this.data.duration = 0, this.data.hidden=0;
    }
    toJSON() {return window.storage.Generic_toJSON("effTeaseDamage", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effTeaseDamage, value.data);};
    get desc() {return(effTeaseDamage.name);}
    onApply(){
        this.data.duration = 0;
        this.parent.parent.Stats.increment('arousal',1*this.amount);
        if(this.data.duration<1) this.parent.removeItem(this.data.id);  
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //ignore
            //this.onApply();
            return(false);
        }
    }
    onCombatEnd() { this.parent.removeItem(this.data.id); }
    onTurnStart() { this.data.duration-=1; if(this.data.duration<=0) this.parent.removeItem(this.data.id);    }
}
class effStunned extends CombatEffect {
    constructor() {
        super();
        this.data.id = this.data.name= effStunned.name, this.data.duration = 2;
    }
    toJSON() {return window.storage.Generic_toJSON("effStunned", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effStunned, value.data);};
    get desc() {return(this.data.name);}
    onApply(){
        this.data.duration = 2;
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //extends stun
            this.onApply();
            return(true);
        }
    }
    onCombatEnd() {
        this.parent.removeItem(this.data.id);
    }
    onTurnStart() {
        this.data.duration-=1;
        if(this.data.duration<=0) this.parent.removeItem(this.data.id);
    }
} 
class effCallHelp extends CombatEffect {
    constructor() {
        super();
        this.data.id = this.data.name= effCallHelp.name, this.data.duration = 2;
    }
    toJSON() {return window.storage.Generic_toJSON("effCallHelp", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(effCallHelp, value.data);};
    get desc() {return(effCallHelp.name);}
    onApply(){
        this.data.duration = 2;
    }
    merge(neweffect) {
        if(neweffect.name===this.data.name) {    //ignore
            return(true);
        }
    }
    onCombatEnd() {
        this.parent.removeItem(this.data.id);
    }
    onTurnStart() {
        this.data.duration-=1;
        if(this.data.duration<=0) {
            window.gm.Encounter.spawnChar(this.data.item,this.data.faction,this.data.amount);
            this.parent.removeItem(this.data.id);
        }
    }
    configureSpawn(item,faction,amount=1) {
        this.data.item=item,this.data.faction=faction,this.data.amount=amount;
    }
}
//skills
class skCooking extends Effect {
    constructor() {
        super();
        this.data.id = this.data.name= skCooking.name;
    }
    toJSON() {return window.storage.Generic_toJSON("skCooking", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(skCooking, value.data);};

    get desc() {return(skCooking.name);}
}
/*skAlchemist
 * Lv1 - can create potions from 1 ingredient
 * Lv2 - can create potion from 2 ingredients
 * Lv3 - can combine 2 potions into better one
 * Lv4 - can use 3 ingredients
 */
window.gm.StatsLib = (function (StatsLib) {
    //...stats
    window.storage.registerConstructor(stHealthMax);
    window.storage.registerConstructor(stHealth);
    window.storage.registerConstructor(stRelation);
    window.storage.registerConstructor(stFetish);
    window.storage.registerConstructor(stAgility);
    window.storage.registerConstructor(stCharisma);
    window.storage.registerConstructor(stEndurance);
    window.storage.registerConstructor(stIntelligence);
    window.storage.registerConstructor(stLuck);
    window.storage.registerConstructor(stPerception);
    window.storage.registerConstructor(stStrength);
    window.storage.registerConstructor(stResistance);
    window.storage.registerConstructor(stEnergyMax);
    window.storage.registerConstructor(stEnergy);
    window.storage.registerConstructor(stWillMax);
    window.storage.registerConstructor(stWill);
    window.storage.registerConstructor(stArousalMax);
    window.storage.registerConstructor(stArousalMin);
    window.storage.registerConstructor(stArousal);
    window.storage.registerConstructor(stCorruptionMax);
    window.storage.registerConstructor(stCorruption);
    window.storage.registerConstructor(stArmor);   
    //...effects
    window.storage.registerConstructor(effCallHelp);
    window.storage.registerConstructor(effDamage);
    window.storage.registerConstructor(effBleed);
    window.storage.registerConstructor(effCombined);
    window.storage.registerConstructor(effGrappled);
    window.storage.registerConstructor(effGrappling);
    window.storage.registerConstructor(effUngrappling);
    window.storage.registerConstructor(effEnergized);    
    window.storage.registerConstructor(effNotTired);
    window.storage.registerConstructor(effTeaseDamage);
    window.storage.registerConstructor(effTired);
    window.storage.registerConstructor(effStunned);
    window.storage.registerConstructor(effGuard);
    window.storage.registerConstructor(effHeal);
    
    window.storage.registerConstructor(effEnergyDrain);

    window.storage.registerConstructor(effHorsePower);
    window.storage.registerConstructor(effMutateHorse);
    window.storage.registerConstructor(effMutateWolf);
    window.storage.registerConstructor(effMutateCat); 
    window.storage.registerConstructor(effGrowBreast);
    window.storage.registerConstructor(effGrowVulva);
    window.storage.registerConstructor(effLewdMark);
    window.storage.registerConstructor(effInHeat);
    window.storage.registerConstructor(effInRut);
    window.storage.registerConstructor(effSpermInWomb);
    window.storage.registerConstructor(effVaginalFertil);
    window.storage.registerConstructor(effVaginalPregnant);
    //
    window.storage.registerConstructor(skCooking);

    return(StatsLib); 
}(window.gm.StatsLib || {}));