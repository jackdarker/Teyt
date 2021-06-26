"use strict"
//bodyparts are special equipment
class BaseHumanoid extends Equipment {
    constructor() {
        super('BaseHumanoid');
        this.tags = ['body'];
        this.slotUse = ['bBase'];
    }
    descLong(fconv) {return(fconv('$[My]$ body is that of an human.'));} //$[I]$ $[have]$ a humanoid body.
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
class BaseWorm extends Equipment {
    constructor() {
        super('BaseWorm');
        this.tags = ['body'];
        this.slotUse = ['bBase'];
    }
    get descShort() {return this.desc;};
    get desc() { return '';}
    toJSON() {return window.storage.Generic_toJSON("BaseWorm", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BaseWorm, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {return(fconv('$[I]$ $[am]$ wriggling around like a snake.'));}
}
class FaceHuman extends Equipment {
    static dataPrototype() {    
        return({femininity:0.2});
        //1 = full female 0= male
    }
    constructor() {
        super('FaceHuman');
        this.tags = ['body'];
        this.slotUse = ['bFace','bMouth'];
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
        return({style:'wolf',femininity:0.2,pDamage:0});    }
    static factory(id) {
        let obj =  new FaceWolf();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('FaceWolf');
        this.tags = ['body'];
        this.slotUse = ['bFace','bMouth'];  //todo separate mouth-bodypart??
        this.data = FaceWolf.dataPrototype();   
    }
    setStyle(id) {
        switch(id) {
            case 'cat':
            case 'dog':
            case 'wolf':
            case 'lizard':
                this.data.style = id; 
                this.pDamage = 10;
                break;
            case 'horse':
                this.data.style = id; 
                this.pDamage = 0;
                break;
            default:
                throw new Error("unknown Face-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { return this.data.style+'\'like face.';}
    toJSON() {return window.storage.Generic_toJSON("FaceWolf", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(FaceWolf, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    onEquip() {
        let old = this.parent.parent.Skills.countItem(SkillBite.name);
        if(old>0) this.parent.parent.Skills.removeItem(SkillBite.name,old);
        this.parent.parent.Skills.addItem(new SkillBite());
        return({OK:true, msg:'shifted'});
    }
    onUnequip() {
        let old = this.parent.parent.Skills.countItem(SkillBite.name);
        if(old>0) this.parent.parent.Skills.removeItem(SkillBite.name,old);
        return({OK:true, msg:'shifted'});
    }
    descLong(fconv) {
        return(fconv('$[I]$ $[have]$ a muzzle like a '+this.data.style+'.'));
    }
}
class FaceHorse extends Equipment {
    static dataPrototype() {    
        return({femininity:0.2});    }
    constructor() {
        super('FaceHorse');
        this.tags = ['body'];
        this.slotUse = ['bFace','bMouth'];
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
        return({style:'wolf', color:'dark grey', pattern: 'dense'}); }
    static factory(id) {
        let obj =  new SkinFur();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('SkinFur');
        this.tags = ['body'];
        this.slotUse = ['bSkin'];
        this.data = SkinFur.dataPrototype();
    }
    setStyle(id,color='dark grey') {
        this.data.style = id; 
        this.data.color = color;
        switch(id) {
            case 'cat':
                this.data.pattern = 'fine';
                break;
            case 'dog':
                this.data.pattern = 'spotted';
                break;
            case 'horse':
                this.data.pattern = 'short';
                break;
            case 'wolf':                
                this.data.pattern = 'rough';
                break;
            default:
                throw new Error("unknown Fur-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { 'a dense fur covering the whole body.';}  //todo color
    toJSON() {return window.storage.Generic_toJSON("SkinFur", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkinFur, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {
        return(fconv('A '+this.data.pattern+', '+this.data.color+' fur covers $[my]$ body.'));
    }
}
class TailWolf extends Equipment {
    static dataPrototype() {    
        return({style:'wolf',growth:0.1, maxGrowth: 1.5,pDamage:0});    }
    static factory(id) {
        let obj =  new TailWolf();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('TailWolf');
        this.tags = ['body'];
        this.slotUse = ['bTailBase'];
        this.data = TailWolf.dataPrototype();  
    }
    setStyle(id) {
        switch(id) {
            case 'cat':
            case 'dog':
            case 'horse':
            case 'wolf':
            case 'lizard':
                this.data.style = id; 
                this.data.growth = 0.10; //in %/100 maxGrowth
                this.data.maxGrowth = 1.2; //in meter, todo depends on bodysize
                break;
            default:
                throw new Error("unknown Tail-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { 
        var msg ='';
        switch(this.data.style) {
            case 'cat':
                msg ='a flexible,furred tail like that of a cat.';
            break;
            default:
                msg = this.data.style+'\'like tail.';
        }
        return(msg);
    }
    toJSON() {return window.storage.Generic_toJSON("TailWolf", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(TailWolf, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) { 
        return(fconv('Some '+this.data.style+'-tail is attached to $[my]$ spine.'));
    }
}
class HandsPaw extends Equipment { //paws of ferals
    static dataPrototype() {    
        return({style:'wolf', pDamage:0 });
    }
    static factory(id) {
        let obj =  new HandsPaw();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('HandsPaw');
        this.tags = ['body'];
        this.slotUse = ['bHands'];
        this.data = HandsPaw.dataPrototype();
    }
    setStyle(id) {
        switch(id) {
            case 'cat':
            case 'dog':
            case 'wolf':
            case 'lizard':
                this.data.style = id; 
                this.data.pDamage = 10;
                break;
            default:
                throw new Error("unknown HandsPaw-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { return this.data.style+'\'like paws.';}
    toJSON() {return window.storage.Generic_toJSON("HandsPaw", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(HandsPaw, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) { 
        return(fconv('$[I]$ $[have]$ paws like that of a '+this.data.style+'.'));
    }
}
class HandsHuman extends Equipment {
    static dataPrototype() {    
        return({style:'human', pDamage:0 });
    }
    static factory(id) {
        let obj =  new HandsHuman();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('HandsHuman');
        this.tags = ['body'];
        this.slotUse = ['bHands'];
        this.data = HandsHuman.dataPrototype();
    }
    setStyle(id) {
        this.data.style = id; 
        switch(id) {
            case 'dog':
            case 'wolf':
            case 'horse':
                this.data.pDamage = 7;
                break;
            case 'cat':
            case 'lizard':
                this.data.pDamage = 14;
                break;
            case 'human':
                this.data.pDamage = 0;
                break;
            default:
                throw new Error("unknown Hands-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { return ('human like hands.');}
    toJSON() {return window.storage.Generic_toJSON("HandsHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(HandsHuman, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) { 
        let msg = '$[My]$ hands consist of a palm and fingers.';
        msg += ['dog','wolf','cat'].includes(this.data.style)?(this.data.style+'-claws adorn the fingertips'):'';
        msg += ['lizard'].includes(this.data.style)?('Large talons grow from their fingertips.'):'';
        return(fconv(msg));
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
        return({style:'human',size:16, virgin:true, wetgen:1,sheath:0, ballsize:2.3});
    }
    static factory(id) {
        let obj =  new PenisHuman();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('PenisHuman');
        this.tags = ['body'];
        this.slotUse = ['bPenis','bBalls'];
        this.data = PenisHuman.dataPrototype();   
    }
    setStyle(id) {
        this.data.style = id;
        switch(id) {
            case 'human':
            case 'cat':
            case 'dog':
            case 'horse':
            case 'wolf':
                break;
            case 'lizard':    
                break;
            default:
                throw new Error("unknown penis-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { 
        var msg ='';
        switch(this.data.style) {
            case 'cat':
                msg ='a slim but spiked cat-member.';
            break;
            default:
                msg = 'a schlong of a '+ this.data.style+'.';
        }
        return(msg);
    }
    toJSON() {return window.storage.Generic_toJSON("PenisHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(PenisHuman, value.data));}
    canEquip() {return({OK:true, msg:'equipable'});}
    canUnequip() {return({OK:true, msg:'unequipable'});}
    descLong(fconv) {
        let msg= "$[My]$ "+this.data.style+"-dong is around "+this.data.size+"cm long.";
        msg+= "A Ballsack dangles below it that measures around "+this.data.ballsize+"cm.";   
        return(fconv(msg));
    }
}
//todo BodyPartLib ??
window.gm.ItemsLib = (function (ItemsLib) {
    window.storage.registerConstructor(BaseHumanoid);
    window.storage.registerConstructor(BaseQuadruped);
    window.storage.registerConstructor(BaseWorm);
    window.storage.registerConstructor(HandsHuman);
    window.storage.registerConstructor(HandsPaw);
    window.storage.registerConstructor(FaceHorse);
    window.storage.registerConstructor(FaceHuman);
    window.storage.registerConstructor(FaceWolf);
    window.storage.registerConstructor(SkinHuman);
    window.storage.registerConstructor(SkinFur);
    window.storage.registerConstructor(TailWolf);
    window.storage.registerConstructor(BreastHuman);
    window.storage.registerConstructor(PenisHuman);
    window.storage.registerConstructor(VulvaHuman);
    return ItemsLib; 
}(window.gm.ItemsLib || {}));

//todo randomize what is mutated
//number of mutations depends on magnitude?
//temporary mutate to feral?
window.gm.MutationsLib = window.gm.MutationsLib || {};
window.gm.MutationsLib['swapGender'] = function (genderItem) {
    let penis = window.gm.player.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bPenis);
    let vulva = window.gm.player.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bVulva);
    if(genderItem.slotUse.includes('bPenis')) {
        if(vulva !==null) window.gm.player.Outfit.removeItem(vulva.id,true);
        if(penis===null) window.gm.player.Outfit.addItem(genderItem,true);
    } 
    if(genderItem.slotUse.includes('bVulva')) {
        if(penis!==null) window.gm.player.Outfit.removeItem(penis.id,true);
        if(vulva===null) window.gm.player.Outfit.addItem(genderItem,true);
    } 
}
window.gm.MutationsLib['mutateWolf'] = function () {
    if(window.story.state.tmp.args===null) {
        window.gm.printOutput(window.story.state.msg);
        return;
    }
    let _rnd =_.random(1,100);
    let msg='',_TF="TailWolf";
    if(window.gm.player.Outfit.countItem(_TF)>0) {
        let item = window.gm.player.Outfit.getItem("TailWolf");
        if(item.getStyle() !=='wolf') {
            item.setStyle('wolf');
            msg=("Your tail is now a fuzzy bush like that of a wolf.</br>");
        } else {
            let growth = item.growth+0.25;
            let maxGrowth = item.maxGrowth;
            if(growth >= 1) {
                msg+="That tail didnt grow any further.</br>";
            } else {
                item.growth=growth;
                msg+="Your bushy tail must have grown and is now "+window.gm.formatNumber(growth*maxGrowth,1)+" meter long.</br>";
            }
        }
    } else {
        window.gm.player.Outfit.addItem(window.storage.constructors[_TF].factory('wolf'));
        msg+="You have grown a fuzzy tail !</br>";
    }
    _TF = 'FaceWolf';
    let face = window.gm.player.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bFace);
    let skin = window.gm.player.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bSkin);
    if(face ===null || face.id !==_TF) {
        window.gm.player.Outfit.addItem(window.storage.constructors[_TF].factory('wolf'));
        msg+= "Your face got transformed into a dog-like muzzle.</br>"; 
    } else if(face.getStyle() !=='wolf') {
        face.setStyle('wolf');
        msg+= "Your not so human face got transformed into a dog-like muzzle.</br>"; 
    } else if(skin ===null || skin.id !="SkinFur") {
        window.gm.player.Outfit.addItem(window.storage.constructors['SkinFur']());
        msg+= "A dense coat of fur spreads over your body.</br>";
    }
    if(msg==='') msg= "Your anxiety goes by as you didnt get any more wolflike."
    window.gm.printOutput(msg);
    window.story.state.msg = msg;
    window.story.state.tmp.args=null; //
};

window.gm.MutationsLib['mutateCat'] = function() {
    if(window.story.state.tmp.args===null) {
        window.gm.printOutput(window.story.state.msg);
        return;
    }
    let msg='', _TF="TailWolf";
    if(window.gm.player.Outfit.countItem(_TF)>0) {
        let item = window.gm.player.Outfit.getItem(_TF);
        if(item.getStyle() !=='cat') {
            item.setStyle('cat');
            msg=("Your tail reshapes itself to a be more cat-like.</br>");
        } else {
            var growth = item.data.growth+0.25;
            var maxGrowth = 2;//window.gm.player.Outfit.getItem("TailWolf").maxGrowth;
            if(growth >= 1) {
                msg=("You already changed to a cat as far as possible.</br>");
            } else {
                item.data.growth=growth;
                msg=("Your tail must have grown and is now "+growth*maxGrowth+" meter long.</br>");
            }
        }
    } else {
        window.gm.player.Outfit.addItem(window.storage.constructors['TailWolf'].factory('cat'));
        msg=("You have grown a cat tail !</br>");
    }
    window.gm.printOutput(msg);
    window.story.state.msg = msg;
    window.story.state.tmp.args=null; //
}