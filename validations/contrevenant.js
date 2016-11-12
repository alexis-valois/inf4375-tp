// Copyright 2016 Jacques Berger.
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//      http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.

module.exports = {
  update: {
    type: "object",
    required: true,
    additionalProperties: false,
    properties: {
      adresse: {
        type: "array",
        required: false,
        items: {
          type: "string",
          required: true
        }
      },
      categorie: {
        type: "array",
        required: false,
        items: {
          type: "string",
          required: true
        }
      },
      date_infraction: {
        type: "string",
        format: "date-time",
        required: false
      },
      date_jugement: {
        type: "string",
        format: "date-time",
        required: false
      },
      description: {
        type: "array",
        required: false,
        items: {
          type: "string",
          required: true
        }
      },
      etablissement: {
        type: "array",
        required: false,
        items: {
          type: "string",
          required: true
        }
      },
      montant: {
        type: "array",
        required: false,
        items: {
          type: "number",
          required: true
        }
      },
      proprietaire: {
        type: "array",
        required: false,
        items: {
          type: "string",
          required: true
        }
      },
      ville: {
        type: "array",
        required: false,
        items: {
          type: "string",
          required: true
        }
      }
    }
  }
}