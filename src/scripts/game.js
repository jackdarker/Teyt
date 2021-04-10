"use strict";

//var window = window || {};  //to supress lint-errors
//import * as con from "const.js";
//import {Inventory} from './inventory.js'; //already included??


window.gm = window.gm || {}; //game related operations
window.gm.getSaveVersion= function(){
  var version = [0,1,0];
    return(version);    
};

window.gm.initGame= function(forceReset,NGP=null) {
  createItemLookups();
  var toast = new Toasty();

// this show an informational message:
toast.info("Here is some information!");
    //this does not work because hidden is called to late
    /*$(window).on('sm.passage.hidden', function(event, eventObject) {
      
      if(eventObject.passage) {// No passage to hide when story starts
          console.log('hiding'+eventObject.passage.name);        
      }
    });*/
    $(window).on('sm.passage.showing', function(event, eventObject) {
        // Current Passage object
        $("tw-passage").fadeIn(500);  //fade in if was previously faded out
      console.log('showing '+eventObject.passage.name);
    });
    // Render the passage named HUD into the element todo replace with <%=%>??
    $(document).on('sm.passage.shown', function (ev,eventObject) { window.gm.updateOtherPanels();});
    
    var s = window.story.state; //s in template is window.story.state from snowman!
    if (!s.vars||forceReset) { // storage of variables that doesnt fit player
        s.vars = {
        debug : true,   //TODO set to 0 for distribution !   see debug passage for meaning
        dbgShowCombatRoll: false,
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
        qUnlockRedlight : 0,
        qUnlockBeach : 0,
        hairGrow: 0,
        crowBarLeft: 1,
        debugInv: new Inventory()
        }; 
        s.vars.debugInv._parent = window.gm.util.refToParent(null);
        s.vars.debugInv.addItem(new Money(),200);

    }
    if (!s.tmp||forceReset) { 
      // storage of temporary variables; dont use them in stacking passages or deffered events      
      s.tmp = {
        rnd : 0,  // can be used as a random variable for use in CURRENT passage
        args: []  // can be used to set arguments before another passage is called (passage-arguments) 
      }
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
        //window.gm.Ratchel.Outfit.addItem(new TailCat());
        window.gm.Ratchel.Outfit.addItem(new Jeans());
        window.gm.Ratchel.Outfit.addItem(new Pullover());
        s.Ratchel=window.gm.Ratchel;
    }      
    window.gm.switchPlayer(s.Ratchel.name); //start-player
    if(NGP) { window.story.state.vars.crowBarLeft = NGP.crowBarLeft; }
    NGP=null; //release memory
}
window.gm.switchPlayer = function(playername) {
  var s = window.story.state;
  window.gm.player= s[playername]; 
  s.vars.activePlayer = playername;
}
window.gm.rebuildObjects= function(){ //Reconnect the objects after load!  
  var s = window.story.state;
  //window.gm.Ratchel = new Character(s.Ratchel);
  //window.gm.Cyril = new Character(s.Cyril);
  window.gm.switchPlayer(s.vars.activePlayer);
}
//returns timestamp since start of game
window.gm.getTime= function() {
  return(window.story.state.vars.time+2400*window.story.state.vars.day);
}
//calculates timedifference for hhmm time format
window.gm.getDeltaTime = function(a,b){
  var m=a%100;         
  var h=((a-m)/100);
  var m2=b%100;         
  var h2=((b-m2)/100);
  return((h*60+m)-(h2*60+m2));
}
//adds MINUTES to time
window.gm.addTime= function(min) {
  var v=window.story.state.vars;
  var m=v.time%100;         
  var h=((v.time-m)/100);
  m= m+min;
  var m2 = m%60;
  var h2 = h+(m-m2)/60;
  window.story.state.vars.time = (h2*100+m2%60);
  while(window.story.state.vars.time>=2400) {
    window.story.state.vars.time -= 2400;
    window.story.state.vars.day += 1;
  }
  window.gm.player.Effects.updateTime();
};
window.gm.getTimeString= function() {
  var c=window.gm.getTimeStruct();
  return (c.hour<10?"0":"")+c.hour.toString()+":"+(c.min<10?"0":"")+c.min.toString()+"("+c.daytime+")";
};
// DoW = DayOfWeek  7 = Sunday, 1 = Monday,...6 = Saturday 
window.gm.getTimeStruct=function() {
  var v=window.story.state.vars;
  var m=v.time%100;
  var h=((v.time-m)/100);
  var daytime = '';
  if(v.time>500 && v.time<1000) {
    daytime = 'morning';
  } else if(v.time>=1000 && v.time<1400) {
    daytime = 'noon';
  } else if(v.time>=1400 && v.time<1800) {
    daytime = 'afternoon';
  } else if(v.time>=1800 && v.time<2200) {
    daytime = 'evening';
  } else {
    daytime = 'night';
  }
  var DoW = window.story.state.vars.day%7;
  return({'hour':h,'min':m, 'daytime': daytime, 'DoW':DoW});
};

