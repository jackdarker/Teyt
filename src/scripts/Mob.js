"use strict";

class Mob extends Character {
    constructor(){
        super();
        this.level_min = 1;     
        this.baseXPReward=0;
        this.loot =[];   //[{id:'healthpotion',chance:5, amount:1}]
        this.levelUp(1);
        this.autoLeveling();
        this.despawn=false;
        this.unique=false; //true if this is a persistent character
        this.baseName=""; //name might be Slime#1 but baseName is Slime
        this.fconv = null; //lazy init because descfixer depends on gm.player
    }
    toJSON(){return window.storage.Generic_toJSON("Mob", this); }
    static fromJSON(value){ 
        var _x = window.storage.Generic_fromJSON(Mob, value.data);
        _x._relinkItems();
        return(_x);
    };
    //override to return the next move to execute
    //OK = false if no action, else true
    //msg should contain a message formatted for view (move description )g 
    //this function should decide what actions the mob takes; 
    //query _canAct to check if stunned or otherwise incapaciated
    calcCombatMove(enemys,friends){
        let rnd = _.random(1,100);
        let result = {OK:true,msg:''};
        result.action =result.target= null;
        if(rnd>80 || (rnd>20 && this.Effects.findEffect('effHesitant').length<=0)){  
            rnd = _.random(0,enemys.length-1);
            result.action = "Attack";
            result.target = [enemys[rnd]];
            //result.msg =this.name+" attacks "+ result.target[0].name+".</br>"+result.msg;
        } else {
            if(this.Skills.countItem('Guard')>0){
                result.action = "Guard";
                result.target = [this];
            }
            result.msg =this.name+" takes a defensive stance.</br>"+result.msg;
        }
        return(result);
    }
    //return false if skill should be manually selected
    get isAIenabled(){ return(true);}
    //randomize mob level around target-level but not below min-level: +-20%;
    scaleLevel(lvl){ 
        let x;
        x=Math.round(window.gm.util.randomNormal(lvl,lvl*0.2));
        x = Math.max(this.level_min,x);
        x=x-this.level;   
        if(x>0){
            this.levelUp(x);
            this.autoLeveling();
        }
        //refill gained stats 
        this.Stats.increment("health",99999); this.Stats.increment("energy",99999);this.Stats.increment("will",99999);
    };
    levelUp(add){
        super.levelUp(add);
        this.baseXPReward = this.level*20; //todo baseXP = sum of statpoints + skills ?
    }
    findInteraction(IDOther){
        return(null)
    }
}

