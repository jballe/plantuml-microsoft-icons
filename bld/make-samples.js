const path = require('path');
const fs = require('fs');
const spawn = require('child_process').spawn;
const resultDir = path.join(__dirname, '../sprites');
const samplesDir = path.join(__dirname, '../samples');
const jarPath = path.join(__dirname, '../artifacts/plantuml.jar');

const folders = fs.readdirSync(resultDir).filter(name => fs.statSync(path.join(resultDir, name)).isDirectory());
folders.map(name => {
    const folderPath = path.join(resultDir, name);
    const files = fs.readdirSync(folderPath).filter(file => file.indexOf('.puml') > 0);
    const content = '@startuml\n' +
        '!include styling.puml \n' +
        'left to right direction\n' +
        '!define MS_SPRITESPATH https://raw.githubusercontent.com/jballe/plantuml-microsoft-icons/master/sprites\n' +
        `!include ../sprites/${name}.puml\n` +
        `rectangle "${path.basename(name)}" {\n` +
        files.map(fileName => {
            const basename = path.basename(fileName, '.puml');
            const imgName = "MSIMG_" + basename.replace(/_/g, '').toUpperCase();
            return `  rectangle "${basename}" { \n    component "${imgName}_M" \n    component "${imgName}_C" \n  }`;
        }).join('\n') +
        '\n} \n@enduml';
    const filepath = path.join(samplesDir, name + '.puml');
    fs.writeFileSync(filepath, content);
});

var sampleFiles = fs.readdirSync(samplesDir).filter(x => path.extname(x) === '.puml');
sampleFiles.map(filename => spawn('java', ['-jar', jarPath, path.join(samplesDir, filename)]));
var readme = '# Samples\n\nSee the various samples:\n\n' +
            sampleFiles.map(filename => `* [${path.basename(filename, '.puml')}](${filename})\n`).join('') +
            '\n\n## Content of samples\n\n' +
            sampleFiles.map(filename => `### ${path.basename(filename, '.puml')}\n\n![${filename}](${path.basename(filename, '.puml')}.png)\n\n`).join('')
            ;
fs.writeFileSync(path.join(samplesDir, 'README.md'), readme);
