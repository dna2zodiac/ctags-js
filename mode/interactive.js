/*
 CTags:
 - request { command, filename, size }
 - reply
   - common { _type, name, version }
   - compelete +{ command }
   - error +{ message, fatal }
   - token +{ path, language, lie, kind, end, scope, scopeKind, access, file, signature, pattern }
 */

const readline = require('readline');
const iVersion = require('../version');
const iTask = require('../util/task');

const nop = () => {};
const runner = new iTask.TaskRunner();

function bootstrap (opt) {
   runner.Register('generate-tags', generateTags);

   const rl = readline.createInterface({
      input: process.stdin,
      output: process.stdout,
      terminal: false,
   });
   rl.on('line', async (line) => {
      try {
         out({
            _type: "program",
            name: "Ctags-JS",
            version: iVersion.version,
         });
         const json = JSON.parse(line);
         runner.Push(json.command, json).then(nop, (err) => {
            if (err === 'NoSupportedRunner') {
               out({
                  _type: "error",
                  message: `Unknow Command (${json.command})`,
                  fatal: false,
               });
            } else {
               out({
                  _type: "error",
                  message: `Unexpected Error (${err})`,
                  fatal: false,
               });
            }
         }).catch((err) => {
            out({
               _type: "error",
               message: `Unexpected Error (catch: ${err})`,
               fatal: false,
            });
         });
      } catch(err) {
         out({
            _type: "error",
            message: "Invalid Json",
            fatal: false,
         });
      }
   });
}

async function generateTags(obj) {
   const filename = obj.filename;
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
