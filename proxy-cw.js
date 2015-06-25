'use strict';

var http = require('http');


var config = {};

function proxy(client_req, client_res) {

    var options = {
        hostname: config.hostname,
        port: config.port,
        path: client_req.url.replace(config.basePathRe, ''),
        headers: client_req.headers
    };

    http.request(options, function(res) {
        copyHeaders(res, client_res);
        res.pipe(client_res);
    }).end();
}

proxy.configure = function configure(mainConfig) {
    config.hostname = mainConfig.proxyHostname;
    config.port = mainConfig.proxyPort;
    config.basePathRe = mainConfig.proxyRe;
};

function copyHeaders(reqFrom, reqTo) {
    var headersOfInterest = ['date', 'content-type',
                             'content-length',
                             'date', 'last-modified',
                             'set-cookie'];
    var headersFrom = reqFrom.headers;
    for (var i = 0, header ; header = headersOfInterest[i] ; i++ ) {
        if (header in headersFrom) {
            reqTo.setHeader(header, headersFrom[header]);
        }
    }
}


module.exports = proxy;

