"use strict";
/* a player has an outfit describing which Equipment (wardrobe,utilities,..) he has equiped
*/
//this is a lookuptable for the equipmentslots
//basially you could create your own slotdefinition, the string is used to lookup properties assigned to list 
window.gm.OutfitSlotLib = { 
    //b.. = bodyparts  (separated for mutation-slots)
    bBase   : "bBase", //defines overall bodyform
    bFeet   : "bFeet",
    bLegs   : "bLegs",
    bTorso  : "bTorso",   
    bWings  : "bWings",
    bSkin   : "bSkin", // or fur,scales,...
    bPubicHair  : "bPubicHair",
    bHeadHair   : "bHeadHair",
    bArms   :   "bArms",
    bHands  :   "bHands",
    bNeck   :   "bNeck",
    bFace   :   "bFace",
    bEyes   :   "bEyes",
    bEars   :   "bEars",
    bMouth  :   "bMouth",
    bTongue :   "bTongue",
    bTailBase : "bTailBase",   
    bBreast :   "bBreast",
    bNipples :  "bNipples",
    bPenis :    "bPenis",
    bBalls  :   "bBalls",
    bVulva  :   "bVulva",
    bClit   :   "bClit",
    bWomb   :   "bWomb",
    bAnus   :   "bAnus",
    // slots for wearables
    Feet    :   "Feet",
    Ankles  :   "Ankles",
    Legs    :   "Legs",
    Thighs  :   "Thighs",     //
    Hips    :   "Hips",    //belt
    Torso   :   "Torso",    //dont use !
    Breast  :   "Breast",
    Nipples :   "Nipples",
    Penis :     "Penis",
    Balls  :    "Balls",
    Vulva  :    "Vulva",
    Clit    :   "Clit",
    Womb   :    "Womb", //??
    Anus   :    "Anus",
    TailBase   :"TailBase",
    TailTip :   "TailTip",
    Stomach :   "Stomach",
    Chest   :   "Chest",
    Shoulders : "Shoulders",  
    Wings   :   "Wings",
    Neck    :   "Neck",
    Head    :   "Head",
    HeadHair:   "HeadHair",//for Hats
    Face    :   "Face",//for facemask
    Mouth   :   "Mouth",
    Nose    :   "Nose",
    Eyes    :   "Eyes",
    Ears    :   "Ears",
    Arms    :   "Arms",
    Wrists  :   "Wrists",
    LHand   :   "LHand",
    RHand   :   "RHand",
    //U  = under wear    P = piercing  T = tattoo 
    uFeet    : "uFeet",   //socks,stockings
    uAnkles  : "uAnkles",    //stockings, cuffs
    uLegs    : "uLegs",     //stockings
    uThighs  : "uThighs",   
    uHips    : "uHips",     
    uTorso   : "uTorso",    //not used !
    uBreast  : "uBreast",   //bra
    pNipples : "pNipples",
    tStomach : "tStomach",
    uPenis   : "uPenis",
    pPenis  :   "pPenis",
    uBalls  :   "uBalls",
    pBalls  :   "pBalls",
    uVulva  :   "uVulva",
    pVulva  :   "pVulva",
    pClit   :   "pClit",
    uAnus   :   "uAnus",
    uTailBase  :"uTailBase",
    uTailTip :  "uTailTip",
    uStomach :  "uStomach",
    uChest   :  "uChest",   //bra
    uShoulders :"uShoulders",
    uWings   :  "uWings",
    uNeck    :  "uNeck",    //necklace
    uHead    :  "uHead",    //
    uHeadHair:  "uHeadHair",
    uFace    :  "uFace",
    uMouth   :  "uMouth",
    pNose    :  "pNose",
    pEyes    :  "pEyes",
    pEars    :  "pEars",    //earring
    pTongue    :  "pTongue",
    pNavel    :  "pNavel",
    uArms    :  "uArms",
    uWrists  :  "uWrists",
    uLHand   :  "uLHand",
    uRHand   :  "uRHand"
};
//Todo equip on other char:
//move from own inventory to chars, equip, if impossible undo 
class Equipment extends Item {
    constructor(name){
        super(name);
        this.slotUse = []; //which slot is used by the equip
        this.slotCover = []; //which other slots are invisible by this "uses Breast, covers bBreast,bNipples"
        this.lewd ={slut:0, bondage:0, sm:0}; //slutiness-rating 
    }
    _relinkItems(parent){  //call this after loading save data to reparent
        super._relinkItems(parent);
        for(var n of this.bonus){ 
            n._relinkItems(this);
        }
    }
    //for compatibility with item
    usable(context){return({OK:false, msg:'Useable in wardrobe'});}
    use(context){return({OK:false, msg:'Cannot use.'});}
    //more detailed description that should reflet if the item is worn or not; 
    descLong(fconv){ 
        let msg='';
        let rnd = _.random(0,100);
        if(this.isEquipped()){
            if(rnd>50) msg='$[I]$ $[wear]$ '+this.name+'.';
            else msg='A '+this.name+' adorns $[me]$.';
        } else {
            if(rnd>50) msg='$[I]$ $[own]$ '+this.name+".";
            else msg='$[I]$ $[have]$ '+this.name+".";
        }
        return(fconv(msg));
    }
    get HP() {return((this._HP!=undefined)?this._HP:100.0);}
    set HP(hp){ //add this line to style-setter if you want to use hp:  if(this._HP) this.HP=this._HP;
        //todo if multiple items edited ??
        //todo unequip on 0hp?
        this._HP=hp;
        this._updateId();this.name=this.baseId+" "+hp.toString()+"%"; //todo "damaged shirt"
    } 
    get desc(){ return(this.descShort+ this.bonusDesc());}
    bonusDesc(){
        let msg='';
        for(var n of this.bonus){
            msg+="\n"+n.desc; //</br> todo 
        }
        return(msg);
    }
    isEquipped(){ return(this.parent.parent.Outfit && this.parent.parent.Outfit.findItemSlot(this.id).length>0);}
    canEquip(context){
        if(this.parent && this.parent.parent.Outfit.findItemSlot(this.id).length>0) return(this.canUnequip()); //if you try to equip the same outfit another time it should unequip 
        else return({OK:true, msg:'equipable'});}
    canUnequip(){
        let n,res = {OK:true, msg:'unequipable'};
        for (n of this.bonus){
            res=n.canUnequip();
            if(res.OK===false) return(res);
        }
        return(res);
    }
    //call Outfit.addItem instead !
    onEquip(context){
        let n,res={OK:true, msg:this.name+' equipped'};
        for (n of this.bonus){
            n.onEquip();
        }
        if(this.equipText) res.msg=this.equipText(context);
        return(res)
    }
    onUnequip(){
        let n,res = {OK:true, msg:this.name+' unequipped'};
        for (n of this.bonus){
            n.onUnequip();
        }
        if(this.unequipText) res.msg=this.unequipText(context);
        return(res);
    }
    //implement unequipText()/equipText() to return a msg for display
    onTimeChange(now){
        for (let n of this.bonus){
            n.onTimeChange(now);
        }
    };
}

