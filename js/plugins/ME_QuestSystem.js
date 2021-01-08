/*:
 * Version 1.0.0
 * @target MZ
 * Last update 02/01/21
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
    this.setup(questId);
};

ME_Quest.prototype.setup = function(questId) {
    this._id=0;
	this._name="";
	this._type="";
	this._status=0;
	this._text="";
	this._goals=[];
	this._rewards=[];
	this._nextQuest=0;
};

