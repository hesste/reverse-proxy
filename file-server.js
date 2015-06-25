'use strict';

var fsPath = require('path'),
    fs = require('fs');

var mimetypes = {
    '.js': 'application/javascript',
    '.txt': 'text/plain'
};

var config = {};

function servePublicFile(httpReq, httpRes) {

    var relativePath = httpReq.url.replace(config.basePathRe, ''),
        path = fsPath.join(config.publicPath, relativePath);

    fs.exists(path, function(ok) {
        if (ok) {
            var ext = fsPath.extname(path);
            if (ext in mimetypes) {
                httpRes.setHeader('Content-Type', mimetypes[ext]);
            }
            var stream = fs.createReadStream(path);
            stream.pipe(httpRes);
        } else {
            var body = 'not found';
            httpRes.writeHead(404, {
                'Content-Length': body.length,
                'Content-Type': 'text/plain'
            });
            httpRes.end(body);
        }
    });
}

servePublicFile.configure = function configure(mainConfig) {
    config.publicPath = mainConfig.publicPath;
    config.basePathRe = mainConfig.dataRe;
};

module.exports = servePublicFile;
