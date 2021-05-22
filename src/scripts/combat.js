"use strict";
/* bundles some operations related to combat */
window.gm = window.gm || {};
window.gm.combat = window.gm.combat || {};


class CombatSetup {
  constructor() {
    this.EnemyFirst=false;
    this.EnemyFunc = null;  //a ctor of Mob
    this.Location = ''  //your actual location-name
    this.scenePic = ''  //bg-image to use
    this.onDefeat = null;
    this.onVictory = null;
    this.onFlee = null;
    this.onSubmit = null;
  }
  onSubmit() {
    return('You submitted completely.</br>'+ window.gm.printPassageLink('GameOver','GameOver'));
  }
  //setup encounter; this calls the Encounter-passage !
initCombat() {
  var s=window.story.state;
  s.combat.enemyParty = this.EnemyFunc();
  s.combat.playerParty = [];
  for(var el of s._gm.playerParty) {
    s.combat.playerParty.push(s[el]);
  }
  s.combat.turnStack = [];
  s.combat.actor = s.combat.target = s.combat.action = null;
  s.combat.location = this.location;
  s.combat.scenePic = this.scenePic;
  s.combat.playerFleeing = false;
  s.combat.playerSubmitting = false;
  s.combat.inCombat=true;
  s.combat.enemyFirst= this.EnemyFirst;
  s.combat.turnCount=0;
  this.next=this.battleInit;
  this.msg='';
  window.story.show("Encounter");
}

hideCombatOption() {
  document.querySelector("#choice").remove();
}
//creates a list of active effects for combat display
printCombatEffects(char) {
  let list=[];
  if(char.isDead()) { //if char is dead print this instead other effects; effects also get not updated when dead??
    list.push('knocked out');
  } else {
    let effects = char.Effects.getAllIds();
    for(let i=0; i<effects.length; i++) {
      let effect = char.Effects.get(effects[i]);
      if(effect.onCombatEnd!==null && effect.onCombatEnd!==undefined) {
        list.push(effect.shortDesc);
      }
    }
  }
  return(list.reduce((sum, current) => sum + current +', ', ''));
}
//prints a table with all player/enemy data
printStats() {
  let s=window.story.state;
  let players = (s.combat.playerParty);
  let enemys = (s.combat.enemyParty);
  /*
              Health  Arousal Effects         Health  Arousal Effects
      player1 10/20   10/20 Stunned     Ork1  10/10   10/10
      player2 50/100  10/20             Ork2  20/20   10/100
  */
 let elmt = '<table id=\"combatstats\"><tbody>';
  elmt += "<tr><th>   </th><th>Player</th><th>Health</th><th>Arousal</th><th>Effects</th><th>   </th><th>Enemys</th><th>Health</th><th>Arousal</th><th>Effects</th>";
  for(let i=0;(i<players.length || i<enemys.length);i++) {
    elmt += "<tr>";
    if(i<players.length) {
      elmt += "<td>" + (s.combat.actor && s.combat.actor.name==players[i].name?">>": "")+ "</td><td>"+players[i].name+"</td><td>"+players[i].health().value.toString()+'/'+players[i].health().max.toString()+"</td><td>"+players[i].Stats.get("arousal").value.toString()+'/'+players[i].Stats.get("arousalMax").value.toString()+"</td><td style=\"font-size:smaller\">"+window.gm.Encounter.printCombatEffects(players[i])+"</td>";
    } else {
      elmt += "<tr><td></td><td></td><td></td><td></td><td></td>";
    }
    if(i<enemys.length) {
      elmt += "<td>" + (s.combat.actor==enemys[i]?">>>": "")+ "</td><td>"+enemys[i].name+"</td><td>"+enemys[i].health().value.toString()+'/'+enemys[i].health().max.toString()+"</td><td>"+enemys[i].Stats.get("arousal").value.toString()+'/'+enemys[i].Stats.get("arousalMax").value.toString()+"</td><td style=\"font-size:smaller\">"+window.gm.Encounter.printCombatEffects(enemys[i])+"</td>";
    } else {
      elmt += "<tr><td></td><td></td><td></td><td></td><td></td>";
    }
  }
  elmt +='</tbody></table>'
  return(elmt);
}
//creates buttons for skills of current actor
printSkillList() {
  var s = window.story.state;
  var canAct = s.combat.actor._canAct();
  if(canAct.OK===true) {
    var skillIds = s.combat.actor.Skills.getAllIds();
    for(var i=0; i<skillIds.length;i++) {
      var entry = document.createElement('a');
      entry.href='javascript:void(0)';
      entry.addEventListener("click",(function(me,target){ 
        return(window.gm.Encounter._postSkillSelect.bind(me,target));}(this,skillIds[i])));
      entry.textContent=s.combat.actor.Skills.getItem(skillIds[i]).name;
      //entry.disabled=this.buttons[y*5+x].disabled;
      $("div#choice")[0].appendChild(entry);      // <- requires this node in html
    }
  } else {  //cannot do a thing
    var entry = document.createElement('p');
    entry.textContent=canAct.msg;
    $("div#choice")[0].appendChild(entry);
  }
  var entry = document.createElement('a');
  entry.href='javascript:void(0)';
  entry.addEventListener('click',(function(me){return(window.gm.Encounter._postSkillAbort.bind(me));}(this)));
  entry.textContent="Do nothing";
  $("div#choice")[0].appendChild(entry);
}
_postSkillAbort(){
  window.story.state.combat.action=null;
  window.gm.Encounter.next=window.gm.Encounter.checkDefeat;
  window.story.show('EncounterStartTurn');
}
_postSkillSelect(id){
  window.story.state.combat.action=id;
  if(id==='UseItem') {
    window.gm.Encounter.next=window.gm.Encounter.selectItem;
  } else {
    window.gm.Encounter.next=window.gm.Encounter.selectTarget;
  }
  window.story.show('EncounterStartTurn');
}
printTargetList() {
  var s = window.story.state;
  var skill = s.combat.actor.Skills.getItem(s.combat.action);
  var all = s.combat.playerParty.concat(s.combat.enemyParty);
  var targets = [];
  for( el of all) {
    targets.push([el]); //need [[],[]]
  }
  targets = skill.targetFilter(targets);
  for(var i=0; i<targets.length;i++) {
    var entry = document.createElement('a');
    entry.href='javascript:void(0)';
    entry.addEventListener("click",(function(me,target){ 
      return(window.gm.Encounter._postTargetSelect.bind(me,target));}(this,targets[i])));
    //if single-target, use name from mob, for multitarget we expect a name attribute to the list
    entry.textContent=(targets[i].length>1)?targets[i].name:targets[i][0].name;
    //entry.disabled=this.buttons[y*5+x].disabled;
    $("div#choice")[0].appendChild(entry);      // <- requires this node in html
  }
  var entry = document.createElement('a');
  entry.href='javascript:void(0)';
  entry.addEventListener('click',(function(me){return(window.gm.Encounter._postTargetAbort.bind(me));}(this)));
  entry.textContent="back";
  $("div#choice")[0].appendChild(entry);
}
_postTargetAbort(){
  window.story.state.combat.action=null;
  window.gm.Encounter.next=window.gm.Encounter.selectMove;
  window.story.show('EncounterStartTurn');
}
_postTargetSelect(target){
  this.hideCombatOption();
  window.story.state.combat.target = target;//(target.length)? target : [target] ;
  window.gm.Encounter.next=window.gm.Encounter.execMove;
  window.story.show('EncounterStartTurn');
}
printItemList() {
  let s = window.story.state;
  let inv = s.combat.actor.Inv;
  let maxSlots = inv.count(); 
  for(var i=0;i<maxSlots;i++){
    let id=inv.getItemId(i);
    let _count =inv.countItem(id);
    //if(useOn===null) useOn=s.combat.actor;
    let useable = inv.usable(id);
    if(_count>0 && useable.OK) {
      let entry = document.createElement('a');
      entry.href='javascript:void(0)';
      let foo = (function(id,carrier){ 
        this._postItemSelect(id);
        //let _res=carrier.Inv.use(id); window.gm.refreshScreen();window.gm.printOutput(_res.msg);
      }).bind(this,id);
      entry.addEventListener("click",foo);
      entry.textContent=id;
      $("div#choice")[0].appendChild(entry);      // <- requires this node in html
    }
  }
  let entry = document.createElement('a');
  entry.href='javascript:void(0)';
  entry.addEventListener('click',(function(me){return(window.gm.Encounter._postTargetAbort.bind(me));}(this)));
  entry.textContent="back";
  $("div#choice")[0].appendChild(entry);
}
_postItemSelect(id){
  let s = window.story.state;
  this.hideCombatOption();
  s.combat.actor.Skills.getItem(s.combat.action).item=id;
  window.gm.Encounter.next=window.gm.Encounter.selectTarget;
  window.story.show('EncounterStartTurn');
}
//if switching to Status panel and back this will redraw screen and call this this.next; to avoid this set next only in clickhandler 
printNextLink(nextState,label="Next") {
  let entry = document.createElement('a');
  entry.href='javascript:void(0)';
  entry.addEventListener('click',(function(me,nextState)
  {return(function() {
    window.gm.Encounter.next=nextState;
    window.story.show('EncounterStartTurn');
  });
  }(this,nextState)));
  entry.textContent=label;
  $("div#choice2")[0].appendChild(entry);
}
//executes a combat-cmd for player/enemy
execCombatCmd(move) { 
  var s = window.story.state;
  var result = move(s.combat.actor,s.combat.target);
  /*s.combat.enemyTurn =!s.combat.enemyTurn;  //toggle whos turn
  if(!(s.combat.enemyTurn ^ s.combat.enemyFirst)) s.combat.newTurn = false;
  */
  return(result);
}
startRound() {
  var s = window.story.state;
  s.combat.turnCount+=1;

  var list = s.combat.allChars = s.combat.enemyParty.concat(s.combat.playerParty);
  //update combateffects
  for(var k=0; k<list.length;k++){
    var effects = list[k].Effects.getAllIds();
    for(var i=0; i<effects.length; i++) {
      var effect = list[k].Effects.get(effects[i]);
      if(effect.onCombatEnd!==null && effect.onCombatEnd!==undefined) {  //typeof effect === CombatEffect doesnt work? so we check presencse of attribut
        effect.onTurnStart();
      }
    }
  }
}
endCombat(){
  var s = window.story.state;
  s.combat.inCombat=false;
//remove combateffects
  var list = s.combat.enemyParty.concat(s.combat.playerParty);
  for(var k=0; k<list.length;k++){
    var effects = list[k].Effects.getAllIds();
    for(var i=0; i<effects.length; i++) {
      var effect = list[k].Effects.get(effects[i]);
      if(effect.onCombatEnd!==null && effect.onCombatEnd!==undefined) {
        effect.onCombatEnd();
      }
    }
  }
}
isAllDefeated(party) {
  for(var i=0;i<party.length;i++) {
    if(!party[i].isDead()) return(false);
  }
  return(true);
}
calcTurnOrder(){
  var s = window.story.state;
  //todo sort by agility
  //todo turnorder can be intermixed?
  if( s.combat.enemyFirst) {
    s.combat.turnStack = s.combat.enemyParty.concat(s.combat.playerParty);
  } else {
    s.combat.turnStack = s.combat.playerParty.concat(s.combat.enemyParty);
  }
}
/////////////////////  State Machine /////////////////////
//
battleInit() {
  var result = {OK:false, msg:''};
  this.next=this.preTurn;
  return(result);
};

preTurn() {
  var result = {OK:false, msg:''};
  var s = window.story.state;
  s.combat.turnCount+=1;
  
  var list = s.combat.enemyParty.concat(s.combat.playerParty);
  //update combateffects
  for(var k=list.length-1; k>=0;k--){
    if(list[k].isDead()) {
      continue;
    }
    var effects = list[k].Effects.getAllIds();
    for(var i=0; i<effects.length; i++) {
      var effect = list[k].Effects.get(effects[i]);
      if(effect.onCombatEnd!==null && effect.onCombatEnd!==undefined) {  //typeof effect === CombatEffect doesnt work? so we check presencse of attribut
        effect.onTurnStart();
      }
    }
  }
  //calculate turnorder
  this.calcTurnOrder();
  this.next=this.checkDefeat;
  return(result);
}
checkDefeat() { //check if party is defeated
  let result = {OK:false, msg:''}; 
  this.msg = '';
  var s = window.story.state;
  if(s.combat.playerFleeing===true) { 
    this.next=this.postBattle;
    return(result); 
  } else if(s.combat.playerSubmitting===true) {
    this.next=this.postBattle;
    return(result);  
  } else if(this.isAllDefeated(s.combat.enemyParty)) {
    this.next=this.postBattle;
    return(result);
  } else if(this.isAllDefeated(s.combat.playerParty)) {
    this.next=this.postBattle;
    return(result);
  }
  this.next=this.selectChar;
  return(result);
}
selectChar() { 
  var s = window.story.state;
  var result = {OK:false, msg:''};
  if(s.combat.turnStack.length>0) {
    //switch to next char
    s.combat.actor= s.combat.turnStack.shift();
    //actual move = 0
    s.combat.action = null;
    this.next=this.selectMove;
  } else {
  //next turn after all done
  this.next=this.preTurn;
  }
  return(result);
}

selectMove() {
  let s = window.story.state;
  let result = {OK:false, msg:''};
  if(s.combat.actor.isDead())  { //skip char if already dead
    this.next=this.selectChar;
    return(result);
  }
  let canAct = s.combat.actor._canAct();
  if(canAct.OK===false) { //skip char if not dead but incapaciated and show msg
    result.msg = canAct.msg;
    this.next=this.checkDefeat;
    return(result);
  } else {
    if(s.combat.actor.calcCombatMove) { //selected by AI
      result = s.combat.actor.calcCombatMove(window.story.state.combat.playerParty,window.story.state.combat.enemyParty);
      window.story.state.combat.action=result.action;
      window.story.state.combat.target=result.target;
      //continue with execMove but memorize the moveselection message for display
            //this.printNextLink(this.execMove) 
      this.next=this.execMove; 
      this.msg=result.msg;
      result.OK=false;
    } else {
      this.printSkillList();
      result.OK=true, result.msg="Choose your action !";//
    }
  }
  return(result);
}
selectItem() {  //select Item from Inventory
  var s = window.story.state;
  var result = {OK:false, msg:''};
  this.printItemList();
  result.OK=true,result.msg = "Choose item";
  return(result);
}
selectTarget() {  //select target for choosen action
  var s = window.story.state;
  var result = {OK:false, msg:''};
  this.printTargetList();
  result.OK=true,result.msg = "Choose target";
  return(result);
}
execMove(){
  var result = {OK:false, msg:''};
  var s = window.story.state;
  //apply move; AI might not found a possible action
  if(s.combat.action!==null && s.combat.action!=='') {
    result.msg=s.combat.actor.Skills.getItem(s.combat.action).cast(s.combat.target).msg;
  }
  result.OK = true;
  this.printNextLink(this.checkDefeat);//this.next=this.checkDefeat; result.msg+=window.gm.printPassageLink("Next","EncounterStartTurn");
  return(result);
}
postBattle() {
  this.next = null;  //terminate SM
  var s=window.story.state;
  var result = {OK:false, msg:''};
  //check if battle done...
  if(s.combat.playerFleeing===true) { 
    result.OK=true;
    result.msg = 'You sucessfully escaped '+"</br>";
    result.msg += window.gm.printPassageLink('Next',window.gm.player.location);
  } else if(s.combat.playerSubmitting===true) {  
    result.OK=true;
    result.msg = this.onSubmit();
  } else if(this.isAllDefeated(s.combat.enemyParty)) {
    result.OK=true;
    result.msg = 'You defeated the enemy'+"</br>";
    result.msg += window.gm.printPassageLink('Next',window.gm.player.location);
  } else if(this.isAllDefeated(s.combat.playerParty)) {
    result.OK=true;
    result.msg = 'You got defeated by the enemy'+"</br>";
    result.msg += window.gm.printPassageLink('Next',window.gm.player.location);
  }
  this.endCombat();
  return(result);
}
//this runs the statemachine and is triggered by user input
battle() {
  var result = {OK:false, msg:''};
  while(this.next!==null && !result.OK) {
    //if result =true; user input required
    result =this.next();
    if(result.OK) {
      result.msg = this.msg+result.msg;
      return(result);
    }
  }
  return(result);
};

}
//returns true if in combat
window.gm.combat.inCombat = function() {
  return(window.story.state.combat.inCombat);
}
//calculates if target can evade the attack 
/*requires minimum Poise
Evasion depends on Agility & Endurance:
- mallus for heavy armor & weapon
- mallus for Effects like Prone, Frozen
- bonus for Skills: Flying, Dancer
Stunned/Bound Chars can not evade */
// on evasion returns false and a message
window.gm.combat.calcEvasion=function(attacker,target, attack) {
  var result = {OK:true,msg:''}
  var rnd = window.gm.roll(1,100);

  if(target.Effects.findItemSlot(effStunned.name)>=0) {
    result.OK = true; 
    result.msg = target.name+' is stunned and cannot evade. '
    attack.crit = true; //when stunned always critical hit
    return(result);
  }

  var lvlDiff = target.level-attacker.level;
  var chance = target.Stats.get("agility").value + target.Stats.get("endurance").value;
  chance += lvlDiff*4;
  window.gm.pushLog(`evasion roll:${chance} vs ${rnd} `,window.story.state.vars.dbgShowCombatRoll);
  if(chance>rnd) {
    result.OK = false;
    result.msg += 'Using agility, '+ target.name +' was able to dodge the attack. '
  }
  return(result);
}
/*If evasion-roll fails, their is a chance that parry is rolled:
- consumes some poise
- parry only works for weapon of similiar size: a Zweihänder is to slow to parry a saber, a dagger is to light to deflect a club
- requires minimum weapon-skill (f.e. projectile deflection )
otherwise continue chain
parry-result depends on agility+perception
- bonus for skills
- bonus for some weapons
on critical fail- full damage, poise damage
on fail - full damage
on success no damage is taken (might consume weapon-stability)
if a critical is rolled, 50% of the attackers damage is reflected to him*/
window.gm.combat.calcParry=function(attacker,target, attack) {
  var result = {OK:true,msg:'',foo:null}
  var rnd = _.random(1,100);

  if(target.Effects.findItemSlot(effStunned.name)>=0) {
    result.OK = true; 
    result.msg = target.name+' is stunned and cannot parry or block. '
    attack.crit = true; //when stunned always critical hit
    return(result);
  }

  var lvlDiff = target.level-attacker.level;
  var chance = target.Stats.get("agility").value + target.Stats.get("perception").value;
  chance += lvlDiff*4;
  window.gm.pushLog(`parry roll:${chance} vs ${rnd} `,window.story.state.vars.dbgShowCombatRoll);
  if(chance>rnd && rnd<10) {
    result.OK = false;
    if(rnd<10) {
      result.msg = target.name +' parried the attack and was even able to land a hit.'  //todo how to add textual variation based on used weapon and skill?
      // foo should reflect fraction of attack back to attacker
      attack.effects.push( {target:attacker,eff:([new effDamage(0.5*attack.value)])});
      //result.foo = function(attacker,attack){ return(function(attacker,attack){ attacker.Stats.increment('health',-0.5*attack.value);});}(attacker,attack);
    } else {
      result.msg = target.name +' parried the attack.'
    }
  } else {
    result.OK = true;
    if(rnd>90) {
      attack.crit = true;
    }
  }
  return(result);
}
/*if all else failed you have to absorb the hit:
DR = sum of armor (with individual skill-bonus) + magic armor
attack = weapon damage formula + weakness-bonus
attack increases on critical
hp-dmg = attack -DR but min.1 */
window.gm.combat.calcAbsorb=function(attacker,defender, attack) {
  let result = {OK:true,msg:'',foo:null}
  let rnd = _.random(1,100);
  let def = defender.Stats.get('pDefense').value;
  //todo weakness bonus
  var dmg = Math.max(1,attack.value* (attack.crit?4:1)-def);
  window.gm.pushLog(`absorb roll:${dmg} vs ${def} `,window.story.state.vars.dbgShowCombatRoll);
  result.msg = defender.name +' got hit by '+attacker.name+' and suffered '+dmg+ (attack.crit?' critical ':'')+'damage. '
  attack.total = dmg;
  //foo should add fraction of attack to defender-health
  attack.effects.push( {target:defender,eff:[(new effDamage(attack.total))]});
  //result.foo = function(defender,attack){ return(function(){ defender.Stats.increment('health',-1*attack.total);});}(defender,attack);
  return(result);
}
//object to store attack-data
window.gm.combat.defaultAttackData = function() {
  return({value:0,total:0,crit:false,effects:[]}); 
}
// calculates the damage of an attack and applies it
window.gm.combat.calcAttack=function(attacker,defender,attack) {
  let result = {OK:false,msg:''};
  //var def = defender.Stats.get('pDefense').value;
  let att = attacker.Stats.get('pAttack').value;
  attack.value=att,attack.total=att; 
  //check if target an evade
  result = window.gm.combat.calcEvasion(attacker,defender,attack);
  if(result.OK===false) { return(result);  }
  var _tmp = result.msg;
  //check if target can block or parry
  result = window.gm.combat.calcParry(attacker,defender,attack);  //todo or block
  //if(result.foo!==null) result.foo(attacker,attack);
  if(result.OK===false) {    return(result);  }
  _tmp += result.msg;
  //deal damage
  result = window.gm.combat.calcAbsorb(attacker,defender,attack);
  //if(result.foo!==null) result.foo(defender,attack);
  _tmp += result.msg;
  result.msg = _tmp;
  return(result);
}
/////////////////////////////////////////////////////////////
/*  generic combat moves */
//used to skip turn
window.gm.combat.moveNOP = function(actor,target) { 
  var result= {OK:false,msg:''};
  return(result);
}
//increase defense
window.gm.combat.moveGuard = function(actor,target) { 
  //Todo
  var s = window.story.state;
  var result= {OK:true,msg:''};
  return(result);
}
//stun caused by blunt weapon, shock
window.gm.combat.moveStun = function(actor,target) { 
  var s = window.story.state;
  var attacker = actor;//s.combat.enemyTurn ? window.story.state.enemy  :window.gm.player;
  var defender = target;//s.combat.enemyTurn ? window.gm.player :window.story.state.enemy;
  var result= {OK:true,msg:''};
  var rnd = _.random(1,100);
  if(rnd >4) {
    result.msg += defender.name+" got stunned by "+attacker.name;
    defender.addEffect(effStunned.name,new effStunned())
  } else {
    result.msg += "Attempt to stun "+defender.name +" failed.";
    result.OK=false;
  }
  return(result);
}
window.gm.combat.moveFlee = function(actor,target) { 
  //Todo
  var s = window.story.state;
  var result= {OK:true,msg:''};
  var rnd = _.random(1,100);
    if(rnd >40) { //Todo fleeing chance calculation
      result.msg += "You escaped the fight.";
      s.combat.playerFleeing = true;  //just setting the flag, you have to take care of handling!
    } else {
      result.msg += "Your attempts to escape failed.";
      result.OK=false;
    }
  return(result);
}
window.gm.combat.moveSubmit = function(actor,target) { 
  var s = window.story.state;
  var result= {OK:true,msg:''};
  var rnd = _.random(1,100);
    if(rnd >0) { //Todo fleeing chance calculation
      result.msg += "You submit to your foe.";
      s.combat.playerSubmitting = true;  //just setting the flag, you have to take care of handling!
    } else {
      result.msg += "Your attempts to submit failed.";
      result.OK=false;
    }
  return(result);
}
//calculates damage of attack
window.gm.combat.movePhysicalAttack = function(actor,target) { 
  var s = window.story.state;
  var skill = new SkillAttack(actor);
  skill.cast([target]);
  return({OK:true,msg:'dealt some damage'});

  var attacker = actor;//s.combat.enemyTurn ? window.story.state.enemy  :window.gm.player;
  var defender = target;//s.combat.enemyTurn ? window.gm.player :window.story.state.enemy;
  var def = defender.Stats.get('pDefense').value;
  var att = attacker.Stats.get('pAttack').value;
  var result = window.gm.combat.calcAttack(attacker,defender,{value:att,total:att});
  return({OK:result.OK,msg:result.msg});
}
window.gm.combat.moveUltraKill = function(actor,target) { 
  var s = window.story.state;
  var attacker = actor;//s.combat.enemyTurn ? window.story.state.enemy  :window.gm.player;
  var defender = target;//s.combat.enemyTurn ? window.gm.player :window.story.state.enemy;
  var msg = '';
  var rnd = 30;
  defender.Stats.increment('health',-1*rnd);
  msg+= attacker.name+' dealt '+rnd+' damage to '+defender.name+'.</br>';
  return({OK:true , msg:msg})
};