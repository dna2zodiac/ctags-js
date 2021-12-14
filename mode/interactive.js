/*
 CTags:
 - request { command, filename, size }
 - reply
   - common { _type, name, version }
   - compelete +{ command }
   - error +{ message, fatal }
   - token +{ path, language, lie, kind, end, scope, scopeKind, access, file, signature, pattern }
 */

const iVersion = require('../version');

function bootstrap (opt) {
   const readline = require('readline');
   const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
   });
   rl.on('line', async (line) => {
      try {
         dispatch(JSON.parse(line));
      } catch(err) {
         // TODO: deal with dispatch can throw errors
         out({
            _type: "error",
            message: "Invalid Json",
            fatal: false,
         });
      }
   });
}

function dispatch(json) {
   const cmd = json.command;
   switch (cmd) {
   case 'generate-tags':
      generateTags(json);
      break;
   default:
      out({
         _type: "error",
         message: `Unknow Command (${cmd})`,
         fatal: false,
      });
   }
}

function generateTags(obj) {
   const filename = obj.filename;
   out({
      _type: "program",
      name: "Ctags-JS",
      version: iVersion.version,
   });
   // _type, name, path, pattern, kind, scope, scopeKind
   out({
      _type: "completed",
      command: obj.command,
   });
}

function out(json) {
   console.log(JSON.stringify(json));
}

module.exports = {
   bootstrap,
};
