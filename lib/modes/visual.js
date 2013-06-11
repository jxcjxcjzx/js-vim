/*

	Visual mode is just text selection on top of command mode. Each keypress, simply maintain your range.

*/

var rangeStart;
module.exports = {

	'/^((?!esc|x|y).*)/': function(keys,vim) {
		vim.curDoc.selecting = true;

		if(!rangeStart) {
			rangeStart = {
				line: vim.cursor().line(),
				char: vim.cursor().char()
			};
		}
		
		//execute the command in command mode
		vim.mode('command'); //dont use 'esc' as that is defined below to cancel the visual session
		vim.exec(keys);

		//Establish new cursor as range end / start
		var end = {
			line: vim.cursor().line(),
			char: vim.cursor().char()
		};

		var range = [rangeStart,end];


		//Reverse if not correct order. But rangeStart remains where it was.
		if(end.line < rangeStart.line || (end.line === rangeStart.line && end.char < rangeStart.char)) {
			range = [range[1],range[0]];
		}

		range[1].char++;

		vim.curDoc.selection(range);

		vim.exec('v');


	},

	'/^(esc)/': function(keys,vim) {
		rangeStart = false;
		vim.curDoc.selection('reset');
		vim.curDoc.selecting = false;
	},

	'/^(x)/': function(keys,vim) {

		vim.mode('command');
		vim.exec(keys);
		vim.exec('v');
		vim.exec('esc');
	},

	'/^(y)/': function(keys,vim) {
		var range = vim.curDoc.selection();
		var val = vim.curDoc.getRange(range);
		vim.register(0,val);
		vim.exec('esc');
	}


};
