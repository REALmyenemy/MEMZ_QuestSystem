/*:
 * Version 0.0.2
 * @target MZ
 * Last update 08/01/21
 * @author myenemy
 * @plugindesc A plugin to introduce a quest system
 * 
 * @command give
 * @text Give quest
 * @arg ID
 * @desc Give player this quest
 * 
 * 
 * 
 * @help
 * 
 * 
 * Script Commands:
 * 
 * 
 * ==============================================
 * @Terms of use
 * - Common:
 * -  Free to use as in money.
 * -  Feel free to modify to redistribute it.
 * -  This plugin comes as is, with no guarantees.
 * -  I'll try to give support about it, but I can't say I will do it for sure.
 * - Non Commercial:
 * -  No credit required unless you modify it then credit yourself, in other words,
 *   no claiming as your own!
 * - Commercial:
 * -  Give credit me as the author of this plugin, I don't mind if you do so in some
 *   scene or some easter egg.
 * -  Report any bugs, incompatibilities and issues with this plugin to me, even if
 *   you have someone else fixing them.
 * 
 * @Terms of redistribution and disambiguation
 * - You must include a link to the original RPG Maker Forums Post plugin.
 * - You can add terms to it, but you can't remove or modify the ones already existent.
 * - You must follow LGPL 3.0.
 *
 * ==============================================
 *
 *
 */

var ME_QuestList;

Game_Player.prototype.ME_QS_PlayerList=[];

DataManager.ME_QS_loadQuests = function(file)
{
	this.loadDataFile("ME_QuestList",file)
}

var ME_Quest = function()
{
	this.initialize(...arguments);
};

ME_Quest.prototype.constructor = ME_Quest;


ME_Quest.prototype.initialize = function()
{
    this.setup();
};

ME_Quest.prototype.setup = function() {
    this.id=0;
	this.name="";
	this.type="";
	this.status=0;
	this.text="";
	this.goals=[];
	this.rewards={};
	this.nextQuest=0;
};

var ME_QuestSystem = function()
{};

ME_QuestSystem.prototype.checkQuestExists = function (questId)
{
	if (!ME_QuestList)
		return false;
	for (var i=1;i<ME_QuestList.length;i++)
	{
		if (ME_QuestList[i].id==questId)
		{
			return i;
		}
	}
	return false;
};


ME_QuestSystem.prototype.checkQuestOwned = function (questId)
{
	if (!$gamePlayer.ME_QS_PlayerList)
		return false;
	for (var i=0;i<$gamePlayer.ME_QS_PlayerList.length;i++)
	{
		if ($gamePlayer.ME_QS_PlayerList[i].id==questId)
		{
			return i;
		}
	}
	return false;
};

ME_QuestSystem.prototype.giveQuest = function (questId)
{
	var quest = this.checkQuestExists(questId);
	if (quest)
	{
		if (!this.checkQuestOwned(questId))
		{
			var actualQuest=ME_QuestList[quest];
			actualQuest.status=1;
			$gamePlayer.ME_QS_PlayerList.push(actualQuest);
			if (actualQuest.startScript)
				eval(actualQuest.startScript);

			return true;
		}
	}
	return false;
};

ME_QuestSystem.prototype.removeQuest = function (questId)
{
	var quest = this.checkQuestExists(questId);
	if (quest||quest==0)
	{
		var index=this.checkQuestOwned(questId);
		console.log(index)
		if (index)
		{
			$gamePlayer.ME_QS_PlayerList.splice(index, 1);
			return true;
		}
	}
	return false;
};

ME_QuestSystem.prototype.awardQuest = function (questId)
{
	var quest = this.checkQuestExists(questId);
	if (quest)
	{
		var index=this.checkQuestOwned(questId);
		if (index||index==0)
		{
			var actualQuest=$gamePlayer.ME_QS_PlayerList[index];
			var rewards = actualQuest.rewards;
			this.award(rewards);
			if (actualQuest.nextQuest&&actualQuest.nextQuest>0)
			{
				this.giveQuest(actualQuest.nextQuest);
			}
			actualQuest.status=2;
			this.removeQuest(questId);
			
			return true;
		}
	}
	return false;
};

ME_QuestSystem.prototype.award= function(rewardList)
{
	if (rewardList.gold)
	{
		$gameParty.gainGold(rewardList.gold);
	}
	if (rewardList.partyexp)
	{
		var interpreter = new Game_Interpreter();
		interpreter.command315([0,0,0,0,rewardList.partyexp,false]);
	}
	if (rewardList.leaderexp)
	{
		$gameParty.leader().changeExp($gameParty.leader().currentExp() + rewardList.leaderexp, false);
	}
	if (rewardList.items)
	{
		var items = rewardList.items;
		for (var i =0;i<items.length;i++)
			this.giveItem(items[i])

	}
	if (rewardList.runScript)
	{
		eval(rewardList.runScript);
	}
};

ME_QuestSystem.prototype.giveItem = function(item)
{
	switch(item.type)
	{
		case "item":
			$gameParty.gainItem($dataItems[item.id],item.amount);
			break;
		case "weapon":
			$gameParty.gainItem($dataWeapons[item.id],item.amount,true);
			break;
		case "armor":
			$gameParty.gainItem($dataArmors[item.id],item.amount,true);
			break;
	}	
}

ME_QuestSystem.prototype.checkFinished = function(goals)
{
	var finished=true;
	for (var i=0;finished&&i<goals.length;i++)
	{
		if (!this.checkGoal(goals[i]))
		finished=false;
	}
	return finished;
};

ME_QuestSystem.prototype.checkGoal = function(goal)
{
	if (goal.checkScript)
	{
		return eval(goal.checkScript);
	}
	else if (goal.varCount&&goal.varMax)
	{
		return $gameVariables.value(goal.varCount)==$gameVariables.value(goal.varMax);
	}
	else if (goal.switches)
	{
		if (Array.isArray(goal.switches))
		{
			var isTrue=true;
			for (var i=0;isTrue && i<goal.switches.length; i++)
				if (!$gameSwitches.value(goal.switches[i]))
					isTrue=false;

			return isTrue;
		}
		else
			return $gameSwitches.value(goal.switches)
	}
	return true; //Since it's player controlled
};

ME_QuestSystem.prototype.completeQuest = function(questId)
{
	var index=this.checkQuestOwned(questId);
	if (index||index==0)
	{
		var actualQuest=$gamePlayer.ME_QS_PlayerList[index];
		
		if (this.checkFinished(actualQuest.goals))
		{
			return this.awardQuest(questId);
		}
	}
	return false;	
};


