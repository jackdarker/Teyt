
"use strict";
/**
 * Items can have curse(s) that is applied when its condition is met 
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
    configureCurse(trigger,curses) {
        this.trigger = trigger;
        this.list=curses;
        this.rebuiltObj()
    }
    rebuiltObj() {
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
    onTimeChange(time) {
        if(this.trigger.onTimeChange(time)) this.apply();
    }
    apply(){
        for(el of this.list) {
            el.apply();
        }
    }
}
//-------------------------------------------------------------------------
class CrsTrigger {
    constructor() {
        this.id='';
    }
     /* 
    * parent is the curse !
    * Attention !! _parent will be added dynamical
    */
    get parent() {return(this._parent?this._parent(): null);} 
    onEquip() {return(false);}
    onTimeChange(time) {return(false);}
}
class CrsTrgOnEquip extends CrsTrigger {
    constructor() {
        super();
        this.minItems=0; //if 0 always trigger onEquip
        this.curseName=''; //todo ..otherwise min no. items with this keyword need to be equipped
    }
    onEquip() {
        return(true);
    }
    toJSON() {return window.storage.Generic_toJSON("CrsTrgOnEquip", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CrsTrgOnEquip, value.data));}
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
}
class CrsEffLock extends CrsEffect{
    constructor() {
        super();
        this.id='CurseLock';
        this.locked=false;
    }
    toJSON() {return window.storage.Generic_toJSON("CurseLock", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CurseLock, value.data));}
    desc() {return("The item can only be unlocked with a fitting key.")}
    apply() {
        this.parent.parent.locked=true;
        window.gm.pushDeferredEvent("GenericDeffered",['As soon as you equiped it, some hidden lock sealed the item on you !']);
        //todo unequip is possible if key in items:  
        //item.canUnequip=curse.canUnequip     need to restore functionassignment after load!
    }
}
class CrsEffEnergyDrain extends CrsEffect{
    constructor() {
        super();
        this.id='CrsEffEnergyDrain';
    }
    toJSON() {return window.storage.Generic_toJSON("CrsEffEnergyDrain", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CrsEffEnergyDrain, value.data));}
    desc() {return("Drains ones energy.")}
    apply() {
        //todo id should be "cursed_leather_bracer.EnergyDrain"
        //this->curse->item->outfit->char
        this.parent.parent.parent.parent.addEffect(this.parent.id+'_EnergyDrain',new window.storage.constructors['effEnergyDrain']());
        //todo remove effect on unequip
    }
}
/**
 * adds a curse-function to an item
 */
window.gm.makeCursedItem = function(item, extra) {
    let curse = new Curse();
    let eff =null;
    let list=[];
    curse.trigger = new CrsTrgOnEquip();
    if(extra.delayed) {
        curse.trigger = new CrsTrgDelayed();
    }
    if(extra.lock) {
        eff = new CrsEffLock();
        list.push(eff);
    }
    if(extra.energydrain) {
        eff = new CrsEffEnergyDrain();
        list.push(eff);
    }
    curse.configureCurse(curse.trigger,list);
    item.curse=curse;
    curse._parent=window.gm.util.refToParent(item); //todo rebuilt on load
    return(item);
  }

window.gm.ItemsLib = (function (ItemsLib) {
    window.storage.registerConstructor(Curse);
    window.storage.registerConstructor(CrsTrgDelayed);
    window.storage.registerConstructor(CrsTrgOnEquip);
    window.storage.registerConstructor(CrsEffLock);
    window.storage.registerConstructor(CrsEffEnergyDrain);
}(window.gm.ItemsLib || {}));