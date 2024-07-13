"use strict";
//stuff for ISurive
class CraftMaterial extends Item {
    constructor(){ super('CraftMaterial');
        this.addTags([window.gm.ItemTags.Material]); this.price=this.basePrice=10;   
        this.style=0;this.lossOnRespawn = false;
    }
    set style(style){ 
        this._style = style; 
        if(style===0) this.id=this.name='Jlorb';
        else if(style===5) this.id=this.name='Shlack';
        else if(style===10) this.id=this.name='Glib';
        else if(style===20) this.id=this.name='Gorb';
        else if(style===30) this.id=this.name='Igent';
        else if(style===40) this.id=this.name='Remk';
        else if(style===50) this.id=this.name='Murk';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg ='';
        switch(this._style){
            case 0: 
            case 5: 
            case 10: 
            case 20: 
            case 30: 
            case 40:
            case 50:
                msg ='some strange material';
                break;
            default: throw new Error(this.id +' doesnt know '+style);
        }
        return(msg);
    }
    toJSON(){return window.storage.Generic_toJSON("CraftMaterial", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(CraftMaterial, value.data);};
}

class Gun extends Weapon {
    static factory(style){
        let x = new Gun();
        x.style=style;
        return(x);
    }
    constructor(){
        super();
        this.slotUse = ['RHand'];
        this.style=0;
    }
    set style(style){ 
        this._style = style; 
        if(style===0) this.id=this.name='Taser';
        else if(style===100) this.id=this.name='Blaster';
        else if(style===105) this.id=this.name='BlasterMK2';
        else if(style===120) this.id=this.name='Cryonizer';
        else throw new Error(this.id +' doesnt know '+style);
    }
    get style(){return this._style;}
    get desc(){ 
        let msg ='';
        switch(this._style){
            case 0: msg+=(' pistol-like plastic tool that shocks someone with 30kV');  
            break;
            case 100: msg+=('scifi-revolver that fires a plasma-fireball');  
            break;
            case 105: msg+=('scifi-revolver that fires a bigger plasma-fireball');  
            break;
            case 120: msg+=('looks like a hair-dryer but can deep freeze something on short distance');  
            break;
            default:
        }
        return(msg);
    }
    toJSON(){return window.storage.Generic_toJSON("Gun", this); }
    static fromJSON(value){return(window.storage.Generic_fromJSON(Gun, value.data));}
    onEquip(context){
        let res=super.onEquip(context);
        if(res.OK){
            let sk = new SkillSpark();
            sk.weapon = this.id;
            this.parent.parent.Skills.addItem(sk);  //todo
        }
        return(res);
    }
    onUnequip(context){
        super.onUnequip(context)
        this.parent.parent.Skills.removeItem('Spark');
        return({OK:true, msg:'unequipped'});
    }
    /*attackMod(target){  //todo
        let mod = new SkillMod();
        mod.onHit = [{ target:target, eff: [effDamage.factory(11,'blunt')]}];
        mod.critChance=5;
        mod.onCrit = [{ target:target, eff: [effDamage.factory(11,'blunt'), new effStunned()]}];
        return(mod);
    }*/
}

window.gm.ItemsLib = (function (ItemsLib){
    window.storage.registerConstructor(CraftMaterial);
    window.storage.registerConstructor(Gun);
    ItemsLib['Jlorb'] = function(){ let x= new CraftMaterial();x.style=0;return(x);}

return ItemsLib; 
}(window.gm.ItemsLib || {}));

window.gm.build_DngNG=function(regionType){
    function addMob(type,pos){
        //type refers either to a unique char existing in s.chars
        //or is generic mob, then we have to append idcounter and create instance
        let _id=type;
        if(!window.story.state.chars[type]) {
            _id=type+IDGenerator.instance().createID();
            window.story.state.chars[_id]=window.gm.Mobs[type]();
        }
        //state = see window.gm.mobAI
        //timerA & B = ; used for mobAI
        //att = 0=indifferent|1=friendly|-1=unfriendly|-2=hostile;
        //tick = last time updated
        data.tmp.mobs.push({
            id:_id,
            mob:type,pos:pos,path:[pos],state:0,tick:'',att:0,timerA:0,timerB:0});
    }
    function getTilesByVisual(visual){
        let _r=[];
        for (let value of data.map.grid.values()) {
            if(value.visuals===visual) { 
                _r.push(value);
            }
        }
        if(_r.length===0) throw new Error("no room with visual "+visual);
        return(_r);
    }
    let s = window.story.state,data;
    
    /////// --!!!!
    const version=1;
    ////// -- !!!!                          // <== increment this if you change anything below - it will reinitialize data !
    if(s.DngNG && s.DngNG.version===version){
        data=s.DngNG;
    } else {
        data=s.DngNG,data.version=version;
        //roll locations
        data.map= [
             "DngNG_00_00",
             "DngNG_00_01",
             "DngNG_00_02",
             "DngNG_00_01",
             "DngNG_00_99"
        ];//window.GenerateDng.DngGen.generate({length:5,doors:2,naming:"12_01",branches:2})
        //data.Exit="DngNG_"+getTilesByVisual("entry")[0].room;// data.map.grid.entries().next().value[0];
        data.tmp={tickPass:'', tier:0 , room:-1 };
        data.tmp.evtLeave = { //events on tile-leave
            F4_G4: [{id:"Trap_Dehair",type:'encounter',tick:window.gm.getTime(),state:0,chance:100 }],
            I4_H4: null
        }
        data.task = {},data.rolledTask=[]; //active task
        data.tasks = { //tasks you did
        };
    }
    //install function to calculate chance of evtLeave
    window.gm.encounterChance=function(evt){
        let res=100.0,s=window.story.state,dng=window.story.state.DngSY.dng;
        res*=evt.chance/100.0;
        if(evt.id==='Trap_Dehair'){ //Dehair if nude and hair
            //if(window.gm.player.clothLevel()==='naked') {res*=2;}
            if(window.gm.getDeltaTime(window.gm.getTime(),evt.tick)>200) res*=2;
            else res=0;
        }
        return(res);
    }
    window.gm.toNextRoom=function(){
        let s=window.story.state;
        if(s.DngNG.tmp.room<0){ //Start
            s.DngNG.tmp.room=0;
        } else {
        s.DngNG.tmp.room++;
            if(s.DngNG.tmp.room>=s.DngNG.map.length){ //this room should either have a exit or we start from begin
                s.DngNG.tmp.room=0;
            }
        }
        window.gm.addTime(120);
        window.story.show(s.DngNG.map[s.DngNG.tmp.room])
    }
    //TODO cannot save graph due circular neigbours data.tmp.graph = window.gm.gridToGraph(_grid);  //for pathfinding  let path = window.astar.search(data.tmp.graph,"F2","I2",null,{heuristic:(function(a,b){return(1);})})
    //add some helper funcs
    data.getMobById=function(id){
        for(var i=data.tmp.mobs.length-1;i>=0;i--){
            if(data.tmp.mobs[i].id===id) return(data.tmp.mobs[i]);
        }
        return(null);
    }
    data.addMob=addMob;
    return({map:data.map,data:data});
};
//TODO override postVictory
window.gm.postTrial=function(data){
    //proceed to next room
    //or get punished
}
window.gm.renderRoomNG= function(room){ //see also window.gm.renderRoom
    let msg="",s=window.story.state, dng=s.DngSY.dng;
    let _c=room.replace(dng+"_",""), _v=s.DngNG.map.grid.get(_c).visuals;
    switch(_v){
        case "trees":
            msg+="There is a group of smaller trees."
            break;
        case "bushes":
            msg+="Bushes of different sizes are growing close to each other."
            break;
        case 'bigtree':
            msg+="The area here lies in the shadow of a huge tree."
            break;
        case 'meadow':
            msg+="The sun shines down on the meadow, casting a warm and inviting glow over the entire area."
            break;
        case 'garage':
            msg+="A garage with a slightly open door.Maybe you can find some tools there."
            break;
        case 'trailer':
            msg+="A rundown trailer with a messy kitchen corner and a unfolded bed."
            break;
        default:
            break;
    }
    switch(_v){
        case "appletree":
            msg+=window.story.render(dng+'_'+_v);
            break;
        case "entry":
            msg+=window.story.render(dng+'_'+_v);
            break;
        default:
            break;
    }
    return(msg);
}
//build message+actions for NPC around player.
//returns {msg,attitudeToPlayer}
// 
//hostile=attack on sight ; this indicates to trigger combat
window.gm.build_NPCInfo=function(mob,position){
    let att=mob.att, msg,_mob =window.story.state.chars[mob.id]; //only unique mobs are stored here TODO 
    msg = "A "+mob.mob+" is here."; //TODO what is the mob doing? sleeping/hiding/lurking
    if(_mob instanceof Mob) {
        msg = _mob.unique?(mob.id+" is around."):msg;
        msg+=window.gm.images._sizeTo(window.gm.images[_mob.pic](),200,200)
        //Todo interaction depends on mob (can talk, detects player, is cloaked) and player (crawl toward)
        //att=0;  //Todo calc attitude by history/relation and player-state (vulnerable or not)
        //msg+= window.gm.printPassageLink("Talk to"+mob.id,"DngNG_"+mob.id+"_Talk");
        if(mob.state===4 || mob.state===3){ 
            att-=(att>-2)?1:0;
            msg+="You better not get closer."
        }
    } 
    mob.att=att;
    return({msg:msg,att:att});
};

//build message about NPC in surrounding tiles(tiles connected to this position)
window.gm.build_NPCProximity=function(position){
    let msg ="", mob,_d=window.story.state[window.story.state.DngSY.dng].tmp;
    let rooms= window.gm.getRoomDirections(position).map((x)=>{return(x.dir);});
    for(var i=_d.mobs.length-1;i>=0;i--){ // go through list of mobs and check if they are in rooms around position
        mob=_d.mobs[i];
        if(mob.state<0) continue;
        if(rooms.indexOf(mob.pos)<0) continue;
        msg+=(mob.state===3)?"Something is approaching from "+mob.pos:"There seems to be someone in "+mob.pos;  //TODO ...is stomping in your direction/ shuffling around/ slushing
        msg+=".<br>"
    }
    
    //translate _to in north/south/above...
    //Was there some noise coming from western direction? You hear something shuffling around east of here | Ruff might be hunting north of here 
    return(msg)
}