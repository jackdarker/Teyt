"use strict";
/* classes to manage a quest
 */
//todo move to class
// helper for publisher/subscriber-pattern
function PubSub() {
    return {
        events: {},
        subscribe: function (event, handler) {
            if (!this.events[event]) {
                this.events[event] = [];    
            }
            this.events[event].push(handler);
        },
        publish: function (event, data) {
            this.events[event] && this.events[event].forEach(publishData);

            function publishData(handler) {
                handler(data);   
            };
        }
    };   
}

///////////////////////////////////////////////////////////////
class QuestMilestone {
    constructor(id,name,descr,CondCheckCB) {
        this.id =id,this.name=name;
        this.hidden = (id=== ""); // Automatical hide entry
        this.descr =descr;
        this.CondCheckCB =CondCheckCB;
        /*this.EnterMilestoneCB = null; //todo use pubsub instead
        this.ExitMilestoneCB = null;*/
        window.storage.registerConstructor(QuestMilestone);
    }
    toJSON() {return window.storage.Generic_toJSON("QuestMilestone", this); };
    static fromJSON(value) {
        var _x = window.storage.Generic_fromJSON(QuestMilestone, value.data);
        return(_x);
    }
    //return value: 0 = condition nok, -1 = condition ok- quest finished, >0 condition ok & next MileID 
	evaluateCondition() {
		return(this.CondCheckCB());
	}
}
// a Quest contains multiple milestones
class Quest  { 
    constructor(id,name) {
        //this.pubSub = PubSub();
        this.id =id,this.name=name;
        this.descr ="", this.hidden = (id==="");
        this.finished = false; this.mile = null, this.miles=new Map();
        window.storage.registerConstructor(Quest);
    }
    toJSON() {return window.storage.Generic_toJSON("Quest", this); };
    static fromJSON(value) {
        var _x = window.storage.Generic_fromJSON(Quest, value.data);
        return(_x);
    }
    
    /* those are not used - see questmanager
    getCurrMile() {
        return(this.mile);
    }
    questUpdated() {
        let nodeChangeEvent = new Event("change");
        nodeChangeEvent.id = this.id;
        this.pubSub.publish("change",nodeChangeEvent)
    }
     //returns the Quest & Milestone description for Quest-Log
	getLogDescription(){
        if (this.hidden()) return("");
		var log= this.descr+"</br>";
		if(this.getCurrMile()!=null && !this.getCurrMile().hidden) log+= this.getCurrMile().descr+"</br>";
		return(log);
	}
	activateMileByID(id){
        var _mile = this.getMileById(id);
        if (_mile !== null) {
            if (this.mile != null && this.mile.ExitMilestoneCB!==null) {
                this.mile.ExitMilestoneCB();
            }
            this.mile = _mile;
            if (this.mile != null && this.mile.EnterMilestoneCB !== null) {
                this.mile.EnterMilestoneCB();
            }

            if (!this.mile.hidden) {
                this.hidden=false;
                this.questUpdated();
            }
        }
	}
	
    // check here if progress to next milestone can be made (Condition of current MS met)
    // if there is no curent MS set, this quest is not started; 
    // the condition of the MS is the EXIT-condition
    evaluateCondition(){
        if (this.finished )  return;
        var Next = -1;
		if(this.mile !== null) {
			Next = this.mile.evaluateCondition();
		} 
		if (Next === -1) {
			this.finished = true;
		}else if (Next > 0) {
			this.activateMileByID(Next);
		}
	}*/
	getMileById(ID) {
        if (this.miles.has(ID))
            return(this.miles.get(ID));
		return(null);
    }
    addMileStone(Mile) {
        if (Mile !== null) {
            this.miles.set(Mile.id,Mile);
        }
        if (this.mile === null) {
            this.mile = Mile; //automatical activate entry milestone
            this.hidden = Mile.hidden;
        }
    }
}

class QuestData {
    constructor() {
        this.activeQuests=[]; 
        this.activeQuestsMS=[];
        this.finishedQuests=[];
        this.finishedQuestsMS=[];
        window.storage.registerConstructor(QuestData);
    }
    toJSON() {return window.storage.Generic_toJSON("QuestData", this); };
    static fromJSON(value) {
        var _x = window.storage.Generic_fromJSON(QuestData, value.data);
        return(_x);
    }
}

