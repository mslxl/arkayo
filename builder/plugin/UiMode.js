
class UiMode {
    apply(compiler) {
        compiler.hooks.emit.tapAsync("UiMode", (compilation, callback) => {
            for (let filename in compilation.assets) {
                if (filename=='arkayo.js') {
                    console.log('Enable ui mode for ' + filename)
                    let result = "\"ui\";\n" + compilation.assets[filename].source()
                    compilation.assets[filename] = {
                        source: function () {
                            return result;
                        },
                        size: function () {
                            return result.length;
                        }
                    };
                }
            }
            callback()
        });
    }
}
module.exports = UiMode;