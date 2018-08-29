'use strict';

const express = require('express');
const app = express();
const http = require('http').Server(app);
const PORT = 1067;

app.use(express.static('assets'));
http.listen(PORT);
