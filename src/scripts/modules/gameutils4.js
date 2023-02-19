"use strict";
//stuff for LaTec
window.gm.build_DngLT=function(){
    const _m=[
        'D1  E1  F1--G1--H1--I1--J1--K1--L1',
        '                                  ',
        'D2--E2--F2  G2--H2--I2--J2  K2--L2',
        '        |       |   |   |   |   | ',
        'D3--E3--F3--G3--H3  I3  J3  K3  L3',
        '            |       |       |     ',
        'D4--E4--F4--G4--H4--I4--J4  K4--L4',
        '    |       |                     ',
        'D5--E5--F5  G5--H5--I5--J5  K5--L5',
        '|       |   |           |         ',
        'D6  E6--F6--G6--H6--I6--J6  K6--L6'];
    function _d(dir){return({dir:dir,exp:0});}
    let grid =[
    {room:'D2', dirs:[_d('E2')]},
    {room:'E2', dirs:[_d('D2'),_d('F2')]},
    {room:'F2', dirs:[_d('E2'),_d('F3')]},
    {room:'G2', dirs:[_d('H2')]},
    {room:'H2', dirs:[_d('I2'),_d('H3')]},
    {room:'I2', dirs:[_d('I3'),_d('J2'),_d('H2')]},
    {room:'J2', dirs:[_d('I2'),_d('J3')]},
    {room:'K2', dirs:[_d('L2'),_d('K3')]},
    {room:'L2', dirs:[_d('K2'),_d('L3')]},
    {room:'D3', dirs:[_d('E3')]},
    {room:'E3', dirs:[_d('D3'),_d('F3')]},
    {room:'F3', dirs:[_d('E3'),_d('G3'),_d('F2')]},
    {room:'G3', dirs:[_d('F3'),_d('H3'),_d('G4')]},
    {room:'H3', dirs:[_d('H2'),_d('G3')]},
    {room:'I3', dirs:[_d('I4'),_d('I2')]},
    {room:'J3', dirs:[_d('J2')]},
    {room:'K3', dirs:[_d('K2'),_d('K4')]},
    {room:'L3', dirs:[_d('L2')]},
    {room:'D4', dirs:[_d('E4')]                 ,anno:['S']},
    {room:'E4', dirs:[_d('F4'),_d('D4'),_d('E5')]},
    {room:'F4', dirs:[_d('G4'),_d('E4')]},
    {room:'G4', dirs:[_d('G3'),_d('F4'),_d('H4'),_d('G5')]},
    {room:'H4', dirs:[_d('G4'),_d('I4')]},
    {room:'I4', dirs:[_d('I3'),_d('H4'),_d('J4')]},
    {room:'J4', dirs:[_d('I4'),_d('J5'),_d('K4')]    ,anno:['B']},      
    {room:'K4', dirs:[_d('L4'),_d('K3')]},
    {room:'L4', dirs:[_d('L3'),_d('K5')]    ,anno:['B']},
    {room:'D5', dirs:[_d('D6'),_d('E5')]},
    {room:'E5', dirs:[_d('F5'),_d('E4'),_d('D5')]},
    {room:'F5', dirs:[_d('E5'),_d('F6')]},
    {room:'G5', dirs:[_d('G4'),_d('G6'),_d('H5')]},
    {room:'H5', dirs:[_d('G5'),_d('I5')]},
    {room:'I5', dirs:[_d('H5'),_d('J5')]},
    {room:'J5', dirs:[_d('J6')]},
    {room:'K5', dirs:[_d('L5')]},
    {room:'L5', dirs:[_d('K5')]},
    {room:'D6', dirs:[_d('D5')]},
    {room:'E6', dirs:[_d('F6')]},
    {room:'F6', dirs:[_d('E6'),_d('F5'),_d('G6')]},
    {room:'G6', dirs:[_d('G5'),_d('F6'),_d('H6')]}, 
    {room:'H6', dirs:[_d('I6'),_d('G6')]},
    {room:'I6', dirs:[_d('H6'),_d('J6')]},
    {room:'J6', dirs:[_d('J5'),_d('I6')]},
    {room:'K6', dirs:[_d('L6')]},
    {room:'L6', dirs:[_d('K6')]}];
    let data,map={grid:grid,width:14,height:8,legend:'S=Start  B=Boss'}
    var s = window.story.state;    
    const version=1;                            // <== increment this if you change anything below - it will reinitialize data !
    if(s.DngLT && s.DngLT.version===version){
        data=s.DngLT;
    } else {
        data=s.DngLT,data.version=version;
        data.tmp={tickPass:'', tier:0
            ,passFail:0
            ,powerLevel:0
            ,doorLock:0
            ,qBabble:0
            ,qKeyBlue:0
            ,qPowRoute:0
            ,qLatex:0
        };
        data.tmp.evtLeave = { //events on tile-leave
            A1_B1: [{id:"Trap_Gas",type:'encounter',tick:window.gm.getTime(),state:0,chance:100 }, //todo cannot assign fct here because saveing
                {id:"Box",type:'encounter',tick:window.gm.getTime(),state:0,chance:100 },
                {id:"Fungus",type:'encounter',tick:window.gm.getTime(),state:0,chance:100 }],
            F4_G4: [{id:"Trap_Dehair",type:'encounter',tick:window.gm.getTime(),state:0,chance:100 }],
            I4_H4: null
        }
        data.tmp.evtEnter = { //events on tile-enter
             F4: {sbot:{tick:window.gm.getTime(),state:0 }}
            ,H4: {gas:{tick:window.gm.getTime(),state:0 }}
        }
        data.tmp.doors = { //doors 2way
            E4:{E5:{state:0 }},
            G4:{G3:{state:0 },G5:{state:0 }},
            H4:{I4:{state:0 }},
            E5:{F5:{state:0 }},
        }
        data.tmp.evtSpawn = { //respawn evts 
        }
        data.tmp.mobs = [ //wandering mobs pos=current tile
            //{id:"HornettI4",mob:"hornett",pos:"I4",path:["I4","H4","I3"],state:0,tick:'',aggro:0}
          ]
        data.task = {},data.rolledTask=[]; //active task
        data.tasks = { //task list 
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
    return({map:map,data:data});
};


class CraftMaterial extends Item {
    constructor(){ super('CraftMaterial');
        this.addTags([window.gm.ItemTags.Material]); this.price=this.basePrice=10;   
        this.style=0;this.lossOnRespawn = false;
    }
    set style(style){ 
        this._style = style; 
        if(style===0) this.id='Jlorb',this.name='Jlorb';
        else if(style===5) this.id='Shlack',this.name='Shlack';
        else if(style===10) this.id="Glib",this.name='Glib';
        else if(style===20) this.id="Gorb",this.name='Gorb';
        else if(style===30) this.id="Igent",this.name='Igent';
        else if(style===40) this.id="Remk",this.name='Remk';
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
                msg ='some strange material';
                break;
            default: throw new Error(this.id +' doesnt know '+style);
        }
        return(msg);
    }
    toJSON(){return window.storage.Generic_toJSON("CraftMaterial", this); };
    static fromJSON(value){ return window.storage.Generic_fromJSON(CraftMaterial, value.data);};
}

window.gm.ItemsLib = (function (ItemsLib){
    window.storage.registerConstructor(CraftMaterial);
ItemsLib['Jlorb'] = function(){ let x= new CraftMaterial();x.style=0;return(x);}
ItemsLib['Shlack'] = function(){ let x= new CraftMaterial();x.style=5;return(x);}
ItemsLib['Glib'] = function(){ let x= new CraftMaterial();x.style=10;return(x);}
ItemsLib['Gorb'] = function(){ let x= new CraftMaterial();x.style=20;return(x);}
ItemsLib['Igent'] = function(){ let x= new CraftMaterial();x.style=30;return(x);}
ItemsLib['Remk'] = function(){ let x= new CraftMaterial();x.style=40;return(x);}
return ItemsLib; 
}(window.gm.ItemsLib || {}));

window.gm.simpleCombatInit=function(instance) {
    var s = window.story.state;
    s.combat.tmp={};
    var tmp=s.combat.tmp;
    tmp.inst=instance;
    tmp.now="";
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
        if(s.DngLT.tmp.qKeyBlue!==0) { res.OK=true; 
            s.DngLT.tmp.doors[from][to].state=1;
            res.msg= "</br>With the blue keycard in your possesion, you can open the door.";
        } else res.msg= "</br>There is a sl.";
    }
    return(res);
};