//data separated for save/load
class AIMemoryData {
    constructor(){
        this.ST=[];   //short-time memory
        this.LT=[];   //long-term memory
        this.IT=[];   //active Interactions
        window.storage.registerConstructor(AIMemoryData);
    }
    toJSON(){return window.storage.Generic_toJSON("AIMemoryData", this); };
    static fromJSON(value){
        var _x = window.storage.Generic_fromJSON(AIMemoryData, value.data);
        return(_x);
    }
    static STentry(IDWho,IDOther){ //short-time memory
        return({
            timestamp:window.gm.getTime(), //time of interaction
            importance: 1.0,  //see updateSTmem     0.0=delete quickly, 1=normal, 2=memorize 2xtimes longer
            iDWho: IDWho , //id of character
            iDOther: IDOther ,//who they interacted with:  Player, Crow#2
            type: 0, //how they interacted:         Fight, Conversation, Watching
            scene:"",
            details: {}, //details of interaction:        who started the fight, theme of conversation   
            result: {}  //result of interaction:          defeat, aggreement
        })
    }
    static LTentry(IDWho,IDOther){   //long-term memory
        return({    //TODO for 2 chars there are 2 entrys or one?
            iDWho: IDWho , //id of character
            iDOther: IDOther ,//who they interacted with:  Player, Crow#2
            aff: 0,     //affection     -100=hates,0=neutral,100=loves
            ass: 0    //assertiveness   -100=submits, 100=dominates
        })
    }
    static IEntry(IDWho,IDOther){    //state of interaction
        return({ iDWho:IDWho,iDOther:IDOther ,
            type:0, //conversation/combat/evasion
            scene:"",
            details:{}  //conversation-dialog /      
        })
    }
    static get TYPE_COMBAT(){return(1);}
    static get TYPE_DIALOG(){return(2);}
    static get TYPE_FORCEDIALOG(){return(3);}  //scene has to point to (back-)passage; make sure not to be stuck in loop by repeating interaction !
}
//contains functions for AI-related tasks
class AIManager {
    constructor(AIMemoryData){
        this.maxSTEntrys = 10; //limit entrys per IDWho
        this.AIMemoryData = AIMemoryData;           
    }
    //appends data by replacing old one
    updateSTMem(STEntry){
        let array=this.AIMemoryData.ST, _x,_i;
        for (var i = 0; i < array.length; i++){
            _x=array[i];
            if(_x.idWho===STEntry.idWho && _x.idOther===STEntry.idOther && _x.scene==STEntry.scene) {
                _i=i; break;
            }
        }
        if(_i>=0)array[_i]=STEntry
        else array.push(STEntry)
        //if to much entrys clear out old one; 
        //for this sort entrys by timedelta and importance   dt/Math.max(0.1,importance)
    }
    updateLTMem(LTEntry){
        let array=this.AIMemoryData.LT, _x,_i;
        for (var i = 0; i < array.length; i++){
            _x=array[i];
            if(_x.idWho===LTEntry.idWho && _x.idOther===LTEntry.idOther) {
                _i=i; break;
            }
        }
        if(_i>=0)array[_i]=LTEntry
        else array.push(LTEntry)
    }
    //returns Entrys for participants
    getSTMemByIDWho(IDWho,IDOther){

    }
    //returns Entrys for participants
    getLTMemByWho(IDWho,IDOther){
        let array=this.AIMemoryData.LT, _x,_i,X=null;
        for (var i = 0; i < array.length; i++){
            _x=array[i];
            if(_x.idWho===IDWho && _x.idOther===IDOther) {
                _i=i,X=array[i]; break;
            }
        }
        if(!X) { //return valid data
            X= AIMemoryData.LTentry(IDWho,IDOther)
            updateLTMem(X); 
        }
        return(X)
    }
    //removes entrys with character ID that doesnt exist anymore
    sanitizeMem(){
        //walk table backwards and delete entrys with invalid ids

        //optional ??
        //sort the ids
        //sorted by IDWho>IDother>dt/importance
        //this.AIMemoryData.ST.sort((a,b) => {a-b});
    }
    //checks which interactable a Mob sees at its current place (other characters); 
    //returns a priorized list of options; options are filterd by interactions logged in STmem (dont repeat most recent action)  
    //
    //this uses the dungeon mob data?! 
    findInteraction(mob){
        let _mob,IDOther, IA=null;
        //priorize by Danger>Opportunity>Common
        //check personal LT-affection & faction -> isEnemy?
        
        //player around?
        //mob.pos==(window.gm.player.location.replace(window.story.state.DngSY.dng+"_",""));
        IDOther=window.gm.player.id;

        //player not busy with interaction
        let _i=this._findById(this.AIMemoryData,"IDOther",window.gm.player.id);
        if(_i<0) _i=this._findById(this.AIMemoryData,"IDWho",window.gm.player.id);
        if(_i>=0) return(IA)

        //what interaction could the mob have with player; requires a instance of the mob
        _mob=window.story.state.chars[mob.id] 
        if(!_mob) return(IA);
        IA=_mob.findInteraction(IDOther);
        if(!IA) return(IA);

        return(IA);
    }
    //starts the desired interaction
    startInteraction(IEntry,renderfct){
        let STEntry;
        //if TYPE_DIALOG offer Talk-button
        if(IEntry.type==AIMemoryData.TYPE_FORCEDIALOG){ //skip to scene; also set STMem
            STEntry=AIMemoryData.STentry(IEntry.iDWho,IEntry.iDOther);
            STEntry.type=IEntry.type,STEntry.details=IEntry.details;
            this._setInteraction(IEntry);
            this.updateSTMem(STEntry)
            //window.story.show(IEntry.scene); not working if iterating over mobs
        }
        //if TYPE_COMBAT continue combat
    }

     /* get the current interaction progress; returns null if nothing found
     */
    getInteraction(IDWho){
        let IA=this.AIMemoryData.IT.find((x)=>{return(x.IDWho===IDWho)}); 
        return(IA)
    }
    //updates/adds the interaction
    _setInteraction(IEntry){
        let _i=this._findById(this.AIMemoryData.IT,"IDWho",IEntry.IDWho);
        if(_i<0) this.AIMemoryData.IT.push(IEntry);
        else this.AIMemoryData.IT[_i]=IEntry;
    }
    abortInteraction(IDWho){

    }
    _findById(array,idname,idvalue){
        for (var i = 0; i < array.length; i++){
            if(array[i][idname]===idvalue) return(i);
        }
        return(-1);
    }
}