// .eslintrc.cjs (or .eslintrc.js)
module.exports = {
    // ...existing config...
    rules: {
        // forbid using raw gql/DocumentNode in app code
        "no-restricted-imports": ["error", {
            "paths": [
                { "name": "@apollo/client", "importNames": ["gql"], "message": "Use generated hooks instead of gql." },
                { "name": "graphql-tag", "message": "Use generated hooks instead of gql." }
            ]
        }]
    }
};
