var ts = require('typescript');
var _ = require('lodash');
var vow = require('vow');
var vowFs = require('vow-fs');
var buildFlow = require('enb').buildFlow || require('enb/lib/build-flow');
var defaultCompilerOptions = {
	module: ts.ModuleKind.ES2015,
	allowJs: true
};

module.exports = buildFlow.create()
	.name('enb-typescript')
	.target('target', '?.js')
	.defineOption('tsCompilerOptions')
	.useFileList(['ts', 'tsx', 'vanilla.js', 'js', 'browser.js', 'jsx'])
	.builder(function(files) {
		var compilerOptions = _.merge({}, this._options.tsCompilerOptions, defaultCompilerOptions);
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
