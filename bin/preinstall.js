var fs = require('fs');
var resolve = require('path').resolve;
var join = require('path').join;
var cp = require('child_process');

// This script fails on windows.
if(/^win/.test(process.platform)) {
    console.log('manually run the following command:');
    console.log('pushd lib/fetch && npm install && popd');
    return;
}

// get library path
var lib = resolve(__dirname, '../lib/');

fs.readdirSync(lib)
  .forEach(function (mod) {
    var modPath = join(lib, mod);
 
    // ensure path has package.json
    if (!fs.existsSync(join(modPath, 'package.json'))) return;
 
    // install folder
    cp.spawn('npm', ['i'], { env: process.env, cwd: modPath, stdio: 'inherit' });
  });
