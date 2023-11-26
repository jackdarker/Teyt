//UMD export from https://github.com/umdjs/umd/blob/master/templates/returnExports.js
//TODO if this module requires something, enable code with b
(function (root, factory) {
    if (typeof define === 'function' && define.amd) {
        // AMD. Register as an anonymous module.
        define([], factory); //define(['b'], factory);  
    } else if(typeof module === 'object' && typeof module.exports === 'object'){//(typeof module === 'object' && module.exports) {
        // Node. Does not work with strict CommonJS, but
        // only CommonJS-like environments that support module.exports,
        // like Node.
        module.exports = factory();//module.exports = factory(require('b'));
    } else {
        // Browser globals (root is window)
        root.GenerateDng = factory();//root.returnExports = factory(root.b);
    }
}(typeof self !== 'undefined' ? self : this, function () {//function (b) {
    // Use b in some fashion.
    class Room{
        constructor(){
            this.pos = [0,0];
            this.sectiles =[[0,0],[0,-1],[0,1],[-1,0],[1,0]];
            this.dirs =[];
            this.setPosition(this.pos);
        }
        setPosition(pos){
            this.pos=pos;
            this.tiles = this.sectiles.map((x)=>{return([x[0]+this.pos[0],x[1]+this.pos[1]])});
        }
        getAddress(){return(this.pos[0]+'_'+this.pos[1]);}
    }
    /** Generates a map made from cross-patterned rooms 
    * 
    */
    class Generator {
        constructor(){
        }
        //resets state of generator
        reset(params){
            this.length=1;
            this.room = new Room();
            this.grid = new Map([[this.room.getAddress(),this.room]]);
            this.mainrooms = [this.room.getAddress()];
            this.doors =[]; //[ [ [1,1],[0,1] ],... ]
        };
        intersects(newroom){
            let inter=[],rooms = Array.from(this.grid.values()),newtiles=newroom.tiles;
            for(var i=rooms.length-1;i>=0;i--){
                let tiles=rooms[i].tiles;
                for(var k =newtiles.length-1;k>=0;k--){
                    for(var l =tiles.length-1;l>=0;l--){
                        if(newtiles[k][0]===tiles[l][0] && newtiles[k][1]===tiles[l][1]) {
                            return(true);
                        }
                    }
                }
            }
            return(false);
        }
        placeRoom(newRoom){
            this.grid.set(newRoom.getAddress(),newRoom);
            this.mainrooms.push(newRoom.getAddress());
        }
        isNeighbour(tileA,tileB){
            //yes: [1,0] & [1,-1]     [2,-1] & [1,-1]
            //no:   [-1,0] & [1,-1]
            let tx=tileA[0]-tileB[0],ty=tileA[1]-tileB[1];
            if( (tx===0 && (ty===1 || ty ===-1)) || (ty===0 && (tx===1 || tx ===-1)))return(true);
            return(false);
        }
        sanitizeDoors(){    //remove double entries of doors
            let _sane =[];
            for (let y of this.doors.values()){
                if(_sane.find((el)=>{return((y[0]===el[0] && y[1]===el[1]) || (y[0]===el[1] && y[1]===el[0]))})) {
                    continue;
                }
                _sane.push(y);
            }
        }
        /**
         *  generates new map and returns it
         * @memberof Generator
         * @param {params} params
         * 
         * parameter options:
         * length: length of rooms chained, default 4
         * doors: additional doors between template, default none
         * naming: namingstyle of rooms: A1 (default, max = K9); -12_1 ; -12_+01
         * branches: defines if mainrooms can branch out: default 0; 2 means there could be 2 forks
         */
        generate(params){
            let _params=params||{};
            _params.length = (_params.length)?_params.length:4;
            _params.doors = (_params.doors)?_params.doors:0;
            _params.naming = (_params.naming)?_params.naming:'A1';
            _params.branches = (_params.branches)?_params.branches:0;
            _params.progress = (_params.progress)?_params.progress:function(){};
            this.reset(_params);
            let pos,n,minX=0,minY=0;
            let slots =[[-2,-1],[2,1],[-2,1],[2,-1],[-1,-2],[1,-2],[-1,2],[1,2]];
            while(this.length<_params.length){
                n = Array.from(slots); 
                n.sort(() => Math.random() - 0.5);// scramble array
                let newroom= new Room();
                while(true){
                    pos = n.pop();
                    newroom.setPosition([pos[0]+this.room.pos[0],pos[1]+this.room.pos[1]]);
                    //check if newroom would intersect with present rooms
                    if(!this.intersects(newroom)) {
                        this.placeRoom(newroom);
                        this.length+=1;
                        //choose next room adjoining current
                        //todo create branch
                        //after adding a room, there is a chance to select a previous mainroom to continue on instead of extending from current mainroom
                        this.room = newroom;
                        break;
                    }
                }
            }
            //add doors to templates
            for(var i=this.mainrooms.length-1;i>=0;i--){
                let ra=this.grid.get(this.mainrooms[i]);
                for(var k=ra.tiles.length-1;k>=0;k--){
                    minX=Math.min(minX,ra.tiles[k][0]),minY=Math.min(minY,ra.tiles[k][1]);
                    for(var l=ra.tiles.length-1;l>=0;l--){
                        if( this.isNeighbour(ra.tiles[k],ra.tiles[l])){ //tiles directly beside each other?
                            this.doors.push([ra.tiles[k],ra.tiles[l]]);
                        }
                    }
                }
            }
            //find neigboring tiles of new and previous room and build main doors  
            for(var i=1;i<this.mainrooms.length;i++){
                let brk,ra=this.grid.get(this.mainrooms[i-1]),rb=this.grid.get(this.mainrooms[i]);
                brk=false;
                for(var k=ra.tiles.length-1;k>=0 && brk===false ;k--){
                    for(var l=rb.tiles.length-1;l>=0 && brk===false;l--){
                        if( this.isNeighbour(ra.tiles[k],rb.tiles[l])){ //tiles directly beside each other?
                            this.doors.push([ra.tiles[k],rb.tiles[l]]);
                            brk=true;
                        }
                    }
                }
            }
            
            let _allrooms = [];
            for (let x of this.grid.values()){
                for (let y of x.tiles.values()){
                    _allrooms.push(y);
                }
            }
            //build additional doors between templates
            for(var i=1;i<this.mainrooms.length;i++){//walk each mainroom
                let brk,ra=this.grid.get(this.mainrooms[i]);
                let n=_params.doors,tiles= ra.tiles;
                for (let x of _allrooms.values()){
                    for(var k=tiles.length-1; k>=0 && n>0;k--){
                        //select a random tile and check neighbours from other mainrooms
                        if(tiles.includes(x)) continue; //only tiles from others
                        if(this.isNeighbour(tiles[k],x)){ //create door to neighbour, if there is already one skip ahead
                            this.doors.push([tiles[k],x]);
                            n--;
                            if(n<=0) break;
                        }
                        //repeat n times or no more tiles
                    }
                }
            }
            this.sanitizeDoors();
            //list rooms by ?? and assign interior, all rooms with main doors have to be used

            //remove unused rooms with single door

            //restructure to:
            //{grid:new Map(_grid.map((x)=>{return([x.room,x]);})),width:14,height:8,legend:''}
            //where x= {room:'D2', dirs:[{dir:'E2'}]},
            let _grid=[];
            let X=['A','B','C','D','E','F','G','H','I','J','K','L','M','N'],Y=['0','1','2','3','4','5','6','7','8','9'];
            function toCoord(tile){ 
                switch(_params.naming){
                    case 'A1': return(X[tile[0]-minX]+Y[tile[1]-minY]); //returns 'E5', also shifts Position as smallest value is A1
                    break;
                    case '-12_1': return((tile[0]-minX)+'_'+(tile[1]-minY));
                    break;
                    case '-12_+01': return(window.gm.util.formatInt(tile[0]-minX,true,2)+
                        '_'+window.gm.util.formatInt(tile[1]-minY,true,2));
                    break;
                }
                 
            } 
            for (let x of this.grid.values()){
                let pos,dirs;
                for(var i=x.tiles.length-1;i>=0;i--){
                    dirs=[]; //doors defined for this tile?
                    for(var k=this.doors.length-1;k>=0;k--){
                        if(this.doors[k][0]==x.tiles[i] ) {
                            dirs.push({dir:toCoord(this.doors[k][1])});
                        } else if(this.doors[k][1]==x.tiles[i] ) {
                            dirs.push({dir:toCoord(this.doors[k][0])});
                        }
                    }
                    pos=toCoord(x.tiles[i]);
                    _grid.push({room:pos,dirs:dirs})
                }
            }
            _grid = new Map(_grid.map((x)=>{return([x.room,x]);}));

            return({grid:_grid,width:20,height:20,legend:''});
        }

    }
    return {DngGen:new Generator()};
}));