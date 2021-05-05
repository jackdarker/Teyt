"use strict";
/* bundles some utility operations*/

window.gm.getSaveVersion= function(){
    var version = [0,1,0];
      return(version);    
};
// reimplement to setup the game
var _origInitGame = window.gm.initGame;
window.gm.initGame= function(forceReset,NGP=null) {
  _origInitGame(forceReset,NGP);
    
    var s = window.story.state; //s in template is window.story.state from snowman!
    if (!s.vars||forceReset) { // storage of variables that doesnt fit player
        s.vars = {
        debug : 1,   //TODO set to 0 for distribution !   see debug passage for meaning
        dbgShowCombatRoll: false,
        dbgShowQuestInfo: true,
        version : window.gm.getSaveVersion(),
        log : [],
        passageStack : [], //used for passage [back] functionality
        defferedStack : [], //used for deffered events
        time : 700, //represented as hours*100 +minutes
        day : 1,
        activePlayer : 'Ratchel', //id of the character that the player controls currently
        //queststates
        qLaptop : 0,   // see passage _Laptop_
        qDogSit : 0,   // see park
        qUnlockCampus : 0,  //see passage into city
        qUnlockPark : 0,
        qUnlockMall : 0,
        qUnlockBeach : 0,
        qUnlockDowntown : 0,
        qUnlockNorthlake : 0,
        qUnlockRedlight : 0,
        qUnlockBeach : 0,
        crowBarLeft: 1,
        debugInv: new Inventory()
        }; 
        s.vars.debugInv._parent = window.gm.util.refToParent(null);
        s.vars.debugInv.addItem(new Money(),200);
    }
    
    if (!window.gm.achievements||forceReset) {  //outside of window.story !
      window.gm.achievements= {
        moleKillerGoldMedal: false //add your flags here
      }
      window.storage.loadAchivementsFromBrowser();
    }
    if (!s.enemy||forceReset) { //actual/last enemy
      s.enemy = new Character();
    }
    if (!s.combat||forceReset) { //see encounter & combat.js
      s.combat = {
        enemyParty : [],  //collection of enemy-chars involved 
        enemyIdx : 0,  //index of actual enemy 
        playerParty : [],
        playerIdx : 0,
        newTurn : false,
        enemyFirst : false, //if true, enemy moves first
        enemyTurn : false, //true if enemys turn
        state : ""  , //internal state
        playerFleeing : false,
        playerSubmitting : false,
        turnCount: 0,
        scenePic : 'assets/bg_park.png'
      }
    }
    if (!s.mom||forceReset) {
      s.mom = {
        location : "Kitchen",
        coffeeStore : 5,
        foodStore : 3,
        foodMaxStore : 4
      };
    }
    if (!s.Cyril||forceReset) {  //alternative player character
      window.gm.Cyril = new Character()
      window.gm.Cyril.name="Cyril";
      //add some basic inventory
      window.gm.Cyril.Wardrobe.addItem(new Jeans());
      window.gm.Cyril.Wardrobe.addItem(new TankShirt());
      window.gm.Cyril.Outfit.addItem(new Jeans());
      window.gm.Cyril.Outfit.addItem(new TankShirt());
      window.gm.Cyril.Stats.increment('strength',3);
      s.Cyril = window.gm.Cyril;
      //delete window.gm.Cyril; 
    }
    if (!s.Ratchel||forceReset) {  
        /*s.Ratchel = Character.defaultData(); //get default struct and add some special data
        s.Ratchel.name = 'Ratchel',
        s.Ratchel.skillPoints = 2,    //no. of free skillpoints on game-start  
        s.Ratchel.skSporty = 0,//perklevels ,name should match perkId
        s.Ratchel.skCook = 0,
        s.Ratchel.skSlacker = 0,
        s.Ratchel.skMoneymaker = 0,
        s.Ratchel.skTechy = 0;*/
        //window.gm.Ratchel = new Character(s.Ratchel);
        window.gm.Ratchel = new Character();
        window.gm.Ratchel.name="Ratchel";
        window.gm.Ratchel.gainRelation('Mom',10);
        window.gm.Ratchel.Effects.addItem(skCooking.name,new skCooking());
        //add some basic inventory
        window.gm.Ratchel.Inv.addItem(new Money(),20);
        window.gm.Ratchel.Inv.addItem(new LighterDad());
        window.gm.Ratchel.Wardrobe.addItem(new Jeans());
        window.gm.Ratchel.Wardrobe.addItem(new Leggings());
        window.gm.Ratchel.Wardrobe.addItem(new TankShirt());
        window.gm.Ratchel.Wardrobe.addItem(new Pullover());
        window.gm.Ratchel.Wardrobe.addItem(new TailRibbon());
        window.gm.Ratchel.Outfit.addItem(new VulvaHuman());
        window.gm.Ratchel.Outfit.addItem(new Jeans());
        window.gm.Ratchel.Outfit.addItem(new Pullover());
        s.Ratchel=window.gm.Ratchel;
    }      
    window.gm.switchPlayer(s.Ratchel.name); //start-player
    if(NGP) { window.story.state.vars.crowBarLeft = NGP.crowBarLeft; }
    NGP=null; //release memory
}
// lookup function for scene background
window.gm.getScenePic = function(id){
  if(id==='Garden' || id ==='Park')   return('assets/bg_park.png');
  if(id==='Bedroom' || id==='Your Bedroom')   return('assets/bg_bedroom.png');
  return('assets/bg_park.png');//todo placehodler
}
//Todo
window.gm.rollExplore= function() {
  var s=window.story.state;
  var places=[];   
  var r = _.random(0,100);
  //todo:depending of your actual location you have a chance to find connected locations or end up in a known one
  if(window.gm.player.location=='Park')   places = ['Mall','Beach','Downtown'];
  if(window.gm.player.location=='Mall')   places = ['Park','Beach','Downtown']; 
  if(window.gm.player.location=='Beach')   places = ['Park','Mall']; 
  if(window.gm.player.location=='Downtown')   {
    places.push('Pawn shop'); 
  }
  if(places.length==0) places = [window.gm.player.location]; //fallback if unspeced location
  r = _.random(1, places.length)-1; //chances are equal
  window.gm.addTime(20);
  window.story.show(places[r]);
};
window.gm.giveCyrilFood=function(){
    if(window.gm.player.Inv.countItem('SimpleFood')>0) {
        var res=window.gm.player.Inv.use('SimpleFood', window.story.state.Cyril);
        window.gm.printOutput(res.msg);
    } else {
        window.gm.printOutput("you have no food to spare");
    }
}
//print list of actions for actual day and hour
window.gm.printSchedule = function(){
  var elmt='';
  var s= window.story.state;
  var now = window.gm.getTimeStruct();

  var jobs = Object.values(window.gm.jobs);
  for(var i=0;i<jobs.length;i++) {
    var id = jobs[i].id;
    if(jobs[i].isHidden()===true) {
      //NOP;
    } else if(jobs[i].isDisabled()===true) {
      elmt +=`<div>${jobs[i].disabledReason()}</div></br>`;
    } else if(jobs[i].DoW.includes(now.DoW)&& s.vars.time>=jobs[i].startTimeMin && s.vars.time<jobs[i].startTimeMax) {
      if(window.gm.player.energy().value>=jobs[i].reqEnergy) {
        elmt +=`<a0 id='${id}' onclick='(function($event){window.story.show("${id}");})(this);'>${jobs[i].name} </a>`;
        elmt +=`</br><div>${jobs[i].descr} It might require ${(jobs[i].reqTime)} minutes of your time and around ${jobs[i].reqEnergy} energy.</div></br>`;
      } else {
        elmt +=`<div>You are to tired to do ${jobs[i].name}.</div></br>`;
      }
    } else {
      var days = "";
      for(var k=0;k<jobs[i].DoW.length;k++) {days +=window.gm.DoWs[jobs[i].DoW[k]-1]+","; }
      elmt +=`<div>${jobs[i].name} is only available between ${(jobs[i].startTimeMin/100).toFixed(0)} and ${(jobs[i].startTimeMax/100).toFixed(0)} at ${days}. </div></br>`;
    }
  }
  return(elmt);
};

