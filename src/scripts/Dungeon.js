"use strict";
/* bundles some operations related to dungeon navigation */
window.gm = window.gm || {};
window.gm.dungeon = window.gm.dungeon || {};

//represents a button the player can press for directions N,E,S,W; this will also be used to generate the map
//if you have to connect 2 rooms, you have to define direction in both of them
class DngDirection{
    //creates direction between 2 rooms and assigns them to them; you can then modify them
    static createDirection(DirEnum, RoomA, RoomB, onlyAtoB=false) {
        var Label = DngDirection.DirEnumToString(DirEnum);
        var DirAtoB = new DngDirection(DirEnum,Label, "");
        var inverseDir = DngDirection.inverseDirection(DirEnum);
        var backLabel = DngDirection.DirEnumToString(inverseDir);
        var DirBtoA = new DngDirection(inverseDir,backLabel, "");
        DirAtoB.roomA = DirBtoA.roomB = RoomA;
        DirAtoB.roomB = DirBtoA.roomA = RoomB;
        if(RoomA != null) RoomA.setDirection(DirEnum, DirAtoB);
        if(RoomB != null) RoomB.setDirection(inverseDir, DirBtoA);
    }
    //returns the opposite direction f.e up-down
    static inverseDirection(DirEnum) {
        switch(DirEnum) {
            case DngDirection.DirN: 
                return DngDirection.DirS;
                break;
            case DngDirection.DirS: 
                return DngDirection.DirN;
                break;
            case DngDirection.DirE: 
                return DngDirection.DirW;
            case DngDirection.DirW: 
                return DngDirection.DirE;
                break;
            case DngDirection.StairDown: 
                return DngDirection.StairUp;
                break;
            case DngDirection.StairUp: 
                return DngDirection.StairDown;
                break;
            default: 
                break;
        }
        return 0;
    }
    //converts direction enum to label
    static DirEnumToString(DirEnum) {
        var backLabel = "";
        switch(DirEnum) {
            case DngDirection.DirN: 
                backLabel = "N";
                break;
            case DngDirection.DirS: 
                backLabel = "S";
                break;
            case DngDirection.DirE: 
                backLabel = "E";
                break;
            case DngDirection.DirW: 
                backLabel = "W";
                break;
            case DngDirection.StairUp: 
                backLabel = "Stair up";
                break;
            case DngDirection.StairDown: 
                backLabel = "Stair down";
                break;
            default: 
                break;
        }
        return backLabel;
    }
    //Enum for possible directions
    static DirW = 4;
    static DirE = 3;
    static DirN = 1;
    static DirS = 2;
    static StairUp = 6;	
    static StairDown = 5;
            
    // default functions for callbacks
    static FALSE(Me) { return false; };
    static TRUE(Me) { return true; };
    
    constructor(dirEnum,name,descr) 		{	
        this.name = name,this.descr = ((descr==="") ? name:descr);
        this.direction = dirEnum;
        this.onExitFct= this.onEnterFct =  this.canExitFct= null;
        
        this.roomA //DngRoom;	//source room
        this.roomB//:DngRoom;	//target room
        this.tooltip="";//:String = "";	//tooltip of the button
    }
    //gets called when player enters from this direction
    /*public function onEnterAtoB():void { 
        onEnterAtoBFct();
    }*/
    onEnter() { 
        if (this.onEnterFct == null) return false;
        return (onEnterFct(this));
    }
    //gets called when player  exits into this direction
    /*public function onExitBtoA():void { 
        onExitBtoAFct();
    };*/
    onExit() { 
        if (this.onExitFct == null) return false;
        return this.onExitFct(this);
    };
    //function to check if player can use this direction; you should also set tooltip for display
    canExit() { 
        if (this.canExitFct == null) return true;
        return this.canExitFct(this); 
    }
    //the direction is hidden if one of the connected rooms is hidden
    hidden() {
        return (this.roomA.isHidden() || this.roomB.isHidden());
    }
}

