/* There's two types of comment.
 * # A single line.
 * <= Multiple
 * Lines
 * =>
 */
const commentRegex = /#.*|<=[^]*=>/g;

/* Format of the section is:
 * [Section]
 */
const sectionRegex = /\[[^]*\]/g;

const sectionBracketRegex = /^\[|\]$/mg;

/* Format of the option is:
 * key=value
 */
const optionRegex = /.*=.*/g;

class ConfigParser {
    static parse(config) {
        config = config.trim();
        config = removeComments(config);
        let result = getResult(config);
        return result;
    }

    static stringify(obj) {
        var config = '';
        for (var name in obj) {
            var sectionName = [...name];
            sectionName[0] = sectionName[0].toUpperCase();
            sectionName = sectionName.join('');
            sectionName = `[${sectionName}]\n`;
            config += sectionName;
            var section = obj[name];
            for (var option in section) {
                var value = section[option];
                config += `${option}=${value}\n`;
            }
            config += '\n';
        }
        config = config.trim();
        return config;
    }

    static toJSON(config) {
        return JSON.stringify(this.parse(config));
    }

    static fromJSON(json) {
        return this.stringify(JSON.parse(json));
    }
}

function getResult(config) {
    let lines = config.split('\n');
    let sections = parseSections(lines);
    let options = parseOptions(sections);
    return options;
}

function parseOptions(sections) {
    // {s:["a=b","b=c"]} -> {s:{a:b,b:c}}
    let options = {};
    for (var name in sections) {
        let section = sections[name];
        options[name] = {};
        section.forEach((option, i) => {
            let divide = option.split('=');
            if (divide[0] && divide[1]) {
                let left = divide[0].trim();
                let right = divide[1].trimLeft();
                options[name][left] = right;
            }
        });
    }
    return options;
}

function parseSections(lines) {
    let indexes = [];
    let splices = [];
    let cp = [];
    const ori = [...lines];
    for (var i = 0; i < ori.length; i++) {
        let line = ori[i];
        if (!line) {
            splices.push(i);
        }
    }
    ori.forEach((line, i) => {
        if (!splices.includes(i)) {
            cp.push(line);
        }
    });
    cp.forEach((line, i) => {
        if (line.match(sectionRegex)?.[0] === line) {
            indexes.push(i);
        }
    });
    let _sections = [];
    indexes.forEach((index, i) => {
        let start = index;
        let end = indexes[i +1] || cp.length;
        _sections.push(cp.slice(start, end));
    });
    let sections = {};
    _sections.forEach((section, i) => {
        let name = section.splice(0, 1)[0].replace(sectionBracketRegex, '').toLowerCase().trim();
        sections[name] = [];
        section.forEach(options => {
            sections[name].push(options);
        });
    });
    return sections;
}

function removeComments(config) {
    let cfg = config.replace(commentRegex, '');
    return cfg;
}

module.exports = ConfigParser;
