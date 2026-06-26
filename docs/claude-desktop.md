# Setup Claude

Ce guide permet d'utiliser Pipedrive avec Claude via le serveur MCP Pipedrive installé en local.

Vous pouvez le configurer de deux façons :

- Claude Desktop, si vous utilisez l'application Claude.
- Claude Code, si vous utilisez le CLI `claude`.

Par défaut, le serveur doit rester en lecture seule avec `PIPEDRIVE_READ_ONLY=true`. Claude peut chercher et lire les données Pipedrive, mais il ne peut pas les modifier.

## Prérequis

- Claude Desktop ou Claude Code installé.
- Node.js 20 ou plus récent.
- Un token API Pipedrive personnel.
- Un accès au repo GitHub du serveur MCP.

## 1. Installer le serveur

Ouvrir le Terminal, puis lancer :

```bash
git clone https://github.com/gkp-dev/pipedrive-mcp-server.git
cd pipedrive-mcp-server
npm install
npm run build
```

## 2. Récupérer le chemin du serveur

Depuis le dossier du projet, lancer :

```bash
pwd
```

Exemple de résultat :

```text
/Users/jean/pipedrive-mcp-server
```

Le chemin à utiliser dans Claude sera :

```text
/Users/jean/pipedrive-mcp-server/build/index.js
```

## 3. Configurer Claude Desktop

Ouvrir le fichier de configuration Claude Desktop :

```text
~/Library/Application Support/Claude/claude_desktop_config.json
```

S'il n'existe pas, le créer.

Ajouter le serveur MCP :

```json
{
  "mcpServers": {
    "pipedrive": {
      "command": "node",
      "args": [
        "/absolute/path/to/pipedrive-mcp-server/build/index.js"
      ],
      "env": {
        "PIPEDRIVE_API_TOKEN": "your-pipedrive-api-token",
        "PIPEDRIVE_READ_ONLY": "true"
      }
    }
  }
}
```

Remplacer :

```text
/absolute/path/to/pipedrive-mcp-server/build/index.js
```

par le vrai chemin obtenu avec `pwd`.

Remplacer aussi :

```text
your-pipedrive-api-token
```

par votre token Pipedrive.

Exemple :

```json
{
  "mcpServers": {
    "pipedrive": {
      "command": "node",
      "args": [
        "/Users/jean/pipedrive-mcp-server/build/index.js"
      ],
      "env": {
        "PIPEDRIVE_API_TOKEN": "pipedrive_api_token_here",
        "PIPEDRIVE_READ_ONLY": "true"
      }
    }
  }
}
```

Redémarrer Claude Desktop après modification.

## 4. Configurer Claude Code (CLI)

Enregistrer le serveur MCP en configuration utilisateur, disponible dans tous les projets :

```bash
claude mcp add pipedrive -s user \
  --env PIPEDRIVE_API_TOKEN="your-pipedrive-api-token" \
  --env PIPEDRIVE_READ_ONLY="true" \
  -- node /absolute/path/to/pipedrive-mcp-server/build/index.js
```

Remplacer :

```text
/absolute/path/to/pipedrive-mcp-server/build/index.js
```

par le vrai chemin obtenu avec `pwd`.

Remplacer aussi :

```text
your-pipedrive-api-token
```

par votre token Pipedrive.

Vérifier que le serveur est bien enregistré :

```bash
claude mcp list
```

Pour supprimer la configuration si besoin :

```bash
claude mcp remove pipedrive -s user
```

## 5. Tester

Dans Claude, demander :

```text
Est-ce que tu as accès au MCP Pipedrive ?
```

Puis tester une recherche simple :

```text
Cherche un deal Pipedrive qui contient "Dupont".
```

## Sécurité

- Ne jamais partager votre token Pipedrive.
- Chaque utilisateur doit utiliser son propre token Pipedrive.
- Garder `PIPEDRIVE_READ_ONLY=true` tant que l'usage doit rester en lecture seule.
- Ne passer `PIPEDRIVE_READ_ONLY` à `false` que si vous voulez explicitement autoriser Claude à écrire dans Pipedrive.

## Dépannage

### Claude ne voit pas le serveur

Vérifier que le chemin pointe bien vers `build/index.js`, puis redémarrer Claude.

### Erreur `PIPEDRIVE_API_TOKEN is required`

Vérifier que `PIPEDRIVE_API_TOKEN` est bien renseigné dans la configuration Claude Desktop ou dans la commande `claude mcp add`.

### Les outils d'écriture échouent

C'est normal si `PIPEDRIVE_READ_ONLY=true`. Cette valeur bloque volontairement les créations et modifications dans Pipedrive.
