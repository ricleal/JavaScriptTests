module.exports = {
    entry: "./entry.js",
    output: {
        path: __dirname,
        filename: "bundle.js"
    },
    module: {
        loaders: [{
            test: /\.css$/,
            include: [
                path.resolve(__dirname, "assets")
            ],
            loader: "style!css"
        }]
    }
};
