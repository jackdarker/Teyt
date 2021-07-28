"use strict";
/*
- imp
- nymph
- kobold
- lizard-man
- naga
- stag-boy/-Stud
- cougar-girl/-mistress
- grizzly
- werwolf
- vile vine
- lush orchid
- slug
- Giant-Snake
- Giant wasp
- spider/tarantula
- raptor
- gryphon
- felkin
- drider
- dragon/wyvern

 */

////////////////////////////////////////////////////////
// normal foes
class Mole extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Mole';
        this.pic= 'assets/mole.jpg';
        this.Stats.increment('healthMax',-1*(this.health().max-20));
    }
}
class Wolf extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Wolf';
        this.pic= 'assets/bw_wolf1.png';
        this.level_min =3;
        this.loot= [{id:'WolfTooth',amount:1}];
        this.Outfit.addItem(new BaseQuadruped());
        this.Outfit.addItem(SkinFur.factory('wolf','black'));
        this.Outfit.addItem(HandsPaw.factory('wolf'));
        this.Outfit.addItem(TailWolf.factory('wolf'));
        this.Outfit.addItem(FaceWolf.factory('wolf'));
        this.fconv = null; //lazy init because descfixer depends on gm.player
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};//this._canAct();
        let rnd = _.random(1,100);
        //if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(window.story.state.combat.turnCount%2===0) {
            rnd = _.random(0,enemys.length-1);
            result.action = "Bite";
            result.target = [enemys[rnd]];
            result.msg =this.name+" snaps at "+result.target[0].name+".</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
}
class Leech extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Leech';
        this.pic= 'assets/Leech.png';    //todo
        this.level_min =1;
        this.Outfit.addItem(new BaseQuadruped());
        this.Skills.addItem(new SkillLeechHealth());
        this.tmp = {grappleCoolDown:1};
        this.fconv = null; //lazy init because descfixer depends on gm.player
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        if(!this.fconv) this.fconv = window.gm.util.descFixer(this);
        result.action =result.target= null;
        if(this.Effects.countItem(effGrappling.name)>0) {
            this.tmp.grappleCoolDown=2;
            result.msg =this.fconv(this.name +" sucks blood.</br>")+result.msg;
            return(result);
        } else if(this.tmp.grappleCoolDown<=0){
            this.tmp.grappleCoolDown=2;
            rnd = _.random(0,enemys.length-1);
            result.action = "Leech";
            result.target = [enemys[rnd]];
            result.msg =this.fconv("$[I]$ $[snap]$ at "+result.target[0].name+".</br>")+result.msg;
            return(result);
        } else {
            this.tmp.grappleCoolDown-=1;
        } 
        return(super.calcCombatMove(enemys,friends));
    }
}
class Huntress extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Huntress';
        this.pic= 'assets/icons/icon_question.svg';
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(new SkinHuman());
        this.Outfit.addItem(HandsHuman.factory('cat'));
        this.Outfit.addItem(BreastHuman.factory('cat'));
        this.Outfit.addItem(FaceWolf.factory('cat'));
        this.Outfit.addItem(VulvaHuman.factory('cat'));
        this.Outfit.addItem(new BikiniBottomLeather());
        this.levelUp(3);
        this.autoLeveling();
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        result.action =result.target= null;
        //todo shoot arrow, pounce, throw net
        return(super.calcCombatMove(enemys,friends));
    }
}
class Dryad extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Huntress';
        this.pic= 'assets/icons/icon_question.svg';
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(new SkinHuman());
        this.Outfit.addItem(HandsHuman.factory('cat'));
        this.Outfit.addItem(BreastHuman.factory('cat'));
        this.Outfit.addItem(FaceWolf.factory('cat'));
        this.Outfit.addItem(VulvaHuman.factory('cat'));
        this.Outfit.addItem(new BikiniBottomLeather());
        this.levelUp(3);
        this.autoLeveling();
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        result.action =result.target= null;
        //todo shoot arrow, pounce, throw net
        return(super.calcCombatMove(enemys,friends));
    }
}
class Mechanic extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Mechanic-Guy';
        this.pic= 'assets/mechanic.jpg';
    }
    calcCombatMove(enemys,friends){
        let result = {OK:true,msg:''};
        let rnd = _.random(1,100);
        result.action =result.target= null;
        if(window.story.state.combat.turnCount<3) {
            rnd = _.random(0,enemys.length-1);
            result.action = "Stun";
            result.target = [enemys[rnd]];
            result.msg =this.name+" trys to hit your head whith his wrench.</br>"+result.msg;
            return(result);
        }
        return(super.calcCombatMove(enemys,friends));
    }
}
/////////////////////////////////////////////////////////
// special NPC
class Carlia extends Mob {
  constructor() {
      super();
      this.name = this.id = 'Carlia';
      this.pic= 'assets/icons/icon_question.svg';
      this.Outfit.addItem(new BaseHumanoid());
      this.Outfit.addItem(new SkinHuman());
      this.Outfit.addItem(HandsHuman.factory('cat'));
      this.Outfit.addItem(FaceWolf.factory('cat'));
      this.Outfit.addItem(BreastHuman.factory('human'));
      this.Outfit.addItem(VulvaHuman.factory('human'));
      this.Outfit.addItem(new BikiniBottomLeather());
      this.levelUp(3);
      this.autoLeveling();
  }
}
class Ruff extends Wolf {
    constructor() {
        super();
        this.name = this.id = 'Ruff';
        this.pic= 'assets/bw_wolf1.png';
        this.Outfit.addItem(PenisHuman.factory('wolf'));
        this.levelUp(3);
        this.autoLeveling();
    }
}
class Trent extends Mob {
    constructor() {
        super();
        this.name = this.id = 'Trent';
        this.pic= 'assets/icons/icon_question.svg';
        this.Outfit.addItem(new BaseHumanoid());
        this.Outfit.addItem(SkinFur.factory('horse', 'brown'));
        this.Outfit.addItem(HandsHuman.factory('horse'));
        this.Outfit.addItem(TailWolf.factory('horse'));
        this.Outfit.addItem(FaceWolf.factory('horse'));
        this.Outfit.addItem(PenisHuman.factory('horse'));
        this.Outfit.addItem(new ShortsLeather());
        this.Outfit.addItem(new MaceSteel());
        this.Stats.increment('strength',3);
        this.levelUp(6);
        this.autoLeveling();
    }
}
//collection of mob-constructors
window.gm.Mobs = (function (Mobs) {
    Mobs.Mole = function () { return new Mole();  };
    Mobs.Wolf = function () { return new Wolf();  };    
    Mobs.Leech = function () { return new Leech();  };   
    Mobs.Mechanic = function () {return new Mechanic();};
    return Mobs; 
}(window.gm.Mobs || {}));