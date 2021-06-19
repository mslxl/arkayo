const fs = require('fs')

const path = require('path')
class ProjectJson {
  apply(compiler) {
    compiler.hooks.emit.tapAsync("ProjectJson", (compilation, callback) => {

      fs.readFile(path.resolve(process.cwd(), 'src', 'project.json'), (err, srcData) => {
        let source = JSON.parse(srcData)
        fs.readFile(path.resolve(process.cwd(), 'package.json'), (err, pkgData) => {
          const pkg = JSON.parse(pkgData)
          let projectObj = {
            name: pkg.name,
            main: `${pkg.name}.js`,
            packageName: pkg.packageName,
            versionName: pkg.version,
            versionCode: pkg.version.split('.')
              .reverse()
              .map((it) => Number.parseInt(it))
              .map((it, index) => it * Math.pow(1000, index))
              .reduce((pre, acc) => pre + acc)
          }
          projectObj = Object.assign(projectObj, source)
          const project = JSON.stringify(projectObj, undefined, 2)
          compilation.assets['project.json'] = {
            source: () => project,
            size: () => project.length
          }

          callback();
        })
      })
    });
  }
}
module.exports = ProjectJson;