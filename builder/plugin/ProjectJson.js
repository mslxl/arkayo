const fs = require('fs')
const path = require('path')
class ProjectJson {
  apply(compiler) {
    compiler.hooks.emit.tapAsync("ProjectJson", (compilation, callback) => {
      const pkg = JSON.parse(fs.readFileSync(path.resolve(process.cwd(), 'package.json')))
      const project = JSON.stringify(
        {
          name: pkg.name,
          main: `${pkg.name}.js`,
          packageName: pkg.packageName,
          versionName: pkg.version,
          versionCode: pkg.version.split('.')
            .reverse()
            .map((it) => Number.parseInt(it))
            .map((it, index) => it * Math.pow(1000, index))
            .reduce((pre, acc) => pre + acc)
        }, undefined, 2
      )

      compilation.assets['project.json'] = {
        source: () => project,
        size: () => project.length
      }

      callback();
    });
  }
}
module.exports = ProjectJson;