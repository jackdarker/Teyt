"use strict";
//import {Item} from './Inventory.js';
/* class definiton of items & Equipment */
class Item {
    constructor(name) {
        this.name = name;
        this.desc = '';
    }
    get parent() {return this._parent();}
    //context is the owner of item (parent of inventory), on is target (character)
    usable(context,on=null) {return({OK:false, msg:'Cannot use.'});}
    use(context,on=null) {return({OK:false, msg:'Cannot use.'});}
}





