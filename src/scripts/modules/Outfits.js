"use strict";
class Leggings extends Equipment {
    constructor() {
        super('Leggings');
        this.tags = ['cloth'];
        this.slotUse = ['Legs','Hips'];
    }
    get desc() { return 'Spandex-leggings for sport. (agility+)';}
    toJSON() {return window.storage.Generic_toJSON("Leggings", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Leggings, value.data));}
    onEquip(context) {
        context.parent.Stats.addModifier('agility',{id:'agility:Leggings', bonus:5});
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
    toJSON() {return window.storage.Generic_toJSON("Jeans", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Jeans, value.data));}
}
class Sneakers extends Equipment {
    constructor() {
        super('Sneakers');
        this.tags = ['cloth'];
        this.slotUse = ['Feet'];
    }
    get desc() { return 'Sneakers for sport and recreational activities.';    }
    toJSON() {return window.storage.Generic_toJSON("Sneakers", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Sneakers, value.data));}
}
class TankShirt extends Equipment {
    constructor() {
        super('TankShirt');
        this.tags = ['cloth'];
        this.slotUse = ['Breast','Stomach'];
    }
    get desc() { return 'light blue tank-top';}
    toJSON() {return window.storage.Generic_toJSON("TankShirt", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TankShirt, value.data));}
}
class Pullover extends Equipment {
    constructor() {
        super('Pullover');
        this.tags = ['cloth'];
        this.slotUse = ['Breast','Stomach','Arms'];
    }
    descLong(fconv) {
        let msg='';
        if(this.isEquipped()) msg='A warm pullover adorns $[me]$.';
        else msg='$[I]$ $[have]$ '+this.name+".";
        return(fconv(msg));
    }
    get desc() { return 'warm pullover';}
    toJSON() {return window.storage.Generic_toJSON("Pullover", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Pullover, value.data));}
}
class BracerLeather extends Equipment {
    constructor() {
        super('BracerLeather');
        this.tags = ['cloth'];
        this.slotUse = ['Wrists'];
        this.style = 0;   
        this.lossOnRespawn = true;
    }
    set style(style) { 
        this._style = style; 
        //if(style===100) this.lossOnRespawn=false;
    }
    get style() {return this._style;}
    get desc() { 
        let msg ='worn bracers made of leather';
        if(this.style===100) msg=('leather bracers with steel-studs');
        return(msg+this.bonusDesc());
    }
    descLong(fconv) {
        let msg='';
        if(this.isEquipped()) msg='A pair of bracers adorns $[my]$ lower arms.';
        else msg='$[I]$ $[have]$ '+this.name+".";
        return(fconv(msg));
    }
    toJSON() {return window.storage.Generic_toJSON("BracerLeather", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BracerLeather, value.data));}
}
class HandCuffs extends Equipment {
    constructor() {
        super('HandCuffs');
        this.tags = ['restrain'];
        this.slotUse = ['RHand','LHand','Wrists'];
    }
    get desc() { return 'handcuffs like the police use them';  }
    toJSON() {return window.storage.Generic_toJSON("HandCuffs", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(HandCuffs, value.data));}
    usable(context) {return(this.canEquip(context));}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) {  
            this.parent.parent.Outfit.removeItem(this.id); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    canEquip(context) { 
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) return({OK:true, msg:'unequip'});    //todo check for key
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
    get desc() { return 'some leather cuffs for wrists';  }
    toJSON() {return window.storage.Generic_toJSON("WristCuffs", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(WristCuffs, value.data));}
    usable(context) {return(this.canEquip(context));}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) {  
            this.parent.parent.Outfit.removeItem(this.id); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    canEquip(context) { 
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) return({OK:true, msg:'unequip'});
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
    toJSON() {return window.storage.Generic_toJSON("CollarQuest", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(CollarQuest, value.data));}
    usable(context) {return(this.canEquip(context));}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) {  
            this.parent.parent.Outfit.removeItem(this.id); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    canEquip(context) { 
        if(this.parent && this.parent.parent.Outfit.findItemSlot(this.id).length>0) return({OK:true, msg:'unequip'});
        else return({OK:true, msg:'equip'});
    }
    canUnequip() {return({OK:false, msg:'This can only be removed by a magican!'});}
}
class PiercingClit extends Equipment {
    constructor() {
        super('PiercingClit');
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
    toJSON() {return window.storage.Generic_toJSON("PiercingClit", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(PiercingClit, value.data));}
    onEquip(context) {
        if(this.style===100) {
            context.parent.addEffect("effGrowVulva",window.storage.constructors['effGrowVulva']()); //only works for player since effects of NPC dont receive ticks!
        } 
        return({OK:true, msg:'equipped'});}
}
class TattooGroin extends Equipment {
    constructor() {
        super('TattooGroin');
        this.tags = ['tattoo'];
        this.slotUse = ['tStomach'];    
        this.style = 0;   
        this.lossOnRespawn = false;
    }
    set style(style) { 
        this._style = style; 
    }
    get style() {return this._style;}
    get desc() { 
        if(this.style===100) return('a kind of lewd mark');
        return('a tribal tatto on the lower belly');
    }
    toJSON() {return window.storage.Generic_toJSON("TattooGroin", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TattooGroin, value.data));}
    canEquip(context) {return({OK:false, msg:'unequipable'});}
    canUnequip() {return({OK:false, msg:'not so easy to get rid off'});}
    onEquip(context) {
        if(this.style===100) {
            context.parent.addEffect("effLewdMark",window.storage.constructors['effLewdMark']()); //only works for player since effects of NPC dont receive ticks!
        } 
        return({OK:true, msg:'tattoed'});}
}
//this is an Inventory-item, not wardrobe
class Crowbar extends Equipment {
    constructor() {
        super('Crowbar');
        this.tags = ['tool', 'weapon'];
        this.slotUse = ['RHand'];
        this.lossOnRespawn = true;
    }
    descLong(fconv) {return(fconv('$[I]$ $[hold]$ a crowbar.'));}
    get desc() { return 'durable crowbar.';}
    toJSON() {return window.storage.Generic_toJSON("Crowbar", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Crowbar, value.data));}
    usable(context) {return(this.canEquip(context));}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) {  
            this.parent.parent.Outfit.removeItem(this.id); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    onEquip(context) {
        //context.parent.Stats.addModifier('pAttack',{id:'pAttack:Crowbar', bonus:2});
        return({OK:true, msg:'equipped'});}
    onUnequip() {
        //this.parent.parent.Stats.removeModifier('pAttack',{id:'pAttack:Crowbar'});
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
    get desc() { return('A rusty,old shovel.');}
    toJSON() {return window.storage.Generic_toJSON("Shovel", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Shovel, value.data));}
    usable(context) {return(this.canEquip(context));}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) {  
            this.parent.parent.Outfit.removeItem(this.id); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }

    onEquip(context) {
        //context.parent.Stats.addModifier('pAttack',{id:'pAttack:Shovel', bonus:2});
        return({OK:true, msg:'equipped'});}
    onUnequip() {
        //this.parent.parent.Stats.removeModifier('pAttack',{id:'pAttack:Shovel'});
        return({OK:true, msg:'unequipped'});}
}
class RobesZealot extends Equipment {
    constructor() {
        super('RobesZealot');
        this.tags = ['cloth'];
        this.slotUse = ['Breast','Stomach','Hips','Legs'];
        this.slotCover = ['bBreast','uBreast','pNipples'];    
        this.lossOnRespawn = true;
    }
    get desc() { return 'light blue tank-top';}
    toJSON() {return window.storage.Generic_toJSON("RobesZealot", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(RobesZealot, value.data));}

}
class Briefs extends Equipment {
    constructor() {
        super('Briefs');
        this.tags = ['cloth'];
        this.slotUse = ['uHips'];
        this.slotCover = ['bPenis','bVulva','bBalls','bClit','bAnus','pPenis','pClit'];    
        this.lossOnRespawn = true;
    }
    get desc() { return 'plain briefs';}
    toJSON() {return window.storage.Generic_toJSON("Briefs", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(Briefs, value.data));}
}
class BikiniBottomLeather extends Equipment {
    constructor() {
        super('BikiniBottomLeather');
        this.tags = ['cloth'];
        this.slotUse = ['uHips'];
        this.slotCover = ['bPenis','bVulva','bBalls','bClit','bAnus','pPenis','pClit'];    
        this.lossOnRespawn = true;
    }
    get desc() { return 'leather triangle-bikini bottom';}
    toJSON() {return window.storage.Generic_toJSON("BikiniBottomLeather", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BikiniBottomLeather, value.data));}
}
class BikiniTopLeather extends Equipment {
    constructor() {
        super('BikiniTopLeather');
        this.tags = ['cloth'];
        this.slotUse = ['uBreast'];
        this.slotCover = ['pNipples'];    
        this.lossOnRespawn = true;
    }
    get desc() { return 'leather triangle-bikini top';}
    toJSON() {return window.storage.Generic_toJSON("BikiniTopLeather", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BikiniTopLeather, value.data));}
}
class ShortsLeather extends Equipment {
    constructor() {
        super('ShortsLeather');
        this.tags = ['cloth'];
        this.slotUse = ['Hips','Legs'];
        this.slotCover = ['bPenis','bVulva','bBalls','bClit','bAnus','pPenis','pClit'];    
        this.lossOnRespawn = true;
    }
    get desc() { return 'leather shorts';}
    toJSON() {return window.storage.Generic_toJSON("ShortsLeather", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(ShortsLeather, value.data));}
}
class BowWodden extends Equipment {
    constructor() {
        super('BowWodden');
        this.tags = [ 'weapon'];
        this.slotUse = ['RHand','LHand'];
        this.lossOnRespawn = true;
        this.pDamage = 11;
    }
    get desc() { return('A simple bow');}
    toJSON() {return window.storage.Generic_toJSON("BowWodden", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BowWodden, value.data));}
    usable(context) {return(this.canEquip(context));}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) {  
            this.parent.parent.Outfit.removeItem(this.id); 
            return( {OK:true, msg:'unequipped '+ this.name});
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); 
        }
    }
    onEquip(context) {        
        return({OK:true, msg:'equipped'});
    }
    onUnequip() {return({OK:true, msg:'unequipped'});}
}
class DaggerSteel extends Equipment {
    constructor() {
        super('DaggerSteel');
        this.tags = [ 'weapon'];
        this.slotUse = ['RHand'];
        this.lossOnRespawn = true;
        this.pDamage = 6;
    }
    get desc() { return('A steel dagger.');}
    toJSON() {return window.storage.Generic_toJSON("DaggerSteel", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(DaggerSteel, value.data));}
    usable(context) {return(this.canEquip(context));}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) {  
            this.parent.parent.Outfit.removeItem(this.id); 
            return( {OK:true, msg:'unequipped '+ this.name});
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); 
        }
    }
    onEquip(context) {        
        return({OK:true, msg:'equipped'});
    }
    onUnequip() {return({OK:true, msg:'unequipped'});}
}
class StaffWodden extends Equipment {
    constructor() {
        super('StaffWodden');
        this.tags = [ 'weapon'];
        this.slotUse = ['RHand','LHand'];
        this.lossOnRespawn = true;
        this.pDamage = 5;
    }
    get desc() { return('A staff made from wood.');}
    toJSON() {return window.storage.Generic_toJSON("StaffWodden", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(StaffWodden, value.data));}
    usable(context) {return(this.canEquip(context));}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) {  
            this.parent.parent.Outfit.removeItem(this.id); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    onEquip(context) {
        let sk = new SkillSmash();
        sk.weapon = this.id;
        this.parent.parent.Skills.addItem(sk);
        return({OK:true, msg:'equipped'});}
    onUnequip() {
        this.parent.parent.Skills.removeItem('Smash');
        return({OK:true, msg:'unequipped'});}
    attackMod(target){
        let mod = new SkillMod();
        mod.onHit = [{ target:target, eff: [effDamage.setup(11,'blunt')]}];
        mod.critChance=50;
        mod.onCrit = [{ target:target, eff: [effDamage.setup(11,'blunt'), new effStunned()]}];
        return(mod);
    }
}
class MaceSteel extends Equipment {
    constructor() {
        super('MaceSteel');
        this.tags = [ 'weapon'];
        this.slotUse = ['RHand'];
        this.lossOnRespawn = true;
        this.pDamage = 15;
        /*this.attack = window.gm.combat.AttackSetup();
        let dmg = {target:"defender", effect:"effDamage", value: 10};
        let stun = {target:"defender", effect:"effStun", value: 10};
        this.attack.apply = [{cond:100, apply:dmg},{cond:50,apply:stun}]; */
    }
    get desc() { return('A heavy steel mace.');}
    toJSON() {return window.storage.Generic_toJSON("MaceSteel", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(MaceSteel, value.data));}
    usable(context) {return(this.canEquip(context));}
    use(context) { //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) {  
            this.parent.parent.Outfit.removeItem(this.id); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    onEquip(context) {        
        return({OK:true, msg:'equipped'});
    }
    onUnequip() {return({OK:true, msg:'unequipped'});}
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
    canEquip(context) { 
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0) return({OK:true, msg:'unequip'});    //todo check for key
        else {
            if(this.parent.parent.Outfit.countItem("TailWolf")>0) {
                return({OK:true, msg:'equip'}); 
            } else {
                return({OK:false, msg:'This requires a propper tail to attach to!'}); 
            }
        }
    }
}
//todo bow,whip,blowpipe
//todo vest,chaps,bikini top, greaves , jacket
window.gm.ItemsLib = (function (ItemsLib) {
    window.storage.registerConstructor(BikiniBottomLeather);
    window.storage.registerConstructor(BikiniTopLeather);
    window.storage.registerConstructor(BracerLeather);
    window.storage.registerConstructor(Briefs);
    window.storage.registerConstructor(CollarQuest);
    window.storage.registerConstructor(DaggerSteel);
    window.storage.registerConstructor(Leggings);
    window.storage.registerConstructor(MaceSteel);
    window.storage.registerConstructor(TankShirt);
    window.storage.registerConstructor(Jeans);
    window.storage.registerConstructor(Sneakers);
    window.storage.registerConstructor(Pullover);
    window.storage.registerConstructor(Crowbar);
    window.storage.registerConstructor(Shovel);
    window.storage.registerConstructor(TailRibbon);
    window.storage.registerConstructor(PiercingClit);
    window.storage.registerConstructor(TattooGroin);
    window.storage.registerConstructor(RobesZealot);
    window.storage.registerConstructor(ShortsLeather);
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
    ItemsLib['PiercingClit'] = function () { return new PiercingClit();};
    ItemsLib['TattooGroin'] = function () { return new TattooGroin();};
    ItemsLib['RobesZealot'] = function () { return new RobesZealot();};
    ItemsLib['WristCuffs'] = function () { return new WristCuffs();};
    //special wardrobe-item combination
    ItemsLib['Crowbar']  = function () { return new Crowbar();};
    ItemsLib['Shovel']  = function () { return new Shovel();};
    ItemsLib['StaffWodden']  = function () { return new StaffWodden();};
    ItemsLib['Handcuffs'] = function () { return new HandCuffs();};
    ItemsLib['DaggerSteel'] = function () { return new DaggerSteel();};
    return ItemsLib; 
}(window.gm.ItemsLib || {}));