'use strict';

var http = require('http');


global.fetch = require('node-fetch');
global.Promise = require('bluebird');
global.fetch.Promise = global.Promise;


var staticServer = require('./file-server');
var proxyCw = require('./proxy-cw');

var assign = require('./Object.assign');


var defaultConfig = {
    proxyHostname: 'localhost',
    proxyPort: '8080',
    proxyRe: /^\/cw/,
    dataRe: /^\/data/,
    publicPath: 'public'
};

function start(config) {
    config = assign({}, defaultConfig, config);

    proxyCw.configure(config);
    staticServer.configure(config);

    function onRequest(req, res) {
        console.log('url', req.url);

        if (config.dataRe.test(req.url)) {
            console.log('\tdata url => serve file');
            staticServer(req, res);
            return;
        } else if (config.proxyRe.test(req.url)) {
            console.log('\tcw url => proxy');
            proxyCw(req, res);
            return;
        } else {
            config.otherUrlCb(req, res);
        }

    }

    http.createServer(onRequest).listen(3000);
    console.log('listening on 3000');

}

exports.start = start;

