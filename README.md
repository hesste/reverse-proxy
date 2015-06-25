reverse-proxy is an http server which serve static files for request with
user-defined path url (default to `/data/`), proxy request on another
user-defined path url (default to `/cw/`).

For all others url this server will call a user-defined callback with `res` and
`req` parameter from node `http` module.

For now the aim is to keep it as simple as possible.  But obviously next step
will be to use dedicated npm packages for proxy (for example `http-proxy`) and
static file server (for example `ecstatic`).
