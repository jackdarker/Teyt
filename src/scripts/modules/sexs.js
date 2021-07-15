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
window.gm.sex.wolfOnPlayerDoggystyle=function(state=1) {
    for(var i=$("div#choice")[0].childNodes.length-1;i>=0;i-- ) {
        $("div#choice")[0].removeChild($("div#choice")[0].childNodes[i]);
    }
    let entry,link;
    link = document.createElement('a');
    link.href='javascript:void(0)';
    entry = document.createElement('p');
    if(state===1) {
        entry.textContent ="You strip of your gear and drop down on knees and hands.";
        //todo detect available holes and let select
        link.addEventListener("click", function(){window.gm.sex.wolfOnPlayerDoggystyle(2)});
        link.textContent="Next";
    } else if(state===2) {
        entry.textContent ="The wolf mounts you and fills you with his sperm.";
        //todo insert sperm in hole
        link.addEventListener("click", function(){window.gm.sex.wolfOnPlayerDoggystyle(-1)});
        link.textContent="Pass out";
    }  
    
    if(state<0){
        window.gm.postVictory();
    } else {
        $("div#panel")[0].appendChild(entry);
        $("div#choice")[0].appendChild(link);
    }
}