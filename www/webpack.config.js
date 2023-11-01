
const path = require("path")

module.exports = {
    entry: "./bootstrap.ts",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bootstrap.js"
    },
    devServer: {
      host: '0.0.0.0',
      port: 3000
    },
    mode: "development",
    module: {
        rules: [
          {
            test: /\.tsx?$/,
            use: 'ts-loader',
            exclude: /node_modules/,
          },
        ],
      },
      resolve: {
        extensions: ['.tsx', '.ts', '.js'],
      },
}