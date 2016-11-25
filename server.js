import express from 'express';
import graphQLHTTP from 'express-graphql';
import path from 'path';
import webpack from 'webpack';
import WebpackDevServer from 'webpack-dev-server';
import {schema} from './data/schema';
import {parcelChecking} from './scripts/trackParcels'
import schedule from 'node-schedule';

//
const APP_PORT = 3333;
const GRAPHQL_PORT = 8080;

// Expose a GraphQL endpoint
const graphQLServer = express();


var j = schedule.scheduleJob('* * 22 * * *', function(){
    parcelChecking();
    console.log('The answer to life, the universe, and everything!');
});

graphQLServer.use('/', graphQLHTTP({schema, pretty: true, graphiql: true}));
graphQLServer.listen(GRAPHQL_PORT, () => console.log(
    `GraphQL Server is now running on http://localhost:${GRAPHQL_PORT}`
));

// Serve the Relay app
const compiler = webpack({
    entry: path.resolve(__dirname, 'js', 'app.js'),
    module: {
        loaders: [
            {
                exclude: /node_modules/,
                loader: 'babel',
                test: /\.js$/,
            },
            {
                test: /\.json$/,
                loader: "json",
            },
        ],
    },
    output: {filename: 'app.js', path: '/'},
    node: {
        console: true,
        fs: 'empty',
        net: 'empty',
        tls: 'empty'
    }
});
const app = new WebpackDevServer(compiler, {
    contentBase: '/public/',
    proxy: {'/graphql': `http://localhost:${GRAPHQL_PORT}`},
    publicPath: '/js/',
    stats: {colors: true},
});
// Serve static resources
app.use('/', express.static(path.resolve(__dirname, 'public')));
app.listen(APP_PORT, () => {
    console.log(`App is now running on http://localhost:${APP_PORT}`);
});
