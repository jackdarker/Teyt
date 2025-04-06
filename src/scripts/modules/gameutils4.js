"use strict";
window.gm.build_DngNG=function(){
    function addMob(type,pos){
        //type refers either to a unique char existing in s.chars
        //or is generic mob, then we have to append idcounter and create instance
        let _id=type;
        if(!window.story.state.chars[type]) {
            _id=type+IDGenerator.createID();
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

        
        const _m=[
            '            D0    ',
            '            |     ',
            '    B1--C1--D1--E1',
            '    |       |   | ',
            'A2--B2--C2  D2  E2',
            '    |           | ',
            '    B3  C3--D3--E3',
            '    |   |   |     ',
            '    B4--C4--D4    ',
            '        |         ',
            '        C5        '
        ];
        function _d(dir){return({dir:dir,exp:0});}
        let grid=[
        {"room":"C2","dirs":[{"dir":"B2"}],"visuals":"entry","anno":"E"},
        {"room":"A2","dirs":[{"dir":"B2"}],"visuals":"hollowtreestump"},
        {"room":"B3","dirs":[{"dir":"B4"},{"dir":"B2"}],"visuals":"totem"},
        {"room":"B1","dirs":[{"dir":"C1"},{"dir":"B2"}],"visuals":"meadow"},
        {"room":"B2","dirs":[{"dir":"B1"},{"dir":"B3"},{"dir":"A2"},{"dir":"C2"}],"visuals":"mushroom"},
        {"room":"D4","dirs":[{"dir":"D3"},{"dir":"C4"}],"visuals":"bigtree"},
        {"room":"B4","dirs":[{"dir":"B3"},{"dir":"C4"}],"visuals":"bigtree"},
        {"room":"C5","dirs":[{"dir":"C4"}],"visuals":"trees"},
        {"room":"C3","dirs":[{"dir":"D3"},{"dir":"C4"}],"visuals":"meadow"},
        {"room":"C4","dirs":[{"dir":"C3"},{"dir":"C5"},{"dir":"B4"},{"dir":"D4"}],"visuals":"appletree"},
        {"room":"F3","dirs":[{"dir":"E3"}],"visuals":"meadow"},
        {"room":"D3","dirs":[{"dir":"C3"},{"dir":"D4"},{"dir":"E3"}],"visuals":"bushes"},
        {"room":"E4","dirs":[{"dir":"E3"}],"visuals":"trees"},
        {"room":"E2","dirs":[{"dir":"E1"},{"dir":"E3"}],"visuals":"bigtree"},
        {"room":"E3","dirs":[{"dir":"E2"},{"dir":"E4"},{"dir":"D3"},{"dir":"F3"}],"visuals":"meadow"},
        {"room":"E1","dirs":[{"dir":"E2"},{"dir":"D1"}],"visuals":"bushes"},
        {"room":"C1","dirs":[{"dir":"B1"},{"dir":"D1"}],"visuals":"trees"},
        {"room":"D2","dirs":[{"dir":"D1"}],"visuals":"bushes"},
        {"room":"D0","dirs":[{"dir":"D1"}],"visuals":"bigtree"},
        {"room":"D1","dirs":[{"dir":"D0"},{"dir":"D2"},{"dir":"C1"},{"dir":"E1"}],"visuals":"brokencabin"}]
        data.map={grid:new Map(grid.map((x)=>{return([x.room,x]);})),width:14,height:8,legend:'S=Start  B=Boss'}
        //data.map= window.GenerateDng.DngGen.generate({length:5,doors:2,naming:"12_01",branches:2})
        data.Exit="DngNG_"+getTilesByVisual("entry")[0].room;// data.map.grid.entries().next().value[0];
        data.tmp={tickPass:'', tier:0
            ,inCombat:false
            ,hiding:false
        };
        data.tmp.evtLeave = { //events on tile-leave
            A1_B1: [{id:"Trap_Gas",type:'encounter',tick:window.gm.getTime(),state:0,chance:100 }, //todo cannot assign fct here because saveing
                {id:"Box",type:'encounter',tick:window.gm.getTime(),state:0,chance:100 },
                {id:"Fungus",type:'encounter',tick:window.gm.getTime(),state:0,chance:100 }],
            F4_G4: [{id:"Trap_Dehair",type:'encounter',tick:window.gm.getTime(),state:0,chance:100 }],
            I4_H4: null
        }
        data.tmp.evtEnter = { //events on tile-enter
             //F4: {sbot:{tick:window.gm.getTime(),state:0 }}
            //,H4: {gas:{tick:window.gm.getTime(),state:0 }}
        }
        data.tmp.doors = { //doors 2way
            //E4:{E5:{state:0 }},
            //G4:{G3:{state:0 },G5:{state:0 }},
            //H4:{I4:{state:0 }},
            //E5:{F5:{state:0 }},
        }
        data.tmp.mobs = [ //wandering mobs pos=current tile, path = walk area, nogo = dont enter here,
            //{id:"Ruff",mob:"Ruff",pos:"G3",path:["G3"],state:0,tick:'',att:0,timerA:0,timerB:0}
            //,{id:"SlimeG2",mob:"slime",pos:"G2",path:["G2"],state:0,hp:15,tick:'',att:0,timerA:0,timerB:0}
            //,{id:"SlimeI2",mob:"slime",pos:"I2",path:["I2"],state:0,hp:15,tick:'',att:-2,timerA:0,timerB:0}
          ];
        data.tmp.evtSpawn = { }//respawn evts 
        data.tmp.evtSpawn["DngNG_"+getTilesByVisual("mushroom")[0].room]={ mushroom:{tick:window.gm.getTime(),state:0,loot:"BrownMushroom" }};
        let _adr,_tiles=getTilesByVisual("bushes").concat(getTilesByVisual("trees")).sort(() => Math.random() - 0.5);;
        for(var i=_tiles.length-1;i>=0;i--){
            _adr="DngNG_"+_tiles[i].room;
            data.tmp.evtSpawn[_adr]=data.tmp.evtSpawn[_adr]||{};
            data.tmp.evtSpawn[_adr].lectern={tick:window.gm.getTime(),state:0};
            if(i===0) addMob("Ruff",_tiles[i].room);  
            if(i===1) addMob("Slime",_tiles[i].room);//TODO spawn generic mobs inplay
        }
        
        //addMob("Ruff","G3"),addMob("Slime","I2"),addMob("Slime","G2");
        data.task = {},data.rolledTask=[]; //active task
        data.tasks = { //task list 
        };
    }
    //override to limit how much items player can pickup
    window.story.state.chars.PlayerVR.Inv.canAddItem=function(item,count,force=false){
        let list,_count=0,_rst={OK:true,msg:"",count:count};
        if(item.hasTag(window.gm.ItemTags.Heal)){
            list=this.findItemByTag(window.gm.ItemTags.Heal);
            list.forEach(X=>{_count+=X.count();});
            _rst.count=Math.max(0,Math.min((  3  -_count),_rst.count));
            if(_rst.count<=0) {
                _rst.OK=false;
                _rst.msg=this.parent.name+" cant carry more of those healing items.";
            } else if(_rst.count<count){ 
                _rst.msg=this.parent.name+" can carry only some more of those healing items.";
            }
        }
        return(_rst);
    };
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

window.gm.simpleCombatInit=function(instance) {
    var tmp,s = window.story.state;
    tmp=s.combat.tmp={};
    tmp.inst=instance;  //start-passage "DngLT_Spider"
    tmp.now="";
    tmp.rollResult="";  //calculated roll on player choice
}
window.gm.simpleCombatCleanup=function() {
    var s = window.story.state,tmp=s.combat.tmp;

    s.combat.tmp={};
}
//overrides for Latec
window.gm.InspectSelf = function() {
    let msg="",s=window.story.state;
    if(s.DngLT.tmp.qBabble===1){ msg+= "</br>A datapad is in your possession."; }
    if(s.DngLT.tmp.qBabble===2){msg+= "</br>The babble companion is talking by an in-ear speaker to you.";}
    msg += window.gm.printBodyDescription(window.gm.player,true);
    return msg+"</br>"
}

window.gm.canOpenDoor=function(from,to) {
    let s=window.story.state,res={OK:false,msg:''};
    if(from==='E4' && to==='E5') {
        if(s.DngNG.tmp.qKeyBlue!==0) { res.OK=true; 
            s.DngNG.tmp.doors[from][to].state=1;
            res.msg= "</br>With the blue keycard in your possesion, you can open the door.";
        } else res.msg= "</br>There is a sl.";
    }
    return(res);
};
