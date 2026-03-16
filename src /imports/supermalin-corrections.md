CORRECTIONS ET AMÉLIORATIONS À APPORTER – SUPERMALIN

Suite aux tests effectués, merci d’apporter les modifications suivantes afin de finaliser et stabiliser le site avant mise en production.

⸻

1. Bouton “Nouveaux arrivages” non fonctionnel

Le bouton “Nouveaux arrivages” ne produit actuellement aucun effet.

Merci de :
	•	Le connecter à une page ou une vue filtrée dynamiquement.
	•	Implémenter un filtre basé sur :
	•	Date de création (order by created_at DESC)
	•	Ou tag spécifique “nouveau” / “arrivage”.
	•	Afficher uniquement les produits récemment ajoutés.
	•	Ajouter pagination si nécessaire.
	•	Vérifier que la requête est bien reliée à Supabase.

Ce bouton doit rediriger vers une page réellement dynamique et fonctionnelle.

⸻

2. Modification du profil utilisateur

Merci de modifier la section Profil utilisateur comme suit :

Supprimer :
	•	Le menu “Mes ventes”.

Ajouter :
	•	Nom
	•	Prénom
	•	Adresse complète (rue, code postal, ville, pays)
	•	Téléphone
	•	Historique des commandes
	•	Téléchargement des factures
	•	Possibilité de modifier ses informations

Le profil doit être adapté à un e-commerce classique, pas à une marketplace.

⸻

3. Obligation de création de compte avant commande

Merci d’imposer :
	•	Connexion ou inscription obligatoire avant validation de commande.
	•	Blocage du checkout si l’utilisateur n’est pas authentifié.
	•	Redirection automatique vers login / inscription.
	•	Sauvegarde du panier après connexion.

Aucune commande ne doit être possible sans compte client.

⸻

4. Modification du filtre prix

Le filtre prix maximum doit être augmenté à 10 000 €.

Merci de :
	•	Modifier la limite du slider.
	•	Adapter la validation backend.
	•	Vérifier la compatibilité avec les requêtes Supabase.
	•	Permettre saisie manuelle du montant.

⸻

5. Personnalisation des sections “Nouveaux lots” et “Derniers arrivages”

Merci d’ajouter la possibilité dans l’admin de :
	•	Personnaliser le titre de la section.
	•	Ajouter un texte descriptif (ex : “Arrivage spécial Tech”, “Lot exceptionnel cuisine”).
	•	Mettre en avant certains produits manuellement.
	•	Activer un badge automatique :
	•	“Nouveau”
	•	“Arrivage”
	•	“Stock limité”

Ces sections doivent être dynamiques et administrables.

⸻

6. Renforcement sécurité mot de passe

Merci de mettre en place une politique stricte :
	•	Minimum 8 caractères
	•	Au moins 1 majuscule
	•	1 minuscule
	•	1 chiffre
	•	1 caractère spécial

Validation côté frontend ET backend.

Ajouter message d’erreur clair si non conforme.

⸻

7. Problème affichage Admin après connexion

La partie Admin n’est pas toujours visible après connexion.

Merci de :
	•	Vérifier que le rôle “admin” est correctement attribué en base.
	•	Vérifier que le rôle est bien récupéré après authentification.
	•	Maintenir la session correctement.
	•	Afficher le menu admin uniquement si role = admin.
	•	Protéger la route /admin.
	•	Empêcher accès si rôle non autorisé.
	•	Vérifier la persistance JWT après reload.

L’accès admin doit être stable et sécurisé.