"use strict";

/* combat encounters are defined here */
window.gm = window.gm || {};
window.gm.encounters = window.gm.encounters || {};

window.gm.encounters.mole = function(location) {
    window.gm.Encounter = new CombatSetup();
    window.gm.Encounter.EnemyFunc = (function() { let x = new window.gm.Mobs.Mole(); x.scaleLevel(window.gm.player.level); return([x]);});
    window.gm.Encounter.Location = location;
    window.gm.Encounter.scenePic = window.gm.getScenePic(location);
    window.gm.Encounter.onSubmit = function() {
        return('What will now happen to you?</br>'+ window.gm.printPassageLink('Next','Mole Submit'));
    }
    window.gm.Encounter.initCombat();
}

window.gm.encounters.moleX2 = function(location) {
    window.gm.Encounter = new CombatSetup();
    window.gm.Encounter.EnemyFunc = (function() { 
        var a = new window.gm.Mobs.Mole();
        var b = new window.gm.Mobs.Mole();
        a.name = a.name+"#1";
        b.name = b.name+"#2";
        return([a,b]);});
    window.gm.Encounter.Location = location;
    window.gm.Encounter.scenePic = window.gm.getScenePic(location);
    window.gm.Encounter.onSubmit = function() {
        return('What will now happen to you?</br>'+ window.gm.printPassageLink('Next','Mole Submit'));
    }
    window.gm.Encounter.initCombat();
}
window.gm.encounters.leech = function(location,amount=1) {
    window.gm.Encounter = new CombatSetup();
    window.gm.Encounter.EnemyFunc = (function() { 
        let mobs =[];
        for(var i=amount;i>0;i-=1) {
            let x = new window.gm.Mobs.Leech(); x.scaleLevel(window.gm.player.level);
            mobs.push(x)
        }
        return(mobs);});
    window.gm.Encounter.Location = location;
    window.gm.Encounter.scenePic = window.gm.getScenePic(location);
    window.gm.Encounter.initCombat();
}
window.gm.encounters.mechanicguy = function(location) {
    window.gm.Encounter = new CombatSetup();
    window.gm.Encounter.EnemyFunc = window.gm.Mobs.Mechanic;
    window.gm.Encounter.Location = location;
    window.gm.Encounter.scenePic = window.gm.getScenePic(location);
    window.gm.Encounter.initCombat();
}
window.gm.encounters.wolf = function(location) {
    window.gm.Encounter = new CombatSetup();
    window.gm.Encounter.EnemyFunc = (function() { 
        let x = new window.gm.Mobs.Wolf();
        x.scaleLevel(window.gm.player.level);
        x.Stats.increment("health",9999); x.Stats.increment("energy",9999);
        return([x]);});
    window.gm.Encounter.Location = location;
    window.gm.Encounter.scenePic = window.gm.getScenePic(location);
    window.gm.Encounter.onSubmit =window.gm.Encounter.onDefeat = function() {
        return('You cannot fight anymore and surrender to the beast.</br>'+ window.gm.printPassageLink('Next','WolfSubmit'));
    }
    window.gm.Encounter.onVictory = function() {
        return('Intimitated, the wolf rolls on its back, whimpering submissively and exposing its throat.</br>'+ window.gm.printPassageLink('Next','WolfVictory'));
    }
    window.gm.Encounter.initCombat();
}
window.gm.encounters.Trent = function(location) {
    window.gm.Encounter = new CombatSetup();
    window.gm.Encounter.EnemyFunc = (function() { 
        let x = window.story.state.Trent; 
        //no leveadaption? x.scaleLevel(window.gm.player.level);
        x.Stats.increment("health",9999); 
        return([x]);});
    window.gm.Encounter.Location = location;
    window.gm.Encounter.scenePic = window.gm.getScenePic(location);
    window.gm.Encounter.onSubmit =window.gm.Encounter.onDefeat = function() {
        return('You cannot fight anymore and surrender to the beast-man.</br>'+ window.gm.printPassageLink('Next','TrentSubmit'));
    }
    window.gm.Encounter.onVictory = function() {
        return('It was barely an even fight but you showed this horsy its place.</br>'+ window.gm.printPassageLink('Next','TrentVictory'));
    }
    window.gm.Encounter.initCombat();
}