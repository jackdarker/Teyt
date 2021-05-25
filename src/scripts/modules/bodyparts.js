"use strict"
//bodyparts are special equipment
class TailNone extends Equipment {
    constructor() {
        super('TailNone');
        this.tags = ['body'];
        this.slotUse = ['bTailBase'];
        window.storage.registerConstructor(TailNone);
    }
    get desc() { return '';}
    toJSON() {return window.storage.Generic_toJSON("TailNone", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TailNone, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class TailCat extends Equipment {
    constructor() {
        super('TailCat');
        this.tags = ['body'];
        this.slotUse = ['bTailBase'];
        this.growth = 0.10; //in %/100 maxGrowth
        this.maxGrowth = 1.2; //in meter, todo depends on bodysize
        window.storage.registerConstructor(TailCat);
    }
    get desc() { 'a flexible,furred tail like that of a cat.';}
    toJSON() {return window.storage.Generic_toJSON("TailCat", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TailCat, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class BreastHuman extends Equipment {
    constructor() {
        super('BreastHuman');
        this.tags = ['body'];
        this.slotUse = ['bBreast'];
        this.growth = 0.0; //in %/100 maxGrowth
        this.maxGrowth = 0.3; //in meter, todo depends on bodysize
        window.storage.registerConstructor(BreastHuman);
    }
    get desc() { return 'some human breasts.';}
    toJSON() {return window.storage.Generic_toJSON("BreastHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BreastHuman, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class VulvaHuman extends Equipment {
    static vulvaDataPrototype() {    
        return({labia:0, virgin:true,wetgen:1, stretch:1,depth:1,clitsize:0.5});
    }
    static labiaStyles() {
        let style ={};
        style['human'] = 0;
        style['dog'] = 1;
    }
    constructor() {
        super('VulvaHuman');
        this.tags = ['body'];
        this.slotUse = ['bVulva'];
        this.data = VulvaHuman.vulvaDataPrototype();
        window.storage.registerConstructor(VulvaHuman);
    }
    get descShort() { return 'human vagina';}
    get desc() { return 'puffy cunt';}
    toJSON() {return window.storage.Generic_toJSON("VulvaHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(VulvaHuman, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong() {
        let msg = this.parent.parent.name+"\'s ";
        msg+= "vagina can snuggly fit around "+this.data.stretch+"cm in diameter and "+this.data.depth+"cm in depth.";
        msg+= "The clit is of a size of around "+this.data.clitsize+"cm.";   
        return(msg);
    }
}
//todo BodyPartLib ??
window.gm.ItemsLib = (function (ItemsLib) {
    ItemsLib['TailNone'] = function () { return new TailNone();};
    ItemsLib['TailCat'] = function () { return new TailCat();};
    ItemsLib['BreastHuman'] = function () { return new BreastHuman();};
    ItemsLib['VulvaHuman'] = function () { return new VulvaHuman();};
    return ItemsLib; 
}(window.gm.ItemsLib || {}));