//this holds the definition of all quests; which quests/ms are active is stored in window.story.state.quests !
window.gm.questDef = window.gm.questDef || {};
{
    let quest = new Quest("qFindGarden","Find the garden","The Garden is somewhere around the house.");
    let mile1 = new QuestMilestone(1,"Find the garden","You heard rumors that there is a garden behind the house.Find it.",
        //each milestone should define a function that checks if the milestone is fullfilled or not or if no more milestones
        function(){ 
          if(window.passage.name==="Garden") {
            return(100);
          }
          else return (0);
        });
    let mile2 = new QuestMilestone(100,"Found the garden","Congratulation. You found the garden.",
        function(){ return(-1)});
    quest.addMileStone(mile1),quest.addMileStone(mile2);
    window.gm.questDef[quest.id]= quest;
}
{
    let NOP = (function(){  return (0)});
    let quest = new Quest("qFixLaptop","Upgrade your Laptop","");
    quest.addMileStone(new QuestMilestone(1,"","The powerconverter for your laptop should be somewhere around in the house. ",
    NOP));
    quest.addMileStone(new QuestMilestone(1000,"","The Laptop is working.",
    NOP));
    // install webcam
    window.gm.questDef[quest.id]= quest;
}
{
    let NOP = (function(){  return (0)});
    let quest = new Quest("qStudy","Do some studying","Do something for your success at university.");
    quest.addMileStone(new QuestMilestone(1,"","Sitting down and reading a book might get you some knowledge.",    NOP));
    quest.addMileStone(new QuestMilestone(100,"","At least you feel a little smarter now.",     function(){ return(-1)}));
    window.gm.questDef[quest.id]= quest;
}
{
    let NOP = (function(){  return (0)});
    let hidden = (function(){return(window.gm.quests.getMilestoneState("qMyPleasure").id<100);});
    let quest = new Quest("qMyPleasure","Pleasure yourself","Pleasure yourself.",hidden );
    quest.addMileStone(new QuestMilestone(1,"","Rub yourself.",    NOP,hidden));
    quest.addMileStone(new QuestMilestone(100,"","You created a mess in your bedsheets.",
        function(){ return(-1)}));
    window.gm.questDef[quest.id]= quest;
}
{
    //quest-flag counts the shifts done in week
    let NOP = (function(){  return (0)});
    let quest = new Quest("qFindAJob","Find a job","Somehow you have to make a living.");
    quest.addMileStone( new QuestMilestone(1,"","Maybe you can ask around or check the blackboard at the uni for some offers.",    NOP));
    quest.addMileStone( new QuestMilestone(100,"","You've got that job-ad from Harcon Health Inc that is somewhere in downtown. Maybe you could inquire there whats up with it.",NOP));
    quest.addMileStone( new QuestMilestone(200,"","They offered you to work in logistic department. You will move boxes and crates around for little money but at least its a start. Check your job-schedule",NOP));
    quest.addMileStone( new QuestMilestone(300,"","???",  NOP));
    window.gm.questDef[quest.id]= quest;
}
{
    let NOP = (function(){  return (0)});
    let hidden = (function(){return(window.gm.quests.getMilestoneState("qDLCMain").id<100);});
    let quest = new Quest("qDLCMain","qDLCMain","qDLCMain",hidden );
    quest.addMileStone(new QuestMilestone(1,"","Sign betatestcontract.",        NOP,hidden));
    quest.addMileStone(new QuestMilestone(100,"","It will take some days until the game-equipment arrives. Spent some time studying or working.",        NOP,hidden));
    quest.addMileStone(new QuestMilestone(500,"","Setup VR-equipment.",        NOP,hidden));
    quest.addMileStone(new QuestMilestone(600,"","Enter the game.",        NOP,hidden));
    quest.addMileStone(new QuestMilestone(700,"","Get to the village.",        NOP,hidden));
    quest.addMileStone(new QuestMilestone(800,"","Ask around for a quest.",        NOP,hidden));
    quest.addMileStone(new QuestMilestone(900,"","Finish the PurpleBerryQuest.",  NOP));
    window.gm.questDef[quest.id]= quest;
}
{
    let NOP = (function(){  return (0)});
    let hidden = (function(){return(window.gm.quests.getMilestoneState("qBeastKink").id<100);});
    let quest = new Quest("qBeastKink","BeastKink","Humans are fun to fool around with. But how about beasts.",hidden );
    quest.addMileStone(new QuestMilestone(1,"","Beasts have sex too.",        NOP,hidden));
    quest.addMileStone(new QuestMilestone(400,"","SEEING is BELIEVING. Catch someone having intercourse with animal.",        NOP,hidden));
    quest.addMileStone(new QuestMilestone(500,"","Maybe you can find a dog or other canine and play with him.",  NOP));
    window.gm.questDef[quest.id]= quest;
}