// the Questmanager contains a list of all quests
// because of save/restore issues this contains only the IDs of the active quest and milestones; all other data is defined in questDef
// todo: this should be singleton
// todo rebuild old quest-milestone structure !!
class QuestManager {
    constructor(questDef) {
        this.pubSub = PubSub();
        this.questDef = questDef;           
    }
    setQuestData(data) {
        this.questData = data;
    }
    questUpdated(id) {
        let nodeChangeEvent = new Event("change");
        nodeChangeEvent.id = id;
        this.pubSub.publish("change",nodeChangeEvent);
        //alert(id);
    }
    //can be used to progress a active quest to next milestone if its at current milestone
    //tick will be called to check for finished or progress-condition
    forceQuestMilestone(questId,mileId, reqMileId) {
        var needsUpdate=false;
        for (var i=0; i< this.questData.activeQuests.length; i++) {
            var qID = this.questData.activeQuests[i];
            var msID = this.questData.activeQuestsMS[i];
            if(qID===questId && reqMileId===msID) {
                this.questData.activeQuestsMS[i]=mileId;
                needsUpdate =true;
            }
        }
        if(needsUpdate) this.tick();
    }
    //this will get called - sometimes - and will trigger the conditioncheck of the milestones
    tick() {
        var tickAgain = false;
        var tmpfinishedQuest =[];
        for (var i=0; i< this.questData.activeQuests.length; i++) {
            var qID = this.questData.activeQuests[i];
            var msID = this.questData.activeQuestsMS[i];
            var quest = this.questDef[qID]
            var mile = quest.getMileById(msID);
            //if (quest.finished ) continue;
            var Next = -1;
            if(mile !== null) {
                Next = mile.evaluateCondition();
            } 
            if (Next === -1) {
                tmpfinishedQuest.push(i);
            }else if (Next > 0) {
                this.questData.activeQuestsMS[i] = (Next);
                this.questUpdated(qID);
                /*todo if (!mile.hidden) {
                    //todo this.hidden=false;
                    //todo this.questUpdated();
                }*/
                tickAgain=true;
            }
        }
        //remove finished quests
        for(var k=tmpfinishedQuest.length-1;k>=0;k--) {
            var qID = this.questData.activeQuests[tmpfinishedQuest[k]];
            var msId = this.questData.activeQuestsMS[tmpfinishedQuest[k]];
            this.questData.activeQuests.splice(tmpfinishedQuest[k],1);
            this.questData.activeQuestsMS.splice(tmpfinishedQuest[k],1);
            this.questData.finishedQuests.push(qID);
            this.questData.finishedQuestsMS.push(msId);
            this.questUpdated(qID);
        }
        // sometimes not only one milestone is fullfilled but several
        // so we need to recheck again until no more progressing milestone
        // also required to remove finished quests 
        if(tickAgain) this.tick();
    }
    hasActiveQuest(questId) {
        for (var i=0; i< this.questData.activeQuests.length; i++) {
            if(questId===this.questData.activeQuests[i]) return(true);
        }
        return(false);
    }
    hasFinishedQuest(questId) {
        for (var i=0; i< this.questData.finishedQuests.length; i++) {
            if(questId===this.questData.finishedQuests[i]) return(true);
        }
        return(false);
    }
    //add & start a quest if not existent; if noRedo==false, finished quests will be restarted
	addQuest(questId,msID,noRedo=true){
        if(!noRedo) this.removeQuest(questId);//remove from finished if redoing a quest
        if(!(this.hasActiveQuest(questId) || this.hasFinishedQuest(questId))) {
            this.questData.activeQuests.push(questId);
            this.questData.activeQuestsMS.push(msID);   
        }
	}
    removeQuest(Id) {
        for (var i=this.questData.activeQuests.length-1; i>=0; i--) {
            if(this.questData.activeQuests[i]===Id) {
                this.questData.activeQuests.splice(i,1);
                this.questData.activeQuestsMS.splice(i,1);
            }
        }
        for (var i=this.questData.finishedQuests.length-1; i>=0; i--) {
            if(this.questData.finishedQuests[i]===Id) {
                this.questData.finishedQuests.splice(i,1);
                this.questData.finishedQuestsMS.splice(i,1);
            }
        }
	}
    /*getQuestCount(){
		return(this.quests.length);
	}

    getQuestById(Id){
        if (this.quests.has(Id)) {
            return(this.quests.get(Id));
        }
        return(null);
    }
    tick() {
        for (let [key, value] of this.quests.entries( )) {
            value.evaluateCondition();
          }
    }
	addQuest(quest){
        quest.pubSub.subscribe("change", this.questUpdated)
        this.quests.set(quest.id, quest);    //Todo update 
	}
    removeQuest(Id) {
        if (this.quests.has(Id)) {
            //todo quest.removeEventListener("change",this.questUpdated)
            this.quests.delete(Id);

        }
	}*/
}
