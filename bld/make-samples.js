const path = require('path');
const fs = require('fs');
const spawn = require('child_process').spawn;
const resultDir = path.join(__dirname, '../sprites');
const samplesDir = path.join(__dirname, '../samples');
const jarPath = path.join(__dirname, '../artifacts/plantuml.jar');

const folders = fs.readdirSync(resultDir).filter(name => fs.statSync(path.join(resultDir, name)).isDirectory());
folders.map(name => {
    const folderPath = path.join(resultDir, name);
    const files = fs.readdirSync(folderPath).filter(file => file.indexOf('.puml') > 0 && file.indexOf('_all.puml') === -1);
    var icons = files.map(fileName => {
        const basename = path.basename(fileName, '.puml');
        const imgName = "MSIMG_" + basename.replace(/_/g, '').toUpperCase();
        return  `| [${fileName}](${fileName}) ` +
                `| ![${imgName}_C](${basename.toLowerCase()}.png) ` +
                `| ![${imgName}_M](${basename.toLowerCase()}_mono.png) ` +
                `| ![${imgName}_G](${basename.toLowerCase()}_gray.png) ` +
                `| \n`;
    }).join('');
    var content = `# ${name}\n\n|   |   |   |   |\n|---|---|---|---|\n${icons}`;
    const filepath = path.join(resultDir, name, 'README.md');
    fs.writeFileSync(filepath, content);
});

var sampleFiles = fs.readdirSync(samplesDir).filter(x => x.substr(0,1) !== '_' && path.extname(x) === '.puml');
sampleFiles.map(filename => spawn('java', ['-jar', jarPath, path.join(samplesDir, filename)]));
var readme = '# Samples\n\nSee the various samples:\n\n' +
            sampleFiles.map(filename => `* [${path.basename(filename, '.puml')}](${filename})\n`).join('') +
            '\n\n## Content of samples\n\n' +
            sampleFiles.map(filename => `### ${path.basename(filename, '.puml')}\n\n![${filename}](${path.basename(filename, '.puml')}.png)\n\n`).join('')
            ;
fs.writeFileSync(path.join(samplesDir, 'README.md'), readme);
