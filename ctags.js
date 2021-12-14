const iVersion = require('./version');
const iHelp = require('./help');

function usage () {
   console.log(iHelp.usage);
   process.exit(1);
}

function version() {
   console.log(`Ctags-JS ${iVersion.version}`);
   process.exit(1);
}

function parseArgs() {
   const opt = {
      interactive: false,
      inputs: [],
   };
   for (let i = 2; i < process.argv.length; i++) {
      i = eat(process.argv, i, opt);
   }
   return opt;

   function eat(list, i, opt) {
      const arg = list[i];
      const parts = arg.split('=');
      const argcmd = parts[0];
      switch(argcmd) {
      case '--_interactive':
         let value = false;
         if (parts.length > 1) {
            value = !(arg.substring(argcmd.length+1) === 'false');
         } else if (eatNext(list, i) > i) {
            value = !(list[++i] === 'false');
         } else {
            value = true;
         }
         opt.interactive = value;
         break;
      case '-v': case '--version':
         version();
         break;
      case '-h': case '--help':
         usage();
         break;
      default:
         opt.inputs.push(arg);
      }
      return i;
   }

   function eatNext(list, i) {
      const val = list[i+1];
      if (val && val.startsWith('-')) {
         return i;
      } else {
         return i+1;
      }
   }
}

function bootstrap(opt) {
   if (opt.interactive) {
      const sub = require('./mode/interactive');
      sub.bootstrap(opt);
   } else {
   }
}

// initialize();

function main() {
   const opt = parseArgs();
   bootstrap(opt);
}

main();
