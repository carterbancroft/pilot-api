// Rules for our Node code. The first number is the warning level as reported by
// eslint, the rest are settings for the error.

const OFF = 0;
const WARNING = 1;
const ERROR = 2;

module.exports = {
    "parserOptions": {
        "ecmaVersion": 2017
    },
    "rules": {
        // 4 space indent
        "indent": [
            ERROR,
            4
        ],
        // Disabled: enforce single quoted strings
        "quotes": [
            OFF,
            "single"
        ],
        // unix style line endings
        "linebreak-style": [
            ERROR,
            "unix"
        ],
        // Disallow semi-colons, except where necessary to disambiguate
        // statements
        // http://eslint.org/docs/rules/semi
        "semi": [WARNING, "never"],
        // Helps cover some ambiguous semi-colon cases, where auto-inserted
        // semi-colons might make a code portion unreachable unexpectedly
        // http://eslint.org/docs/rules/no-unreachable
        "no-unreachable": [ERROR],
        // Helps cover more semi-colon cases where a newline may not terminate
        // an expression as expected when the following tokens are valid
        // continuations of those expressions
        // http://eslint.org/docs/rules/no-unexpected-multiline
        "no-unexpected-multiline": [ERROR],
        // 80 char line limit. The 4 means tabs == 4 chars
        "max-len": [ERROR, 80, 4],
        // Variables must be used but params don't need to be
        "no-unused-vars": [ERROR, {"vars": "all", "args": "none"}],
        // Disable comma dangle rule. With or without dangling commas is allowed
        "comma-dangle": [OFF],
        // Turn off indentation rules for now. Mostly because it's all over the
        // place in our code.
        "indent": [OFF],
        // Turn off rule to disable console statements.
        "no-console": [OFF]
    },
    // Make these includes available so eslint doesn't complain about it
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    // Inherit from eslint's recommended settings
    "extends": "eslint:recommended"
};
