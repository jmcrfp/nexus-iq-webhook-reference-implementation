/*
 * Copyright (c) 2018-present Sonatype, Inc.
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *      http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

const serverless = require('serverless-http');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const validator = require('./src/webhook-signature-validator');
const mapper = require('./src/nexus-webhook-mapper');
const request = require('request');

app.use(bodyParser.json({strict: false}));

app.post('/', function(req, res) {
  if (!validator.validate(req, process.env.NEXUS_SECRET_KEY)) {
    res.status(401).send({error: 'Not authorized'});
    return;
  }
  const asset = mapper.map(req.body);
  if (asset) {
    request(process.env.NEXUS_WEBHOOK_URL+asset, function (error, response, body) {
      if (error) {
        console.error(error);
        res.status(500).send({error: error});
        return;
      }
      res.send(`Refreshed: ${asset}`);
    });
  } else {
    res.send('Nothing refreshed');
  }
});
module.exports.handler = serverless(app);
