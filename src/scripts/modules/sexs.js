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
window.gm.sex.wolfOnPlayerDoggystyle=function(data) {
    window.gm.sex.beginScene();
    let entry = document.createElement('p');
    let createButton=window.gm.sex.createButton;
    let newdata = {};
    if(data.state<0) { //quit if scene is done
        window.gm.postVictory();
        return;
    } else if(data.state===0) { //start-menu
        entry.textContent ="You arent horny enough. | The beast is quite in the mood to fool around. | You need some hard wolfcock right now. ";
        //todo detect available holes and let select
        data.state=1;
        Object.assign(newdata,data);
        createButton('Straddle Him',window.gm.sex.wolfOnPlayerDoggystyle.bind(null,newdata));
        newdata = {},Object.assign(newdata,data);
        createButton('On all 4',window.gm.sex.wolfOnPlayerDoggystyle.bind(null,newdata));
        newdata = {},Object.assign(newdata,data);
        newdata.state=-1;
        createButton('Walk away',window.gm.sex.wolfOnPlayerDoggystyle.bind(null,newdata));
    } else if(data.state===1) { //each button-click will call this sm again and switch state
        entry.textContent ="You strip of your gear and drop down on knees and hands.";
        //todo detect available holes and let select
        data.state=2;
        Object.assign(newdata,data); //need a copy to create different data-values
        newdata.hole = "anal";
        createButton(newdata.hole,window.gm.sex.wolfOnPlayerDoggystyle.bind(null,newdata));
        newdata = {},Object.assign(newdata,data);
        newdata.hole = "vaginal";
        createButton(newdata.hole,window.gm.sex.wolfOnPlayerDoggystyle.bind(null,newdata));
    } else if(data.state===2) {
        entry.textContent ="The wolf mounts you and drills into your "+data.hole+" hole.";
        data.state=3;
        Object.assign(newdata,data);
        createButton("Take it",window.gm.sex.wolfOnPlayerDoggystyle.bind(null,newdata));
    } else if(data.state===3) {
        entry.textContent ="Wolf-jizzm is painting your inside white.";
        //todo insert sperm in hole
        data.state=-1;
        Object.assign(newdata,data);
        createButton("Pass out",window.gm.sex.wolfOnPlayerDoggystyle.bind(null,newdata));
    }
    window.gm.sex.updateScene(entry); 
}