"use strict";
/* bundles some utility operations*/

window.gm.getSaveVersion= function(){   return([0,1,0]); };
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
        debugInv: new Inventory(),
        //flags for global states
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
        //VR flags todo character specific ?
        wolfKnowledge: 0,
        wolfSubmit: 0,
        wolfVictory: 0
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
      window.gm.Cyril.name=window.gm.Cyril.id="Cyril";
      window.gm.Cyril.faction="Player";
      //add some basic inventory
      window.gm.Cyril.Wardrobe.addItem(new Jeans());
      window.gm.Cyril.Wardrobe.addItem(new TankShirt());
      window.gm.Cyril.Outfit.addItem(new Jeans());
      window.gm.Cyril.Outfit.addItem(new TankShirt());
      window.gm.Cyril.Stats.increment('strength',3);
      s.Cyril = window.gm.Cyril;
      //delete window.gm.Cyril; 
    }
    if (!s.PlayerVR||forceReset) {  
      window.gm.PlayerVR = new Character();
      window.gm.PlayerVR.id="PlayerVR";
      window.gm.PlayerVR.name="Zeph";
      window.gm.PlayerVR.faction="Player";
      window.gm.PlayerVR.Effects.addItem(skCooking.name,new skCooking());
      //add some basic inventory
      window.gm.PlayerVR.Outfit.addItem(new VulvaHuman());
      window.gm.PlayerVR.Wardrobe.addItem(new RobesZealot());
      window.gm.PlayerVR.Outfit.addItem(new RobesZealot());
      window.gm.PlayerVR.Inv.addItem(new StaffWodden(),1);
      s.PlayerVR=window.gm.PlayerVR;
  }
    if (!s.PlayerRL||forceReset) {  
        window.gm.PlayerRL = new Character();
        window.gm.PlayerRL.id="PlayerRL";
        window.gm.PlayerRL.name="Ratchel";
        window.gm.PlayerRL.faction="Player";
        //window.gm.PlayerVR.gainRelation('Mom',10);
        window.gm.PlayerRL.Effects.addItem(skCooking.name,new skCooking());
        //add some basic inventory
        window.gm.PlayerRL.Inv.addItem(new Money(),20);
        window.gm.PlayerRL.Inv.addItem(new LighterDad());
        window.gm.PlayerRL.Inv.addItem(new FlashBang(),2);
        window.gm.PlayerRL.Inv.addItem(new CanOfCoffee(),2);
        window.gm.PlayerRL.Wardrobe.addItem(new Jeans());
        window.gm.PlayerRL.Wardrobe.addItem(new Sneakers());
        window.gm.PlayerRL.Wardrobe.addItem(new Leggings());
        window.gm.PlayerRL.Wardrobe.addItem(new TankShirt());
        window.gm.PlayerRL.Wardrobe.addItem(new Pullover());
        window.gm.PlayerRL.Wardrobe.addItem(new TailRibbon());
        window.gm.PlayerRL.Outfit.addItem(new VulvaHuman());
        window.gm.PlayerRL.Outfit.addItem(new Jeans());
        window.gm.PlayerRL.Outfit.addItem(new Sneakers());
        window.gm.PlayerRL.Outfit.addItem(new Pullover());
        //special skills
        window.gm.PlayerRL.Skills.addItem(SkillCallHelp.setup('Mole'));
        s.PlayerRL=window.gm.PlayerRL;
    }      
    window.gm.switchPlayer("PlayerRL");
    //take over flags for newgameplus
    if(NGP) { window.story.state.vars.crowBarLeft = NGP.crowBarLeft; }
    NGP=null; //release memory
}
// lookup function for scene background
window.gm.getScenePic = function(id){
  if(id==='Garden' || id ==='Park')   return('assets/bg_park.png');
  if(id==='Bedroom' || id==='Your Bedroom')   return('assets/bg_bedroom.png');
  return('assets/bg_park.png');//todo placehodler
}
window.gm.enterVR=function() {
  //todo update effects in VR but stop RL effects
  window.gm.switchPlayer("PlayerVR");
  window.gm.respawn(true);
}
window.gm.leaveVR=function() {
  //todo update effects in VR but stop RL effects
  window.gm.switchPlayer("PlayerRL");
}
//heal player and remove inventory
window.gm.respawn=function(keepInventory=false) {
  window.gm.player.Stats.increment("energy",9999);
  window.gm.player.Stats.increment("health",9999);
  if(!keepInventory) { //remove inentory and outfit that is not questitem, cursed or permanent
    for(let i =window.gm.player.Outfit.list.length-1;i>=0;i-=1) {
      let el = window.gm.player.Outfit.list[i];
      if(el.item && el.item.lossOnRespawn ) window.gm.player.Outfit.removeItem(el.id,true);
    }
    for(let i =window.gm.player.Wardrobe.list.length-1;i>=0;i-=1) {
      let el = window.gm.player.Wardrobe.list[0];
      if(el.item.lossOnRespawn ) window.gm.player.Wardrobe.removeItem(el.id,el.count);
    }
    for(let i =window.gm.player.Inv.list.length-1;i>=0;i-=1){
      let el = window.gm.player.Inv.list[i];
      if(el.item.lossOnRespawn ) window.gm.player.Inv.removeItem(el.id,el.count);
    }
  }
}
//sets current player location and advances time
//call this in passage header
window.gm.moveHere = function(time=10){
  if(window.gm.player.location!==window.passage.name) {
    window.gm.player.location=window.passage.name;
    window.gm.addTime(time); 
  }
};
window.gm.rollExploreCity= function() {
  let s=window.story.state;
  let places=[];   
  let r = _.random(0,100);
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
window.gm.giveCyrilFood= function(){
    if(window.gm.player.Inv.countItem('SimpleFood')>0) {
        var res=window.gm.player.Inv.use('SimpleFood', window.story.state.Cyril);
        window.gm.printOutput(res.msg);
    } else {
        window.gm.printOutput("you have no food to spare");
    }
};
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
    } else if(jobs[i].DoW.includes(now.DoW)&& s._gm.time>=jobs[i].startTimeMin && s._gm.time<jobs[i].startTimeMax) {
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

