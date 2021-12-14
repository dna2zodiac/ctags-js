const iLFile = require('../util/large_file');

async function ParseLine (line, stat, opt) {
   // TODO: do analysis
   console.log(line);
}

async function Parse (text, opt) {
   let stat = {};
   const lines = text.split('\n');
   for (let i = 0, n = lines.length; i < n; i++) {
      const line = lines[i];
      stat = await ParseLine(line, stat, opt);
   }
}

async function ParseFile (filename, opt) {
   // TODO: check binary file
   // TODO: guess language
   const lr = new iLFile.LineReader(filename);
   let stat = {}, line;
   await lr.Open();
   // a little bit urgly but we can have a const `line`
   while (true) {
      const line = await lr.NextLine();
      if (line === null) break;
      stat = await ParseLine(line, stat, opt);
   };
   await lr.Close();
}

module.exports = {
   Parse,
   ParseLine,
   ParseFile,
};
