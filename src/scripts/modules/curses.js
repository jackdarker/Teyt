
"use strict";
/**
 * Items can have bonus/curse(s) that is applied when its condition is met 
 * condition is checked when equipped and on every timechange (no check if not equipped ? )
 * if trigger succeeds, apply-function is called  
 * the curse should be initially hidden to the player but might be revealed by a magican
 * 
 * possible conditions to think of:
 * - is activated if worn for some time
 * - is activated if other certain (cursed) items are worn
 * - is activated if effect is active
 * - is activated if in location
 * 
 * possible actions to think of:
 * - disable unequip/ locking
 * - replace the item with a different one
 * - add an effect
 * 
 * use deffered event to show the triggerd curse
 * 
 * ways to remove a curse (not yet triggered)
 * - by magican?
 * 
 * ways to remove active curse
 * - a key to unlock
 * - dissolve the item by a magican
 * - use item/potion that counters the effect
 * - mutate body to remove bodypart (snake -> no wristcuffs) 
 */
/**
 * //hidden 0 = visible, 1= name=???, 2= , 4= hidden
 */
class Curse {
    constructor() {
        this.hidden=0;
        this.trigger = null;
        this.list=[];
    }
    /* 
    * parent is the item !
    * Attention !! _parent will be added dynamical
    */
    get parent() {return(this._parent?this._parent(): null);} 
    configureCurse(item,trigger,curses) {
        this.trigger = trigger;
        this.list=curses;
        item.bonus.push(this);
        this._relinkItems(item);
    }
    _relinkItems(parent) {
        this._parent = window.gm.util.refToParent(parent);
        this.trigger._parent=window.gm.util.refToParent(this);
        for(el of this.list) {
            el._parent=window.gm.util.refToParent(this);
        }
    }
    toJSON() {return window.storage.Generic_toJSON("Curse", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Curse, value.data));}
    onEquip() {
        if(this.trigger.onEquip()) this.apply();
    }
    onUnequip() {
        if(this.trigger.onUnequip()) this.apply(true);
    }
    canUnequip() { //ask effects if allowed to unequip/not locked
        let res;
        for(el of this.list) {
            res = el.canUnequip();
            if(res.OK==false) return(res);
        }
        res = {OK:true, msg:'unequipable'};
        return(res);
    }
    onTimeChange(time) {
        if(this.trigger.onTimeChange(time)) this.apply();
    }
    apply(unapply){
        this.hidden=0; //reveal
        for(el of this.list) {
            el.apply(unapply); //todo 3 effects would generate 3 defferedEvents; instead combine text into single event
        }
    }
    get desc() {
        let msg='';
        if((this.hidden & 0x4)>0) {  //completely hidden

        } else if((this.hidden & 0x1)>0) {
            msg = 'unknown effect';
        } else if(this.hidden===0 ) {
            msg = this.trigger.desc;
            for(el of this.list) {
                msg += "; " + el.desc;
            }
        }
        return(msg);
    }
}
//-------------------------------------------------------------------------
class CrsTrigger { //each curse has a trigger that evaluates if the curse gets triggered
    constructor() { this.id='';  }
     /* 
    * parent is the curse !
    * Attention !! _parent will be added dynamical
    */
    get parent() {return(this._parent?this._parent(): null);} 
    onEquip() {return(false);}
    onUnequip() {return(true);} //by default trigger unapply when unequipped
    onTimeChange(time) {return(false);}
    get desc() { return('');}
}
class CrsTrgOnEquip extends CrsTrigger {
    constructor() {
        super();
        this.minItems=0; //if 0 always trigger onEquip
        this.curseName=''; //todo ..otherwise min no. items with this keyword need to be equipped
    }
    onEquip() { return(true);  }
    toJSON() {return window.storage.Generic_toJSON("CrsTrgOnEquip", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CrsTrgOnEquip, value.data));}
    get desc() { return('when equipped');}
}
class CrsTrgDelayed extends CrsTrigger {
    constructor() {
        super();
        this.timeToTrigger = 60*2;
        this.timeStart=null;
    }
    onEquip() {
        this.timeStart = window.gm.getTime();
        return(false);
    }
    onTimeChange(time) {
        return(this.timeToTrigger< window.gm.getDeltaTime(time,this.time));
    }
    toJSON() {return window.storage.Generic_toJSON("CrsTrgDelayed", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CrsTrgDelayed, value.data));}
    get desc() { return('after '+window.gm.util.formatNumber(this.timeToTrigger,0)+'min');}
}
//-------------------------------------------------------------------------
class CrsEffect {
    constructor() {
        this.hidden=0;
        this.id='';
    }
     /* 
    * parent is the curse !
    * Attention !! _parent will be added dynamical
    */
    get parent() {return(this._parent?this._parent(): null);} 
    canUnequip() {return({OK:true,msg:'unequipable'});}
    get desc() { return('');}
    apply(unapply) {} //override to do something!
}
class CrsEffLock extends CrsEffect{
    constructor() {
        super();
        this.id='CrsEffLock';
        this.key='KeyRestraintA';
    }
    toJSON() {return window.storage.Generic_toJSON("CrsEffLock", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CrsEffLock, value.data));}
    get desc() {return("The item can only be unlocked with a "+this.key+".")}
    canUnequip() {
        let res= {OK:true,msg:'This devices requires '+this.key+' to unlock'};
        if(this.parent.parent.parent.parent.Inv.countItem(this.key)<=0) {
            res.OK=false;
        }
        return(res);
    }
    apply(unapply) {
        if(unapply) {
            this.parent.parent.parent.parent.Inv.removeItem(this.key,1);
            window.gm.pushDeferredEvent("GenericDeffered",['With the key, it was now possible to unlock and remove '+this.parent.parent.name+' !']);
        } else {
            window.gm.pushDeferredEvent("GenericDeffered",['As soon as you equiped '+this.parent.parent.name+', some hidden lock sealed the item on you !']);
        }
    }
}
class CrsEffConvert extends CrsEffect{
    constructor() {
        super();
        this.id='CrsEffConvert';
        this.newItem='GlovesRubber';
    }
    toJSON() {return window.storage.Generic_toJSON("CrsEffConvert", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CrsEffConvert, value.data));}
    get desc() {return("Converts the item to "+this.newItem+".")}
    apply(unapply) {
        if(unapply) {
        } else {
            let item = window.gm.ItemsLib[this.newItem]();
            window.gm.makeCursedItem(item,{lock:true,energydrain:2});
            if(this.parent.parent.parent.parent.Outfit.removeItem(this.parent.parent.id).OK) {
            this.parent.parent.parent.parent.Wardrobe.removeItem(this.parent.parent.id);
            window.gm.pushDeferredEvent("GenericDeffered",['To your surprise, '+this.parent.parent.name+' contorts its shape to something different, reforming itself into '+item.name+'! ']);
            this.parent.parent.parent.parent.Wardrobe.addItem(item);
            this.parent.parent.parent.parent.Outfit.addItem(item);
            }
        }
    }
}
class CrsEffEnergyDrain extends CrsEffect{
    constructor() {
        super();
        this.id='CrsEffEnergyDrain';
    }
    toJSON() {return window.storage.Generic_toJSON("CrsEffEnergyDrain", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CrsEffEnergyDrain, value.data));}
    get desc() {return("Drains wearers energy.")}
    apply(unapply) {
        if(unapply) {
            this.parent.parent.parent.parent.Effects.removeItem(this.parent.parent.id+'_EnergyDrain');
        } else {
        //this->curse->item->outfit->char     id="cursed_leather_bracer.EnergyDrain"
            this.parent.parent.parent.parent.addEffect(this.parent.parent.id+'_EnergyDrain',new window.storage.constructors['effEnergyDrain']());
        }
    }
}
class CrsEffStatBonus extends CrsEffect{
    constructor() {
        super();
        this.id='CrsEffStatBonus';
        this.statid ='strength';
        this.statbonus = 5;
    }
    toJSON() {return window.storage.Generic_toJSON("CrsEffStatBonus", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CrsEffStatBonus, value.data));}
    get desc() {return(this.statid+" +"+this.statbonus)}
    apply(unapply) {
        if(unapply) {
            this.parent.parent.parent.parent.Stats.removeModifier(this.statid,{id:this.statid+":"+this.parent.parent.id});
        } else {
            this.parent.parent.parent.parent.Stats.addModifier(this.statid,{id:this.statid+":"+this.parent.parent.id, bonus:this.statbonus});
        }
    }
}
//todo wrap you in rubber; pony gear,
/**
 * adds a curse-function to an item
 */
