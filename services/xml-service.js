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

function getJsObjFromXml(xmlString, elementName, callback){
  xml.parseString(xmlString, function (err, xmlObject) {
    if (err){
      callback(err);
    } else{
      callback(null, xmlObject.get[elementName]);
    }
  });
}

function fetchXmlString(encoding, host, ressource, callback) {
  var options = {
    host: host,
    path: ressource,
    //host: 'donnees.ville.montreal.qc.ca',
    //path: '/dataset/a5c1f0b9-261f-4247-99d8-f28da5000688/resource/92719d9b-8bf2-4dfd-b8e0-1021ffcaee2f/download/inspection-aliments-contrevenants.xml',
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
    callback(e);
  });
  request.end();
}

exports.fetchXmlString = fetchXmlString;
exports.getJsObjFromXml = getJsObjFromXml;
