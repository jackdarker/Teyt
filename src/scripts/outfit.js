"use strict";
/* a player has an outfit describing which Equipment (wardrobe,utilities,..) he has equiped
*/
//this is a lookuptable for the equipmentslots
//todo this will bloat up every character in savegame; is there a way to only store the used slots in character?
//changing the numbers will break savegames !
window.gm.OutfitSlotLib = { 
    //b.. = bodyparts  (separated for mutiation-slots)
    bFeet   : 1,
    bLegs   : 2,
    bTorso  : 3,   
    bWings  : 4,
    bSkin   : 5, // or fur,scales,...
    bPubicHair  : 6,
    bHeadHair   : 7,
    bArms   :   8,
    bHands  :   9,
    bNeck   :   10,
    bFace   :   11,
    bEyes   :   12,
    bEars   :   13,
    bMouth  :   14,
    bTongue :   15,
    bTailBase : 16,   
    bBreast :   17,
    bNipples :  18,
    bPenis :    19,
    bBalls  :   20,
    bVulva  :   21,
    bClit   :   22,
    bWomb   :   23,
    bAnus   :   24,
    // slots for wearables
    Feet    :   41,
    Ankles  :   42,
    Legs    :   43,
    Thighs  :   44,
    Hips     :   45,
    Torso   :   46,    //not used !
    Breast  :   47,
    Nipples :   48,
    Penis :     49,
    Balls  :    50,
    Vulva  :    51,
    Clit    :   52,
    Womb   :    53,
    Anus   :    54,
    TailBase   :55,
    TailTip :   56,
    Stomach :   57,
    Chest   :   58,
    Shoulders : 59,  
    Wings   :   60,
    Neck    :   61,
    Head    :   62,
    HeadHair:   63,//for Hats
    Face    :   64,//for facemask
    Mouth   :   65,
    Nose    :   66,
    Eyes    :   67,
    Ears    :   68,
    Arms    :   69,
    Wrists  :   70,
    LHand   :   71,
    RHand   :   72,
    //U  = under wear    P = piercing
    uFeet    : 81,   //socks
    uAnkles  : 82,    //
    uLegs    : 83,
    uThighs  : 84,
    uHips    : 85,
    uTorso   : 86,    //not used !
    uBreast  : 87,
    pNipples : 88,
    uPenis   : 89,
    pPenis  :   90,
    uBalls  :   91,
    pBalls  :   92,
    uVulva  :   93,
    pVulva  :   94,
    pClit   :   95,
    uWomb   :   96,
    uAnus   :   97,
    uTailBase  :98,
    uTailTip :  99,
    uStomach :  100,
    uChest   :  101,
    uShoulders :102,
    uWings   :  103,
    uNeck    :  104,
    uHead    :  105,
    uHeadHair:  106,
    uFace    :  107,
    uMouth   :  108,
    uNose    :  109,
    pEyes    :  110,
    pEars    :  111,
    uArms    :  112,
    uWrists  :  113,
    uLHand   :  114,
    uRHand   :  115,
    //insert more slots before here
    SLOTMAX : 120
};
//Todo equip on other char:
//move from own inventory to chars, equip, if impossible undo 
class Equipment extends Item {
    constructor(name) {
        super(name);
        this.tags = [];
        this.slotUse = [];
    }
    // Attention !!
    //_parent will be added dynamical
    get parent() {return this._parent();}
    //for compatibility with item
    usable(context) {return({OK:false, msg:'Useable in wardrobe'});}
    use(context) {return({OK:false, msg:'Cannot use.'});}

