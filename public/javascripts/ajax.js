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

function replaceTableContent(path, dateDebutId, dateFinId, tableId) {
  var request = new XMLHttpRequest();
  var dateDebut = document.getElementById(dateDebutId).value;
  var dateFin = document.getElementById(dateFinId).value;
  var url = "/" + path + "/?du=" + dateDebut + "&au=" + dateFin;
  console.log(url);
  request.open("GET", url, true);
  request.onreadystatechange = function() {
    if (request.readyState === 4 && request.status === 200) {
      var table = document.getElementById(tableId);
      insertContrevenantsEntries(table, $.parseJSON(request.responseText));
    }
  };
  request.send();
}

function insertContrevenantsEntries(table, contrevenants){
  var contrevenant;
  var row;
  table.innerHTML = "";
  for (var i = 0; i < contrevenants.length; i++){
    contrevenant = contrevenants[i];
    row = document.createElement("tr");
    
    var proprietaire = document.createElement("td");
    var proprietaireText = document.createTextNode(contrevenant.proprietaire); 
    proprietaire.appendChild(proprietaireText);
    row.appendChild(proprietaire);

    var etablissement = document.createElement("td");
    var etablissementText = document.createTextNode(contrevenant.etablissement); 
    etablissement.appendChild(etablissementText);
    row.appendChild(etablissement);

    var adresse = document.createElement("td");
    var adresseText = document.createTextNode(contrevenant.adresse); 
    adresse.appendChild(adresseText);
    row.appendChild(adresse);

    var ville = document.createElement("td");
    var villeText = document.createTextNode(contrevenant.ville); 
    ville.appendChild(villeText);
    row.appendChild(ville);

    var description = document.createElement("td");
    var descriptionText = document.createTextNode(contrevenant.description); 
    description.appendChild(descriptionText);
    row.appendChild(description);

    var date_infraction = document.createElement("td");
    var date_infractionText = document.createTextNode(contrevenant.date_infraction); 
    date_infraction.appendChild(date_infractionText);
    row.appendChild(date_infraction);

    var date_jugement = document.createElement("td");
    var date_jugementText = document.createTextNode(contrevenant.date_jugement); 
    date_jugement.appendChild(date_jugementText);
    row.appendChild(date_jugement);

    var montant = document.createElement("td");
    var montantText = document.createTextNode(contrevenant.montant); 
    montant.appendChild(montantText);
    row.appendChild(montant);

    table.appendChild(row); 
  }
  return table;
}