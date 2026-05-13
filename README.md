# IT-Pressing - Système de Gestion de Pressing Moderne

IT-Pressing est une application web moderne et élégante conçue pour simplifier la gestion quotidienne d'un établissement de pressing. Développée avec React et Tailwind CSS v4, elle offre une expérience utilisateur fluide avec un design "Premium" et une gestion locale des données performante.

##  Fonctionnalités Clés

- **Tableau de Bord Intuitif** : Vue d'ensemble du chiffre d'affaires, des impayés et du volume de commandes.
- **Gestion des Commandes** : Ajout, modification, suppression et suivi du statut de paiement.
- **Base de Données Clients** : Identification automatique des clients réguliers et suivi de leur historique.
- **Suivi des Paiements** : Section dédiée pour monitorer les factures réglées et en attente.
- **Design Premium** : Interface épurée avec thème blanc/marron, icônes Lucide et animations fluides.
- **Stockage Local** : Utilisation de Dexie.js (IndexedDB) pour une application rapide qui conserve les données sur votre navigateur.

##  Prérequis

Avant de commencer, assurez-vous d'avoir installé sur votre machine :
- [Node.js](https://nodejs.org/) (Version 18 ou supérieure recommandée)
- [npm](https://www.npmjs.com/) (généralement installé avec Node.js)

##  Installation

1. **Cloner ou télécharger le projet** dans le dossier de votre choix.
2. **Ouvrir un terminal** dans le dossier du projet.
3. **Installer les dépendances** :
   ```bash
   npm install
   ```
   *Note : Si vous installez les bibliothèques individuellement :*
   ```bash
   npm install lucide-react dexie dexie-react-hooks
   ```

##  Utilisation

Pour lancer l'application en mode développement :
```bash
npm run dev
```
L'application sera accessible par défaut sur `http://localhost:5173`.

### Identifiants par défaut (Admin) :
- **E-mail** : `admin@pressing.com`
- **Mot de passe** : `admin`


##  Stack Technique

- **Frontend** : React 19 + Vite
- **Styling** : Tailwind CSS v4
- **Icônes** : Lucide React
- **Base de données** : Dexie.js (IndexedDB pour navigateur)

---
Développé pour une gestion de pressing efficace et moderne.
