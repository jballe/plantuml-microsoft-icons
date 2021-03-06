const path = require('path');
const fs = require('fs');
const recursive = require('recursive-readdir');
const asciify = require('asciify-image');
const im = require('imagemagick');

const artifactsDir = path.join(__dirname, '../artifacts');
const symbolsDir = path.join(artifactsDir, 'Microsoft_CloudnEnterprise_Symbols_v2.7KP/Symbols');
const resultDir = path.join(__dirname, '../sprites');
if(!fs.existsSync(resultDir)) {
    fs.mkdirSync(resultDir);
}

function ignoreFile(file, stats) {
    if(stats.isDirectory()) return false;
    if(path.extname(file) !== '.png') return true;
    const basename = path.basename(file);
    //if(basename.match(/[\s_](color|copy)$/i)) return true;
    //return !basename.match(/azure.*app.*service/i);
    return false;
}

// change chars to plantuml format
// asciify format:
// Set of basic characters ordered by increasing "darkness"
var chars =        ' .,:;i1tfLCG08@';
var replacements = 'FFFFE9855310000';
var map = [];
for(var index = 0; index<chars.length; index++) {
    var c = chars[index];
    var replacement = replacements[index]; //index.toString(16).toUpperCase();
    var encoded = c.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    var regex = new RegExp(encoded, 'g');
    map.push({ regex: regex, char: c, replacement: replacement});
}
map = map.reverse();

function asciifyToPlantuml(spriteArray, size) {
    for(var index=0; index<spriteArray.length; index++) {
        var lineArray = spriteArray[index];
        var line = lineArray.join('');
        for(var o of map) {
            line = line.replace(o.regex, o.replacement);
        }    

        // var charsToAdd = size - line.length;
        // var charsToAddAtTop = Math.floor(charsToAdd / 2);
        // var charsToAddAtBottom = charsToAdd - charsToAddAtTop;
        // line = emptyLines(1, charsToAddAtTop).join('') + line + emptyLines(1, charsToAddAtBottom).join('');
        spriteArray[index] = line;
    }

    //var linesToAdd = size - spriteArray.length;
    //if(linesToAdd > 0) {
    //    var linesToAddAtTop = Math.floor(linesToAdd / 2);
    //    var linesToAddAtBottom = linesToAdd - linesToAddAtTop;
//
    //    var arrayToAddAtTop = emptyLines(linesToAddAtTop, size);
    //    spriteArray.splice.apply(spriteArray, [0,0].concat(arrayToAddAtTop));
    //    spriteArray.splice.apply(spriteArray, [spriteArray.length, 0].concat(emptyLines(linesToAddAtBottom, size)));
    //}

    var sprite = spriteArray.join('\n');
    return sprite;
}

const defineUrl = '!ifdef MS_SPRITESPATH\n!else\n!define MS_SPRITESPATH https://raw.githubusercontent.com/jballe/plantuml-microsoft-icons/master/sprites\n!endif\n\n';


