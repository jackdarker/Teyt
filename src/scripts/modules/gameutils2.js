
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
    to=window.gm.navEvent(to,window.story.state.DngSY.prevLocation);
    if(to==="") to=window.story.state.DngSY.nextLocation;
    window.gm.addTime(15);
    window.story.show(to);
}
window.gm.navEvent = function(to,from) {
    let _to = '',evt,evts,dng=window.story.state.DngSY.dng;
    let _from=from.replace(dng+"_","");
    let _room=to.replace(dng+"_","");
    //tick = timestamp  
    //state: 0-active  1-inactive  
    evts = window.story.state[dng].tmp.doors[_room];
    if(evts) { //door-check
        evt = evts[_from];
        if(evt) {
            if(evt.state===0) _to=dng+"_Door_Closed";
            if(_to!=='') return(_to);
        }
    }
    evts = window.story.state[dng].tmp.evtEnter[_room];
    if(evts) { //mobs
        evt = evts["dog"];
        if(evt) {
            if(evt.state===0) _to=dng+"_Meet_Dog";
            if(_to!=='') return(_to);
        }
        evt = evts["gas"];
        if(evt) {
            //if(evt.state===0) _to="HC_Trap_Gas";
            if(_to!=='') return(_to);
        }
    }
    return(_to);
}
window.gm.mobAI = function(mob){
    function getRoomDirections(from) {
        let rooms=window.story.state.DngSY.dngMap.grid
        for(var i=rooms.length-1;i>=0;i--){
            if(rooms[i].room===from) {
                return(rooms[i].dirs)
            }
        }
        return([]);
    }
    var _now=window.gm.getTime();
    if(mob.state!==0 || mob.tick==='') {mob.tick=_now;return;}
    if(window.gm.getDeltaTime(_now,mob.tick)>30) {
        mob.tick=_now;
        var _to = getRoomDirections(mob.pos).filter(el=> mob.path.includes(el));
        if(_to.length>0) {
            mob.pos=_to[_.random(0,_to.length-1)];
            //alert(mob.id+' now moving to '+mob.pos);
        }
    }
}
//dynamic room description 
window.gm.renderRoom= function(room){
    let msg="",deltaT,dng=window.story.state.DngSY.dng,_evt,_evts= window.story.state[dng].tmp.evtSpawn[room];
    if(!_evts) return(msg);
    _evt=_evts["chest"];
    if(_evt && (_evt.state===0 || _evt.state===1)) {
      msg+=window.story.render(dng+"_Chest");
    }
    _evt=_evts["mushroom"];
    if(_evt && (_evt.state===0 || _evt.state===1)) {
        deltaT=window.gm.getDeltaTime(window.gm.getTime(),_evt.tick);
        if(_evt.loot==="BrownMushroom" && deltaT>4800) { //growth of...
            _evt.tick=window.gm.getTime();_evt.loot="RottenMushroom";
        } else if(_evt.loot==="ViolettMushroom" && deltaT>2400){
            _evt.tick=window.gm.getTime();_evt.loot="BrownMushroom";
        }
        msg+=window.story.render(dng+"_Mushroom");
    }
    return(msg);
}
window.gm.randomTask = function() {
    let tasks;
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
}
