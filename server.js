var connect = require("connect"),
    serveStatic = require("serve-static");

var app = connect().use(serveStatic('./'));

app.listen(5000);
