"use strict";
class Leggings extends Equipment {
    constructor() {
        super('Leggings');
        this.tags = ['cloth'];
        this.slotUse = ['Legs','Hips'];
        window.storage.registerConstructor(Leggings);
    }
    get desc() { return 'Spandex-leggings for sport. (agility+)';}
    toJSON() {return window.storage.Generic_toJSON("Leggings", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Leggings, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    onEquip() {
        this.parent.parent.Stats.addModifier('agility',{id:'agility:Leggings', bonus:5});
        return({OK:true, msg:'equipped'});}
    onUnequip() {
        this.parent.parent.Stats.removeModifier('agility',{id:'agility:Leggings'});
        return({OK:true, msg:'unequipped'});}
}
class Jeans extends Equipment {
    constructor() {
        super('Jeans');
        this.tags = ['cloth'];
        this.slotUse = ['Legs','Hips'];
        window.storage.registerConstructor(Jeans);
    }
    get desc() { return 'plain old blue jeans';    }
    toJSON() {return window.storage.Generic_toJSON("Jeans", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Jeans, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class Sneakers extends Equipment {
    constructor() {
        super('Sneakers');
        this.tags = ['cloth'];
        this.slotUse = ['Feet'];
        window.storage.registerConstructor(Sneakers);
    }
    get desc() { return 'Sneakers for sport and recreational activities.';    }
    toJSON() {return window.storage.Generic_toJSON("Sneakers", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Sneakers, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class TankShirt extends Equipment {
    constructor() {
        super('TankShirt');
        this.tags = ['cloth'];
        this.slotUse = ['Breast','Stomach'];       
        window.storage.registerConstructor(TankShirt);
    }
    get desc() { return 'light blue tank-top';}
    toJSON() {return window.storage.Generic_toJSON("TankShirt", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TankShirt, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class Pullover extends Equipment {
    constructor() {
        super('Pullover');
        this.tags = ['cloth'];
        this.slotUse = ['Breast','Stomach','Arms'];
        window.storage.registerConstructor(Pullover);
    }
    get desc() { return 'warm pullover';}
    toJSON() {return window.storage.Generic_toJSON("Pullover", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Pullover, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class HandCuffs extends Equipment {
    constructor() {
        super('HandCuffs');
        this.tags = ['restrain'];
        this.slotUse = ['RHand','LHand'];   //Todo wrists??
    }
    get desc() { return 'handcuffs'
        window.storage.registerConstructor(Pullover);
    }
    toJSON() {return window.storage.Generic_toJSON("HandCuffs", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(HandCuffs, value.data));}
    usable(context) {return(this.canEquip());}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) {  
            this.parent.parent.Outfit.removeItem(this.name); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    canEquip() { 
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) return({OK:true, msg:'unequip'});    //todo check for key
        else return({OK:true, msg:'equip'});
    }
    canUnequip() {return({OK:false, msg:'You need to find a key first to be able to remove it!'});}
}
//this is an Inventory-item, not wardrobe
class Crowbar extends Equipment {
    constructor() {
        super('Crowbar');
        this.tags = ['tool', 'weapon'];
        this.slotUse = ['RHand'];
        window.storage.registerConstructor(Crowbar);
    }
    get desc() { return 'A durable crowbar.';}
    toJSON() {return window.storage.Generic_toJSON("Crowbar", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Crowbar, value.data));}
    usable(context) {return(this.canEquip());}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) {  
            this.parent.parent.Outfit.removeItem(this.name); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    canEquip() { 
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) return({OK:true, msg:'unequip'});
        else return({OK:true, msg:'equip'});
    }
    canUnequip() {return({OK:true, msg:'unequipable'});}
    onEquip() {
        this.parent.parent.Stats.addModifier('pAttack',{id:'pAttack:Crowbar', bonus:2});
        return({OK:true, msg:'equipped'});}
    onUnequip() {
        this.parent.parent.Stats.removeModifier('pAttack',{id:'pAttack:Crowbar'});
        return({OK:true, msg:'unequipped'});}
}
//this is an Inventory-item, not wardrobe
class Shovel extends Equipment {
    constructor() {
        super('Shovel');
        this.tags = ['tool', 'weapon'];
        this.slotUse = ['RHand','LHand'];
        window.storage.registerConstructor(Shovel);
    }
    get desc() { 'A rusty,old shovel.';}
    toJSON() {return window.storage.Generic_toJSON("Shovel", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Shovel, value.data));}
    usable(context) {return(this.canEquip());}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) {  
            this.parent.parent.Outfit.removeItem(this.name); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    canEquip() {
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) return({OK:true, msg:'unequip'});
        else return({OK:true, msg:'equip'});
    }
    canUnequip() {return({OK:true, msg:'unequipable'});}
    onEquip() {
        this.parent.parent.Stats.addModifier('pAttack',{id:'pAttack:Shovel', bonus:2});
        return({OK:true, msg:'equipped'});}
    onUnequip() {
        this.parent.parent.Stats.removeModifier('pAttack',{id:'pAttack:Shovel'});
        return({OK:true, msg:'unequipped'});}
}
class TailRibbon extends Equipment {
    constructor() {
        super('TailRibbon');
        this.tags = ['cloth'];
        this.slotUse = ['TailTip'];
        window.storage.registerConstructor(TailRibbon);
    }
    get desc() { 'a fancy color band that can be wrapped around someones tailtip';}
    toJSON() {return window.storage.Generic_toJSON("TailRibbon", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TailRibbon, value.data));}
    canEquip() { 
        if(this.parent.parent.Outfit.findItemSlot(this.name).length>0) return({OK:true, msg:'unequip'});    //todo check for key
        else {
            if(this.parent.parent.Outfit.countItem("TailCat")>0) {
                return({OK:true, msg:'equip'}); 
            } else {
                return({OK:false, msg:'This requires a propper tail to attach to!'}); 
            }
        }
    }
    canUnequip() {return({OK:true, msg:'unequipable'});}
}

//a bodypart
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
    constructor() {
        super('VulvaHuman');
        this.tags = ['body'];
        this.slotUse = ['bVulva'];
        this.growth = 0.0; //in %/100 maxGrowth
        this.maxGrowth = 0.2; //in meter, todo depends on bodysize
        window.storage.registerConstructor(VulvaHuman);
    }
    get desc() { return 'a human cooter.';}
    toJSON() {return window.storage.Generic_toJSON("VulvaHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(VulvaHuman, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}

window.gm.ItemsLib = (function (ItemsLib) {
    window.storage.registerConstructor(Leggings);
    window.storage.registerConstructor(TankShirt);
    window.storage.registerConstructor(Jeans);
    window.storage.registerConstructor(Sneakers);
    window.storage.registerConstructor(Pullover);
    window.storage.registerConstructor(Crowbar);
    window.storage.registerConstructor(Shovel);
    window.storage.registerConstructor(TailRibbon);
    //.. and Wardrobe
    ItemsLib['Leggings'] = function () { return new Leggings();};
    ItemsLib['Tank-shirt'] = function () { return new TankShirt(); };
    ItemsLib['Jeans'] = function () { return new Jeans();};
    ItemsLib['Jeans'] = function () { return new Sneakers();};
    ItemsLib['Pullover'] = function () { return new Pullover();};
    ItemsLib['TailRibbon'] = function () { return new TailRibbon();};
    //special wardrobe-item combination
    ItemsLib['Crowbar']  = function () { return new Crowbar();};
    ItemsLib['Shovel']  = function () { return new Shovel();};//{name: 'Shovel', desc: 'A shovel for the dirty work.', tags: ['tool', 'weapon'], slotUse: ['RHand','LHand'],usable:defaultCanUse, use:defaultOnUse, canEquip:defaultCanUse, canUnequip:defaultCanUnequip };
    ItemsLib['Handcuffs'] = function () { return new HandCuffs();};//{name: 'Handcuffs', desc: 'You cannot use your hand.', tags: ['restrain'], slotUse: ['RHand','LHand'],usable:defaultCanUse, use:defaultOnUse, canEquip:defaultCanUse, canUnequip:defaultNoUnequip };
    ItemsLib['TailNone'] = function () { return new TailNone();};
    ItemsLib['TailCat'] = function () { return new TailCat();};
    ItemsLib['BreastHuman'] = function () { return new BreastHuman();};
    ItemsLib['BreastHuman'] = function () { return new VulvaHuman();};
    return ItemsLib; 
}(window.gm.ItemsLib || {}));