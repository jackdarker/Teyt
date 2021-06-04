"use strict";
class Leggings extends Equipment {
    constructor() {
        super('Leggings');
        this.tags = ['cloth'];
        this.slotUse = ['Legs','Hips'];
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
    }
    descLong(fconv) {return(fconv('A warm pullover adorns $[me]$.'));}
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
        this.slotUse = ['RHand','LHand','Wrists'];
    }
    get desc() { return 'handcuffs';  }
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
class WristCuffs extends Equipment {
    constructor() {
        super('WristCuffs');
        this.tags = [];
        this.slotUse = ['Wrists'];
        this.lossOnRespawn = false;
    }
    get desc() { return 'handcuffs';  }
    toJSON() {return window.storage.Generic_toJSON("WristCuffs", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(WristCuffs, value.data));}
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
    canUnequip() {return({OK:false, msg:'Those cuffs can only be removed by a magican!'});}
}
class CollarQuest extends Equipment {
    constructor() {
        super('CollarQuest');
        this.tags = [];
        this.slotUse = ['Neck'];
        this.lossOnRespawn = false;
    }
    get desc() { return 'a collar';  }
    toJSON() {return window.storage.Generic_toJSON("CollarQuest", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CollarQuest, value.data));}
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
        if(this.parent && this.parent.parent.Outfit.findItemSlot(this.name).length>0) return({OK:true, msg:'unequip'});
        else return({OK:true, msg:'equip'});
    }
    canUnequip() {return({OK:false, msg:'This can only be removed by a magican!'});}
}
class ClitPiercing extends Equipment {
    constructor() {
        super('ClitPiercing');
        this.tags = ['piercing'];
        this.slotUse = ['pClit'];    
        this.style = 0;   
        this.lossOnRespawn = true;
    }
    set style(style) { 
        this._style = style; 
        if(style===100) this.lossOnRespawn=false;
    }
    get style() {return this._style;}
    get desc() { 
        if(this.style===100) return('cursed piercing');
        return('small clitoris-piercing');
    }
    toJSON() {return window.storage.Generic_toJSON("ClitPiercing", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(ClitPiercing, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    onEquip() {
        if(this.style===100) window.gm.player.addEffect("effGrowVulva",window.gm.StatsLib.effGrowVulva());
        return({OK:true, msg:'equipped'});}
}


//this is an Inventory-item, not wardrobe
class Crowbar extends Equipment {
    constructor() {
        super('Crowbar');
        this.tags = ['tool', 'weapon'];
        this.slotUse = ['RHand'];
        this.lossOnRespawn = true;
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
        this.lossOnRespawn = true;
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
class RobesZealot extends Equipment {
    constructor() {
        super('RobesZealot');
        this.tags = ['cloth'];
        this.slotUse = ['Breast','Stomach','Hips','Legs'];    
        this.lossOnRespawn = true;
    }
    get desc() { return 'light blue tank-top';}
    toJSON() {return window.storage.Generic_toJSON("RobesZealot", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(RobesZealot, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
//
class StaffWodden extends Equipment {
    constructor() {
        super('StaffWodden');
        this.tags = [ 'weapon'];
        this.slotUse = ['RHand','LHand'];
        this.lossOnRespawn = true;
    }
    get desc() { 'A staff ade from wood.';}
    toJSON() {return window.storage.Generic_toJSON("StaffWodden", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(StaffWodden, value.data));}
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
        this.parent.parent.Stats.addModifier('pAttack',{id:'pAttack:StaffWodden', bonus:2});
        return({OK:true, msg:'equipped'});}
    onUnequip() {
        this.parent.parent.Stats.removeModifier('pAttack',{id:'pAttack:StaffWodden'});
        return({OK:true, msg:'unequipped'});}
}
class TailRibbon extends Equipment {
    constructor() {
        super('TailRibbon');
        this.tags = ['cloth'];
        this.slotUse = ['TailTip'];
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

window.gm.ItemsLib = (function (ItemsLib) {
    window.storage.registerConstructor(CollarQuest);
    window.storage.registerConstructor(Leggings);
    window.storage.registerConstructor(TankShirt);
    window.storage.registerConstructor(Jeans);
    window.storage.registerConstructor(Sneakers);
    window.storage.registerConstructor(Pullover);
    window.storage.registerConstructor(Crowbar);
    window.storage.registerConstructor(Shovel);
    window.storage.registerConstructor(TailRibbon);
    window.storage.registerConstructor(ClitPiercing);
    window.storage.registerConstructor(RobesZealot);
    window.storage.registerConstructor(StaffWodden);
    window.storage.registerConstructor(WristCuffs);
    
    //.. and Wardrobe
    ItemsLib['CollarQuest'] = function () { return new CollarQuest();};
    ItemsLib['Leggings'] = function () { return new Leggings();};
    ItemsLib['Tank-shirt'] = function () { return new TankShirt(); };
    ItemsLib['Jeans'] = function () { return new Jeans();};
    ItemsLib['Sneakers'] = function () { return new Sneakers();};
    ItemsLib['Pullover'] = function () { return new Pullover();};
    ItemsLib['TailRibbon'] = function () { return new TailRibbon();};
    ItemsLib['ClitPiercing'] = function () { return new ClitPiercing();};
    ItemsLib['RobesZealot'] = function () { return new RobesZealot();};
    ItemsLib['WristCuffs'] = function () { return new WristCuffs();};
    //special wardrobe-item combination
    ItemsLib['Crowbar']  = function () { return new Crowbar();};
    ItemsLib['Shovel']  = function () { return new Shovel();};
    ItemsLib['StaffWodden']  = function () { return new StaffWodden();};
    ItemsLib['Handcuffs'] = function () { return new HandCuffs();};
    return ItemsLib; 
}(window.gm.ItemsLib || {}));