recursive(symbolsDir, [ignoreFile]).then(files => {
    console.log(`Processing ${files.length} files...`);
    return files.map(file => {
        
        if(path.extname(file) !== '.png') {
            console.log('ignore ' + file);
            return null;
        }

        const relPath = file.substr(symbolsDir.length);
        let folderName = relPath.split(path.sep)[1].replace('CnE_', '');
        const origFileName = path.basename(file, '.png');
        let fileName = origFileName.toLowerCase().replace(/[^a-z0-9\s\-\_]/ig, '');
        fileName = fileName.replace(/[\s\-\_]+copy/ig, '');
        fileName = fileName.replace(/[\s\-\_]+/g, '_');

        const targetFolder = path.join(resultDir, folderName);
        if(!fs.existsSync(targetFolder)) {
            fs.mkdirSync(targetFolder);
        }

        const size = 48;

        // Copy image
        const originalCopiedPath = path.join(targetFolder, fileName + '_orig.png');
        const imagePath = path.join(targetFolder, fileName + '.png');
        const grayPath =  path.join(targetFolder, fileName + '_gray.png');
        const monoPath =  path.join(targetFolder, fileName + '_mono.png');

        if(!fs.existsSync(originalCopiedPath)) {
            fs.writeFileSync(originalCopiedPath, fs.readFileSync(file));
        }

        im.resize({
            srcPath: originalCopiedPath,
            dstPath: imagePath,
            format: 'png',
            width: size,
            height: size,
            sharpening: 0,
            strip: false,
            filter: null
        }, (err) => { if(err) { console.warn('error while creating resized img', file, err.message, imagePath); return;} });
        im.resize({
            srcPath: originalCopiedPath,
            dstPath: grayPath,
            format: 'png',
            width: size,
            height: size,
            sharpening: 0,
            strip: false,
            filter: null,
            colorspace: 'gray'
        }, (err) => { if(err) { console.warn('error while creating grayscale img', file, err.message, imagePath); return;} });
        im.resize({
            srcPath: originalCopiedPath,
            dstPath: monoPath,
            format: 'png',
            width: size,
            height: size,
            sharpening: 0,
            strip: false,
            filter: null,
            colorspace: 'gray',
            customArgs: [
                '-background', 'white', 
                '-alpha', 'remove',
                '-depth', '8', 
                '-auto-level', 
                '-contrast',
                '-separate'
            ]
        }, (err) => {
            if(err) { console.warn('error while creating mono img', file, err.message, grayPath); return; }
            // Make sprite
            return asciify(monoPath, {
                fit: 'box',
                width: size,
                height: size,
                color: false,
                format: 'array',
                c_ratio: 1

            }).then(spriteArray => {

                var sprite = asciifyToPlantuml(spriteArray, size);
                //console.log(fileName);
                var format = `${spriteArray.length}x${spriteArray[0].length}`;
                const imgName = "MSIMG_" + fileName.replace(/_/g, '').toUpperCase();
                const localVarName = fileName.replace(/_/g, '').toLowerCase();
                const content = `@startuml\nsprite \$${localVarName} [${format}/16] {\n${sprite}\n}\n\n`
                    + defineUrl
                    +  `!define ${imgName}_G <img:MS_SPRITESPATH/${folderName}/${fileName}_gray.png>\n`
                    +  `!define ${imgName}_B <img:MS_SPRITESPATH/${folderName}/${fileName}_mono.png>\n`
                    +  `!define ${imgName}_C <img:MS_SPRITESPATH/${folderName}/${fileName}.png>\n`
                    // + `!define ${entityName}(_alias) ENTITY(rectangle,black,${localVarName},_alias,${stereoName})\n`
                    // + `!define ${entityName}(_alias, _label) ENTITY(rectangle,black,${localVarName},_label, _alias,${stereoName})\n`
                    // + `!define ${entityName}(_alias, _label, _shape) ENTITY(_shape,black,${localVarName},_label, _alias,${stereoName})\n`
                    // + `!define ${entityName}(_alias, _label, _shape, _color) ENTITY(_shape,_color,${localVarName},_label, _alias,${stereoName})\n`
                    // + `skinparam folderBackgroundColor<<${stereoName}>> White\n`
                    + `@enduml`
                ;
                const fullPath = path.join(targetFolder, fileName + '.puml');
                fs.writeFileSync(fullPath, content);
            });
        }); 
    });
}).then(() => {
    const folders = fs.readdirSync(resultDir).filter(name => fs.statSync(path.join(resultDir, name)).isDirectory());
    const allFileName = '_all.puml';
    folders.map(name => {
        const folderPath = path.join(resultDir, name);
        const files = fs.readdirSync(folderPath).filter(file => file.indexOf('.puml')>0 && file !== allFileName);
        const content = '@startuml\n' + defineUrl +
                        files.map(fileName => `!includeurl MS_SPRITESPATH/${name}/${fileName}`).join('\n') +
                        //files.map(fileName => `!include ${name}/${fileName}`).join('\n') +
                        '\n@enduml';
        fs.writeFileSync(path.join(resultDir, name, allFileName), content);

    });
});