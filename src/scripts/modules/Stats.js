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
            return('<statup>Your relation to '+attr.id+" improved by "+(_new-_old).toFixed(1).toString()+"</statup></br>");
        } else if ((_new-_old)<0) {
            return('<statdown>Your relation to '+attr.id+" worsend by "+(_new-_old).toFixed(1).toString()+"</statdown></br>");
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
class stAgility extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stAgility();
        var _n = _stat.data;
        _n.id='agility',_n.base=base, _n.value=base, _n.modifys=[{id:'energyMax'}],_n.limits=[{max:999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stAgility", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stAgility, value.data);};
    updateModifier() {
        this.parent.addModifier('energyMax',{id:'agility', bonus:this.parent.get('agility').value});
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
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stIntelligence", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stIntelligence, value.data);};
    updateModifier() {
    };
}
class stStrength extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stStrength();
        var _n = _stat.data;
        _n.id='strength',_n.base=base, _n.value=base, _n.modifys=[{id:'healthMax'},{id:'pAttack'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
        
    }
    toJSON() {return window.storage.Generic_toJSON("stStrength", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stStrength, value.data);};
    updateModifier() {
        this.parent.addModifier('healthMax',{id:'strength', bonus:this.parent.get('strength').value*4});
        this.parent.addModifier('pAttack',{id:'strength', bonus:Math.floor(this.parent.get('strength').value/4)});
    };
}
class stEndurance extends Stat { // core attribute
    static setup(context, base,max) { 
        var _stat = new stEndurance();
        var _n = _stat.data;
        _n.id='endurance',_n.base=base, _n.value=base, _n.modifys=[{id:'healthMax'},{id:'pDefense'}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();
       
    }
    toJSON() {return window.storage.Generic_toJSON("stEndurance", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stEndurance, value.data);};
    updateModifier() {
        this.parent.addModifier('healthMax',{id:'endurance', bonus:this.parent.get('endurance').value*4});
        this.parent.addModifier('pDefense',{id:'strength', bonus:this.parent.get('endurance').value%4});
    };
}
class stPAttack extends Stat {   //physical attack
    static setup(context, base,max) {
        var _stat = new stPAttack();
        var _n = _stat.data;
        _n.id='pAttack',_n.base=base, _n.value=base,_n.limits=[{max:99999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();

    }
    toJSON() {return window.storage.Generic_toJSON("stPAttack", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stPAttack, value.data);};
}
class stPDefense extends Stat {   //physical defense
    static setup(context, base,max) {
        var _stat = new stPDefense();
        var _n = _stat.data;
        _n.id='pDefense',_n.base=base, _n.value=base,_n.limits=[{max:99999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();

    }
    toJSON() {return window.storage.Generic_toJSON("stPDefense", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stPDefense, value.data);};
}
class stLAttack extends Stat {   //tease attack
    static setup(context, base,max) {
        var _stat = new stLAttack();
        var _n = _stat.data;
        _n.id='lAttack',_n.base=base, _n.value=base,_n.limits=[{max:99999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();

    }
    toJSON() {return window.storage.Generic_toJSON("stLAttack", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stLAttack, value.data);};
}
class stLDefense extends Stat {   //tease defense
    static setup(context, base,max) {
        var _stat = new stLAttack();
        var _n = _stat.data;
        _n.id='lDefense',_n.base=base, _n.value=base,_n.limits=[{max:99999,min:0}];
        context.addItem(_stat);
        _stat.Calc();
    }
    constructor() {
        super();

    }
    toJSON() {return window.storage.Generic_toJSON("stLAttack", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(stLAttack, value.data);};
}
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
        this.data.id = effTired.name, this.data.name="tired", this.data.duration = 120, this.data.hidden=0;
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
        this.parent.parent.Stats.addModifier('pDefense',{id:'pDefense:Guard', bonus:5}); //Todo percentage
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
        this.parent.parent.Stats.removeModifier('pDefense',{id:'pDefense:Guard'});
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
    constructor(amount) {
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
window.gm.StatsLib = (function (StatsLib) {
    //...stats
    window.storage.registerConstructor(stHealthMax);
    window.storage.registerConstructor(stHealth);
    window.storage.registerConstructor(stRelation);
    window.storage.registerConstructor(stEndurance);
    window.storage.registerConstructor(stStrength);
    window.storage.registerConstructor(stAgility);
    window.storage.registerConstructor(stLuck);
    window.storage.registerConstructor(stCharisma);
    window.storage.registerConstructor(stPerception);
    window.storage.registerConstructor(stResistance);
    window.storage.registerConstructor(stEnergyMax);
    window.storage.registerConstructor(stEnergy);
    window.storage.registerConstructor(stArousalMax);
    window.storage.registerConstructor(stArousalMin);
    window.storage.registerConstructor(stArousal);
    window.storage.registerConstructor(stCorruptionMax);
    window.storage.registerConstructor(stCorruption);
    window.storage.registerConstructor(stPAttack);
    window.storage.registerConstructor(stPDefense);
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
    
    window.storage.registerConstructor(effHorsePower);
    window.storage.registerConstructor(effMutateHorse);
    window.storage.registerConstructor(effMutateWolf);
    window.storage.registerConstructor(effMutateCat); 
    window.storage.registerConstructor(effGrowBreast);
    window.storage.registerConstructor(effGrowVulva);
    //
    window.storage.registerConstructor(skCooking);

    return(StatsLib); 
}(window.gm.StatsLib || {}));