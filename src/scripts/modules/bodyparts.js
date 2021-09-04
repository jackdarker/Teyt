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
        return({femininity:0.2,style:'human'});
        //1 = full female 0= male
    }
    static factory(id) {
        let obj =  new FaceHuman();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('FaceHuman');
        this.addTags(['body']);
        this.slotUse = ['bFace','bMouth'];
        this.data = FaceHuman.dataPrototype();   
    }
    setStyle(id) {
        this.data.style = id;
        switch(id) {
            case 'human':
                break;
            case 'elve':
                break;
            default:
                throw new Error("unknown Face-style "+id);
        }
    }
    getStyle() { return this.data.style; }
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
        mod.onHit = [{ target:target, eff: [effDamage.factory(11,'slash')]}];
        return(mod);
    }
}
class FaceHorse extends Equipment {
    static dataPrototype() {    
        return({femininity:0.2,style:'horse'});    }
    static factory(id) {
            return(new FaceHorse());
    }
    constructor() {
        super('FaceHorse');
        this.addTags(['body']);
        this.slotUse = ['bFace','bMouth'];
        this.data = FaceHorse.dataPrototype();   
    }
    setStyle(id) {
        this.data.style = id;
        switch(id) {
            case 'horse':
                break;
            case 'deer':
                break;
            default:
                throw new Error("unknown Face-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return 'horse muzzle';}
    get desc() { return this.descShort;}
    toJSON() {return window.storage.Generic_toJSON("FaceHorse", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(FaceHorse, value.data));}
    descLong(fconv) {
        return(fconv('$[I]$ $[have]$ a muzzle like a horse'));
    }
}
class FaceLeech extends Equipment {
    static dataPrototype() {    
        return({style:'leech'});    }
    static factory(id) {
        let obj =  new FaceLeech();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('FaceLeech');
        this.addTags(['body']);
        this.slotUse = ['bFace','bMouth'];
        this.data = FaceLeech.dataPrototype();   
    }
    setStyle(id) {
        this.data.style = id;
        switch(id) {
            case 'slug':
                break;
            case 'leech':
                break;
            default:
                throw new Error("unknown Face-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { return this.data.style+'\'like face.';}
    toJSON() {return window.storage.Generic_toJSON("FaceLeech", this); }
    static fromJSON(value) {return(window.storage.Generic_fromJSON(FaceLeech, value.data));}
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
        if(this.data.style==='slug') {
            mod.onHit = [{ target:target, eff: [effDamage.factory(5,'acid','The slug spits some acid that eats at '+target.name+' armor.')]}];
        } else {
            mod.onHit = [{ target:target, eff: [effDamage.factory(5,'acid')]}];
        }
        return(mod);
    }
}
//Armor for creatures not using equipment
class ArmorTorso extends Equipment {
    static dataPrototype() {    
        return({style:'scales'}); }
    static factory(id) {
        let obj =  new ArmorTorso();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('ArmorTorso');
        this.addTags(['body']);
        this.slotUse = ['Breast','Stomach'];
        this.data = ArmorTorso.dataPrototype();
    }
    setStyle(id) {
        this.data.style = id;
        switch(id) {
            case 'scales':
                break;
            case 'slime':
                break;
            case 'fur':
                    break;
            default:
                throw new Error("unknown Armor-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { 'The '+this.data.style+' improves resistance.';}
    toJSON() {return window.storage.Generic_toJSON("ArmorTorso", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(ArmorTorso, value.data));}
    descLong(fconv) {
        return(fconv('$[My]$ body is covered with '+this.data.style+' .'));
    }
    onEquip(context) {
        let arm,rst;
        for(let el of window.gm.combat.TypesDamage) {
            arm=rst=0;
            if(this.data.style ==='slime') {
                if(el.id==='fire' || el.id==='poison' || el.id==='acid') arm=5,rst=70;

            } else if(this.data.style ==='fur') {
                if(el.id==='ice') arm=5,rst=30;
                if(el.id==='blunt') arm=5,rst=20;
            } else if(this.data.style ==='scales') {
                if(el.id==='ice') rst=-30;
                if(el.id==='slash') arm=5,rst=20;
            }
            if(arm!==0) context.parent.Stats.addModifier('arm_'+el.id,{id:'arm_'+el.id+':'+this.id, bonus:arm});
            if(rst!==0) context.parent.Stats.addModifier('rst_'+el.id,{id:'rst_'+el.id+':'+this.id, bonus:rst});
        }
        return({OK:true, msg:'equipped'});
    }
    onUnequip() {
        for(let el of window.gm.combat.TypesDamage) {
            context.parent.Stats.removeModifier('arm_'+el,{id:'arm_'+el+':'+this.id});
            context.parent.Stats.removeModifier('rst_'+el,{id:'rst_'+el+':'+this.id});
        }
        return({OK:true, msg:'unequipped'});
    }
}
class SkinHuman extends Equipment {
    static dataPrototype() {    
        return({style:'human', color:'olive', pattern: 'smooth'}); }
    static factory(id) {
        let obj =  new SkinHuman();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('SkinHuman');
        this.addTags(['body']);
        this.slotUse = ['bSkin'];
        this.data = SkinHuman.dataPrototype();
    }
    setStyle(id,color='pale') {
        this.data.style = id; 
        this.data.color = color;
        switch(id) {
            case 'human':
                this.data.pattern = 'smooth';
                break;
            case 'latex':
                this.data.pattern = 'thick';
                break;
            default:
                throw new Error("unknown Skin-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { 'a smooth skin mostly bare of noticable hair.';}
    toJSON() {return window.storage.Generic_toJSON("SkinHuman", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkinHuman, value.data));}
    descLong(fconv) {
        return(fconv('$[My]$ body is covered with '+this.data.pattern+' '+this.data.color+' '+this.data.style+' skin.'));
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
            case 'cat','bunny':
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
class SkinScales extends Equipment {
    static dataPrototype() {    
        return({style:'lizard', color:'dark green', pattern: 'smooth'}); }
    static factory(id) {
        let obj =  new SkinScales();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('SkinScales');
        this.addTags(['body']);
        this.slotUse = ['bSkin'];
        this.data = SkinScales.dataPrototype();
    }
    setStyle(id,color='dark grey') {
        this.data.style = id; 
        this.data.color = color;
        switch(id) {
            case 'lizard':
                this.data.pattern = 'smooth';
                break;
            default:
                throw new Error("unknown Fur-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { 'scales like a eptile.';}  //todo color
    toJSON() {return window.storage.Generic_toJSON("SkinScales", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(SkinScales, value.data));}
    descLong(fconv) {
        return(fconv('$[My]$ body is covered in '+this.data.pattern+', '+this.data.color+' scales.'));
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
        this.data.style = id;
        switch(id) {
            case 'cat':
            case 'dog':
            case 'horse':
            case 'wolf':
            case 'lizard':  
                this.data.growth = 0.10; //in %/100 maxGrowth
                this.data.maxGrowth = 1.2; //in meter, todo depends on bodysize
                break;
            case 'bunny':
                this.data.growth = 0.40; //in %/100 maxGrowth
                this.data.maxGrowth = 0.2; //in meter, todo depends on bodysize
            case 'human':
                this.data.growth =1;
                this.data.maxGrowth = 0.0; //todo no tail??
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
            case 'bunny':
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
        let _dmg =5;
        if(this.data.style==='cat' || this.data.style==='lizard' ) _dmg+=5;
        mod.onHit = [{ target:target, eff: [effDamage.factory(_dmg,'slash')]}];
        return(mod);
    }
}
class HandsHoof extends Equipment { //hoves of horse,...
    static dataPrototype() {    
        return({style:'horse'});
    }
    static factory(id) {
        let obj =  new HandsHoof();
        obj.setStyle(id);
        return(obj);
    }
    constructor() {
        super('HandsHoof');
        this.addTags(['body']);
        this.slotUse = ['bHands'];
        this.data = HandsHoof.dataPrototype();
    }
    setStyle(id) {
        this.data.style = id; 
        switch(id) {
            case 'horse':
            case 'deer':
                break;
            default:
                throw new Error("unknown HandsHoof-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { return this.data.style+'\'like hoves.';}
    toJSON() {return window.storage.Generic_toJSON("HandsHoof", this); };
    static fromJSON(value) {return(window.storage.Generic_fromJSON(HandsHoof, value.data));}
    descLong(fconv) { 
        return(fconv('$[I]$ $[have]$ hoves like that of a '+this.data.style+'.'));
    }
    attackMod(target){
        let mod = new SkillMod();
        let _dmg =5;
        if(this.data.style==='horse' ) _dmg+=5;
        mod.onHit = [{ target:target, eff: [effDamage.factory(_dmg,'blunt')]}];
        return(mod);
    }
}
class HandsHuman extends Equipment { //hands with digits to use tools
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
            case 'bunny':
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
        msg += ['horse','deer'].includes(this.data.style)?(this.data.style+'-hoofes adorn the fingertips'):'';
        msg += ['dog','wolf','cat','bunny'].includes(this.data.style)?(this.data.style+'-claws adorn the fingertips'):'';
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
            case 'bunny':
                break;
            case 'lizard':
                break;
            default:
                throw new Error("unknown breast-style "+id);
        }
    }
    getStyle() { return this.data.style; }
    get descShort() { return (this.desc);}
    get desc() { return 'some '+this.data.style+' breasts.';}
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
            case 'bunny':
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
        context.parent.addEffect(new window.storage.constructors['effSpermInWomb'](),'effSpermInWomb');
        context.parent.addEffect(new window.storage.constructors['effVaginalFertil'](),'effVaginalFertil');
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
            case 'bunny':
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
    window.storage.registerConstructor(ArmorTorso);
    window.storage.registerConstructor(BaseHumanoid);
    window.storage.registerConstructor(BaseQuadruped);
    window.storage.registerConstructor(BaseWorm);
    window.storage.registerConstructor(HandsHoof);
    window.storage.registerConstructor(HandsHuman);
    window.storage.registerConstructor(HandsPaw);
    window.storage.registerConstructor(FaceHorse);
    window.storage.registerConstructor(FaceHuman);
    window.storage.registerConstructor(FaceLeech);
    window.storage.registerConstructor(FaceWolf);
    window.storage.registerConstructor(SkinHuman);
    window.storage.registerConstructor(SkinFur);
    window.storage.registerConstructor(SkinScales);
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
///////////////////////////////////////////////////////
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
                char.addEffect(pregnancy,effVaginalPregnant.name)
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
                char.addEffect(pregnancy,effVaginalFertil.name);
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
        char.Outfit.addItem(new window.storage.constructors[_TF].factory('wolf'));
        msg+="You have grown a fuzzy tail !</br>";
    }
    _TF = 'FaceWolf';
    let face = char.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bFace);
    let skin = char.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bSkin);
    if(face ===null || face.id !==_TF) {
        char.Outfit.addItem(new window.storage.constructors[_TF].factory('wolf'));
        msg+= "Your face got transformed into a dog-like muzzle.</br>"; 
    } else if(face.getStyle() !=='wolf') {
        face.setStyle('wolf');
        msg+= "Your not so human face got transformed into a dog-like muzzle.</br>"; 
    } else if(skin===null || skin.id !="SkinFur") {
        char.Outfit.addItem(new window.storage.constructors['SkinFur'].factory('wolf'));
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
        char.Outfit.addItem(new window.storage.constructors['TailWolf'].factory('cat'));
        msg=("You have grown a cat tail !</br>");
    }
    if(char===window.gm.player) {
        window.gm.pushDeferredEvent("GenericDeffered",[msg]);
    }
};
window.gm.MutationsLib['mutateHorse'] = function(char,magnitude=1) {
    let msg='', bb=window.gm.OutfitSlotLib;
    let fconv =window.gm.util.descFixer(char);
    let base=char.Outfit.getItemForSlot(bb.bBase);//todo bodyparts depends also on feral or anthro body
    let el,slots=[], cnt=0;
    //which part can mutate?
    [bb.bFace,bb.bSkin,bb.bTailBase,bb.bHands].forEach(
        x=>{slots.push({"slot":x,"item":char.Outfit.getItemForSlot(x)})});
    //select a part to mutate, repick if already mutated    
    while(slots.length>0 && cnt<magnitude) {//todo legs,skin,genitals
        el = slots.splice(_.random(0,slots.length-1),1)[0];
        if(el.slot===bb.bTailBase) {
            if(el.item===null) {
                char.Outfit.addItem(window.storage.constructors['TailWolf'].factory('horse'),true);
                msg+=fconv("$[I]$ $[have]$ grown a horse tail !</br>");
                cnt++;
            } else if(el.item.getStyle() !=='horse'|| el.item.id!=='TailWolf') {
                char.Outfit.removeItem(el.item.id,true);
                char.Outfit.addItem(window.storage.constructors['TailWolf'].factory('horse'),true);
                msg+=fconv("$[My]$ tail reshapes itself to a be more horse-like.</br>");
                cnt++;
            } else {
                var growth = el.item.data.growth+0.25;
                var maxGrowth = 2;//window.gm.player.Outfit.getItem("TailWolf").maxGrowth;
                if(growth >= 1) {
                    //msg=("You already changed to a horse as far as possible.</br>");
                } else {
                    el.item.data.growth=growth;
                    msg+=fconv("$[My]$ tail must have grown and is now "+window.gm.util.formatNumber(growth*maxGrowth,1)+" meter long.</br>");
                    cnt++;
                }
            }
        } else if(el.slot===bb.bFace) {
            if(el.item===null) { //grow no face?
            } else if(el.item.getStyle() !=='horse') {
                char.Outfit.removeItem(el.item.id,true);
                char.Outfit.addItem(window.storage.constructors['FaceHorse'].factory('horse'),true);
                msg+=fconv("$[My]$ face transforms into a horse ones.</br>");
                cnt++;
            } 
        } else if(el.slot===bb.bHands) {
            if(el.item===null) { //grow no hands?
            } else if(el.item.getStyle() !=='horse') {
                if(base.id==="BaseHumanoid") {
                    char.Outfit.removeItem(el.item.id,true);
                    char.Outfit.addItem(window.storage.constructors['HandsHuman'].factory('horse'),true);
                    msg+=fconv("$[My]$ hands now look like that of a human but with thick fingernails.</br>");
                } else {
                    char.Outfit.removeItem(el.item.id,true);
                    char.Outfit.addItem(window.storage.constructors['HandsHoof'].factory('horse'),true);
                    msg+=fconv("$[My]$ hands transforms into a horse-like hoves.</br>");
                }
                cnt++;
            }
        }
    }
    if(cnt<magnitude) msg=fconv("$[I]$ already changed to a horse as far as possible.</br>");
    if(char===window.gm.player) {
        window.gm.pushDeferredEvent("GenericDeffered",[msg]);
    }
};
window.gm.MutationsLib['mutateBunny'] = function(char) {
    let msg='', _TF="TailWolf", style='bunny';
    if(char.Outfit.countItem(_TF)>0) {
        let item = char.Outfit.getItem(_TF);
        if(item.getStyle() !==style) {
            item.setStyle(style);
            msg=("Your tail reshapes itself to a be more bunny-like.</br>");
        } else {
            var growth = item.data.growth+0.25;
            var maxGrowth = char.Outfit.getItem(_TF).maxGrowth;
            if(growth >= 1) {
                msg=("You already changed to a bunny as far as possible.</br>");
            } else {
                item.data.growth=growth;
                msg=("Your tail must have grown and is now "+growth*maxGrowth+" meter long.</br>");
            }
        }
    } else {
        char.Outfit.addItem(new window.storage.constructors['TailWolf'].factory(style));
        msg=("You have grown a small, fluffy bunny tail !</br>");
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
        char.Outfit.addItem(new window.storage.constructors[_TF].factory('human'));
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