window.gm.makeCursedItem = function(item, extra) {
    let curse = new Curse();
    let eff =null;
    let list=[];
    curse.trigger = new CrsTrgOnEquip();
    if(extra.hidden) { 
        curse.hidden=extra.hidden;
    } else curse.hidden=4; //by default hidden
    if(extra.delayed) {
        curse.trigger = new CrsTrgDelayed();
    }
    if(extra.lock) {
        eff = new CrsEffLock();
        list.push(eff);
    }
    if(extra.convert) {
        eff = new CrsEffConvert();
        eff.newItem=extra.convert;
        list.push(eff);
    }
    if(extra.energydrain) {
        eff = new CrsEffEnergyDrain();
        list.push(eff);
    }
    curse.configureCurse(item,curse.trigger,list);
    return(item);
}
window.gm.makeBonusItem = function(item, extra) {
    let curse = new Curse();
    let eff =null;
    let list=[];
    curse.trigger = new CrsTrgOnEquip();
    if(extra.hidden) { 
        curse.hidden=extra.hidden;
    } else curse.hidden=0; //by default visible?
    if(extra.statBoost && extra.statBonus) {
        eff = new CrsEffStatBonus();
        eff.statid=extra.statBoost, eff.statbonus=extra.statBonus;
        list.push(eff);
    }
    curse.configureCurse(item,curse.trigger,list);
    return(item);
}

window.gm.ItemsLib = (function (ItemsLib) {
    window.storage.registerConstructor(Curse);
    window.storage.registerConstructor(CrsTrgDelayed);
    window.storage.registerConstructor(CrsTrgOnEquip);
    window.storage.registerConstructor(CrsEffLock);
    window.storage.registerConstructor(CrsEffConvert);
    window.storage.registerConstructor(CrsEffEnergyDrain);
    window.storage.registerConstructor(CrsEffStatBonus);
}(window.gm.ItemsLib || {}));