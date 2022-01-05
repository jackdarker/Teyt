
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
window.gm.testA=function() {
    var width=400,height=200,step=32;
    var draw = document.querySelector("#canvas svg");
    if(!draw) draw = SVG().addTo('#canvas').size(width, height);
    else draw = SVG(draw);//recover svg document instead appending new one
    draw.rect(width, height).attr({ fill: '#303030'});
    var node = SVG(window.gm.images['template3']()); //get the source-svg
    var group=node.find('#layer1')[0]; //fetch a layergroup by id to add to
    var tmpl = node.find('#tmplRoom')[0];
    var ox= tmpl.cx(),oy=tmpl.cy(); //
    var A1 = group.use('tmplRoom').attr({id:"Tile_A1"}).move(0, 0).addClass('roomFound');
    var A2 = group.use('tmplRoom').attr({id:"Tile_A2"}).move(0, step).addClass('roomVisited');
    group.text(function(add) {add.tspan('E')}).addClass('textLabel').ax(A2.cx()+ox).ay(A2.cy()+oy);
    var door = group.polyline([[A1.cx()+ox,A1.cy()+oy], [A2.cx()+ox,A2.cy()+oy]]).attr({id:"A1A2"}).insertBefore(A1).addClass('pathFound');
    node.addTo(draw);
  }