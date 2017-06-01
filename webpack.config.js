
module.exports = {
    entry:"./libs/index.js",
    output:{
        libraryTarget: "umd",
        library: "reducerContainer",
        path:__dirname,
        filename:"index.js"
    },
    externals: {
        "immutable": "immutable"
    },
   
    module:{
        loaders:[
            {
                test:/.*\.css$/,
                loaders:["style","css"],
                exclude:'/node_modules/'
            }
        ]
    },
    resolve:{
        extensions:['.css','.js','jsx']
    }
};