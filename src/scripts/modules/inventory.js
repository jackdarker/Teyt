"use strict";
//an Inventory-Component to store items
class Inventory {
    constructor(externlist) {  
        this.list = externlist ? externlist : [];
      window.storage.registerConstructor(Inventory);
    }
    get parent() {return this._parent();}
    toJSON() {return window.storage.Generic_toJSON("Inventory", this); };
    static fromJSON(value) { return window.storage.Generic_fromJSON(Inventory, value.data);};
    postItemChange(inv,id,operation,msg) {
        window.gm.pushLog('Inventory: '+operation+' '+id+' '+msg+'</br>');
    }
    count() {return(this.list.length);}
    countItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) return(0);
        return(this.list[_i].count);  
    }
    findItemSlot(id) {
        for (var i = 0; i < this.count(); i++) {
            if(this.list[i].id===id) return(i);
        }
        return(-1);
    }
    getItemId(slot) {
        return(this.list[slot].id);
    }
    getItem(id) {
        var _item = window.gm.ItemsLib[id];
        if(!_item) throw new Error('unknown item: '+id);
        return (window.gm.ItemsLib[id]);
    }
    //returns all Ids in list
    getAllIds() {   
        var ids=[];
        for(var i=0;i<this.list.length;i++) {
            ids.push(this.list[i].id);
        }
        return(ids);
    }
    addItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) this.list.push({'id': id, 'count': count});
        else this.list[_i].count+=count;
        this.postItemChange(this,id,"added","");
    }
    removeItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) return; //just skip if not found
        this.list[_i].count -=count;
        if(this.list[_i].count<1) this.list.splice(_i,1);
        this.postItemChange(this,id,"removed","");
    }
    //convience method to check if item is usable
    usable(id) {
        var _item = this.getItem(id);
        return (_item.usable(this));
    }
    //uses an item by calling item.use
    use(id) {
        var _item = this.getItem(id);
        var result = _item.use(this);
        if(result.OK) {
            this.postItemChange(this,id,"used",result.msg);
        }
        return(result);
    }
}

class Inventory2 {
    constructor(externlist) {  
        this.list = externlist ? externlist : [];
      window.storage.registerConstructor(Inventory2);
    }
    get parent() {return this._parent();}
    toJSON() {return window.storage.Generic_toJSON("Inventory2", this); };
    static fromJSON(value) { 
        var _x = window.storage.Generic_fromJSON(Inventory2, value.data);
        return(_x);
    };
    _relinkItems() {
        for(var i=0; i<this.list.length; i++) {
            this.list[i].item._parent=window.gm.util.refToParent(this);
        }
    }
    postItemChange(id,operation,msg) {
        window.gm.pushLog('Inventory: '+operation+' '+id+' '+msg+'</br>');
    }
    count() {return(this.list.length);}
    countItem(id) {
        var _i = this.findItemSlot(id);
        if(_i<0) return(0);
        return(this.list[_i].count);  
    }
    findItemSlot(id) {
        for (var i = 0; i < this.count(); i++) {
            if(this.list[i].id===id) return(i);
        }
        return(-1);
    }
    getItemId(slot) {
        return(this.list[slot].id);
    }
    getItem(id) {
        var _idx = this.findItemSlot(id);
        if(_idx<0) throw new Error('no such item: '+id);
        return(this.list[_idx].item);
    }
    //returns all Ids in list
    getAllIds() {   
        var ids=[];
        for(var i=0;i<this.list.length;i++) {
            ids.push(this.list[i].id);
        }
        return(ids);
    }
    addItem(item,count=1) {
        var _i = this.findItemSlot(item.name);
        if(_i<0) this.list.push({'id': item.name,'count': count, item:item});
        else this.list[_i].count+=count;
        this.postItemChange(item.name,"added","");
    }
    removeItem(id,count=1) {
        var _i = this.findItemSlot(id);
        if(_i<0) return; //just skip if not found
        this.list[_i].count -=count;
        if(this.list[_i].count<1) this.list.splice(_i,1);
        this.postItemChange(this,id,"removed","");
    }
    //convience method to check if item is usable
    usable(id) {
        var _item = this.getItem(id);
        return (_item.usable(this));
    }
    //uses an item by calling item.use
    use(id) {
        var _item = this.getItem(id);
        var result = _item.use(this);
        if(result.OK) {
            this.postItemChange(this,id,"used",result.msg);
        }
        return(result);
    }
}