# Configuration Claude Desktop

Cette configuration lance le serveur depuis le dossier du projet. Le token reste uniquement dans le fichier `.env` local du projet.

## Étapes

1. Installer et compiler le serveur :

```bash
npm install
npm run build
```

2. Créer le fichier `.env` :

```bash
cp .env.example .env
```

3. Renseigner `PIPEDRIVE_API_TOKEN` dans `.env`.

4. Ouvrir la configuration Claude Desktop :

```text
~/Library/Application Support/Claude/claude_desktop_config.json
```

5. Ajouter le serveur :

```json
{
  "mcpServers": {
    "pipedrive": {
      "command": "bash",
      "args": [
        "-lc",
        "cd /absolute/path/to/mcp-pipedrive-server && exec node build/index.js"
      ]
    }
  }
}
```

6. Redémarrer Claude Desktop.

## Sécurité

Ne mettez pas le token dans `claude_desktop_config.json`. Gardez-le dans `.env`, qui doit rester local et ignoré par Git.