// a room connected by directions
class DngRoom {
    constructor(name,descr,hidden) {
        this.name = name, this.descr = descr;
        this.isDungeonExit = false; // player can leave to camp with Leave-button
        this.isDungeonEntry = false; //when entering the dungeon player will be coming from here; there should only be one of this 
        this.directions/*DngDirection*/ = [null, null, null, null, null, null];	//list of directions
        this.operations/*DngOperations*/ = []; //list of additional operations (= buttons you can press)
        this.isHidden = false;
        this.floor/*DngFloor*/ = null;	//the floor where the room is assigned to
        this.onEnterFct = null;

        this.origResumeFct = null;
        this.it;
        this.fromRoom;
    }

    setDirection(DirEnum, direction) { 
        this.directions.splice(DirEnum-1,1,direction);
    }
    getDirections() { return(this.directions);   }
    getDirection(DirEnum) { return (this.directions[DirEnum-1]);    }
    //this is called after the direction onEnter-Event was called
    onEnter() { 
        this.isHidden = false;
        if (this.onEnterFct == null) return false;
        return this.onEnterFct(this);
    }

    moveHere(from) {
        origResumeFct = DungeonAbstractContent.inRoomedDungeonResume;
        fromRoom = from;
        it = 0;
        moveIterator();
    }

    // Whats that good for: onExit or onEnter might trigger an interaction/combat that we have to finish first befor displaying navigation buttons again.
    // iterator->onExit->startCombat->won->doNext(resume)->iterator
    
    moveIterator() {
        var dir;//DngDirection;
        var _it=0;//int = 0;
        //call Exit function from previous room
        var _dirs = fromRoom.getDirections();
        for(var i=0;i<_dirs.length;i++) {
            var element = _dirs[i];
            _it = _it +1; 
            if (element == null ) continue;
            if (_it <= this.it) continue;
            this.it = _it;
            dir = element;// as DngDirection;
            if (dir.roomA == fromRoom && dir.roomB==this) {
                if (dir.onExit())
                {
                    DungeonAbstractContent.inRoomedDungeonResume = this.moveIterator
                    return;
                }
            }
        }
        //call Entry function of this room
        _dirs = this.getDirections();
        for(var i=0;i<_dirs.length;i++) {
            var element1 = _dirs[i];
            _it = _it +1; 
            if (element1 == null) continue;
            if (_it <= this.it) continue;
            this.it = _it;
            dir = element1;// as DngDirection;
            if (dir.roomA==this && dir.roomB == fromRoom) {
                if (dir.onEnter()) {
                    DungeonAbstractContent.inRoomedDungeonResume = this.moveIterator
                    return;
                }
            }
        }
        _it = _it +1; 
        if (_it > this.it && this.onEnter()) {
            this.it = _it;
            DungeonAbstractContent.inRoomedDungeonResume = this.moveIterator
            return;
        }
        
        DungeonAbstractContent.inRoomedDungeonResume = origResumeFct;
        DungeonAbstractContent.inRoomedDungeonResume();
    
    }
    //gets called when entering the floor or room; override it to update the other properties
    updateRoom() { };
}

//a floor of the dungeon
//a floor consist of several rooms that are arranged in a xy-coordinate system
//every room is connected up to 4 surrounding rooms, + stairs to lower/higher floor; 
class DngFloor {
    constructor(name,descr) {
        this.rooms = [];//list of rooms
        this.descr = descr;
        this.name = name; //label of the floor 
    }
	
    addRoom(room) { 
        this.rooms.push(room);
    };
    setRooms(Rooms) { 
        this.rooms = Rooms;
        var found = null;
        for (var i=0; i<this.rooms.length;i++ ) {
            var element = this.rooms[i];
            if (element == null) continue;
            found = (element);
            if (found != null ) {
                found.floor = this;
            }
        }
    };
    allRooms() {   return this.rooms;   }
    getRoom(Name) {
        var found = null;
        for (var i=0; i<this.rooms.length;i++ ) {
            var element = this.rooms[i];
            if (element == null) continue;
            found = (element);
            if (found.name == Name) {
                break;
            }
            found = null;
        }
        return found;
    }	
}
// an additional operation that the player can trigger by pressing a button
class DngOperation {
    constructor(name,destination) {
        this.destination = destination; //description to be displayed when entering room
        this.name=name; //label of the button
    };
	
    //function to check if player can use this button
    canTrigger() { return false; }
    onTrigger() { };
}
