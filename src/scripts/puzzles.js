"use strict";
window.gm = window.gm || {};
/* initialize a puzzle with tetris-styled pieces; 
* the player has to dragNdrop all pieces to completely cover the goals; Note that the pieces dont have to fit completely into the goals 
* custom shapes of pieces/goals can be set.
* the function returns a data-object that you have to configure before calling init()
*/
window.gm.startBlockPuzzle=function(){
    const PUZZLE_HOVER_TINT = '#009900';
    var _stage, _canvas, _mtt;
    var _pieces,_goals;
    var _puzzleWidth,_puzzleHeight,_gridwidth;
    var startX =0, startY= 0;
    // Goal is an array of gridfields that need to be completely covered with puzzle-pieces
    var Goal = function(x,y,grid,parts) {
      let goal={x:x*grid,y:y*grid,parts:parts,grid:grid};
      goal.render = function(ctx) {
          ctx.save();
          ctx.strokeStyle ='#000000';ctx.fillStyle = '#AAAAAA';
          ctx.setLineDash([5, 10]);
          ctx.beginPath();
          for(var _r of this.parts) {
              ctx.rect(this.grid*_r[0]+this.x , this.grid*_r[1]+this.y , this.grid, this.grid);
          }
          ctx.fill();ctx.stroke();
          ctx.restore();
      };
      goal.getGrid =function() {
          let grid=[];
          for(var _r of this.parts) {
              var x=_r[0]*this.grid+this.x,y=_r[1]*this.grid+this.y;
              grid.push([x,y]);
          }
          return(grid);
      }
      return(goal);
    }
    //Piece is a puzzle-piece which shape is defined by part-rects. 
    //Grid defines the size of the part-rects. x/y is specified in multiples of grid
    //parts is an array of arrays with 2 elements specifiying x,y of every part-rect; x/y is relativ to piece-x/y 
    var Piece = function(x, y, grid, parts,design) {
      let piece={x:x*grid,y:y*grid,parts:parts,grid:grid,isDragging:false,
        fill:(design&&design.fill)?design.fill:'#2793ef',
        canRotate:(design&&design.canRotate)?design.canRotate:false};
        piece.oldX=piece.newX=piece.x;piece.oldY=piece.newY=piece.y;
        piece.render = function(ctx) {
            ctx.save();
            if(this.isDragging) {
                ctx.globalAlpha = .4;
                ctx.fillStyle = PUZZLE_HOVER_TINT;
            } else {
                ctx.fillStyle = this.fill;
            }
            ctx.strokeStyle ='#000000';
            ctx.beginPath();
            for(var _r of this.parts) {
                ctx.rect(this.grid*_r[0]+this.x , this.grid*_r[1]+this.y , this.grid, this.grid);
                if(_r[0]===0 && _r[1]===0 && this.canRotate) { //mark rotation on part [0,0]
                  var _cx=this.grid*(_r[0]+0.5)+this.x,_cy=this.grid*(_r[1]+0.5)+this.y;
                  ctx.moveTo(_cx+this.grid*0.3,_cy); //if ..(_cx,_cy) there would be another line from circle to center
                  ctx.arc(_cx,_cy,this.grid*0.3,0,Math.PI*2);
                }
            }
            ctx.fill();ctx.stroke();
            ctx.restore();
        };
        piece.getGrid =function() {
            let grid=[];
            for(var _r of this.parts) {
                var x=_r[0]*this.grid+this.x,y=_r[1]*this.grid+this.y;
                grid.push([x,y]);
            }
            return(grid);
        }
        piece.rotate=function(angle) {
          //rotate-Matrix 90°
          // 0 -1
          // 1  0
          if(!this.canRotate) return;
          this.parts=this.parts.map(
            function(pt){ return([pt[1]*-1,pt[0]*1]);}
          );
        }
        piece.isHit=function(x,y) {
            for(var _r of this.parts) {
                /*if (x > this.grid*_r[0]+this.x - this.grid * 0.5                && y > this.grid*_r[1]+this.y - this.grid * 0.5 && 
                    x < this.grid*_r[0]+this.x + this.grid - this.grid * 0.5    && y < this.grid*_r[1]+this.y + this.grid - this.grid * 0.5) {*/
                if (x > this.grid*_r[0]+this.x              && y > this.grid*_r[1]+this.y && 
                    x < this.grid*_r[0]+this.x + this.grid  && y < this.grid*_r[1]+this.y + this.grid ) {
                    return true;
                }
            }
            return false;
        };
        return(piece);
    }
    // this structure is returned by the start-fct and is the public interface to the game
    let data ={
      init:init,      //points to the init-function
      setup:demoLevel, //set this to a function that defines the level; see demoLevel
      start:start,  //(re-)starts the game at a level
      onWin:demoWinLevel, //callback called on solving a level
      onLoss:demoLossLevel, //todo callback called on failing a level
      onFinish:demoWinGame, //callback called on solving all level
      level:1,  //tracks the current level
      createGoal:Goal,  //points to a helper-function to build goal-areas
      createPiece:Piece //points to a helper-fct to build pieces
    }
    //utility function to track touch & mouse movement
    var MouseTouchTracker = function(canvas, callback){
        function processEvent(evt) {
            var rect = canvas.getBoundingClientRect();
            var offsetTop = rect.top;
            var offsetLeft = rect.left;
            if (evt.touches) {return { x: evt.touches[0].clientX - offsetLeft, y: evt.touches[0].clientY - offsetTop }
            } else { return {x: evt.clientX - offsetLeft,y: evt.clientY - offsetTop }
            }
        }
        function onDown(evt) {
            evt.preventDefault();
            _canvas.focus(); //this is to make sure canvas can receive keyup; canvas also has to have tabindex set to be focusable!
            var coords = processEvent(evt);
            callback('down', coords.x, coords.y);
        }
        function onUp(evt) { 
            evt.preventDefault(); 
            callback('up');  
        }
        function onMove(evt) {
            evt.preventDefault();
            var coords = processEvent(evt);
            callback('move', coords.x, coords.y);
        }
        function onKey(evt) {
          evt.preventDefault();
          callback('key', evt.code);
      }
        var _canvas=canvas;
        canvas.ontouchmove = onMove;
        canvas.onmousemove = onMove;
        canvas.ontouchstart = onDown;
        canvas.onmousedown = onDown;
        canvas.ontouchend = onUp;
        canvas.onmouseup = onUp;
        canvas.onkeyup = onKey;
    }
    /**
     * expects a canvas-element with proper size on the page with id='canvas'
     * initialize setup-function before calling this !
     *
     * @param {*} grid : puzzle-part-size in pixel
     */
    function init(grid){
        _canvas = document.getElementById('canvas');
        _stage = _canvas.getContext('2d');
        _gridwidth=grid;
        _puzzleWidth=_canvas.width; _puzzleHeight=canvas.height;
        _mtt = new MouseTouchTracker(_canvas,dragPiece);
        start(this.level);
    }
    //draw canvas; called internally
    function redraw(){
        _stage.clearRect(0, 0, _canvas.width, _canvas.height);
        for(el of _goals) {
            el.render(_stage);
        }
        for(el of _pieces) {
            el.render(_stage);
        }
    }
    //returns true if pieces collides with other piece or outside border; called internally
    function collides(piece) { 
        var _a=piece.getGrid();
        //todo outside border
        for(var _p of _a){
            if(_p[0]<0 || _p[1]<0 || _p[0]>=_puzzleWidth || _p[1]>=_puzzleHeight) return(true);
        }
        for(var _p of _pieces) {
            if(_p===piece) continue;
            var _b = _p.getGrid();
            for(var i=_a.length-1;i>=0;i--) {
                if(_b.find(function(value,index){return((_a[i][0]===value[0])&&(_a[i][1]===value[1]))})) return(true);
            }
        }
        return(false);
    }
    //check if goals are completly covered (but pieces dont have to be completely inside goal); called internally
    function checkWin() {
        let won=true;
        let a,allG=[],allP=[];
        for(var _p of _pieces) {
            allP=allP.concat(_p.getGrid());
        }
        for(var _g of _goals){
            allG=allG.concat(_g.getGrid());
        }
        for(var i=allG.length-1;i>=0;i--) {//check if no goal-part is uncovered
            if(allP.find(function(value,index){return((allG[i][0]===value[0])&&(allG[i][1]===value[1]))})){}
            else{won=false};
        }
        return(won);
    }
    //drag&drop operation; called internally
    function dragPiece(evtType, x, y) {
        switch(evtType) {
        case 'key':
          if(x==='KeyR') {
            for(el of _pieces) {
              if (el.isDragging) {
                el.rotate(90);
              }
            }
          }
          break;
        case 'down':
            startX = x;
            startY = y;
            for(el of _pieces) {
                if (!el.isDragging && el.isHit( x, y)) { 
                    el.isDragging = true; 
                    el.oldX=el.newX=el.x,el.oldY=el.newY=el.y;
                }
            }
            break;
        case 'up':
            for(el of _pieces) { 
                el.isDragging = false;
                if(collides(el)){ el.x =el.oldX,el.y=el.oldY;}
            }
            break;
        case 'move':
            var dx = x - startX, dy = y - startY;
            startX = x;startY = y;
            for(el of _pieces) {
                if (el.isDragging) {
                    el.newX += dx, el.newY += dy; 
                    /*el.x=Math.floor(((el.newX-_gridwidth/2)/_gridwidth))*_gridwidth+_gridwidth/2;
                    el.y=Math.floor(((el.newY-_gridwidth/2)/_gridwidth))*_gridwidth+_gridwidth/2;*/
                    el.x=Math.floor(((el.newX)/_gridwidth))*_gridwidth; //floor is used to snap to grid
                    el.y=Math.floor(((el.newY)/_gridwidth))*_gridwidth;
                }
            }
            break;
        }
        redraw();
        if(evtType==='up' && checkWin()){
          data.onWin(data.level);
        }
    }
    //used to start a certain level; the onWin-callback has to call this to continue the game
    function start(level){
        _pieces=[];_goals=[];
        data.level=level;
        var tmp=data.setup(level);
        if(!tmp) {
          data.onFinish(level);
        } else {
          _goals=tmp.goals;
          _pieces=tmp.pieces;
        }
        redraw();
    }
    //the setup-fct receives a level-No and has to return a object containing the goals and pieces of that level
    function demoLevel(level) {
      return({goals:[new Goal(3,3,_gridwidth,[[0,0],[0,1],[1,0],[1,1],[1,2],[2,2],[2,3]])],
      pieces:[new Piece(0, 0, _gridwidth, [[0,0],[1,0],[1,1]],{fill:'#57535f'}),
          new Piece(4, 1, _gridwidth, [[0,0],[0,1],[1,0],[1,1]])
      ]})
    }
    function demoWinGame(level) {
      alert("You solved all puzzles");
    }
    function demoWinLevel(level) {
      alert("You solved the puzzle-level "+level);
      this.start(level+1);
    }
    function demoLossLevel(level) {
      alert("You failed to solve the puzzle");
    }
    return(data);
};
/*
* ReactTest = a box is moing repeatedly left-right-left and the user has to click on it to 
* stop it inside a hit area (success if center of moving box is inside one hit-area)
*
* call this setup-function once and use the returned start & click function for game input
* bar is the id of the moving element-node; example:
* <div style='height:1em; width: 100%;'><div id='bar' style="position:relative; width:5%; height:100%; background-color:green;"></div></div>
* 
* you might provide callbacks for start & stop, stop will get area-index on success or -1 on fail
* speed is ms for one movement of the box from left to right 
* area is a list of non-overlapping hit-areas like [{a:5,b:10, color:'orange'}]; 
*/
window.gm.startReactTest=function(bar, speed, stopCB, startCB,areas) {
    /**
     * starts the game
     */
    function start() { //todo instead left-right also up-down should be possible
      ///////////////svg test ////////////////////
      var draw = SVG().addTo('#canvas').size(300, 300);
      var rect = draw.rect(100, 100).attr({ fill: '#f06' })
  
      ///////////////////////////////////////////////////
      data.stop();
      data.value=0,data.run=true;
      data.bargraph.style.left = data.value+'%'; //dont start in between; speed would be slowed down to maintain transition time
      var width =window.getComputedStyle(data.bargraph).getPropertyValue('width');
      var total = window.getComputedStyle(data.bargraph.parentNode).getPropertyValue('width');
      //calculate barsize relative to total width (necessary if windowsize changed in between )
      data.barsize=100*parseFloat(width.split('px'))/parseFloat(total.split('px')); 
      data.bargraph.style.transition = "left "+data.speed+"ms linear"; //configure transition for animation
      if(data.startCB) data.startCB(); //called before transition-start!
      data.bargraph.ontransitionend(); //start transition
    }
    /**
     * this stops the game and returns the index of hit area; use click() instead !
     */
    function stop() {
      var computedStyle = window.getComputedStyle(data.bargraph);
      var left = computedStyle.getPropertyValue('left');
      data.bargraph.style.left=left;
      data.bargraph.style.transition = null; // disable transition AFTER fetching computed value !
      var total = window.getComputedStyle(data.bargraph.parentNode).getPropertyValue('width');
      left =parseFloat(left.split('px')),total=parseFloat(total.split('px'));
      left = 100*left/total+data.barsize/2;
      var res =-1; //detect if area was hit or not
      for(var i=data.areas.length-1; i>=0;i--) {
        if(data.areas[i].a<=left && left<=data.areas[i].b) res=i; 
      }
      data.run=false;
      return(res);
    }
    /**
     * this can be bound to eventhandler for user input detection to trigger stop and will call stop-CB
     */
    function click() {
      var run = data.run;
      var res = data.stop();
      if(run && data.stopCB) data.stopCB(res);
    }
    let data ={ //internal state of game
      bargraph : document.getElementById(bar),
      run:false, //game started?
      value: 0, //actual setpoint in%
      barsize: 5, //width of hitbox relative to total width in %
      areas:areas,  //list of areas to hit in %;
      speed:speed, //transition time in ms
      stopCB: stopCB, //callback after user trigger 
      startCB: startCB, //callback after start
      start: start, //ref to start-function
      stop: stop, //ref to stop-func
      click: click //ref to click-func
    }
    let gradient=''; 
    for(el of data.areas) { //todo need to sort from left to right
      gradient += '#80808000 0 '+el.a+'%, '+el.color+' '+el.a+'%,'+el.color+' '+el.b+'%,#80808000 '+el.b+'%,';
    }
    data.bargraph.parentNode.style.backgroundImage='linear-gradient(to right,'+gradient.slice(0,-1)+')';
    /**
     * instead of using timers rely on css-transition handling and events
     */
    data.bargraph.ontransitionend = () => {
      data.value = (data.value===0)?100-data.barsize:0;
      data.bargraph.style.left=data.value+'%'; //this should trigger css-transition
    };
    return(data);
  }
  /**
   * by pressing left/right alternatively you move a box along a bar until you reach its end or run out of time
   * the bar will slowly slide back to origin without proper input (you have to press quickly to finish); each time you pass an area, this movement increases 
   * 
   * @param {*} bar : the element to move
   * @param {*} speed : recovery rate in ms 
   * @param {*} stopCB 
   * @param {*} startCB 
   * @param {*} areas 
   */
  window.gm.startReactTest2=function(bar, speed, stopCB, startCB,areas) {   //todo timeout starts after first click
    /**
     * starts the game
     */
    function start() { //todo instead left-right also up-down should be possible
      data.stop();
      data.run=true;
      data.bargraph.style.left = data.value+'%'; //dont start in between; speed would be slowed down to maintain transition time
      var width =window.getComputedStyle(data.bargraph).getPropertyValue('width');
      var total = window.getComputedStyle(data.bargraph.parentNode).getPropertyValue('width');
      //calculate barsize relative to total width (necessary if windowsize changed in between )
      data.barsize=100*parseFloat(width.split('px'))/parseFloat(total.split('px')); 
      //data.bargraph.style.transition = "left "+data.speed+"ms linear"; //configure transition for animation
      if(data.startCB) data.startCB(); //called before transition-start!
      //data.bargraph.ontransitionend(); //start transition
      data.value=20, data.speed2 =1;
      tick();
      data.intervalID = window.setInterval( tick,data.speed);
    }
    /**
     * this stops the game and returns the index of hit area; use click() instead !
     */
    function stop() {
      if(data.intervalID) window.clearInterval(data.intervalID);
      var computedStyle = window.getComputedStyle(data.bargraph);
      var left = computedStyle.getPropertyValue('left');
      data.bargraph.style.left=left;
      data.bargraph.style.transition = null; // disable transition AFTER fetching computed value !
      data.run=false;
    }
    function tick() {
        data.value= Math.max(0,data.value-data.speed2);
        data.bargraph.style.left=data.value+'%';
      }
    /**
     * this can be bound to eventhandler for user input detection to trigger stop and will call stop-CB
     */
    function click(evt) {
      if(!data.run) return;
      let prevKey = data.lastKey;
      if((prevKey !==evt.key && (evt.key==='a' || evt.key==='ArrowLeft' || evt.key==='d'|| evt.key==='ArrowRight'))) {
        data.lastKey=evt.key,data.value+=5;
        data.bargraph.style.left=data.value+'%';
      } 
      var left = data.value+data.barsize/2;
      var res =-1; //detect if area was hit or not
      for(var i=data.areas.length-1; i>=0;i--) {
        if(data.areas[i].a<=left && left<=data.areas[i].b) {
          res=i; data.speed2=(i+1)*2; } 
      }
      if(res===data.areas.length-1) {
        stop();
        if(data.stopCB) data.stopCB(res); 
      }
    }
    let data ={ //internal state of game
      bargraph : document.getElementById(bar),
      run:false, //game started?
      value: 0, //actual setpoint in%
      barsize: 5, //width of hitbox relative to total width in %
      areas:areas,  //list of areas to hit in %;
      speed:speed, //transition time in ms
      speed2 : 1,  //recovery speed in % of barwidth
      stopCB: stopCB, //callback after user trigger 
      startCB: startCB, //callback after start
      start: start, //ref to start-function
      stop: stop, //ref to stop-func
      click: click, //ref to click-func
      intervalID: null,
      lastKey: ''
    }
    let gradient=''; 
    for(el of data.areas) { //todo need to sort from left to right
      gradient += '#80808000 0 '+el.a+'%, '+el.color+' '+el.a+'%,'+el.color+' '+el.b+'%,#80808000 '+el.b+'%,';
    }
    data.bargraph.parentNode.style.backgroundImage='linear-gradient(to right,'+gradient.slice(0,-1)+')';
    /**
     * instead of using timers rely on css-transition handling and events
     */
    /*data.bargraph.ontransitionend = () => {
      data.value = (data.value===0)?100-data.barsize:0;
      data.bargraph.style.left=data.value+'%'; //this should trigger css-transition
    };*/
    return(data);
  }
  window.gm.startPong=function(){
    ///// fixed sample from https://svgjs.dev/ ////////
  // define document width and height
  var width = 450, height = 300
  // create SVG document and set its size
  var draw = SVG().addTo('#pong').size(width, height)
  draw.viewbox(0,0,450,300)
  // draw background
  var background = draw.rect(width, height).fill('#dde3e1')
  // draw line
  var line = draw.line(width/2, 0, width/2, height)
  line.stroke({ width: 5, color: '#fff', dasharray: '5,5' })
  // define paddle width and height
  var paddleWidth = 15, paddleHeight = 80
  // create and position left paddle
  var paddleLeft = draw.rect(paddleWidth, paddleHeight)
  paddleLeft.x(0).cy(height/2).fill('#00ff99')
  // create and position right paddle
  var paddleRight = draw.rect(paddleWidth, paddleHeight)//paddleLeft.clone()
  paddleRight.x(width-paddleWidth).fill('#ff0066')
  // define ball size
  var ballSize = 10
  // create ball
  var ball = draw.circle(ballSize)
  ball.center(width/2, height/2).fill('#7f7f7f')
  // define inital player score
  var playerLeft =0, playerRight = 0
  // create text for the score, set font properties
  var scoreLeft = draw.text(playerLeft+'').font({
    size: 32,
    family: 'Menlo, sans-serif',
    anchor: 'end',
    fill: '#fff'
  }).move(width/2-10, 10)
  // cloning doesnt work!
  var scoreRight = draw.text(playerRight+'').font({
    size: 32,
    family: 'Menlo, sans-serif',
    anchor: 'end',
    fill: '#fff'
  }).move(width/2-10, 10)
    .font('anchor', 'start')
    .x(width/2+10)
  // random velocity for the ball at start
  var vx = 0, vy = 0
  // AI difficulty
  var difficulty = 2
  // update is called on every animation step
  function update(dt) {
    // move the ball by its velocity
    ball.dmove(vx*dt, vy*dt)
    // get position of ball
    var cx = ball.cx(), cy = ball.cy()
    // get position of ball and paddle
    var paddleLeftCy = paddleLeft.cy()
    // move the left paddle in the direction of the ball
    var dy = Math.min(difficulty, Math.abs(cy - paddleLeftCy))
    paddleLeftCy += cy > paddleLeftCy ? dy : -dy
    // constraint the move to the canvas area
    paddleLeft.cy(Math.max(paddleHeight/2, Math.min(height-paddleHeight/2, paddleLeftCy)))
    // check if we hit top/bottom borders
    if ((vy < 0 && cy <= 0) || (vy > 0 && cy >= height)) { vy = -vy }
    var paddleLeftY = paddleLeft.y() , paddleRightY = paddleRight.y()
    // check if we hit the paddle
    if((vx < 0 && cx <= paddleWidth && cy > paddleLeftY && cy < paddleLeftY + paddleHeight) ||
       (vx > 0 && cx >= width - paddleWidth && cy > paddleRightY && cy < paddleRightY + paddleHeight)) {
      // depending on where the ball hit we adjust y velocity
      // for more realistic control we would need a bit more math here
      // just keep it simple
      vy = (cy - ((vx < 0 ? paddleLeftY : paddleRightY) + paddleHeight/2)) * 7 // magic factor
      // make the ball faster on hit
      vx = -vx * 1.05
    } else
    // check if we hit left/right borders
    if ((vx < 0 && cx <= 0) || (vx > 0 && cx >= width)) {
      // when x-velocity is negative, it's a point for player 2, otherwise player 1
      if(vx < 0) { ++playerRight }
      else { ++playerLeft }
      reset()
      scoreLeft.text(playerLeft+'')
      scoreRight.text(playerRight+'')
    }  
    // move player paddle
    var playerPaddleY = paddleRight.y()
    if (playerPaddleY <= 0 && paddleDirection == -1) {
      paddleRight.cy(paddleHeight/2)
    } else if (playerPaddleY >= height-paddleHeight && paddleDirection == 1) {
      paddleRight.y(height-paddleHeight)
    } else {
      paddleRight.dy(paddleDirection*paddleSpeed)
    }  
    // update ball color based on position
    ball.fill(ballColor);//??.at(1/width*ball.x()))
  }
  var lastTime, animFrame
  function callback(ms) {
    // we get passed a timestamp in milliseconds
    // we use it to determine how much time has passed since the last call
    if (lastTime) {
      update((ms-lastTime)/1000) // call update and pass delta time in seconds
    }
    lastTime = ms
    animFrame = requestAnimationFrame(callback)
  }
  callback()
  var paddleDirection = 0 , paddleSpeed = 5
  SVG.on(document, 'keydown', function(e) {
    paddleDirection = e.keyCode == 40 ? 1 : e.keyCode == 38 ? -1 : 0
    e.preventDefault()
  })
  SVG.on(document, 'keyup', function(e) {
    paddleDirection = 0
    e.preventDefault()
  })
  draw.on('click', function() {
    if(vx === 0 && vy === 0) {
      vx = Math.random() * 500 - 150
      vy = Math.random() * 500 - 150
    }
  })
  function reset() {
    // visualize boom
    boom()
    // reset speed values
    vx = 0,  vy = 0
    // position the ball back in the middle
    ball.animate(100).center(width/2, height/2)
    // reset the position of the paddles
    paddleLeft.animate(100).cy(height/2)
    paddleRight.animate(100).cy(height/2)
  }
  // ball color update
  var ballColor = new SVG.Color('#ff0066')
  //?? ballColor.morph('#00ff99')
  // show visual explosion 
  function boom() {
    // detect winning player
    var paddle = ball.cx() > width/2 ? paddleLeft : paddleRight
    // create the gradient
    var gradient = draw.gradient('radial', function(stop) {
      stop.stop(0, paddle.attr('fill'))
      stop.stop(1, paddle.attr('fill'))
    })
    // create circle to carry the gradient
    var blast = draw.circle(300)
    blast.center(ball.cx(), ball.cy()).fill(gradient)
    // animate to invisibility
    blast.animate(1000, '>').opacity(0).after(function() {
      blast.remove()
    })
  }
  }