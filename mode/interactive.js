/*
 CTags:
 - request { command, filename, size }
 - reply
   - common { _type, name, version }
   - compelete +{ command }
   - error +{ message, fatal }
   - token +{ path, language, line, kind, end, scope, scopeKind, access, file, signature, pattern }
 */

const readline = require('readline');
const iVersion = require('../version');
const iTask = require('../util/task');
const iLazac = require('../lazac');

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
   /*
      in zoekt,
         _type, name, line, path, kind, scope, scopeKind,
         language, pattern, signature
      are used; but only name, language and line are used for indexing
      ref: https://github.com/sourcegraph/go-ctags/blob/main/ctags.go#L19
      ref: https://github.com/sourcegraph/zoekt/blob/master/build/ctags.go#L210

      moreover, now go-enry is used to replace ctags language field
      ref: https://github.com/sourcegraph/zoekt/commit/d86fb30b50bafb17dec50c2fa5f74ac285e14b16
      ref: https://github.com/sourcegraph/zoekt/blob/master/indexbuilder.go#L436
    */
   await iLazac.ParseFile(obj.filename);
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
