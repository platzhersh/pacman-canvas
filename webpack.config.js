const path = require('path');

module.exports = (env) => {

    console.log('NODE_ENV: ', env.NODE_ENV);
    return {
        entry: './',
        mode: 'development',
        devServer: {
            port: 4200,
            hot: true,
            open: true,
            openPage: 'index.htm'
        }
    }
};