/* 

	One vim

	Multiple docs

	One status

	Some meta rendering per doc

*/

var Doc = require('./Doc');

var Event = require('./Event');

var _ = require('./3rd/_');

var Vim = function(obj) {

	this.docs = [];

	//Create initial document
	var doc = new Doc();
	this.docs.push(doc);
	this.curDoc = doc;

	this.modes = {};

	this.on('change:mode', function(mode) {

	});

};

Vim.prototype = new Event();

Vim.prototype.new = function() {
	var doc = new Doc();
	this.docs.push(doc);
	this.curDoc = doc;
};

Vim.prototype.addMode = function(name,mode) {

	var modeArr = [];

	for(var i in mode) {
		if(mode.hasOwnProperty(i)) {
			var reg = new RegExp(i.substring(1,i.length-1));
			modeArr.push({
				command: reg,
				fn: mode[i]
			});
		}
	}

	this.modes[name] = modeArr;
};

Vim.prototype.mode = function(name) {
	if(name) {
		if(! (name in this.modes)) throw "Mode " + name + " does not exist";
		this._mode = this.modes[name];
		this.trigger('change:mode',this._mode);
		this.modeName = name;
	}

	return this._mode;
};

/** Execute a given command by passing it through 
*/
Vim.prototype.exec = function(command) {

	if(typeof command !== 'string' && command.length) {
		for(var i in command) {
			if(command.hasOwnProperty(i)) this.exec(command[i]);
		}
		return;
	}

	var mode = this.mode();

	var arg, regResult;

	var handlers = _(this.mode()).filter(function(mode) {
		var res = mode.command.exec(command)
		if(res) {
			regResult = res;
			arg = res[0];
			return true;
		}
	});

	if(handlers.length) {
		handlers[0].fn(arg,this,regResult);
	}

};

/* Shorthand fns */

Vim.prototype.insert = function() {
	return this.curDoc.insert.apply(this.curDoc,arguments);
};

Vim.prototype.remove = function() {
	return this.curDoc.remove.apply(this.curDoc,arguments);
};

Vim.prototype.text = function() {
	return this.curDoc.text.apply(this.curDoc,arguments);
}

Vim.prototype.cursor = function() {
	return this.curDoc.cursor;
}

Vim.prototype.Doc = Doc;

var vim = new Vim();
vim.addMode('insert',require('./modes/insert'));
vim.addMode('command',require('./modes/command'));
vim.mode('command');
vim.Vim = Vim;

module.exports = vim; // h29482