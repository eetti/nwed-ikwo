const fs = require("fs");
var JSSoup = require('jssoup').default;


if (process.argv.length <= 2) {
    console.log("Usage: " + __filename + " path/to/directory");
    process.exit(-1);
}

var path = process.argv[2];

let createStmt = createTable();


var stream = fs.createWriteStream("my_file.txt");
stream.once('open', function (fd) {
    stream.write(createStmt);
    fs.readdir(path, function (err, items) {
        // console.log(items[0]);

        // console.log(items[i],i);
        for (var i = 0; i < items.length; i++) {
            // console.log(items[i]);
            let number = (items[i]).split(".html")[0];
            fs.readFile(path + items[i], 'utf8', function (err, data) {
                if (err) throw err;

                let resp = soupParse(data);
                // let number = (items[i - 1]).split(".html")[0];
                let statment = insertStatment(number, resp);
                stream.write(statment);
                // console.log(resp,statment);
                

            });
            if (i == items.length) {
                stream.end();
            }
        }
    });

    // stream.end();

});


function soupParse(data) {
    var soup = new JSSoup(data);
    // var div = soup.findAll('div', 'verse');
    // var b = div.nextElement;
    // console.log(div.length);
    // div.forEach(hymn => {
    var hymn_content = "";
    var hymns = soup.findAll('p');
    // console.log(hymns.length);
    const set1 = new Set();
    hymns.forEach(hymn => {
        // console.log(new JSSoup(hymn.nextElement).prettify());
        let content = new JSSoup(hymn.nextElement).prettify();
        // console.log(content, "hello");
        set1.add(content)

        // if (typeof content != "number") {
        //     hymn_content += content;
        //     hymn_content += " ";
        // }
    });
    var iterator1 = set1.values();
    let content = "";
    while (content != undefined) {
        content = iterator1.next().value
        if (content != undefined) {
            // console.log(me);
            hymn_content += content;
            hymn_content += " ";
        }
    }
    // console.log(new JSSoup(hymn.nextElement.nextElement.nextElement).prettify());
    // });
    // var hymn_numbers = soup.findAll('p', 'verse-number');
    // console.log(hymn_numbers.length);
    // hymn_numbers.forEach(number => {
    //     console.log(new JSSoup(number.nextElement).prettify());
    // });
    // console.log(hymn_numbers[0].nextElement._text);
    // console.log(new JSSoup(hymn_numbers[0].nextElement).prettify());
    // console.log(hymn_numbers[0].attrs);

    return hymn_content;
}

function insertStatment(number, hymn) {
    let statment = `INSERT INTO hymn (id,content) values(${number},"${hymn}");\n`;
    return statment;
}

function createTable() {
    let statment = `CREATE TABLE hymn (id INTEGER PRIMARY KEY,content TEXT NOT NULL);\n`

    return statment;
}