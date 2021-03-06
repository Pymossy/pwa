const { join } = require('path');
const preprocess = require('svelte-preprocess')();

exports.webpack = function (config, env, opts) {
	config.resolve.extensions.push('.html', '.svelte');

	if (config.resolve.mainFields) {
		config.resolve.mainFields.unshift('svelte');
	} else {
		config.resolve.mainFields = ['svelte', 'browser', 'module', 'main'];
	}

	// disable CSS modules
	opts.css.modules = false;

	// turn off "raw-loader" on *.html files
	config.module.rules.forEach(obj => {
		if (obj.test.test('index.html')) {
			let rgx, arr=obj.test.toString().match(/\((.*)\)/);
			if (arr && arr[1]) {
				rgx = arr[1].split('|').filter(x => x !== 'html').join('|');
				obj.test = new RegExp('\\.(' + rgx + ')$');
			}
		}
	});

	config.module.rules.push({
		test: /\.(html|svelte)$/,
		exclude: [
			// Ignore root template (eg src/index.html)
			join(config.context, 'index.html')
		],
		use: {
			loader: 'svelte-loader',
			options: {
				preprocess,
				emitCss: true,
				hotReload: true,
				hydratable: true,
				nestedTransitions: true,
				skipIntroByDefault: true
			}
		}
	});
}
