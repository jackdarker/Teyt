
"use strict";
//used for pathfinding in map not using dungeon
//grid = grid =[{room:'H2', dirs:['H3','I2']},...]
window.gm.gridToGraph=function(grid) {
  let _r,_rooms= new Map();
  for(el of grid) {
      _rooms.set(el.room,{name:el.room, neighbours:[]});
  }
  for(el of grid) {
      _r = _rooms.get(el.room);
      for(var dir of el.dirs) {
          _r.neighbours.push(_rooms.get(dir));
      }
      _rooms.set(el.room,_r);
  }
  let graph = new window.Graph(Array.from(_rooms.values( )));
  graph.neighbors=function(node){
      var dir,ret = [],dirs = node.origNode.neighbours;
      for(dir of dirs) {
          var room = dir;
          var next=this.nodes.find((el)=>{return(el.origNode===room);})
          ret.push(next);
      }
      return ret;
  };
  graph.areNodesEqual=function(nodeA,nodeB){return(nodeA.origNode.name===nodeB.origNode.name)};
  return(graph)
}
window.gm.printNav2=function(label,to) {
    let args = { func: function(to){return('window.gm.navHere(\"'+to+'\")');}};
    return(window.gm.printNav(label,to,args));
}
window.gm.navHere = function(to) {
    window.story.state.DngSY.prevLocation=window.gm.player.location;
    window.story.state.DngSY.nextLocation=to;
    let room=to.replace(window.story.state.DngSY.dng+"_","");
    switch(window.story.state.DngSY.dng) { //add specific functions here
        case "HC_Lvx": to=window.gm.navEvent_HC(room); break;
        default: break;
    }
    if(to==="") to=window.story.state.DngSY.nextLocation;
    window.gm.addTime(15);
    window.story.show(to);
}
window.gm.navEvent_HC = function(room) {
    let to = '';
    let evt,evts = window.story.state.DngHC.tmp.evt[room];
    //tick = timestamp  
    //state: 0-inactive  1-active  2-done 
    if(evts) {
        evt = evts["dog"];
        if(evt) {
            if(evt.state===0) to="HC_Meet_Dog";
        } else {}
    }
    return(to);
}
window.gm.randomTask = function() {
    let tasks = window.story.state.DngHC.tasks;
    if(tasks==={}) { //init tasks
        //within 1 day gather 3 mushrooms
        //find 3 black candles
        //banish 2 hounds
        //open 4 containers within 3 days
        //drink 3 mysterious potions 
        //deliver 2l milk in 2 days
        //help milikin the steeds and collect 2l cum
        //get pierced
        //recover your virginity within 5days
        //
        //walk around nude (except forced gear) for 3 days
        //wear a tail-plug for 3 days

    }
    let currTask
}