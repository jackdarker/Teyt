"use strict";

window.gm.jobs = window.gm.jobs || {};

// global definition of repeatable tasks
/*
passage linked to the task
time-schedule; 
used resources; time and energy used
hidden; job is hidden in schedule
disable; job is displayed in schedule but unavailable
critical; indicates that if not done on time there is punishment (just shows the indicator in the sidebar)
onAddTime-CB is called when time passes; can be used to check if task was done on time
 */

class Job {
    constructor(id,name,descr) {
        this.id=id,this.name=name;
        this.descr=descr, this.reqEnergy=0,this.reqTime=0,
        this.startTimeMin=0,this.startTimeMax=0,this.DoW=[], 
        this.onAddTimeCB = null;
    }
    onAddTime() {
    }
    isDisabled() { return(false); }
    disabledReason() { return(""); }
    isHidden() { return(false); }
}

{
    var job;

    job = new Job("Campus","get to the uni","You have to at least attend some of the lectures to keep up with the studys.");
    job.reqEnergy = 5, job.reqTime=15,job.startTimeMin=700,job.startTimeMax=1100,job.DoW =[1,2,3,4,5];
    window.gm.jobs[job.id] = job;

    job = new Job("Harcon_work","work at Hacorn facility","do a shift at Harcon logistic dept.");
    job.reqEnergy = 10, job.reqTime=20,job.startTimeMin=800,job.startTimeMax=930,job.DoW =[1,3,5];
    job.isHidden = function (){ return(!window.gm.quests.hasActiveQuest("qFindAJob",200));};
    window.gm.jobs[job.id] = job;

    job = new Job("Dogsit_NewCall","Dog-sitting","You could call the dogsit agency if they have a new job.");
    job.reqEnergy = 20, job.reqTime=120,job.startTimeMin=900,job.startTimeMax=1300,job.DoW =[2,3,4];
    window.gm.jobs[job.id] = job;

    job = new Job("Home_Study","Studying","Do some studying for your graduation.");
    job.reqEnergy = 20, job.reqTime=120,job.startTimeMin=700,job.startTimeMax=1800,job.DoW =[1,2,3,4,5,6,7];
    job.isDisabled = function (){ return(true);};
    job.disabledReason=function() {return("You are not in the mood to waste your time with books.");};
    window.gm.jobs[job.id] = job;
}
//this holds the definition of all quests; which quests/ms are active is stored in window.story.state.quests !
window.gm.questDef = window.gm.questDef || {};
{
    var quest = new Quest("qFindGarden","Find the garden","The Garden is somewhere around the house.");
    var mile1 = new QuestMilestone(1,"Find the garden","You heard rumors that there is a garden behind the house.Find it.",
        //each milestone should define a function that checks if the milestone is fullfilled or not or if no more milestones
        function(){ 
          if(window.passage.name==="Garden") {
            return(100);
          }
          else return (0);
        });
    var mile2 = new QuestMilestone(100,"Found the garden","Congratulation. You found the garden.",
        function(){ return(-1)});
    quest.addMileStone(mile1),quest.addMileStone(mile2);
    window.gm.questDef[quest.id]= quest;
}
{
    var quest = new Quest("qStudy","Do some studying","Do something for your success at university.");
    var mile1 = new QuestMilestone(1,"","Sitting down and reading a book might get you some knowledge.",
        function(){  return (0); });
    var mile2 = new QuestMilestone(100,"","At least you feel a little smarter now.",
        function(){ return(-1)});
    quest.addMileStone(mile1),quest.addMileStone(mile2);
    window.gm.questDef[quest.id]= quest;
}
{
    var hidden = (function(){return(window.gm.quests.getMilestoneState("qMyPleasure").id<100);});
    var quest = new Quest("qMyPleasure","Pleasure yourself","Pleasure yourself.",hidden );
    var mile1 = new QuestMilestone(1,"","Rub yourself.",
        function(){  return (0);},hidden);
    var mile2 = new QuestMilestone(100,"","You created a mmess in your bedsheets.",
        function(){ return(-1)});
    quest.addMileStone(mile1),quest.addMileStone(mile2);
    window.gm.questDef[quest.id]= quest;
}

{
    //quest-flag counts the shifts done in week
    var quest = new Quest("qFindAJob","Find a job","Somehow you have to make a living.");
    quest.addMileStone( new QuestMilestone(1,"","Maybe you can ask around or check the blackboard at the uni for some offers.",
        function(){ return (0);}));
    quest.addMileStone( new QuestMilestone(100,"","You've got that job-ad from Harcon Health Inc that is somewhere in downtown. Maybe you could inquire there whats up with it.",
        function(){ return(0)}));
    quest.addMileStone( new QuestMilestone(200,"","They offered you to work in logistic department. You will move boxes and crates around for little money but at least its a start. Check your job-schedule",
        function(){ return(0)}));
    quest.addMileStone( new QuestMilestone(300,"","???",
        function(){ return(0)}));
    window.gm.questDef[quest.id]= quest;
}
