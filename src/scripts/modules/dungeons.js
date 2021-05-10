"use strict";

class BeeHive extends DngDungeon{
    constructor()    {
        super("BeeHive", "There seem to live alot of giant bees here.")
        this.buildFloors();
    }

    buildFloors() {
        var _floors= [];
        var firstFloor//:DngFloor;
        var stairUp//:DngRoom;
        var stairDown//:DngRoom;
        firstFloor = new DngFloor();
        firstFloor.description = "This is the lowest floor of the beehive.";
        firstFloor.name = "1.Floor";
        var room//:DngRoom;
        //var rooms:LookupTable = new LookupTable(); 
        var rooms= new Map();
        /* first floor
        *  A1 - A2 - A3 - A4
        *  	    |	  |    |	
        *  B1 - B2   B3   B4
        *  |    |    |    |
        *  E    C2   C3   S
        * */
        rooms.set("Entrance", new DngRoom("Entrance", "",false));
        rooms.set("B1", new DngRoom("B1", "",false));
        rooms.set("A1",new DngRoom("A1", "",true));	//hidden
        rooms.set("B2", new DngRoom("B2", "", false));
        rooms.set("C2",new DngRoom("C2", "",false));
        rooms.set("A2",new DngRoom("A2", "",false));
        rooms.set("B3", new DngRoom("B3", "", false));
        rooms.set("C3",new DngRoom("C3", "",false));
        rooms.set("A3",new DngRoom("A3", "",false));
        rooms.set("B4",new DngRoom("B4", "",false));
        rooms.set("A4",new DngRoom("A4", "",false));
        rooms.set("Stairs",new DngRoom("Stairs", "",false));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("Entrance") , rooms.get("B1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B1" ), rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B2" ), rooms.get("A2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C2" ), rooms.get("B2"), true);
        DngDirection.createDirection(DngDirection.DirW, rooms.get("A2" ), rooms.get("A1"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A2" ), rooms.get("A3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A3" ), rooms.get("A4"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B3" ), rooms.get("A3"), true);
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C3" ), rooms.get("B3"), true);
        DngDirection.createDirection(DngDirection.DirS, rooms.get("A4" ), rooms.get("B4"));
        DngDirection.createDirection(DngDirection.DirS, rooms.get("B4" ), rooms.get("Stairs"));
        room = (rooms.get("Entrance") );
        room.isDungeonEntry = room.isDungeonExit = true;
        room = (rooms.get("B1"));
        //room.onEnterFct = encounterTentacle;
        room = (rooms.get("B2") );
        //room.onEnterFct = this.encounterBee2;
        room = (rooms.get("A4") );
        room.onEnterFct = this.encounterBee2;
        room = (rooms.get("A3") );
        room.onEnterFct = this.encounterBee2;
        room = (rooms.get("B4") );
        room.getDirection(DngDirection.DirS).canExitFct = this.hasItem;
        stairUp = (rooms.get("Stairs") );
        
        firstFloor.setRooms(Array.from(rooms.values( )));
        _floors.push(firstFloor);
        
        
        var secondFloor;
        secondFloor = new DngFloor();
        secondFloor.description = "This is the second floor of the beehive.";
        secondFloor.name = "2.Floor";
        rooms= new Map(); 
        /* second floor
        * 	A1# - A2 - A3# - A4
        *  |	  |	   |     |	
        *  B1 -  B2 - B3 -  B4
        *  |     |    |     |
        *  C1 - C2# - C3# - S
        * */
        rooms.set("C1", new DngRoom("C1", "",false));
        rooms.set("B1", new DngRoom("B1", "",false));
        rooms.set("A1", new DngRoom("A1", "",false));
        rooms.set("C2", new DngRoom("C2", "",false));
        rooms.set("B2",new DngRoom("B2", "",false));
        rooms.set("A2", new DngRoom("A2", "",false));
        rooms.set("C3", new DngRoom("C3", "",false));
        rooms.set("B3",new DngRoom("B3", "",false));
        rooms.set("A3", new DngRoom("A3", "",false));
        rooms.set("StairsDown",new DngRoom("StairsDown", "",false));
        rooms.set("B4",new DngRoom("B4", "",false));
        rooms.set("A4", new DngRoom("A4", "",false));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C3" ), rooms.get("StairsDown"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C2" ), rooms.get("C3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C1" ), rooms.get("C2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A3" ), rooms.get("A4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A2" ), rooms.get("A3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("A1" ), rooms.get("A2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B3" ), rooms.get("B4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B2" ), rooms.get("B3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("B1" ), rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C3" ), rooms.get("C4"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C2" ), rooms.get("C3"));
        DngDirection.createDirection(DngDirection.DirE, rooms.get("C1" ), rooms.get("C2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B1" ), rooms.get("A1"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C1" ), rooms.get("B1"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B2" ), rooms.get("A2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C2" ), rooms.get("B2"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B3" ), rooms.get("A3"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("C3" ), rooms.get("B3"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("B4" ), rooms.get("A4"));
        DngDirection.createDirection(DngDirection.DirN, rooms.get("StairsDown"), rooms.get("B4"));
        room = (rooms.get("B4") );
        stairDown = room = (rooms.get("StairsDown") );
        room.getDirection(DngDirection.DirW).onExitFct = this.trapDoor;	//its a trap
        room = (rooms.get("B3") );
        room.getDirection(DngDirection.DirW).canExitFct = this.hasItem;
        room.getDirection(DngDirection.DirN).onExitFct = this.trapDoor;	//its a trap
        room.getDirection(DngDirection.DirS).onExitFct = this.trapDoor;	//its a trap
        room = (rooms.get("B2") );
        room.getDirection(DngDirection.DirE).onExitFct = this.trapDoor;	//its a trap
        room = (rooms.get("A2"));
        room.getDirection(DngDirection.DirW).onExitFct = this.trapDoor;	//its a trap
        room = (rooms.get("B1"));
        room.getDirection(DngDirection.DirN).onExitFct = this.trapDoor;	//its a trap
        secondFloor.setRooms(Array.from(rooms.values( )));
        _floors.push(secondFloor);
        //now create floor links
        DngDirection.createDirection(DngDirection.StairUp, stairUp , stairDown);
        this.setFloors(_floors);
    }
    exitDungeon() {
        window.gm.dng=null;
        window.story.show("ForestEntrance");
    }
    encounterTentacle(Me) {
        window.story.show('DungeonFoundNothing');
        return true;
    }
    encounterBee2(Me) {
        window.story.show('DungeonFoundNothing');
        return true;
    }
    hasItem(Me) {
       /* if (!player.hasItem(ItemType.lookupItem("BeeHony"), 1))
        {
            Me.tooltip = "You dont have a vial of beehoney";
            return false;
        }*/
        return true;
    }
    //player falls down to 1.floor when entering the room
    trapDoor(Me) {
        window.story.show('DungeonCrashedThroughFloor');
        return(true);
        var floor1 = this.floor.dungeon.allFloors()[0];
        var Room = floor1.getRoom(Me.roomB.name);  //room names are the same at same position of floor
        if (Room != null) {
            this.floor.dungeon.teleport(floor1, Room);
            
            return true;
        }
        return false; 	
    }
}

window.gm.dngs = (function (dngs) {
    dngs.BeeHive = function () { return(new BeeHive());  };  
    return dngs; 
}(window.gm.dngs || {}));