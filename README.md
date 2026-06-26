# MCP Pipedrive Server

Serveur MCP local et agnostique pour connecter Pipedrive à Claude Desktop, Codex ou tout client compatible MCP.

Le serveur utilise l'API REST Pipedrive avec un token fourni par chaque utilisateur dans son propre fichier `.env`. Aucun secret ne doit être commité.

## Fonctionnalités

- Rechercher des deals, personnes et organisations.
- Récupérer le détail d'un deal, d'une personne ou d'une organisation.
- Lister les activités et les notes.
- Créer des activités.
- Ajouter des notes.
- Mettre à jour certains champs de deals et personnes, uniquement si le mode écriture est activé.
- Exposer des ressources de schéma Pipedrive utiles aux agents.

## Prérequis

- Node.js 20 ou plus récent.
- Un compte Pipedrive avec accès API.
- Un client compatible MCP : Codex, Claude Desktop, Cursor ou équivalent.

## Installation

```bash
git clone https://github.com/gkp-dev/pipedrive-mcp-server.git
cd pipedrive-mcp-server
npm install
npm run build
```

## Configuration locale

Copier l'exemple d'environnement :

```bash
cp .env.example .env
```

Puis renseigner votre token Pipedrive dans `.env` :

```env
PIPEDRIVE_API_TOKEN=your-pipedrive-api-token
PIPEDRIVE_READ_ONLY=true
```

### Variables

| Variable | Description | Valeur recommandée |
|---|---|---|
| `PIPEDRIVE_API_TOKEN` | Token API personnel Pipedrive. Obligatoire. | Aucun |
| `PIPEDRIVE_READ_ONLY` | Bloque les outils d'écriture quand `true`. | `true` |

Par défaut, gardez `PIPEDRIVE_READ_ONLY=true`. Passez à `false` seulement si vous voulez autoriser la création d'activités, l'ajout de notes ou les mises à jour.

## Mode local

Le serveur fonctionne en local via le transport MCP `stdio`, utilisé par défaut par le code.

Il n'est pas nécessaire de configurer un port, un host ou un token MCP pour Claude Desktop.

## Utilisation avec Codex

Voir [docs/codex.md](docs/codex.md).

## Utilisation avec Claude Desktop

Voir [docs/claude-desktop.md](docs/claude-desktop.md).

## Outils MCP exposés

### Lecture

- `pipedrive_search_deals`
- `pipedrive_get_deal`
- `pipedrive_search_persons`
- `pipedrive_get_person`
- `pipedrive_search_organizations`
- `pipedrive_get_organization`
- `pipedrive_list_activities`
- `pipedrive_list_notes`

### Écriture, bloquée si `PIPEDRIVE_READ_ONLY=true`

- `pipedrive_update_deal`
- `pipedrive_update_person`
- `pipedrive_create_activity`
- `pipedrive_add_note`

## Sécurité

- Ne commitez jamais `.env`.
- Chaque collaborateur doit utiliser son propre token Pipedrive.
- Commencez avec `PIPEDRIVE_READ_ONLY=true` pour valider la configuration sans risque.
- Le serveur ne supprime aucune donnée Pipedrive.
- Les actions d'écriture sont limitées à des champs explicitement autorisés par les schémas MCP.
- Les tokens sont lus depuis l'environnement local et ne sont pas stockés dans le repo.

## Développement

```bash
npm run typecheck
npm test
npm run build
```

## Partager avec d'autres utilisateurs

Chaque utilisateur doit :

1. Cloner le repo.
2. Installer les dépendances.
3. Créer son propre fichier `.env`.
4. Ajouter son propre token Pipedrive.
5. Configurer son client MCP.

Ne partagez jamais votre fichier `.env` avec un autre utilisateur.

## Dépannage

### `PIPEDRIVE_API_TOKEN is required`

Le fichier `.env` est absent ou ne contient pas `PIPEDRIVE_API_TOKEN`.

### Les outils d'écriture échouent

Vérifier `PIPEDRIVE_READ_ONLY`. Si la valeur est `true`, les créations et mises à jour sont volontairement bloquées.

### Le client MCP ne voit pas le serveur

Redémarrer le client après modification de sa configuration MCP.
