"use strict";

/* combat encounters are defined here */
window.gm = window.gm || {};
window.gm.encounters = window.gm.encounters || {};

window.gm.encounters.mole = function(location) {
    window.gm.Encounter = new CombatSetup();
    window.gm.Encounter.EnemyFunc = (function() { var x = new window.gm.Mobs.Mole(); x.scaleLevel(window.gm.player.level); return([x]);});
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

window.gm.encounters.mechanicguy = function(location) {
    window.gm.Encounter = new CombatSetup();
    window.gm.Encounter.EnemyFunc = window.gm.Mobs.Mechanic;
    window.gm.Encounter.Location = location;
    window.gm.Encounter.scenePic = window.gm.getScenePic(location);
    window.gm.Encounter.initCombat();
}