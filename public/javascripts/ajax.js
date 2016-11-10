/*
 * Copyright 2013 Jacques Berger.
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

function replaceTableContent(path, tableId) {
  var request = new XMLHttpRequest();
  var url = "/" + path;

  request.open("GET", url, true);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      var table = document.getElementsById(tableId);
      table.innerHTML = request.responseText;
    }
  };

  request.send();
}