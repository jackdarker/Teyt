"use strict";



/* bundles some utility operations*/
window.gm.getSaveVersion= function(){   return([0,1,0]); };
// reimplement to setup the game
let _origInitGame = window.gm.initGame;
window.gm.initGame= function(forceReset,NGP=null) {
  _origInitGame(forceReset,NGP);
    
    var s = window.story.state;
    s._gm.timeRL= s._gm.timeVR = s._gm.time;
    s._gm.dayRL= s._gm.dayVR = s._gm.day;
    //TODO set debug to 0 for distribution !
    s._gm.debug = 1,   
    s._gm.dbgShowCombatRoll= true,
    s._gm.dbgShowQuestInfo= true;
    if (!s.vars||forceReset) { // storage of variables that doesnt fit player
        s.vars = {
        debugInv: new Inventory(),
        inVR: false,
        playerPartyVR:[],
        playerPartyRL:[],
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
    if (!s.Cyril||forceReset) {  //
      let ch = new Character()
      ch.name=ch.id="Cyril";
      ch.faction="Player";
      //add some basic inventory
      ch.Outfit.addItem(new BaseHumanoid());
      ch.Outfit.addItem(new SkinHuman());
      ch.Outfit.addItem(new FaceHuman());
      ch.Wardrobe.addItem(new Jeans());
      ch.Wardrobe.addItem(new TankShirt());
      ch.Outfit.addItem(new Jeans());
      ch.Outfit.addItem(new TankShirt());
      ch.Stats.increment('strength',3);
      s.Cyril =window.gm.Cyril= ch;
    }
    if (!s.Carlia||forceReset) {  //the cat/dog-woman
      let ch = new Carlia()
      s.Carlia =window.gm.Carlia= ch;
    }
    if (!s.Ruff||forceReset) {  //Ruff the wolf
      let ch = new Ruff()
      s.Ruff = window.gm.Ruff=ch;
    }
    if (!s.Trent||forceReset) {  //the horse-bully from the bridge
      let ch = new Trent()
      ch.name=ch.id="Trent";
      s.Trent = window.gm.Trent = ch;
    }
    if (!s.PlayerVR||forceReset) {  
      let ch = new Character();
      ch.id="PlayerVR";
      ch.name="Zeph";
      ch.faction="Player";
      //body
      ch.Outfit.addItem(new BaseHumanoid());
      ch.Outfit.addItem(new SkinHuman());
      ch.Outfit.addItem(new FaceHuman());
      ch.Outfit.addItem(new PenisHuman());
      ch.Skills.addItem(new SkillInspect());
      s.PlayerVR=window.gm.PlayerVR= ch;
    }
    if (!s.PlayerRL||forceReset) {  
        let ch = new Character();
        ch.id="PlayerRL";
        ch.name="Ratchel";
        ch.faction="Player";
        //window.gm.PlayerVR.gainRelation('Mom',10);
        ch.Effects.addItem(skCooking.name,new skCooking());
        //add some basic inventory
        ch.Inv.addItem(new Money(),20);
        ch.Inv.addItem(new LighterDad());
        ch.Inv.addItem(new FlashBang(),2);
        ch.Inv.addItem(new CanOfCoffee(),2);
        ch.Wardrobe.addItem(new Jeans());
        ch.Wardrobe.addItem(new Sneakers());
        ch.Wardrobe.addItem(new Leggings());
        ch.Wardrobe.addItem(new TankShirt());
        ch.Wardrobe.addItem(new Pullover());
        ch.Wardrobe.addItem(new TailRibbon());
        ch.Outfit.addItem(new BaseHumanoid());
        ch.Outfit.addItem(new FaceHuman());
        ch.Outfit.addItem(new SkinHuman());
        ch.Outfit.addItem(new VulvaHuman());
        ch.Outfit.addItem(new Jeans());
        ch.Outfit.addItem(new Sneakers());
        ch.Outfit.addItem(new Pullover());
        //special skills
        ch.Effects.addItem(effNotTired.name, new effNotTired()); //depending on sleep Tired will be set to NotTired or Tired
        ch.Skills.addItem(SkillCallHelp.setup('Mole'));
        s.PlayerRL=window.gm.PlayerRL=ch;
    }      
    window.gm.switchPlayer("PlayerRL");
    //take over flags for newgameplus
    if(NGP) { window.story.state.vars.crowBarLeft = NGP.crowBarLeft; }
    NGP=null; //release memory
}
// lookup function for sidebar icon
window.gm.getSidebarPic = function(){ //todo display doll ??
  if(window.story.state.vars.inVR) {
    return("assets/icons/icon_swordspade.svg");
  }
  return('assets/icons/icon_cityskyline.svg');
}
// lookup function for scene background
window.gm.getScenePic = function(id){
  if(id==='Garden' || id ==='Park')   return('assets/bg_park.png');
  if(id==='Bedroom' || id==='Your Bedroom')   return('assets/bg_bedroom.png');
  return('assets/bg_park.png');//todo placehodler
}
window.gm.enterVR=function() {
  //todo update effects in VR but stop RL effects
  let s= window.story.state;
  s.vars.playerPartyRL = s._gm.playerParty;
  s._gm.playerParty = s.vars.playerPartyVR;
  window.gm.switchPlayer("PlayerVR");
  s.vars.inVR =true;
  //time in VR is paused when in RL
  s._gm.timeRL = s._gm.time,s._gm.dayRL = s._gm.day;
  s._gm.time = s._gm.timeVR,s._gm.day = s._gm.dayVR;
  window.gm.addTime(0);
  window.gm.respawn({keepInventory:true});
}
window.gm.leaveVR=function() {
  //todo update effects in VR but stop RL effects
  let s= window.story.state;
  s.vars.playerPartyVR = s._gm.playerParty;
  s._gm.playerParty = s.vars.playerPartyRL;
  window.gm.switchPlayer("PlayerRL");
  s.vars.inVR =false;
  //while in VR time in RL is paused but advances 1h on leave??
  s._gm.timeVR = s._gm.time,s._gm.dayVR = s._gm.day;
  s._gm.time = s._gm.timeRL,s._gm.day = s._gm.dayRL;
  window.gm.addTime(60);
}
//heal player and remove inventory {keepInventory=false,location=''}
window.gm.respawn=function(conf={keepInventory:false}) {
  window.gm.player.Stats.increment("energy",9999);
  window.gm.player.Stats.increment("health",9999);
  if(!conf.keepInventory) { //remove inentory and outfit that is not questitem, cursed or permanent
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
  if(window.gm.quests.getMilestoneState("qDiedAgain").id===2) {
    window.story.show('YouDiedOnce'); 
  } else if([100,200,300].includes(window.gm.quests.getMilestoneState("qBondageKink").id)){
      window.story.show('YouDiedWithCursedGear');
  } else {
      window.gm.player.Wardrobe.addItem(new window.storage.constructors['RobesZealot']());
      window.gm.player.Outfit.addItem(new window.storage.constructors['RobesZealot']());
      let staff = new window.storage.constructors['StaffWodden']();
      window.gm.player.Inv.addItem(staff);
      window.gm.player.Outfit.addItem(staff);
      window.story.show('ForestRespawnPodExit'); //todo what location
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
  let elmt='<hr><form><ul style=\"list-style-type: none; padding-inline-start: 0px;\" ><legend>In progress</legend>';
  let s= window.story.state;
  
  //elmt +="<li><label><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled>always: keep the fridge filled</label></li>";
  for(let i=0; i<s.quests.activeQuests.length; i++) {
      let qId = s.quests.activeQuests[i].id;
      let flags = s.quests.activeQuests[i].flags;
      let msId = s.quests.activeQuestsMS[i].id;
      let quest = window.gm.questDef[qId];
      let mile = quest.getMileById(msId);
      if(!quest.HiddenCB() || window.story.state._gm.dbgShowQuestInfo) {
        elmt +="<li style=\"padding-bottom: 0.5em;\"><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled><label>"+
          quest.name+(window.story.state._gm.dbgShowQuestInfo?(" "+msId+" 0x"+flags.toString(16)):(""))+" : "+ ((mile.HiddenCB()===true)?("???"):(mile.descr))+"</label></li>"; //checked="checked"
      }
  }
  elmt +="</ul></form></br>";
  elmt +='<hr><form><ul style=\"list-style-type: none\" ><legend>Completed</legend>';
  for(let i=0; i<s.quests.finishedQuests.length; i++) {
    let qId = s.quests.finishedQuests[i].id;
    let flags = s.quests.activeQuests[i].flags;
    let msId = s.quests.finishedQuestsMS[i].id;
    let quest = window.gm.questDef[qId];
    let mile = quest.getMileById(msId);
    if(!quest.HiddenCB() || window.story.state._gm.dbgShowQuestInfo) {
      elmt +="<li><input type=\"checkbox\" name=\"y\" value=\"x\" readonly disabled checked=\"checked\"><label>"+
        quest.name+(window.story.state._gm.dbgShowQuestInfo?(" "+msId+" 0x"+flags.toString(16)):(""))+" : "+ mile.descr+"</label></li>"; 
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

//prints a description of the chars-body
window.gm.printBodyDescription= function(whom,onlyvisible=false) {
  let msg = "";
  let conv = window.gm.util.descFixer(whom);
  let worn =whom.Outfit.getAllIds(); //todo this returns wearables & bodyparts
  // todo filter by visibility and sort the order: plae Breast & Nipple-Piercing together 
  for(el of worn) {
    msg+= whom.Outfit.getItem(el).descLong(conv);
  }
	return msg+"</br>";
};
// returns singular pronoun for the char depending on gender
window.gm.util.estimatePronoun= function(whom) {
    let isplayer = (whom.name===window.gm.player.name);
    let vulva = whom.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bVulva);
    let penis = whom.Outfit.getItemForSlot(window.gm.OutfitSlotLib.bPenis);
    //todo what if whom is a gang of imps?
    if(isplayer) {
      return('i')
    } else if(vulva && penis) {
      return('shi');
    } else if(vulva) {
      return('she');
    } else if(penis) {
      return('he');
    }
    return('it');
};
//returns a function that accept a text and fixes the word-phrases: let fixer = window.gm.util.descFixer(this.actor);msg=fixer('[I] [like] this shit.');
window.gm.util.descFixer = function(whom) {
  let pron = window.gm.util.estimatePronoun(whom);
  return(function(pron) { 
    return function(text) {
      let repl = [],br = 0, aft,bef,found;
      //search brackets like $[dff]$ $[[sdff]]$ dont find [ ] or \[ \] ; 
      //using no regex because couldnt get it get working:(!\[|[^\[])([\[]{1})(!\]|!\[|[^\[\]])+[\]]{1}([^\]]|!\])
      for(let i=text.length-1, max=text.length-1;i>=0;i-=1){ //in backward direction !
        bef= (i>0)? text[i-1]:'';
        aft= (i<max)?text[i+1]:'';
        if(text[i]===']' && aft==='$') { //opening braket
          br+=1;
          if(br>1) {  //there was already opening but no closing bracket !
            //no bracket in bracket allowed; ignore previous bracket
            br =1;
          }
          found = {end:i};
        }
        if(text[i]==='[' && bef==='$') { //opening braket
          br-=1;
          if(br<0) {  //there was already closing but no opening bracket !
            //no bracket in bracket allowed; ignore previous bracket
            br =0;
          } else {
            found.start=i;
            found.text=text.slice(found.start+1,found.end); //text within brackets
            found.start -=1,found.end +=1;  // inlude $ $
            repl.push(found);
          }
        }
      }
      for(el of repl) {//replace bracket+bracketcontent,
        el.new = window.gm.util.lookupWord(el.text,pron);
        let bef = text.substring(0,el.start), aft = text.substr(el.end+1);
        text= bef+el.new+aft;
      }
      // $[I]$ $[have]$ some rough [hair] that needs a lot combing. He has some rough...
      // c. She buys those pants. 
      // That hat [I] [wear] is ugly. That hat she wears is ugly.  
      // A dense fur covers $[my]$ body. A dense fur covers your body.  
      return(text);
    }
  }(pron))
};
// add irregular words here
window.gm.util.wordlist = function buildWordList(list) {
  //defines for each word a list to match to pronoun to replace with
  //have = [I have, you have, he/she has, we have, you have, they have ]
  list['i'] = {def:'I',i:'I',you:'you',he:'he',she:'she',shi:'shi',it:'it'};
  list['you'] = list['i']; //if you use you instead I as it would be required ...
  list['me'] = {def:'me',i:'me',you:'you',he:'him',she:'her',shi:'hir',it:'it'};
  list['my'] = {def:'my',i:'my',you:'your',he:'his',she:'her',shi:'hir',it:'its'};
  list['have'] = {def:'have',he:'has',she:'has',shi:'has',it:'has'};
  list['am'] = {def:'is',i:'am',he:'is',she:'is',shi:'is',it:'is'};
  list['them'] = {def:'them',i:'me',he:'him',she:'her',shi:'hir',it:'it'}; //I snap at them -> He snaps at me.
  return(list);
}(window.gm.util.wordlist || {});

//looks up a word in the wordlist and retourns the version fitting pronoun
window.gm.util.lookupWord = function(word,pron) {
  let output = word;
  let x = word.toLowerCase();
  let repl =window.gm.util.wordlist[x];
  if(repl) {
    output = (repl[pron])?repl[pron]:repl.def;
    if(word[0]===word[0].toUpperCase()) { //check if first letter needs to be large; 'I' is always large
      output= output[0].toUpperCase()+output.substr(1);
    }
  } else {
    if(pron==='he' || pron==='she'|| pron==='shi' ) {  
      output+='s';//wear -> wears
    }
  }
  return(output);
}