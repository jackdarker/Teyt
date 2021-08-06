"use strict"
//bodyparts are special equipment
class BaseHumanoid extends Equipment {
    constructor() {
        super('BaseHumanoid');
        this.addTags(['body']);this.slotUse = ['bBase'];
        this.race='human'; //todo this is calculated with calcRacialScore
    }
    descLong(fconv) {return(fconv('$[My]$ body is that of an human.'));} //$[I]$ $[have]$ a humanoid body.
    get descShort() {return this.desc;};
    get desc() { return '';}
    toJSON() {return window.storage.Generic_toJSON("BaseHumanoid", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BaseHumanoid, value.data));}
}
class BaseQuadruped extends Equipment {
    constructor() {
        super('BaseQuadruped');
        this.addTags(['body']);this.slotUse = ['bBase'];
        this.race='human';
    }
    get descShort() {return this.desc;};
    get desc() { return '';}
    toJSON() {return window.storage.Generic_toJSON("BaseQuadruped", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BaseQuadruped, value.data));}
    descLong(fconv) {return(fconv('$[I]$ $[am]$ walking on 4 legs like a feral mammal.'));}
}
class BaseWorm extends Equipment {
    constructor() {
        super('BaseWorm');
        this.addTags(['body']);this.slotUse = ['bBase'];
        this.race='human';
    }
    get descShort() {return this.desc;};
    get desc() { return '';}
    toJSON() {return window.storage.Generic_toJSON("BaseWorm", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BaseWorm, value.data));}
    descLong(fconv) {return(fconv('$[I]$ $[am]$ wriggling around like a snake.'));}
}
class FaceHuman extends Equipment {
    static dataPrototype() {    
        return({femininity:0.2});
        //1 = full female 0= male
    }
    constructor() {
        super('FaceHuman');
        this.addTags(['body']);
        this.slotUse = ['bFace','bMouth'];
        this.data = FaceHuman.dataPrototype();   
    }
    get descShort() { return 'human face';}
    get desc() { return 'hominid face';}
    toJSON() {return window.storage.Generic_toJSON("FaceHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(FaceHuman, value.data));}
    descLong(fconv) {
        return(fconv('$[My]$ face ressembles that of a human'));
    }
}
class FaceWolf extends Equipment {
    static dataPrototype() {    
        return({style:'wolf',femininity:0.2});    }
    static factory(id) {
        let obj =  new FaceWolf();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('FaceWolf');
        this.addTags(['body']);
        this.slotUse = ['bFace','bMouth'];  //todo separate mouth-bodypart??
        this.data = FaceWolf.dataPrototype();   
    }
    setStyle(id) {
        this.data.style = id;
        switch(id) {
            case 'cat':
            case 'dog':
            case 'wolf':
            case 'lizard':
                break;
            case 'horse':
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
    onEquip(context) {
        let old = context.parent.Skills.countItem(SkillBite.name);
        if(old>0) context.parent.Skills.removeItem(SkillBite.name,old);
        context.parent.Skills.addItem(new SkillBite());
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
    attackMod(target){
        let mod = new SkillMod();
        mod.onHit = [{ target:target, eff: [effDamage.setup(11,'slash')]}];
        return(mod);
    }
}
class FaceHorse extends Equipment {
    static dataPrototype() {    
        return({femininity:0.2});    }
    constructor() {
        super('FaceHorse');
        this.addTags(['body']);
        this.slotUse = ['bFace','bMouth'];
        this.data = FaceHorse.dataPrototype();   
    }
    get descShort() { return 'wolf muzzle';}
    get desc() { return 'wolf muzzle';}
    toJSON() {return window.storage.Generic_toJSON("FaceHorse", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(FaceHorse, value.data));}
    descLong(fconv) {
        return(fconv('$[I]$ $[have]$ a muzzle like a horse'));
    }
}
class SkinHuman extends Equipment {
    constructor() {
        super('SkinHuman');
        this.addTags(['body']);
        this.slotUse = ['bSkin'];
    }
    get desc() { 'a smooth tanned skin mostly bare of noticable hair.';}
    toJSON() {return window.storage.Generic_toJSON("SkinHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkinHuman, value.data));}
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
        this.addTags(['body']);
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
    descLong(fconv) {
        return(fconv('A '+this.data.pattern+', '+this.data.color+' fur covers $[my]$ body.'));
    }
}
class TailWolf extends Equipment {
    static dataPrototype() {    
        return({style:'wolf',growth:0.1, maxGrowth: 1.5});    }
    static factory(id) {
        let obj =  new TailWolf();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('TailWolf');
        this.addTags(['body']);
        this.slotUse = ['bTailBase'];
        this.data = TailWolf.dataPrototype();  
    }
    setStyle(id) {
        switch(id) {
            case 'human':
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
    descLong(fconv) { 
        return(fconv('Some '+this.data.style+'-tail is attached to $[my]$ spine.'));
    }
}
class HandsPaw extends Equipment { //paws of ferals
    static dataPrototype() {    
        return({style:'wolf'});
    }
    static factory(id) {
        let obj =  new HandsPaw();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('HandsPaw');
        this.addTags(['body']);
        this.slotUse = ['bHands'];
        this.data = HandsPaw.dataPrototype();
    }
    setStyle(id) {
        this.data.style = id; 
        switch(id) {
            case 'cat':
            case 'dog':
            case 'wolf':
            case 'lizard':
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
    descLong(fconv) { 
        return(fconv('$[I]$ $[have]$ paws like that of a '+this.data.style+'.'));
    }
    attackMod(target){
        let mod = new SkillMod();
        mod.onHit = [{ target:target, eff: [effDamage.setup(10,'slash')]}];
        return(mod);
    }
}
class HandsHuman extends Equipment {
    static dataPrototype() {    
        return({style:'human'});
    }
    static factory(id) {
        let obj =  new HandsHuman();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('HandsHuman');
        this.addTags(['body']);
        this.slotUse = ['bHands'];
        this.data = HandsHuman.dataPrototype();
    }
    setStyle(id) {
        this.data.style = id; 
        switch(id) {
            case 'dog':
            case 'wolf':
            case 'horse':
                break;
            case 'cat':
            case 'lizard':
                break;
            case 'human':
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
    descLong(fconv) { 
        let msg = '$[My]$ hands consist of a palm and fingers.';
        msg += ['dog','wolf','cat'].includes(this.data.style)?(this.data.style+'-claws adorn the fingertips'):'';
        msg += ['lizard'].includes(this.data.style)?('Large talons grow from their fingertips.'):'';
        return(fconv(msg));
    }
}
class BreastHuman extends Equipment {
    static dataPrototype() {    
        return({style:'human',growth:0.1, maxGrowth: 1.5});
    }
    static factory(id) {
        let obj =  new BreastHuman();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('BreastHuman');
        this.addTags(['body']);
        this.slotUse = ['bBreast'];
        this.data = BreastHuman.dataPrototype();
    }
    setStyle(id) {
        this.data.style = id;
        switch(id) {
            case 'human':
            case 'horse':
                break;
            case 'cat':
            case 'dog':
            case 'wolf':
                break;
            case 'lizard':
                break;
            default:
                throw new Error("unknown breast-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { return 'some human breasts.';}
    toJSON() {return window.storage.Generic_toJSON("BreastHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(BreastHuman, value.data));}
    descLong(fconv) { 
        return(fconv('$[My]$ breasts are small but perky.'));
    }
}
class VulvaHuman extends Equipment {
    static dataPrototype() {    
        //
        return({labia:0, virgin:true,wetgen:1, stretch:1,depth:1,clitsize:0.5, spermtype:'',sperm:0});
    }
    static factory(id) {
        let obj =  new VulvaHuman();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('VulvaHuman');
        this.addTags(['body']);
        this.slotUse = ['bVulva'];
        this.data = VulvaHuman.dataPrototype();
    }
    setStyle(id) {
        this.data.style = id;
        switch(id) {
            case 'human':
            case 'cat':
            case 'dog':
            case 'horse':
            case 'wolf':
            case 'lizard':
                break;
            default:
                throw new Error("unknown vulva-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return(this.data.style+' vagina');}
    get desc() { return 'puffy cunt';}
    toJSON() {return window.storage.Generic_toJSON("VulvaHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(VulvaHuman, value.data));}
    descLong(fconv) {
        let msg= "$[My]$ vagina can snuggly fit around "+this.data.stretch+"cm in diameter and "+this.data.depth+"cm in depth.";
        msg+= "Its clit is of a size of around "+this.data.clitsize+"cm."; 
        if(this.data.spermtype!=='') {
            msg+= this.data.sperm+"ml of sperm from a "+this.data.spermtype+" might be deposited in $[my]$ womb.";  
        }
        return(fconv(msg));
    }
    onEquip(context){
        context.parent.addEffect('effSpermInWomb',new window.storage.constructors['effSpermInWomb']());
        context.parent.addEffect('effVaginalFertil',new window.storage.constructors['effVaginalFertil']());
        return({OK:true,msg:'equipped'});
    }
    onUnequip(context) {
        context.parent.Effects.removeItem('effVaginalFertil');
        context.parent.Effects.removeItem('effVaginalPregnant');
        context.parent.Effects.removeItem('effSpermInWomb');
        return({OK:true,msg:'unequipped'});
    }
    addSperm(type,amount) {
        if(amount>this.data.sperm || this.data.spermtype) {
            this.data.spermtype=type;
        }
        this.data.sperm+=amount;
    }
    removeSperm(amount) {
        if(amount>0) {
            this.data.sperm-=amount;
        } else this.data.sperm=0;
        if(this.data.sperm<=0) {
            this.data.sperm=0;this.data.spermtype='';
        }
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
        this.addTags(['body']);
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
    canEquip(context) {return({OK:true, msg:'equipable'});}
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

window.gm.mutate = window.gm.mutate || {};
/**
 * checks each bodypart for race and calculates race-score (in %)
 * @param {*} char 
 */
window.gm.mutate.calcRacialScore = function(char) { //todo

}
window.gm.mutate.getScoreHuman = function(char) {
    //human body, human face, legs, arms, tail ignored?
}
window.gm.mutate.getScoreCat = function(char) { //one fct for Lynx/Lion/tiger ?
    //
}
/**
 * modify stats for race-bonus, cat -> better agility
 * @param {*} char 
 * @param {*} scores 
 */
window.gm.mutate.updateRacialBoon = function(char,scores) {
    //remove old RacialBoon
}
//todo randomize what is mutated
//number of mutations depends on magnitude?
//temporary mutate to feral?
/*
* those mutations are usually triggered by effects, calculate some changes and 
* if related to player pushDeffered Event for displaying message  
*/
window.gm.MutationsLib = window.gm.MutationsLib || {};
window.gm.MutationsLib['vaginaSpermDissolve'] = function (char) {
    let vulva = char.getVagina();
    vulva.removeSperm(2); //todo decay depends on looseness, soulgem absorption??
    let msg='';
    msg+="You can feel some of the cum in your womb dribble down your leg. ";
    let lewdMark=char.Effects.findEffect(effLewdMark.name)[0];
    let pregnancy=char.Effects.findEffect(effVaginalPregnant.name)[0];
    if(pregnancy) {
        if(lewdMark) {
            msg+="More of that precious seed is absorbed by that soulgem growing in you.</br>";
            vulva.removeSperm(2); //todo decay depends on looseness, soulgem absorption??
        } else msg+="But you are pregnant already anyway.</br>"; 
    } 
    if(!pregnancy) {
        pregnancy=char.Effects.findEffect(effVaginalFertil.name)[0];
        if(pregnancy) { 
            //todo random chance according to base-fertility-stat, sperm-fertility, vulva-fertility
            //race-compatibility between father-mother
            if(true || _.random(0,100)>75) {
                msg+="Has your last fling got you impregnated?</br>";
                pregnancy = new effVaginalPregnant();
                pregnancy.data.type=vulva.data.spermtype;
                if(lewdMark) pregnancy.data.type='soulgem'; 
                char.addEffect(effVaginalPregnant.name, pregnancy)
            } else msg+="Hopefully there is nothing to worry about?</br>";
        }
    }    
    if(vulva.data.sperm>0) {
        msg+="There might still be "+window.gm.util.formatNumber(vulva.data.sperm,0)+"ml sperm left.</br>"
    } else msg+="This was possibly the last remains of sperm.</br>";
    if(char===window.gm.player) {
        window.gm.pushDeferredEvent("GenericDeffered",[msg]);
    }
}
window.gm.MutationsLib['vaginaPregnancy'] = function (char) {
    let msg='';
    let lewdMark=char.Effects.findEffect(effLewdMark.name)[0];
    let pregnancy=char.Effects.findEffect(effVaginalPregnant.name)[0];
    if(pregnancy) {
        if(lewdMark && pregnancy.data.type==='soulgem') {
            if(pregnancy.data.cycles <=0) {
                pregnancy = new effVaginalFertil();
                char.addEffect(effVaginalFertil.name, pregnancy);
                msg+="A homemade soulgem slips out of your nethers !</br>";
                char.Inv.addItem(window.gm.ItemsLib['TinySoulGem']());
            } else msg+="If you dont provide that soulgem something to feed off, it might absorb some energy from you instead!.</br>";
        } else {
            if(pregnancy.data.cycles <=0) {
                msg+="Congrats, you brought some more "+pregnancy.data.type+" into this world.</br>";
            } else {
                msg+="Your belly is swollen with the spawn of some "+pregnancy.data.type+".</br>"; 
            }
        }
        if(window.story.state._gm.dbgShowMoreInfo) msg+= pregnancy.data.cycles*pregnancy.data.duration+" minutes to go.";
    } 
    //todo go in heat if fertility-cycle triggers?
    if(char===window.gm.player) {
        window.gm.pushDeferredEvent("GenericDeffered",[msg]);
    }
}
window.gm.MutationsLib['swapGender'] = function (char,genderItem) {
    let msg='';
    let penis = char.getPenis();
    let vulva = char.getVagina();
    let style=(penis)?penis.getStyle():((vulva)?vulva.getStyle():'human');
    let newItem =genderItem.factory(style);
    if(newItem.slotUse.includes('bPenis')) {
        if(vulva !==null) {
            window.gm.player.Outfit.removeItem(vulva.id,true);
            msg+= 'You lost your female privats. ';
        }
        if(penis===null) {
            window.gm.player.Outfit.addItem(newItem.factory(style),true);
            msg+= 'Instead a dick sprouts in your nethers.</br>';
        }
    } 
    if(newItem.slotUse.includes('bVulva')) {
        if(penis!==null) {
            window.gm.player.Outfit.removeItem(penis.id,true);
            msg+= 'Your fine penis shrinks down until it is finally completely absorbed in your body. ';
        }
        if(vulva===null) {
            window.gm.player.Outfit.addItem(newItem,true);
            msg+= 'A female opening forms itself in your groin.</br>';
        }
    } 
    if(msg!=='' && char===window.gm.player) {
        window.gm.pushDeferredEvent("GenericDeffered",[msg]);
    }
}
window.gm.MutationsLib['mutateWolf'] = function (char) {
    let _rnd =_.random(1,100);
    let msg='',_TF="TailWolf";
    if(char.Outfit.countItem(_TF)>0) {
        let item = char.Outfit.getItem("TailWolf");
        if(item.getStyle() !=='wolf') {
            item.setStyle('wolf');
            msg=("Your tail is now a fuzzy bush like that of a wolf.</br>");
        } else {
            let growth = item.growth+0.25;
            let maxGrowth = item.maxGrowth;
            if(growth >= 1) {
                msg+="That tail didnt grow any further.</br>";
            } else {
                item.data.growth=growth;
                msg+="Your bushy tail must have grown and is now "+window.gm.util.formatNumber(growth*maxGrowth,1)+" meter long.</br>";
            }
        }
    } else {
        char.Outfit.addItem(window.storage.constructors[_TF].factory('wolf'));
        msg+="You have grown a fuzzy tail !</br>";
    }
    _TF = 'FaceWolf';
    let face = char.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bFace);
    let skin = char.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bSkin);
    if(face ===null || face.id !==_TF) {
        char.Outfit.addItem(window.storage.constructors[_TF].factory('wolf'));
        msg+= "Your face got transformed into a dog-like muzzle.</br>"; 
    } else if(face.getStyle() !=='wolf') {
        face.setStyle('wolf');
        msg+= "Your not so human face got transformed into a dog-like muzzle.</br>"; 
    } else if(skin===null || skin.id !="SkinFur") {
        char.Outfit.addItem(window.storage.constructors['SkinFur'].factory('wolf'));
        msg+= "A dense coat of fur spreads over your body.</br>";
    }
    if(msg==='') msg= "Your anxiety goes by as you didnt get any more wolflike."
    if(char===window.gm.player) {
        window.gm.pushDeferredEvent("GenericDeffered",[msg]);
    }
};
window.gm.MutationsLib['mutateCat'] = function(char) {
    let msg='', _TF="TailWolf";
    if(char.Outfit.countItem(_TF)>0) {
        let item = char.Outfit.getItem(_TF);
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
        char.Outfit.addItem(window.storage.constructors['TailWolf'].factory('cat'));
        msg=("You have grown a cat tail !</br>");
    }
    if(char===window.gm.player) {
        window.gm.pushDeferredEvent("GenericDeffered",[msg]);
    }
};
window.gm.MutationsLib['mutateHorse'] = function(char) {
    let msg='', _TF="TailWolf";
    if(char.Outfit.countItem(_TF)>0) {
        let item = char.Outfit.getItem(_TF);
        if(item.getStyle() !=='horse') {
            item.setStyle('horse');
            msg=("Your tail reshapes itself to a be more horse-like.</br>");
        } else {
            var growth = item.data.growth+0.25;
            var maxGrowth = 2;//window.gm.player.Outfit.getItem("TailWolf").maxGrowth;
            if(growth >= 1) {
                msg=("You already changed to a horse as far as possible.</br>");
            } else {
                item.data.growth=growth;
                msg=("Your tail must have grown and is now "+growth*maxGrowth+" meter long.</br>");
            }
        }
    } else {
        char.Outfit.addItem(window.storage.constructors['TailWolf'].factory('horse'));
        msg=("You have grown a horse tail !</br>");
    }
    if(char===window.gm.player) {
        window.gm.pushDeferredEvent("GenericDeffered",[msg]);
    }
};
window.gm.MutationsLib['growBreast'] = function(char) {
    let msg='', _TF="BreastHuman";
    if(char.Outfit.countItem(_TF)>0) {
        let item = char.Outfit.getItem(_TF);
        var growth = item.data.growth+0.15; //todo shrinking/increase as parameter?
        var maxGrowth = 3; //todo cupsize dimension?
        if(growth >= 1) {
            msg=("Your milkbags are as big as they can get.</br>");
        } else {
            item.data.growth=growth;
            msg=("Your bust size increased further.</br>");
        }
    } else {
        char.Outfit.addItem(window.storage.constructors[_TF].factory('human'));
        msg="As you feel up your pecks you notice that they seem to be softer than before !</br>";
    }
    if(char===window.gm.player) {
        window.gm.pushDeferredEvent("GenericDeffered",[msg]);
    }
};
window.gm.MutationsLib['growVulva'] = function(char) {
    let msg = 'Everything is ok, nothing unusual.</br>', _TF="VulvaHuman";
    if(char.Outfit.countItem(_TF)>0) {
        let item = char.Outfit.getItem(_TF);
        msg ="An unusual feeling lets you move your hand down to your nethers.</br>"
        if(item.data.clitsize>0.9) {
            vulva.data.stretch+=0.5;
            msg+= "Your muff seems to be more loose then before !</br>";
        } else {
            item.data.clitsize+=0.5;
            msg+= "You arent quite sure but could it be possible that your clitoris is larger then before?</br>";
        }
        msg += "</br>"+item.descLong(window.gm.util.descFixer(char))+"</br>";
    }
    if(char===window.gm.player) {
        window.gm.pushDeferredEvent("GenericDeffered",[msg]);
    }
};