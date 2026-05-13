# Guide d'Utilisation - IT-Pressing

Ce document détaille les fonctionnalités principales de l'application IT-Pressing pour vous aider à prendre en main l'outil.

## 1. Authentification
L'accès est sécurisé. À la première utilisation, un compte administrateur est créé automatiquement.
- Saisissez vos identifiants sur la page de connexion élégante (background glassmorphism).
- En cas d'erreur, un message d'alerte rouge vous informe.

## 2. Le Tableau de Bord (Dashboard)
C'est le centre de contrôle de votre activité.
- **Statistiques** : En haut, trois cartes vous donnent instantanément votre **Chiffre d'affaires**, le nombre d'**Impayés** et le **Total des Commandes**.
- **Recherche** : Utilisez la barre de recherche pour trouver une commande par le nom du client ou son numéro de téléphone.
- **Liste des Commandes** : Affiche les détails de chaque linge, le prix, et la date de retrait prévue. Les retards sont automatiquement surlignés en rouge.

## 3. Gestion des Commandes
- **Ajouter** : Cliquez sur "Nouvelle Commande" pour ouvrir le formulaire. Remplissez le nom, téléphone, les articles (ex: 3 chemises), le poids, le prix et la date.
- **Modifier** : Si une commande n'est pas payée, cliquez sur l'icône **Crayon**. Vous pouvez corriger n'importe quel détail.
- **Marquer comme Payé** : Cliquez sur l'icône **Coche Verte** pour valider un paiement instantanément sans ouvrir de formulaire.
- **Supprimer** : L'icône **Poubelle** permet de retirer une commande de la base de données.

## 4. Section Clients
Cette page répertorie tous les clients ayant déjà passé commande.
- Regroupe les informations par client (Nom + Téléphone).
- Indique le nombre de fois que le client est venu.
- Affiche la date de sa dernière visite pour un meilleur suivi relationnel.

## 5. Section Paiements
Un outil de comptabilité simple :
- Filtrez les commandes pour voir uniquement les **Payés** ou les **Impayés**.
- Consultez le **Total Encaissé** vs le **Total à Percevoir**.
- Idéal pour faire le point en fin de journée ou de semaine.

## 6. Stockage des Données
Toutes vos données sont stockées **localement dans votre navigateur** (grâce à IndexedDB). 
- **Avantage** : C'est très rapide et fonctionne sans serveur externe.
- **Attention** : Si vous videz totalement le cache/historique de votre navigateur (suppression des données de sites), les données pourraient être effacées. Pensez à ne pas nettoyer ces données spécifiques.

---
*Fin du guide d'utilisation.*