    canEquip() {return({OK:false, msg:'unusable'});}
    canUnequip() {return({OK:false, msg:'unusable'});}
    onEquip() {return({OK:true, msg:'equipped'});}
    onUnequip() {return({OK:true, msg:'unequipped'});}
}
//a kind of special inventory for worn equipment
class Outfit extends Inventory{
    constructor(externlist) {
        super(externlist);
        //create each slot
        for(let i=0; i<window.gm.OutfitSlotLib.SLOTMAX;i++) {
            if(this.list.length-1 < i) {
                this.list.push({id:'', item:null});        // {id:'Leggings'}
            }
        }
        window.storage.registerConstructor(Outfit);
    }
    get parent() {return this._parent();}
    toJSON() {return window.storage.Generic_toJSON("Outfit", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Outfit, value.data);};
    postItemChange(id,operation,msg) {
        window.gm.pushLog('Outfit: '+operation+' '+id+' '+msg+'</br>');
    }
    //count how many slots are used by an item
    countItem(id) {
        let _i = this.findItemSlot(id);
        return(_i.length);  
    }
    //detect which slots are used by a item
    findItemSlot(id) {
        let _idx =[];
        for (let i = 0; i < this.count(); i++) {
            if(this.list[i].id===id) _idx.push(i);
        }
        return(_idx);
    }
    //override because findItemSlot returns array
    getItem(id) {
        let _idx = this.findItemSlot(id);
        if(_idx.length<0) throw new Error('no such item: '+id);
        return(this.list[_idx[0]].item);
    }
    getItemForSlot(slot) {
        return(this.list[slot].item)
    }
    canEquipSlot(slot) {
        return({OK:true});
    }
    canUnequipSlot(slot) {
        return({OK:true});
    }
    canUnequipItem(id, force) {
        let _idx = this.findItemSlot(id);
        let _item = this.getItem(id);
        let result = _item.canUnequip();
        for(let i=0; i<_idx.length;i++) {
            let _tmp = this.canUnequipSlot(_idx[i]);
            if(!_tmp.OK) result.msg +=_tmp.msg+" ";
            result.OK = result.OK && _tmp.OK;
        }
        return(result);
    }
    //this will equip item if possible
    addItem(item, force) {
        let _idx = this.findItemSlot(item.name);
        if(_idx.length>0) return; //already equipped
        let _item = item;
        _idx = _item.slotUse.map((function(cv, ix, arr) { return (window.gm.OutfitSlotLib[cv]);  }));
        let _oldIDs = [];
        let _oldSlots = [];
        let result = {OK: true, msg:''};
        //check if equipment is equipable
        result = item.canEquip();
        if(result.OK) {
            for(let l=0; l< _idx.length;l++) {  //check if the current equip can be unequipped
                let oldId = this.getItemId(_idx[l]);
                if(oldId==='') continue;
                if(_oldIDs.indexOf(oldId)<0) {
                    _oldIDs.push(oldId);
                    _oldSlots=_oldSlots.concat(this.getItem(oldId).slotUse.map((function(cv, ix, arr) { return (window.gm.OutfitSlotLib[cv]);})));
                }
                let _tmp = this.canUnequipItem(oldId);
                if(!_tmp.OK) result.msg += _tmp.msg; //todo duplicated msg if item uses multiple slots
                result.OK = result.OK && _tmp.OK;
                //Todo  check if slot is available fo equip this canEquipSlot(_idx[l])
            }
        }
        if(!result.OK) {
            this.postItemChange(_item.name,"equip_fail:",result.msg);
            return;
        }
        for(let m=0;m<_oldIDs.length;m++){
            this.getItem(_oldIDs[m]).onUnequip(this);
        }
        for(let i=0; i<_oldSlots.length;i++) {
            this.__clearSlot(_oldSlots[i]);
        }
        
        for(let k=0; k<_idx.length;k++) {
            this.list[_idx[k]].id = _item.name;
            this.list[_idx[k]].item = _item;
        }  
        _item._parent = window.gm.util.refToParent(this);       //Todo currently we have 2 copies of equipment - 1 for wardrobe 1 for outfit otherwise this will not work
        result=_item.onEquip();
        this.postItemChange(_item.name,"equipped",result.msg);
    }
    //assumme that it was checked before that unequip is allowed
    __clearSlot(slot, force) {
        this.list[slot].id = '', this.list[slot].item=null;
    }
    removeItem(id, force) {
        let _idx = this.findItemSlot(id);
        if(_idx.length===0) return; //already unequipped
        let result =this.canUnequipItem(id);
        if(!result.OK) {
            this.postItemChange(id,"unequip_fail",result.msg);
            return;
        }
        let _item = this.getItem(id);
        result=_item.onUnequip(this);
        for(let i=0; i<_idx.length;i++) {
            this.__clearSlot(_idx[i]);
        }
        this.postItemChange(id,"removed",result.msg);
        //Todo delete _item;    //un-parent
    }
}

