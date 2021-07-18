//todo UNUSED
/**
     * standfaceback
     * standfaceface
     * doggystyle
     * doggystyle3some
     * missionary|mf
     * cowgirl|fm
     * spoon|mf
     * kneelfaceface
     * 69
     */
/*window.gm.sex.fuck = function(style, setup) {
    //style defines number of involved chars and how to interact
    //order of chars defines theire role in position f.e. CharA is giving,CharB is receiving
    //addtional modifiers
    //style = '69|m,m', setup=[{Char:Player},{Char:Carlia}] 
    //m = cock  a=anal f= vagina, o =oral
    let option = style.split('|');
    let genders = option[1].split(',');
    let count =2; //how many partakers expected
    if(option[0]==='doggystyle3some'){

    }
    if(setup.length<count || genders.length<count) throw new Error("requires more parttakers");
    let tools = [];
    let tool;
    for(var i=0;i<count-1;i++) {
        if(genders[i]==='m') {
            tool = setup[i].Char.Outfit.getItemId("bPenis");
        } else if (genders[i]==='f') {
            tool = setup[i].Char.Outfit.getItemId("bVulva");
        } else {
            tool = setup[i].Char.Outfit.getItemId("bAnus");
        }
        tools.push(tool);
    }
    //deposit

    
}*/
window.gm.sex = window.gm.sex||{};
window.gm.sex.createButton=function(label,foo) {
    let link;
    link = document.createElement('a');
    link.href='javascript:void(0)';
    link.addEventListener("click", function(){foo();});
    link.textContent=label;
    $("div#choice")[0].appendChild(link);
};
//cleans up choice-list
window.gm.sex.beginScene=function(){
    for(var i=$("div#choice")[0].childNodes.length-1;i>=0;i-- ) {
        $("div#choice")[0].removeChild($("div#choice")[0].childNodes[i]);
    }
};
//add scenedescription to panel
window.gm.sex.updateScene=function(entry){
    $("div#panel")[0].appendChild(entry); 
};
/*
* calculates which of the generic scenes can play after a battle
*/
/*window.gm.sex.setupPostBattleScene = function(battleResult,sexsceneCB,extra) {
    let s=windows.story.state;
    //s.combat.playerParty  detect scene by available actors?
    let data = {state:0 , battleResul:battleResult, player:s._gm.activePlayer }; //data should not contain objects beause using object.assign!
    data.foes = [];
    for(el of s.combat.enemyParty)
    {
        data.foes.push(String.toLowerCase(el.id));
    }
    data.foes.sort();

}*/
window.gm.sex.wolfOnPlayer=function(data) {
    window.gm.sex.beginScene();
    let entry = document.createElement('p');
    let createButton=window.gm.sex.createButton;
    let newdata = {};
    if(data.state<0) { //quit if scene is done
        if(data.battleResult==='victory') window.gm.postVictory(); //todo flee, submit, defeat
        else window.gm.postDefeat();
        return;
    } else if(data.state===0) { //start-menu
        if(data.battleResult==='victory') {
            entry.textContent ="You arent horny enough. | The beast is quite in the mood to fool around. | You need some hard wolfcock right now. ";
            //todo detect gender,.. -> available position;
            data.state='plDomPosSelect';
            Object.assign(newdata,data);//need a copy to create different data-values
            newdata.position = 'Straddle Him';
            createButton(newdata.position,window.gm.sex.wolfOnPlayer.bind(null,newdata));
            newdata = {},Object.assign(newdata,data);
            newdata.position = 'On all 4';
            createButton(newdata.position,window.gm.sex.wolfOnPlayer.bind(null,newdata));
            newdata = {},Object.assign(newdata,data);
            newdata.state=-1;
            createButton('Walk away',window.gm.sex.wolfOnPlayer.bind(null,newdata));
        } else {
            entry.textContent ="The creature isnt interested in you.";
            data.state=-1;
            createButton('Pass out',window.gm.sex.wolfOnPlayer.bind(null,data));
        }
    } else if(data.state==='plDomPosSelect') { //each button-click will call this sm again and switch state
        if(data.position==='On all 4') {
            entry.textContent ="You strip of your gear and drop down on knees and hands.";
        } else {
            entry.textContent ="Rolling the big,bad wuff on its back, you climb on top of it, straddeling him with your naked body.";
        }
        entry.textContent += "The question now is, which of your holes would you like to get filled?"
        //todo detect available holes and let select
        data.state='plDomHoleSelect';
        Object.assign(newdata,data);
        newdata.hole = "anal";
        createButton(newdata.hole,window.gm.sex.wolfOnPlayer.bind(null,newdata));
        if(window.gm.player.getVagina()) {
            newdata = {},Object.assign(newdata,data);
            newdata.hole = "vaginal";
            createButton(newdata.hole,window.gm.sex.wolfOnPlayer.bind(null,newdata));
        }
    } else if(data.state==='plDomHoleSelect') {
        entry.textContent ="The wolf mounts you and drills into your "+data.hole+" opening.";
        // Surprised, you find your comrade has grown a large lump at the base of its cock that now bumps against your entrance.
        // to late you notice that his knot is already swelling in your thight orifice. You wouldnt be able to dislodge unless he gets his rocks off.
        data.state='plDomOrgasm';
        Object.assign(newdata,data);
        createButton("Take it",window.gm.sex.wolfOnPlayer.bind(null,newdata));
    } else if(data.state==='plDomOrgasm') {
        entry.textContent ="Wolf-jizzm is painting your inside white.";  //Unfortunatly, the stud came before you did -- 
        if(data.hole==='vaginal') {
            window.gm.player.getVagina().addSperm('wolf',3);
        } else if(data.hole==='anal') {

        }
        //todo insert sperm in hole
        data.state=-1;
        Object.assign(newdata,data);
        createButton("Pass out",window.gm.sex.wolfOnPlayer.bind(null,newdata));
    }
    window.gm.sex.updateScene(entry); 
}