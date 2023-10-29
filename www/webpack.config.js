
const path = require("path")

module.exports = {
    entry: "./bootstrap.ts",
    output: {
        path: path.resolve(__dirname, "public"),
        filename: "bootstrap.js"
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
    //   plugins: [
    //     new CopyWebpackPlugin({
    //       patterns: [
    //         {
    //           from: "./index.html",
    //           to: "./",
    //         },
    //       ],
    //     }),
    //   ],
}