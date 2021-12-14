const usage = `[usage] universal-ctags
--_interactive   enable interactive mode; use stdin to get and run
                 commands to extract source code into tokens
                 current supported command:
                    - generate-tags: args(filename)
                      generate tokens for specified file
`;

module.exports = {
   usage,
};
