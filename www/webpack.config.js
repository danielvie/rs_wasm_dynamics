
const path = require("path")

module.exports = {
    entry: "./bootstrap.ts",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bootstrap.js"
    },
    mode: "development",
}