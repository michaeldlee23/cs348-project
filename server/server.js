'use strict';

const process = require('process');
const http = require('http');
const app = require('./app');

const port = process.env.PORT || 7777;
const server = http.createServer(app);

server.listen(port, () => {
    console.log(`Server started on port ${port}`);
});
