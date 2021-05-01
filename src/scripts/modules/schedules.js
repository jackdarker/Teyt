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
    constructor(id,name,desc) {
        this.id=id,this.name=name;
        this.desc=desc, this.reqEnergy=0,this.reqTime=0,
        this.startTimeMin=0,this.startTimeMax=0,this.DoW=[], 
        this.disabled=false,this.disableReason="",this.hidden=false;
        this.onAddTimeCB = null;
    }
    onAddTime() {
        
    }
}

{
    var job;
    job = new Job("Dogsit_NewCall","Dog-sitting","You could call the dogsit agency if they have a new job.");
    job.reqEnergy = 20, job.reqTime=120,job.startTimeMin=900,job.startTimeMax=1300,job.DoW =[2,3,4];
    window.gm.jobs[job.id] = job;

    job = new Job("Home_Study","Studying","Do some studying for your graduation.");
    job.reqEnergy = 20, job.reqTime=120,job.startTimeMin=700,job.startTimeMax=1800,job.DoW =[1,2,3,4,5,6,7];
    job.disabled=false,job.disableReason="You are not in the mood to waste your time with books.";
    window.gm.jobs[job.id] = job;
}
//this holds the definition of all quests; which quests/ms are active is stored in window.story.state.quests !
window.gm.questDef = window.gm.questDef || {};
{
    var quest = new Quest("qFindGarden","Find the garden","The Garden is somewhere around the house.");
    var mile1 = new QuestMilestone(1,"Find the garden","You heard rumors that there is a garden behind the house.Find it.",
        //each milestone should define a function that checks if the milestone is fullfilled or not or if no more milestones
        function(){ 
          if(window.passage.name==="Garden") return(100);
          else return (0);
        })
    var mile2 = new QuestMilestone(100,"Found the garden","Congratulation. You found the garden.",
        function(){ return(-1)});
    quest.addMileStone(mile1),quest.addMileStone(mile2);
    window.gm.questDef[quest.id]= quest;
}
{
    var quest = new Quest("qStudy","Do some studying","Do something for your success at university.");
    var mile1 = new QuestMilestone(1,"","Sitting down and reading a book might get you some knowledge.",
        function(){  return (0); })
    var mile2 = new QuestMilestone(100,"","At least you feel a little smarter now.",
        function(){ return(-1)});
    quest.addMileStone(mile1),quest.addMileStone(mile2);
    window.gm.questDef[quest.id]= quest;
}