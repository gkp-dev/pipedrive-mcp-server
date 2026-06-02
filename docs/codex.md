# Configuration Codex

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

4. Ajouter le serveur MCP dans `~/.codex/config.toml` :

```toml
[mcp_servers.pipedrive]
command = "bash"
args = ["-lc", "cd /absolute/path/to/mcp-pipedrive-server && exec node build/index.js"]
startup_timeout_sec = 120
```

Exemple macOS :

```toml
[mcp_servers.pipedrive]
command = "bash"
args = ["-lc", "cd /Users/<user>/code/mcp-pipedrive-server && exec node build/index.js"]
startup_timeout_sec = 120
```

5. Redémarrer Codex.

## Sécurité

Ne mettez pas le token dans `config.toml`. Gardez-le dans `.env`, qui doit rester local et ignoré par Git.
