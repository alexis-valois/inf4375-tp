# inf4375-tp
## Prérequis

* Avoir une instance de MongoDB en local qui écoute sur le port par défaut (27017).
* Avoir Node.js (6.7+) installé sur le poste local.

## Procédure pour lancer le projet

1. Cloner le dépôt Git en local.
2. Se positionner sur la racine du répertoire du dépôt.
3. Lancer la commande ```npm install``` pour télécharger les dépendances du projet.
4. Lancer la commande ```node ./scheduled-tasks/update-contrevenants.js now ``` pour charger la liste des contrevenants du site de la ville de Montréal dans la bd Mongo. Le nom de la bd sera **inf4375**.
5. Lancer la commande ```npm start``` pour lancer le serveur Node.
6. Le serveur sera lancé sur le port 3000.

## Points de l'énoncé qui ont été réalisés

* A1 : 20pts
* A2 : 5pts
* A3 : 5pts
* A4 : 10pts
* A5 : 15pts
* D1 : 15pts
* D2 : 5pts
* C1 : 10pts
* C2 : 10pts
* C3 : 5pts
* Total : 100pts

## Comment utiliser le projet
Consulter la documentation à l'adresse [http://localhost:3000/doc](http://localhost:3000/doc) pour la façon d'utiliser le projet.
