# Setup Claude Desktop

Ce guide permet d'utiliser Pipedrive depuis Claude Desktop avec le serveur MCP Pipedrive installé en local.

Par défaut, le serveur est en lecture seule. Claude peut chercher et lire les données Pipedrive, mais il ne peut pas les modifier tant que `PIPEDRIVE_READ_ONLY=true`.

## Prérequis

- Claude Desktop installé.
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

## 2. Créer le fichier `.env`

Dans le dossier du projet :

```bash
cp .env.example .env
```

Ouvrir le fichier `.env`, puis remplir :

```env
PIPEDRIVE_API_TOKEN=your-pipedrive-api-token
PIPEDRIVE_READ_ONLY=true
```

Remplacer `your-pipedrive-api-token` par votre token Pipedrive.

Garder `PIPEDRIVE_READ_ONLY=true` pour commencer. Cela bloque les actions d'écriture.

## 3. Récupérer le chemin du serveur

Depuis le dossier du projet, lancer :

```bash
pwd
```

Exemple de résultat :

```text
/Users/jean/pipedrive-mcp-server
```

Le chemin à utiliser dans Claude Desktop sera :

```text
/Users/jean/pipedrive-mcp-server/build/index.js
```

## 4. Configurer Claude Desktop

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
      ]
    }
  }
}
```

Remplacer `/absolute/path/to/pipedrive-mcp-server/build/index.js` par le vrai chemin obtenu avec `pwd`.

Exemple :

```json
{
  "mcpServers": {
    "pipedrive": {
      "command": "node",
      "args": [
        "/Users/jean/pipedrive-mcp-server/build/index.js"
      ]
    }
  }
}
```

## 5. Redémarrer Claude Desktop

Fermer complètement Claude Desktop, puis le rouvrir.

## 6. Tester

Dans Claude Desktop, demander :

```text
Est-ce que tu as accès au MCP Pipedrive ?
```

Puis tester une recherche simple :

```text
Cherche un deal Pipedrive qui contient "Dupont".
```

## Sécurité

- Ne jamais mettre le token Pipedrive dans `claude_desktop_config.json`.
- Ne jamais partager le fichier `.env`.
- Chaque utilisateur doit utiliser son propre token Pipedrive.
- Garder `PIPEDRIVE_READ_ONLY=true` tant que l'usage doit rester en lecture seule.

## Dépannage

### Claude ne voit pas le serveur

Vérifier que le chemin dans `claude_desktop_config.json` pointe bien vers `build/index.js`, puis redémarrer Claude Desktop.

### Erreur `PIPEDRIVE_API_TOKEN is required`

Vérifier que le fichier `.env` existe bien dans le dossier du projet et que `PIPEDRIVE_API_TOKEN` est renseigné.

### Les outils d'écriture échouent

C'est normal si `PIPEDRIVE_READ_ONLY=true`. Cette valeur bloque volontairement les créations et modifications dans Pipedrive.