window.gm.getDateString= function() {
  var v=window.story.state.vars;
  const DoW=['Monday', 'Tuesday','Wednesday','Thursday','Friday','Saturday','Sunday'];
  return v.day.toString()+". day "+ DoW[(v.day%7)-1];
};
//forward time to until (1025 = 10:25), regenerate player
//warning dont write 0700 because this would be take as octal number
window.gm.sleep=function(until) {
  var v=window.story.state.vars;
  var msg='';
  var m=v.time%100;
  var h=((v.time-m)/100);
  var m2=until%100;
  var h2=((until-m)/100);
  var min = (h2-h)*60+(m2-m);
  //if now is 8:00 and until 10:00 we assume you want to sleep 2h and not 2+24h
  //if now is 10:00 and until is 9:00 we assume sleep for 23h
  if(until<v.time) {
    min = 24*60-(h-h2)*60+(m-m2);
  }
  if(min===0) { //if sleep from 700 to 700, its a day
    min=24*60;
  }
  msg+="</br>Slept for "+min/60+" hours.</br>";
  window.gm.addTime(min);
  var regen = min>420 ? 999 : min/60*15;  //todo scaling of regeneration
  window.gm.player.Stats.increment('health',regen);
  window.gm.player.Stats.increment('energy',regen);
  window.gm.pushLog(msg);
  return(msg);
};

//Todo
window.gm.rollExplore= function() {
  var s=window.story.state;
  var places=[];   
  var r = _.random(0,100);
  //todo:depending of your actual location you have a chance to find connected locations or end up in a known one
  if(window.gm.player.location=='Park')   places = ['Mall','Beach'];
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
window.gm.newGamePlus = function() {
  var NGP = { //be mindful if adding complex objects to NGP, they might not work as expected ! simple types are ok 
    crowBarLeft: window.story.state.vars.crowBarLeft
    }
  window.gm.initGame(true,NGP);
  window.story.show('Home');
};
//---------------------------------------------------------------------------------
//TODO Deferred Event is incomplete
//maybe you sometimes dont want to trigger an event immediatly, 
//f.e. if you send a email, it might take some time until you get a response-email 
//(you can receive email at anytime on your phone, so we would have to add checks on ALL passages)
//use this function to push a passage to a stack of deffered events; 
//the passage will trigger under the given condition: minimum time, location-tag, at a certain time-window
//the passage will show when a new passage is requested and will be removed from stack
//if this passage is already pushed, only its condition will be updated
window.gm.pushDeferredEvent=function(id) {
  var cond1 = {waitTime: 6,
              locationTags: ['Home','City'],      //Never trigger in Combat
              dayTime: [1100,600]
            },
      cond2 = { waitTime: 60,
                locationTags: ['Letterbox'],
      };

  var cond = [cond1,cond2]; //passage is executed if any of the conds is met
  window.story.state.vars.defferedStack.push({id:id,cond:cond});
};
window.gm.removeDefferedEvent=function(id=""){
  if(id!=="") {
    for(var i=window.story.state.vars.defferedStack.length-1;i>0;i--) {
      if(window.story.state.vars.defferedStack[i].id===id) 
      window.story.state.vars.defferedStack.splice(i,1);
    }
  }else {
    window.story.state.vars.defferedStack = [];
  }
}
window.gm.hasDeferredEvent = function(id="") {
  if(id!=="") {
    for(var i=0;i<window.story.state.vars.defferedStack.length;i++) {
      if(window.story.state.vars.defferedStack[i].id===id) return(true);
    }
    return(false);
  } else {
    return(window.story.state.vars.defferedStack.length>0);
  }
}
window.gm.showDeferredEvent= function() {
  var msg = '';

  var namenext = window.passage.name;
  var tagsnext = window.story.passage(namenext).tags;
  var evt = window.story.state.vars.defferedStack.shift();
  if(evt!==null) {
    msg += window.gm.printPassageLink("Next",evt.id);
  }
  return msg;
}
//when show is called the previous passage is stored if the new has [_back]-tag
//if the new has no back-tag, the stack gets cleared
window.gm.pushPassage=function(id) {
  if(!window.story.state.hasOwnProperty("vars")) return;  //vars exist only after initGame
  if(window.story.state.vars.passageStack.length>0 && window.story.state.vars.passageStack[window.story.state.vars.passageStack.length-1]===id){
    //already pushed
  } else {
    window.story.state.vars.passageStack.push(id);
  }
};
//call on [_back]-passages to get the previous passage
window.gm.popPassage=function() {
    var pass = window.story.state.vars.passageStack.pop();
    if(!pass) return('nothing to pop from stack');
    return(pass);
};
//overriding show:
//- to enable back-link
//- to intercept with deffered events
var _origStoryShow = window.story.__proto__.show;
window.story.__proto__.show = function(idOrName, noHistory = false) {
  var next = idOrName;
  if(idOrName === '_back') { //going back
    next = window.gm.popPassage();
  } else {  //going forward
    var tagsnext = window.story.passage(next).tags;
    var namenext = window.story.passage(next).name;
    if(tagsnext.indexOf('_back')>=0 ) { //push on stack but only if not re-showing itself
      if(namenext!=window.passage.name) window.gm.pushPassage(window.passage.name); 
    } else if(window.story.state.hasOwnProperty("vars")) {
      window.story.state.vars.passageStack.splice(0,window.story.state.vars.passageStack.length);
    }
}
  //Todo
  //before entering a new passage check if there is a defferedEvent that we should do first
  //if so, push the normal-passage onto stack, show deffered passage
  //after the deffered passage(s) finish, make sure to show the original passage
  //this is a problem?how do I know the deffered passage is done? 
  _origStoryShow.call(window.story,next, noHistory);
};
//---------------------------------------------------------------------------------