class Weapon extends Equipment {
    constructor(){
        super();this.addTags(['weapon']);
    }
    usable(context){return(this.canEquip(context));}
    use(context){ //context here is inventory not outfit
        if(this.parent.parent.Outfit.findItemSlot(this.id).length>0){  
            this.parent.parent.Outfit.removeItem(this.id); 
            return( {OK:true, msg:'unequipped '+ this.name}); //todo
        } else {
            this.parent.parent.Outfit.addItem(this); 
            return( {OK:true, msg:'equipped '+ this.name}); //todo
        }
    }
    onEquip(context){return({OK:true, msg:'equipped'});}
    onUnequip(){return({OK:true, msg:'unequipped'});}
}
//a kind of special inventory for worn equipment
class Outfit { //extends Inventory{
    constructor(){
        /*this.list = {};  //this.list.Legs = {id:'Leggings' item:x}       old
        this.list[Symbol.iterator] = function(){ //need iterator for for..of
            let index = -1;
            let arr = this;
            let items = Object.keys(this);
            return {
               next(){
                  while (true){
                     index++;
                     if (index >= items.length) return { done: true };
                     if (arr[items[index]] !== undefined) break;
                  }
                  return {
                     done: false,
                     value: { index:items[index], value:arr[items[index]]}
                  };
               }
            }
         }*/
        //new: multiple slots may point to same item; load creates different items for each slot!
        this.list=[];// [{item:x, slots:['Legs']}]
        window.storage.registerConstructor(Outfit);
    }
    get parent(){return this._parent?this._parent():null;}
    toJSON(){return window.storage.Generic_toJSON("Outfit", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(Outfit, value.data);};
    postItemChange(id,operation,msg){
        window.gm.pushLog('Outfit: '+operation+' '+id+' '+msg);
    }
    _relinkItems(){  //call this after loading save data to reparent
        for (let n of this.list){
            /*if(n.value.item){     old
                n.value.item._relinkItems(this);
            }*/
            n.item._relinkItems(this);
        }
    }
    _updateId(oldId){
        /*let slots = item.slotUse
        for(let k=0; k<slots.length;k++){
            let _el = this.list[slots[k]];
            this.list[slots[k]].id = this.list[slots[k]].item.id;
        }*/
    }
    count(){return(this.list.length);}//return( Object.keys(this.list).length);} old
    //count how many slots are used by an item
    countItem(id){
        //let _i = this.findItemSlot(id); return(_i.length);  old
        return(this.findItemSlot(id).length);
    }
    //detect which slots are used by a item
    findItemSlot(id){
        /*let n,_idx =[];    old
        for (n of this.list){
            if(n.item.id===id) _idx.push(n.index); //if(n.value.id===id) _idx.push(n.index);
        }
        return(_idx);*/
        for(var n of this.list){
            if(n.item.id===id) return(n.slots);
        }
        return([]);
    }
    getItemId(slot){
        //let item = this.list[slot]; return(item?item.id:""); old
        for(var n of this.list){
            if(n.slots.includes(slot)) return(n.item.id);
        }
        return("");
    }
    //override because findItemSlot returns array
    getItem(id, noerror=false){
        /*let _idx = this.findItemSlot(id);      old
        if(_idx.length<0) throw new Error('no such item: '+id);
        return(this.list[_idx[0]].item);*/
        for(var n of this.list){
            if(n.item.id===id) return(n.item);
        }
        if(noerror===false) throw new Error('no such item: '+id);
        return(null);
    }
    //returns all Item-Ids in list
    getAllIds(){   
        /*let n,ids=[];   old
        for (n of this.list){
            if(n.value.item && ids.indexOf(n.value.item.id)<0){ //only unique items  
                ids.push(n.value.item.id);
            }
        }
        return(ids);*/
        let ids=[];
        for (var n of this.list){
            ids.push(n.item.id);
        }
        return(ids)
    }
    getItemForSlot(slot){
        //let item = this.list[slot]; return(item?item.item:null); old
        for(var n of this.list){
            if(n.slots.includes(slot)) return(n.item);
        }
        return(null)
    }
    canEquipSlot(slot){
        return({OK:true});
    }
    canUnequipSlot(slot){
        return({OK:true});
    }
    canUnequipItem(id, force){
        let _idx = this.findItemSlot(id);
        let _item = this.getItem(id);
        let result = _item.canUnequip();
        for(let i=0; i<_idx.length;i++){
            let _tmp = this.canUnequipSlot(_idx[i]);
            if(!_tmp.OK) result.msg +=_tmp.msg+" ";
            result.OK = result.OK && _tmp.OK;
        }
        return(result);
    }
    //this will equip item if possible
    addItem(item, force){
        let result = {OK: true, msg:''},_idx = this.findItemSlot(item.id);
        if(_idx.length>0) return(result); //already equipped
        let _item = item;
        _idx = _item.slotUse;
        let _oldIDs = [], _oldItem, _oldSlots = [];
        //check if equipment is equipable
        result = item.canEquip(this);
        if(result.OK){
            for(let l=0; l< _idx.length;l++){  //check if the current equip can be unequipped
                let oldId = this.getItemId(_idx[l]);
                if(oldId==='') continue;
                if(_oldIDs.indexOf(oldId)<0){
                    _oldIDs.push(oldId);
                    _oldSlots=_oldSlots.concat(this.getItem(oldId).slotUse);
                }
                let _tmp = this.canUnequipItem(oldId);
                if(!_tmp.OK) result.msg += _tmp.msg; //todo duplicated msg if item uses multiple slots
                result.OK = result.OK && _tmp.OK;
                //Todo  check if slot is available fo equip this canEquipSlot(_idx[l])
            }
        }
        if(!result.OK){
            this.postItemChange(_item.name,"equip_fail:",result.msg);
            return(result);
        }
        for(let m=0;m<_oldIDs.length;m++){
            this.removeItem(_oldIDs[m]);
            /*_oldItem=this.getItem(_oldIDs[m]);
            _oldItem.onUnequip(this);
            this.parent.Inv.addItem(_oldItem);*/
        }
        /*for(let i=0; i<_oldSlots.length;i++){   old
            this.__clearSlot(_oldSlots[i]);
        }*/
        //if item is from wardrobe/Inventory, remove it there
        if(item.parent && item.parent.removeItem){
            item.parent.removeItem(item.id);
            _item=window.gm.util.deepClone(item);
        }
        _item._parent = window.gm.util.refToParent(this);       //Todo currently we have 2 copies of equipment - 1 for wardrobe 1 for outfit otherwise this will not work
        /*for(let k=0; k<_idx.length;k++){ //attach item to slots    old
            let _el = this.list[_idx[k]];
            if(!_el){
                this.list[_idx[k]] = _el =  {id:'', item:null};
            }
            this.list[_idx[k]].id = _item.id;
            this.list[_idx[k]].item = _item;
        } */
        this.list.push({item:_item, slots:_item.slotUse});
        result=_item.onEquip(this);
        this.postItemChange(_item.name,"equipped",""/*result.msg*/);
        return(result);
    }
    //assumme that it was checked before that unequip is allowed
    __clearSlot(slot, force){
        /*let item = this.list[slot];   old
        if(item){
            item.id = '', item.item=null;
        }*/
    }
    removeItem(id, force){
        let result ={OK:true,msg:''};
        /*let _idx = this.findItemSlot(id);   old
        if(_idx.length===0) return(result); //already unequipped*/
        let _allIds=this.getAllIds();
        if(!_allIds.includes(id))return(result); //already unequipped
        result =(force)?result:this.canUnequipItem(id);
        if(!result.OK){
            this.postItemChange(id,"unequip_fail",result.msg);
            return(result);
        }
        let _idx=_allIds.indexOf(id),_item = this.list[_idx].item;
        result=_item.onUnequip(this);
        /*for(let i=0; i<_idx.length;i++){  old
            this.__clearSlot(_idx[i]);
        }*/
        this.list.splice(_idx,1);
        //unequipped items go into wardrobe except bodyparts
        if(_item.hasTag('body')){
            //dont store bodyparts 
        }else if(_item.hasTag('weapon')){
            this.parent.Inv.addItem(_item);
        } else {
            this.parent.Wardrobe.addItem(_item);
        }
        this.postItemChange(id,"removed",""/*result.msg*/);
        //Todo delete _item;    //un-parent
        return(result)
    }
    updateTime(){
        let now =window.gm.getTime();
        for(var n of this.list){
            //let _eff = n.value.item;  old
            let _eff=n.item;
            if(_eff) _eff.onTimeChange(now);   
        }
    }
    /**
     * returns all items that can be seen (Breast-armor hides breast-underwear hides breast)
     */
    getVisibleSlots(){
        let covered=[], seen=[], lstIds = this.getAllIds();
        for(var i=lstIds.length-1;i>=0;i--){
            let item =this.getItem(lstIds[i]);
            covered=covered.concat(item.slotCover);
            seen =seen.concat(item.slotUse);
        }
        function remCovered(elm){
            return(!covered.includes(elm));
        }
        seen=seen.filter(remCovered);
        return(seen);
    }
    getLewdness(){
        let total={},lewd={};
        let item,slots = this.getVisibleSlots();
        for(var i=0; i<slots.length-1;i++){
            item = this.getItemForSlot(slots[i]);
            if(item && !lewd[item.id]){ //no double count items  
                lewd[item.id] = item.lewd;
            }
        }
        var _keys = Object.keys(lewd); // {slut:0,sm:2}
        for(var i=0;i<_keys.length;i++){
            item = lewd[_keys[i]];
            var _keys2 = Object.keys(item);
            for(var n of _keys2){
                if(total.hasOwnProperty(n)) total[n] += item[n];
                else total[n] = item[n];
            }
        }
        return(total);
    }
}

