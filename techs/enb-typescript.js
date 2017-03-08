var ts = require('typescript'),
	_ = require('lodash'),
	vow = require('vow'),
	vowFs = require('vow-fs'),
	Concat = require('concat-with-sourcemaps'),
	defaultCompilerOptions = {
		module: ts.ModuleKind.ES2015,
		allowJs: true
	};

module.exports = require('enb/lib/build-flow').create()
	.name('enb-typescript')
	.target('target', '?.js')
	.defineOption('tsCompilerOptions')
	.useFileList(['ts', 'tsx', 'vanilla.js', 'js', 'browser.js', 'jsx'])
	.builder(function(files) {
		var compilerOptions = _.merge({}, this._options.tsCompilerOptions, defaultCompilerOptions);
		var concat = new Concat(true, 'all.js', '\n');
		var target = this.node.resolvePath(this._target);

		return vow.all(files.map(function(file) {
			return vowFs.read(file.fullname, 'utf-8').then(function(data) {
				var result = ts.transpileModule(data, {
						compilerOptions: compilerOptions
					});
				return result.outputText;
			});
		})).then(function(res) {
			return res.join('\n');
		});
	})
	.createTech();
