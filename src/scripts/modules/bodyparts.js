"use strict"
//bodyparts are special equipment
class BaseHumanoid extends Equipment {
    constructor() {
        super('BaseHumanoid');
        this.tags = ['body'];
        this.slotUse = ['bBase'];
    }
    descLong(fconv) {return(fconv('$[I]$ $[have]$ a humanoid body.'));}
    get descShort() {return this.desc;};
    get desc() { return '';}
    toJSON() {return window.storage.Generic_toJSON("BaseHumanoid", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BaseHumanoid, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
}
class BaseQuadruped extends Equipment {
    constructor() {
        super('BaseQuadruped');
        this.tags = ['body'];
        this.slotUse = ['bBase'];
    }
    get descShort() {return this.desc;};
    get desc() { return '';}
    toJSON() {return window.storage.Generic_toJSON("BaseQuadruped", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BaseQuadruped, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {return(fconv('$[I]$ $[am]$ walking on 4 legs like a feral mammal.'));}
}
class FaceHuman extends Equipment {
    static dataPrototype() {    
        return({femininity:0.2});
        //1 = full female 0= male
    }
    constructor() {
        super('FaceHuman');
        this.tags = ['body'];
        this.slotUse = ['bFace'];
        this.data = FaceHuman.dataPrototype();   
    }
    get descShort() { return 'human face';}
    get desc() { return 'hominid face';}
    toJSON() {return window.storage.Generic_toJSON("FaceHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(FaceHuman, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {
        return(fconv('$[My]$ face ressembles that of a human'));
    }
}
class FaceWolf extends Equipment {
    static dataPrototype() {    
        return({femininity:0.2});    }
    constructor() {
        super('FaceWolf');
        this.tags = ['body'];
        this.slotUse = ['bFace'];
        this.data = FaceWolf.dataPrototype();   
    }
    get descShort() { return 'wolf muzzle';}
    get desc() { return 'wolf muzzle';}
    toJSON() {return window.storage.Generic_toJSON("FaceWolf", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(FaceWolf, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {
        return(fconv('$[I]$ $[have]$ a muzzle like a wolf'));
    }
}
class FaceHorse extends Equipment {
    static dataPrototype() {    
        return({femininity:0.2});    }
    constructor() {
        super('FaceHorse');
        this.tags = ['body'];
        this.slotUse = ['bFace'];
        this.data = FaceHorse.dataPrototype();   
    }
    get descShort() { return 'wolf muzzle';}
    get desc() { return 'wolf muzzle';}
    toJSON() {return window.storage.Generic_toJSON("FaceHorse", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(FaceHorse, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {
        return(fconv('$[I]$ $[have]$ a muzzle like a horse'));
    }
}
class SkinHuman extends Equipment {
    constructor() {
        super('SkinHuman');
        this.tags = ['body'];
        this.slotUse = ['bSkin'];
    }
    get desc() { 'a smooth tanned skin mostly bare of noticable hair.';}
    toJSON() {return window.storage.Generic_toJSON("SkinHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkinHuman, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {
        return(fconv('Smooth skin covers most of $[my]$ body.'));
    }
}
class SkinFur extends Equipment {
    static dataPrototype() {    
        return({style:0, coloring:'dark grey'}); }
    constructor() {
        super('SkinFur');
        this.tags = ['body'];
        this.slotUse = ['bSkin'];
        this.data = SkinFur.dataPrototype();
    }
    get descShort() { return (this.desc);}
    get desc() { 'a dense fur covering the whole body.';}  //todo color
    toJSON() {return window.storage.Generic_toJSON("SkinFur", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkinFur, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {
        return(fconv('A dense fur covers $[my]$ body.'));
    }
}
class TailCat extends Equipment {
    constructor() {
        super('TailCat');
        this.tags = ['body'];
        this.slotUse = ['bTailBase'];
        this.growth = 0.10; //in %/100 maxGrowth
        this.maxGrowth = 1.2; //in meter, todo depends on bodysize
    }
    get descShort() { return (this.desc);}
    get desc() { 'a flexible,furred tail like that of a cat.';}
    toJSON() {return window.storage.Generic_toJSON("TailCat", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TailCat, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) { 
        return(fconv('Some cat-like tail is attached to $[my]$ spine.'));
    }
}
class BreastHuman extends Equipment {
    constructor() {
        super('BreastHuman');
        this.tags = ['body'];
        this.slotUse = ['bBreast'];
        this.growth = 0.0; //in %/100 maxGrowth
        this.maxGrowth = 0.3; //in meter, todo depends on bodysize
    }
    get descShort() { return (this.desc);}
    get desc() { return 'some human breasts.';}
    toJSON() {return window.storage.Generic_toJSON("BreastHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BreastHuman, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) { 
        return(fconv('$[My]$ breasts are small but perky.'));
    }
}
class VulvaHuman extends Equipment {
    static dataPrototype() {    
        return({labia:0, virgin:true,wetgen:1, stretch:1,depth:1,clitsize:0.5});
    }
    static labiaStyles() {
        let style ={};
        style['human'] = 0;
        style['dog'] = 1;
        return(style);
    }
    constructor() {
        super('VulvaHuman');
        this.tags = ['body'];
        this.slotUse = ['bVulva'];
        this.data = VulvaHuman.dataPrototype();
    }
    get descShort() { return 'human vagina';}
    get desc() { return 'puffy cunt';}
    toJSON() {return window.storage.Generic_toJSON("VulvaHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(VulvaHuman, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {
        let msg= "$[My]$ vagina can snuggly fit around "+this.data.stretch+"cm in diameter and "+this.data.depth+"cm in depth.";
        msg+= "Its clit is of a size of around "+this.data.clitsize+"cm.";   
        return(fconv(msg));
    }
}
class PenisHuman extends Equipment {
    static dataPrototype() {    
        return({size:0, virgin:true, wetgen:1,sheath:0, style:0,ballsize:2.3});
    }
    static penisStyles() {
        let style ={};
        style['human'] = 0;
        style['dog'] = 1;
        return (style);
    }
    constructor() {
        super('PenisHuman');
        this.tags = ['body'];
        this.slotUse = ['bPenis','bBalls'];
        this.data = PenisHuman.dataPrototype();   
    }
    get descShort() { return 'human penis';}
    get desc() { return 'hominid dick';}
    toJSON() {return window.storage.Generic_toJSON("PenisHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(PenisHuman, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {
        let msg= "$[My]$ dong is around "+this.data.size+"cm long.";
        msg+= "A Ballsack dangles below it that measures around "+this.data.ballsize+"cm.";   
        return(fconv(msg));
    }
}
//todo BodyPartLib ??
window.gm.ItemsLib = (function (ItemsLib) {
    window.storage.registerConstructor(BaseHumanoid);
    window.storage.registerConstructor(BaseQuadruped);
    window.storage.registerConstructor(FaceHorse);
    window.storage.registerConstructor(FaceHuman);
    window.storage.registerConstructor(FaceWolf);
    window.storage.registerConstructor(SkinHuman);
    window.storage.registerConstructor(SkinFur);
    window.storage.registerConstructor(TailCat);
    window.storage.registerConstructor(BreastHuman);
    window.storage.registerConstructor(PenisHuman);
    window.storage.registerConstructor(VulvaHuman);
    window.storage.registerConstructor(BreastHuman);
    
    /*ItemsLib['PenisHuman'] = function () { return new PenisHuman();};
    ItemsLib['SkinFur'] = function () { return new SkinFur();};
    ItemsLib['SkinHuman'] = function () { return new SkinHuman();};
    ItemsLib['TailCat'] = function () { return new TailCat();};
    ItemsLib['BreastHuman'] = function () { return new BreastHuman();};
    ItemsLib['VulvaHuman'] = function () { return new VulvaHuman();};
    ItemsLib['PenisHuman'] = function () { return new PenisHuman();};*/
    return ItemsLib; 
}(window.gm.ItemsLib || {}));