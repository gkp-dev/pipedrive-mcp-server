# Sécurité

## Modèle de menace

Ce serveur MCP donne à un agent accès à des données CRM Pipedrive. Selon la configuration, il peut aussi créer des activités, ajouter des notes et mettre à jour certains champs.

Les principaux risques sont :

- exposition du token API Pipedrive ;
- action d'écriture non voulue ;
- fuite de données CRM dans les prompts, logs ou exports ;
- mauvais rattachement d'une note ou activité à un deal, contact ou organisation ;
- usage d'un token trop permissif par plusieurs collaborateurs.

## Garde-fous actuels

- Le token est chargé depuis l'environnement local.
- `.env` est ignoré par Git.
- `PIPEDRIVE_READ_ONLY=true` bloque les outils d'écriture.
- `MCP_AUTH_TOKEN` est obligatoire en mode HTTP.
- Aucune suppression Pipedrive n'est exposée.
- Les entrées des outils sont validées avec Zod.
- Les champs modifiables sont limités par les schémas MCP.
- Les requêtes API ont un timeout configurable.

## Bonnes pratiques d'utilisation

- Chaque collaborateur doit utiliser son propre token.
- Garder `PIPEDRIVE_READ_ONLY=true` pour la première configuration.
- Passer `PIPEDRIVE_READ_ONLY=false` uniquement quand les actions d'écriture sont nécessaires.
- Ne jamais exposer le mode HTTP sans bearer token.
- Tester les écritures sur un contact ou deal de test avant usage réel.
- Ne jamais partager `.env`, captures contenant un token ou logs sensibles.
- Révoquer immédiatement un token exposé par erreur.

## Avant de pousser sur GitHub

Exécuter :

```bash
rg -n "PIPEDRIVE_API_TOKEN|api_token|password|secret|Bearer|Authorization" -g '!node_modules' -g '!build'
git status --short
npm test
npm run build
npm audit --audit-level=moderate
```

Vérifier que `.env`, `node_modules` et `build` ne sont pas suivis par Git.

## Limites connues

- L'authentification repose sur un token API Pipedrive personnel. OAuth serait préférable pour une distribution SaaS ou multi-client.
- Le serveur local ne centralise pas les logs ni les politiques d'accès.
- Les permissions dépendent des droits du token Pipedrive utilisé.
- Le mode HTTP utilise un bearer token statique. C'est suffisant pour un déploiement privé de test, mais pas pour une distribution publique.
