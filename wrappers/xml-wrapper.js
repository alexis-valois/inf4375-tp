var logger = require('../logger');
/*
 * Copyright 2012 Jacques Berger.
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
var http = require("http");
var xml = require('xml2js');

module.exports = XmlWrapper;

function XmlWrapper(){}

XmlWrapper.prototype.getJsObjFromXml = function (xmlString, elementName, callback){
  xml.parseString(xmlString, function (err, xmlObject) {
    if (err){
      logger.error(err);
      callback(err);
    } else{
      callback(null, xmlObject[elementName]);
    }
  });
}

XmlWrapper.prototype.fetchXmlString = function (encoding, host, ressource, callback) {
  var options = {
    host: host,
    path: ressource,
    method: 'GET'
  };

  var request = http.request(options, function (result) {
    if (result.statusCode !== 200) {
      callback("HTTP Error: " + result.statusCode);
    } else {
      var chunks = [];
      result.setEncoding(encoding);
      result.on("data", function (chunk) {
        chunks.push(chunk);
      });
      result.on("end", function () {
        var completeXmlData = chunks.join("");
        callback(null, completeXmlData);
      });
    }
  });
  
  request.on("error", function (e) {
    logger.error(e);
    callback(e);
  });
  request.end();
}