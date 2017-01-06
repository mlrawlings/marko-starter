var fs = require('fs');
var ncp = require('ncp').ncp;
var path = require('path');
var install = require('yarn-install');
var ignore = require('ignore');
var ig = ignore();

addScripts();
copyFiles();
install(['marko-js/marko']);

function copyFiles() {
    ig.add(require('../ignore.json'));
    ig.add(fs.readFileSync(path.join(__dirname, '..', 'app', '.gitignore'), 'utf-8'));

    var source = path.join(__dirname, '..', 'app');
    var target = process.cwd();
    var options = {
        filter: filepath => {
            if(filepath === source) return true;
            var relative = filepath.replace(source+path.sep, '');
            return !ig.ignores(relative);
        }
    }

    ncp(source, target, options, (err) => {
        if(err) return console.error(err);
    });
}

function addScripts() {
    var packagePath = path.join(process.cwd(), 'package.json');
    var packageContents = fs.readFileSync(packagePath);
    var packageData = JSON.parse(packageContents);

    packageData.scripts = packageData.scripts || {};
    packageData.scripts.start = 'marko-app start';
    packageData.scripts.build = 'marko-app build';
    packageData.scripts.eject = 'marko-app eject';

    packageContents = JSON.stringify(packageData, null, 2);
    fs.writeFileSync(packagePath, packageContents);
}