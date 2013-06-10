/*
	Really janky rendering. Just rewrites the entire doc every relevant change. Long-term solution is to do a diff.
*/

module.exports = function(vim) {

var _ = require('./lib/3rd/_');

var keys = require('./keys');
keys(function() {
	vim.trigger('exec',arguments[0]);
	vim.exec.apply(vim,arguments);
});

var container = document.createElement('pre');
container.className = 'vim';

var content = document.createElement('pre');
content.className = 'content';

var status = document.createElement('pre');
status.className = 'status';
status.innerHTML = vim.modeName;

document.getElementsByTagName('body')[0].appendChild(container);
container.appendChild(content);
container.appendChild(status);

vim.on('change:mode', function() {
	status.innerHTML = vim.modeName;
})


var _text = '';
var cursor = [null,null];
var _mode = '';

var render = function() {

	var text = vim.text();

	var mode = vim.modeName;

	var lines = text.split('\n');
	var cursor = vim.cursor();
	var cursorLine = cursor.line();
	var cursorChar = cursor.char();

	if(text === _text && cursor[0] === cursorChar && cursor[1] === cursorLine && _mode === mode) return; //no change 

	_text = text;
	cursor[0] = cursorChar;
	cursor[1] = cursorLine;
	_mode = mode;

	content.innerHTML = '';
	lines.forEach(function(line,i) {
		var node = document.createElement('span');
		if(i === cursorLine) {
			var cursorKey = line.substring(cursorChar,cursorChar+1);
			var cursorClass = '';
			if(!cursorKey.length || cursorKey === ' ') { cursorKey = '_'; cursorClass = 'blank' }	
			node.innerHTML = '' + line.substring(0,cursorChar) + '<span class="cursor ' + cursorClass + '">' + cursorKey + '</span>' + line.substring(cursorChar+1);
		} else {
			node.innerHTML = '' + line;
		}
		content.appendChild(node);
		content.appendChild(document.createElement('br'));
	});

};

//render = _.debounce(render,1);

vim.on('change', render);
vim.cursor().on('change', render);




};
