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
}

//data separated for save/load
class AIMemoryData {
    constructor(){
        this.ST=[];   //short-time memory
        this.LT=[];   //long-term memory
        window.storage.registerConstructor(AIMemoryData);
    }
    toJSON(){return window.storage.Generic_toJSON("AIMemoryData", this); };
    static fromJSON(value){
        var _x = window.storage.Generic_fromJSON(AIMemoryData, value.data);
        return(_x);
    }
    static STentry(){
        return({
            timestamp:window.gm.getTime(), //time of interaction
            importance: 1.0,  //see updateSTmem     0.0=delete quickly, 1=normal, 2=memorize 2xtimes longer
            iDWho: "" , //id of character
            iDOther: "" ,//who they interacted with:  Player, Crow#2
            theme: "", //how they interacted:         Fight, Conversation, Watching
            details: {}, //details of interaction:        who started the fight, theme of conversation   
            result: {}  //result of interaction:          defeat, aggreement
        })
    }
    static LTentry(){
        return({    //TODO for 2 chars there are 2 entrys or one?
            iDWho: "" , //id of character
            iDOther: "" ,//who they interacted with:  Player, Crow#2
            aff: 0,     //affection     -100=hates,0=neutral,100=loves
            ass: 0    //assertiveness   -100=submits, 100=dominates
        })
    }
}
//contains functions for AI-related tasks
class AIManager {
    constructor(AIMemoryData){
        this.maxSTEntrys = 10; //limit entrys per IDWho
        this.AIMemoryData = AIMemoryData;           
    }
    //appends data by replacing old one
    updateSTMem(STentry){
        //if to much entrys clear out old one; 
        //for this sort entrys by timedelta and importance   dt/Math.max(0.1,importance)
    }
    updateLTMem(LTentry){

    }
    //returns Entrys for participants
    getSTMemByIDWho(IDWho,IDOther){

    }
    //returns Entrys for participants
    getLTMemByIDWho(IDWho,IDOther){

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
    //this uses the dungeon data to detect place?! 
    findInteraction(IDWho){
    //return{ IDOther: 
    //type: conversation/combat/evasion
    //details:  conversation-dialog / 
    //                  
    //}
        //priorize by Danger>Opportunity>Common
        //check personal LT-affection & faction -> isEnemy?
        //
    }
    //starts the desired interaction
    //does nothing if character is busy?
    startInteraction(IDWho,params){}
}