//prints a list of todo quest
window.gm.printTodoList= function() {
    var elmt='<form><ul style=\"list-style-type: none\" >';
    var s= window.story.state;
    var list=['qDogSit'];
    elmt +="<li><label><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled>always: keep the fridge filled</label></li>";
    for(var i=0; i<list.length; i++) {
        var val = s.vars[list[i]];
        var msg ='';
        if(list[i]==='qDogSit') {       //todo we could use <%=> instead
        if(val<=0) {  
        } else if(val<=0x100) {
            msg = 'There was this dogsit-ad in the park. Maybe you should call there to earn some money.';
        } else if(val<=0x200) {
            msg = 'You called dogsit but didnt get a response...';
        }else if(val<=0x300) {
            msg = 'Get a task from dogsit!';
        }
        }
        if(msg!='') elmt +="<li><label><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled>"+msg+"</label></li>";
    }
        elmt +="</ul></form></br>";
        return(elmt);
};
//prints a list of quest
window.gm.printQuestList= function() {
  var elmt='<hr><form><ul style=\"list-style-type: none; padding-inline-start: 0px;\" ><legend>In progress</legend>';
  var s= window.story.state;
  
  //elmt +="<li><label><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled>always: keep the fridge filled</label></li>";
  for(var i=0; i<s.quests.activeQuests.length; i++) {
      var qId = s.quests.activeQuests[i].id;
      var flags = s.quests.activeQuests[i].flags;
      var msId = s.quests.activeQuestsMS[i].id;
      var quest = window.gm.questDef[qId];
      var mile = quest.getMileById(msId);
      if(!quest.HiddenCB()) {
        elmt +="<li style=\"padding-bottom: 0.5em;\"><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled><label>"+
          quest.name+(window.story.state.vars.dbgShowQuestInfo?(" "+msId+" 0x"+flags.toString(16)):(""))+" : "+ ((mile.HiddenCB()===true)?("???"):(mile.descr))+"</label></li>"; //checked="checked"
      }
  }
  elmt +="</ul></form></br>";
  elmt +='<hr><form><ul style=\"list-style-type: none\" ><legend>Completed</legend>';
  for(var i=0; i<s.quests.finishedQuests.length; i++) {
    var qId = s.quests.finishedQuests[i].id;
    var flags = s.quests.activeQuests[i].flags;
    var msId = s.quests.finishedQuestsMS[i].id;
    var quest = window.gm.questDef[qId];
    var mile = quest.getMileById(msId);
    if(!quest.HiddenCB()) {
      elmt +="<li><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled checked=\"checked\"><label>"+
        quest.name+(window.story.state.vars.dbgShowQuestInfo?(" "+msId+" 0x"+flags.toString(16)):(""))+" : "+ mile.descr+"</label></li>"; 
    }
}
  elmt +="</ul></form></br>";
  return(elmt);
};
//prints a list of perks for unlock
window.gm.printUnlockPerk= function(id, descr) {
    var elmt='';
    var s= window.story.state;
        if(window.gm.player[id]==0 && window.gm.player.skillPoints>0) {
            elmt +=''.concat("<a0 id='"+id+"' onclick='(function ( $event ) { unlockPerk($event.id); })(this);'>"+descr+"</a>");
        elmt +=''.concat("    [[Info|"+id+"]]");
        } else if(window.gm.player[id]>0) {
            elmt +=id+": "+descr;
        }
        elmt +=''.concat("</br>");
        return(elmt);
};

