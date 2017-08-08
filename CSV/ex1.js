/*

npm install --save-dev papaparse fs

*/
fs = require('fs');
pp = require('papaparse');

function beforeFirstChunk1D(chunk) {
  // Split the text into rows
  var rows = chunk.split(/\r\n|\r|\n/);

  var delimiterRegex = /([\s,]+)/g;
  // Find the delimiter on 3rd row
  var match = delimiterRegex.exec(rows[2]);
  var delimiter = match[1];
  var header = rows[0];

  if (header.startsWith("#")) {
    header = header.replace(/#\s*/, '');
    header = header.split(/[\s,]+/).join(delimiter);
  }

  rows[0] = header.toLowerCase();
  // Remove the 2nd row if it's not data
  if (rows[1].length <= 2) {
    rows.splice(1, 1);
  }
  return rows.join("\r\n");
}
// files endind in Iq.txt
config1D =
    {
      header : true,
      dynamicTyping : true, // parse string to int
      delimiter : "",       // auto-detect
      newline : "",         // auto-detect
      quoteChar : '"',
      skipEmptyLines : true,
      beforeFirstChunk : beforeFirstChunk1D
    }

function beforeFirstChunk2D(chunk) {
  // Split the text into rows
  var rows = chunk.split(/\r\n|\r|\n/);
  var header = rows[0];
  header = header.replace(/,/, '');
  if (header.startsWith("Data columns")) {
    header = header.replace(/Data columns\s*/, '');
    header = header.split(/[\s,-]+/).join("  ");
  }
  rows[0] = header.toLowerCase();
  // Remove the 2nd row if it's not data
  if (rows[1].split(/[\s,-]+/).length <= 2) {
    rows.splice(1, 1);
  }
  return rows.join("\r\n");
}

// files endind in Iqxy.dat
config2D = {
  header : true,
  dynamicTyping : true, // parse string to int
  delimiter : "  ",
  newline : "", // auto-detect
  quoteChar : '"',
  skipEmptyLines : true,
  beforeFirstChunk : beforeFirstChunk2D
}

var data1D = fs.readFileSync(
    '/home/rhf/git/sns-plot-fit/src/assets/datasets/b_data/CG2_exp158_scan0039_0001_Iq.txt',
    // '/home/rhf/git/sns-plot-fit/src/assets/datasets/b_data/Si_8m12A_abs_1.txt',
    'utf8');

var data2D = fs.readFileSync(
    '/home/rhf/git/SANSAnisotropic/Data/test-more-data-7-6-16/BioSANS_exp134_scan0012_0001_Iqxy.dat',
    'utf8');

var results1D = pp.parse(data1D, config = config1D, );

//  console.log(results1D);

var results2D = pp.parse(data2D, config = config2D, );

// console.log(results2D);

//
// To check the file names:
//
var filename = "CG2_exp158_scan0039_0001_Iq.txt";
// var filename = "BioSANS_exp134_scan0012_0001_Iqxy.dat";

if (/.*Iq.txt$/.exec(filename))
  console.log(results1D);
else if (/.*Iqxy.dat$/.exec(filename))
  console.log(results2D);
else return undefined;