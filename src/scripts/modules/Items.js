"use strict";
class LighterDad extends Item {
    constructor() {        super('LighterDad');    }
    get desc() { return('I got this lighter from my real dad.');}
    toJSON() {return window.storage.Generic_toJSON("LighterDad", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(LighterDad, value.data);};
};
class Money extends Item {
    constructor() {super('Money');}
    get desc() { return('shiny,clinky coin.');}
    toJSON() {return window.storage.Generic_toJSON("Money", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Money, value.data);};
};

class LaptopPS extends Item {
    constructor() {        super('LaptopPS');    }
    get desc() { return 'Power converter for laptop.';    }
    toJSON() {return window.storage.Generic_toJSON("LaptopPS", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(LaptopPS, value.data);};
};
class Dildo_small extends Item {
    constructor() {        super('Dildo_small');    }
    get desc() { return 'A dildo, smaller than an average dong, made from rubbery plastic.';    }
    toJSON() {return window.storage.Generic_toJSON("Dildo_small", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Dildo_small, value.data);};
}
class Lube extends Item {
    constructor() {     super('Lube');    }
    get desc() { return 'Slippery lubricant for personal use.';    }
    toJSON() {return window.storage.Generic_toJSON("Lube", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Lube, value.data);};
}
class Battery extends Item {
    constructor() { super('Battery'); }
    get desc() { return 'Provides electricity for devices.';   }
    toJSON() {return window.storage.Generic_toJSON("Battery", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Battery, value.data);};
}
class Ingredient extends Item {
    constructor() { super('Ingredient');   
        this.lossOnRespawn = true;
    }
    static lookupId(id) {
        let info ={desc:''};
        switch(id){
            case "ApocaFlower": 
                info.desc= "yellow bluish flower";
                break;
            case "PurpleBerry":
                info.desc="purple berrys grown in the forest";
                break;
            case "BloatedMushroom":
                info.desc="mushrooms from a cave";
                break;
            case "SquishedLeech":
                info.desc="I dont wanna carry that around";
                break;
            default:
        }
        return(info);
    }
    changeId(id) {this.id = id;} //instead of creating full class for every useless junk I use this and just add variable that will be restored after load
    get desc() { return Ingredient.lookupId(this.id).desc;   }
    toJSON() {return window.storage.Generic_toJSON("Ingredient", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Ingredient, value.data);};
}

class FlashBang extends Item {
    constructor() { super('FlashBang');  }
    get desc() { return 'Stun someone with a blinding light.';  }
    toJSON() {return window.storage.Generic_toJSON("FlashBang", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(FlashBang, value.data);};

    //context is the skillUseItem calling this
    targetFilter(targets,context) {
        if(!window.gm.combat.inCombat()) return([]);
        //to use skill-targetfilter we need an instance of skill bound to the caster  - todo this is ugly
        //let _sk = this.parent.parent.Skills.getItem('UseItem');//._parent=window.gm.util.refToParent(this.parent.parent.Skills); 
        return(context.targetMultiple(context.targetFilterFighting(context.targetFilterEnemy(targets))));
    }
    usable(context,on=null) {
        //can only be used while in combat and target is enemy
        let result = {OK:false, msg:'cannot use'};
        if(!window.gm.combat.inCombat()) {
            result.msg= 'can only be used in combat';
        } else {
            result.msg= 'use',result.OK=true;
        }
        return(result);
    }
    use(context,on=null) { 
        let result = {OK:false,msg:''};
        if(context instanceof Inventory) {
            context.removeItem('FlashBang');
            if(context.parent instanceof Character){
                if(on===null) on=context.parent;
                if(on.length && on.length>0) { 
                    //on can be several targets (array)
                } else {
                    on = [on];  //..if not an array change it
                }
                result.msg = context.parent.name+' uses '+this.name+'.';
                for(let _targ of on) {
                    _targ.addEffect(effStunned.id,new effStunned());  //todo should 'FlashBang:Stunned' merge with other stunned? 
                    result.msg +=_targ.name+' got stunned. ';
                }
                result.OK=true;
                return(result);
            }
        } else throw new Error('context is invalid');
    }
};
class CanOfCoffee extends Item {
    constructor() {   super('CanOfCoffee');   }
    get desc() { return 'Cold coffee in a can. Tasty? Not really!';    }
    toJSON() {return window.storage.Generic_toJSON("CanOfCoffee", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(CanOfCoffee, value.data);};
    usable(context) {return({OK:true, msg:'drink'});}
    use(context) { 
        if(context instanceof Inventory) {
            context.removeItem('CanOfCoffee');
            if(context.parent instanceof Character){
                context.parent.addEffect('CanOfCoffee:Energized',new effEnergized());    //apply over-time-effect instead directly changing stat
            return({OK:true, msg:context.parent.name+' gulped down a can of iced coffee.'});
            }
        } else throw new Error('context is invalid');
    }
};
class SimpleFood extends Item {
    constructor() {        super('SimpleFood');    }
    get desc() { return 'Something to eat.';    }
    toJSON() {return window.storage.Generic_toJSON("SimpleFood", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(SimpleFood, value.data);};
    usable(context,on=null) {return({OK:true, msg:'eat'});}
    use(context,on=null) { 
        var _gaveAway=false;
        if(context instanceof Inventory) {
            if(on===null) on=context.parent;
            else _gaveAway=true;
            context.removeItem('Simple food');
            if(on instanceof Character){
                on.addEffect('Simple food:Energized',new effEnergized());
            return({OK:true, msg:on.name+' ate some plain foods.'});
            }
        } else throw new Error('context is invalid');
        
    }
}
class HealthPotion extends Item {
    static lookupId(id) {
        let info ={desc:'',amount:10};
        switch(id){
            case "HealthPotion": 
                info.amount = 45,info.desc= "health potion";
                break;
            case "HealthPotion(small)":
                info.amount = 20,info.desc="small health potion";
                break;
            default:
        }
        return(info);
    }
    constructor() { super('HealthPotion'); this.changeId('HealthPotion'); }
    toJSON() {return window.storage.Generic_toJSON("HealthPotion", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(HealthPotion, value.data);};
    usable(context,on=null) {return({OK:true, msg:'drink'});}
    use(context,on=null) { 
        var _gaveAway=false;
        if(context instanceof Inventory) {
            if(on===null) on=context.parent;
            else _gaveAway=true;
            context.removeItem(this.id);
            if(on instanceof Character){ 
                on.Stats.increment("health",this.amount);
                return({OK:true, msg:on.name+' drank a potion.'});
            }
        } else throw new Error('context is invalid');
    }
    changeId(id) {
        this.id = id;
        this.amount = HealthPotion.lookupId(id).amount;
    } //instead of creating full class for every useless junk I use this and just add variable that will be restored after load
    get desc() { return HealthPotion.lookupId(this.id).desc;   }
}
class HorsePotion extends Item {
    static lookupId(id) {
        let info ={desc:'',amount:10};
        switch(id){
            case "HorsePotion": 
                info.amount = 10,info.desc= "horse power potion";
                break;
            default:
        }
        return(info);
    }
    constructor() { super('HorsePotion'); this.changeId('HorsePotion'); }
    toJSON() {return window.storage.Generic_toJSON("HorsePotion", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(HorsePotion, value.data);};
    usable(context,on=null) {return({OK:true, msg:'drink'});}
    use(context,on=null) { 
        var _gaveAway=false;
        if(context instanceof Inventory) {
            if(on===null) on=context.parent;
            else _gaveAway=true;
            context.removeItem(this.id);
            if(on instanceof Character){ 
                if(on instanceof Character){
                    on.addEffect('HorsePower',new effHorsePower());
                    on.Stats.increment("health",100);
                }
                return({OK:true, msg:on.name+' drank a potion.'});
            }
        } else throw new Error('context is invalid');
    }
    changeId(id) {
        this.id = id;
        this.amount = HorsePotion.lookupId(id).amount;
    } 
    get desc() { return HorsePotion.lookupId(this.id).desc;   }
}

window.gm.ItemsLib = (function (ItemsLib) {
    window.storage.registerConstructor(LighterDad);
    window.storage.registerConstructor(Money);
    window.storage.registerConstructor(LaptopPS);
    window.storage.registerConstructor(Battery);
    window.storage.registerConstructor(Dildo_small);
    window.storage.registerConstructor(Lube);
    window.storage.registerConstructor(CanOfCoffee);
    window.storage.registerConstructor(SimpleFood);
    window.storage.registerConstructor(HealthPotion);
    window.storage.registerConstructor(HorsePotion);
    window.storage.registerConstructor(Ingredient);
    window.storage.registerConstructor(FlashBang);
    
    //todo do I need this extra ollection?
    ItemsLib['Money'] = function () { return new Money();};
    ItemsLib['LighterDad'] = function () { return new LighterDad();};
    ItemsLib['LaptopPS'] = function () { return new LaptopPS();};
    ItemsLib['Battery'] = function () { return new Battery();};
    ItemsLib['Dildo_small'] = function () { return new Dildo_small();};
    // consumables
    ItemsLib['Lube'] = function () { return new Lube();};
    ItemsLib['Ingredient'] = function () { return new Ingredient();};
    ItemsLib['CanOfCoffee'] = function () { return new CanOfCoffee(); };
    ItemsLib['SimpleFood'] = function () { return new SimpleFood(); };
    ItemsLib['FlashBang'] = function () { return new FlashBang(); };
    ItemsLib['HealthPotion'] = function () { let x= new HealthPotion();x.changeId("HealthPotion");return(x); };
    ItemsLib['HealthPotion(small)'] = function () { let x= new HealthPotion();x.changeId("HealthPotion(small)");return(x); };
    ItemsLib['BloatedMushroom'] = function () { let x= new Ingredient();x.changeId("BloatedMushroom");return(x); };
    ItemsLib['PurpleBerry'] = function () { let x= new Ingredient();x.changeId("PurpleBerry");return(x); };
    ItemsLib['ApocaFlower'] = function () { let x= new Ingredient();x.changeId("ApocaFlower");return(x); };
    return ItemsLib; 
}(window.gm.ItemsLib || {}));