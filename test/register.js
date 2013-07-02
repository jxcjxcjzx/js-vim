describe('registers', function() {

	var Vim = require('../index');
	var vim

	var expect = function(assertion) {

	return {
		equal: function(obj) {
			if(assertion == obj) return true;
			throw "expected " + assertion + " to equal " + obj;
		}
	}
};

	var doc;
	beforeEach(function() {
		vim = new Vim();
		vim.text( 'hello\nis it me\nyou\'re looking for?' )
	});

	describe('vim.register', function() {
		it('exists', function() {
			expect('register' in vim);
		});

		it('sets a val if given two args', function() {
			vim.register('a','hi');
			expect(vim.register('a')).equal('hi');
		});

		it('returns an empty string for an empty register', function() {
			expect(vim.register('b')).equal('');
		});
		
		it('returns the register for a nonempty register', function() {
			//vim.exec('yy');
			vim.register(0,'hello\n');
			expect(vim.register(0)).equal('hello\n');
		});
		describe('%', function() {
			it('returns the filename', function() {
				vim.curDoc.path = 'index.js';
				var name = vim.register('%');	
				name.should.equal('index.js');
			});	
		});
	});

	/*describe('yy', function() {
		it('places the current line into the first register', function() {
			vim.exec('yy');
			expect(vim.register(1)).equal('hello\n');
		});
	});

	*/

	describe('"ayy', function() {
	beforeEach(function() {
		vim = new Vim();
		vim.text('hello\nis it me\nyou\'re looking for?');
	});
		it('places the first line into the "a" register', function() {
			vim.exec('"');
			vim.exec('a');
			vim.exec('yy');
			JSON.stringify(vim.register('a')).should.equal(JSON.stringify(['o','hello','esc','0']));
		});
	});

	describe('"ap', function() {
		it('puts the contents of register "a" after the cursor', function() {
			vim.register('a','aloha');
			vim.exec('"');
			vim.exec('a');
			vim.exec('p');
			var text = vim.text();
			var line = text.substring(0,text.indexOf('\n'));
			expect(line).equal('halohaello');
		});
	});

	describe('"%', function() {
		it('retrieves the filename', function() {
			var vim = new Vim();
			vim.curDoc.path = 'asdf';
			vim.exec('"');
			vim.exec('%');
			vim.exec('p');
			vim.text().should.equal('asdf');
		});
		it('returns "" if no path specified', function() {

		});
		it('returns "" if path is not a string', function() {

		});
	});
});
