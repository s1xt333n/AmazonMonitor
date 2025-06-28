<div align="center">
  <h1>AmazonMonitor</h1>
  <h3>Bot Discord pour surveiller les prix Amazon - Configuration Europe 🇪🇺</h3>
  <h3>Discord bot for Amazon price monitoring - European Configuration 🇪🇺</h3>

  <img src="https://img.shields.io/github/package-json/v/SpikeHD/AmazonMonitor" />
  <img src="https://img.shields.io/github/repo-size/SpikeHD/AmazonMonitor" />
  <img src="https://img.shields.io/github/stars/SpikeHD/AmazonMonitor?style=social" />
</div>

## 🌟 Nouvelles Fonctionnalités / New Features

### 🇫🇷 Version Française
- **Configuration européenne** avec Amazon.fr prioritaire
- **Interface utilisateur modernisée** avec boutons Discord interactifs
- **Messages en français** et icônes colorées
- **Support complet** des domaines Amazon européens (fr, de, it, es, co.uk)
- **Pagination intelligente** pour naviguer dans les résultats
- **Actions rapides** via boutons (Détails, Ajouter à la surveillance, Supprimer)

### 🇬🇧 English Version
- **European configuration** with Amazon.fr priority
- **Modern UI** with interactive Discord buttons
- **French messages** and colored icons
- **Full support** for European Amazon domains (fr, de, it, es, co.uk)
- **Smart pagination** to navigate through results
- **Quick actions** via buttons (Details, Add to watchlist, Remove)

---

## 🚀 Description

**Français:** AmazonMonitor est un bot Discord auto-hébergé conçu pour vous notifier des baisses de prix et des restocks sur Amazon. Il supporte la définition de limites de prix, la surveillance d'articles depuis d'autres pays, la surveillance de requêtes de recherche et de catégories entières, et bien plus.

**English:** AmazonMonitor is a self-hosted Discord bot designed for notifying you, or other people, about price drops and restocks on Amazon. It supports setting price limits, watching items from other countries, watching entire search queries and categories, and more.

## 📋 Configuration

### Configuration Européenne / European Configuration

Le bot est maintenant pré-configuré pour l'Europe avec `config.europe.json` :

```json
{
  "tld": "fr",
  "region": "europe", 
  "default_currency": "EUR",
  "language": "fr",
  "supported_domains": [
    {"tld": "fr", "country": "France", "currency": "EUR", "priority": 1},
    {"tld": "de", "country": "Germany", "currency": "EUR", "priority": 2},
    {"tld": "it", "country": "Italy", "currency": "EUR", "priority": 3},
    {"tld": "es", "country": "Spain", "currency": "EUR", "priority": 4},
    {"tld": "co.uk", "country": "United Kingdom", "currency": "GBP", "priority": 5}
  ]
}
```

### Migration depuis la configuration US / Migration from US configuration

1. **Copier votre token** / Copy your token:
   ```bash
   cp config.json config.backup.json
   cp config.europe.json config.json
   # Ajouter votre token dans config.json / Add your token to config.json
   ```

2. **Conserver l'ancienne configuration** / Keep old configuration:
   ```bash
   # L'ancienne configuration reste dans config.backup.json
   # Old configuration remains in config.backup.json
   ```

## 🎮 Commandes / Commands

### 🔍 Recherche / Search
```
!search <terme de recherche> [-p limite_prix]
!search <search term> [-p price_limit]
```
- **Français:** Recherche et affiche les 10 meilleurs résultats avec pagination interactive
- **English:** Search and display top 10 results with interactive pagination
- **Nouveauté:** Boutons de navigation ⬅️➡️ et actions rapides 🔍⭐

### 👀 Surveillance / Watch
```
!watch -l <lien Amazon>
!watch -q <requête de recherche>
!watch -c <lien de catégorie>
```
- **Options:** `-p` (limite prix), `-d` (différence prix), `-e` (pourcentage)
- **Français:** Ajoute un article, une requête ou une catégorie à la surveillance
- **English:** Add an item, query or category to watchlist

### 📝 Liste de surveillance / Watchlist
```
!watchlist
```
- **Français:** Affiche tous les articles surveillés avec boutons de suppression rapide 🗑️
- **English:** Display all watched items with quick remove buttons 🗑️

### 🔍 Détails / Details
```
!details <lien Amazon>
```
- **Français:** Affiche les détails complets d'un produit avec interface améliorée
- **English:** Show complete product details with enhanced interface

### ❌ Supprimer de la surveillance / Unwatch
```
!unwatch <numéro>
```

### ❓ Aide / Help
```
!help
```

## 🎨 Nouvelles Fonctionnalités UI/UX

### 🔘 Boutons Interactifs / Interactive Buttons
- **⬅️➡️ Pagination** pour les résultats de recherche
- **🔍 Détails** pour voir les informations complètes
- **⭐ Ajouter à la surveillance** directement depuis les résultats
- **🗑️ Supprimer** de la liste de surveillance
- **📄 Indicateur de page** (Page X/Y)

### 🎨 Embeds Colorés / Colored Embeds
- 🔵 **Bleu** pour les recherches
- 🟢 **Vert** pour les actions réussies et restocks
- 🔴 **Rouge** pour les alertes de prix
- 🟡 **Orange** pour les avertissements
- 🟣 **Violet** pour les détails de produits

### 🌐 Messages Localisés / Localized Messages
```
✅ Article ajouté avec succès à la surveillance !
❌ Vous avez atteint le nombre maximum d'articles (5)
⚠️ L'article existe déjà dans la liste de surveillance
🔍 Résultats de recherche pour : <requête>
🔴 Alerte de prix pour "<article>"
🟢 Article maintenant en stock !
```

## 🔧 Installation

### Prérequis / Requirements
- Node.js 16+
- Discord Bot Token
- Git

### Installation Rapide / Quick Install
```bash
# Cloner le repository / Clone repository
git clone https://github.com/s1xt333n/AmazonMonitor.git
cd AmazonMonitor

# Installer les dépendances / Install dependencies
npm install

# Configuration européenne / European configuration
cp config.europe.json config.json

# Ajouter votre token Discord / Add your Discord token
nano config.json  # ou vim/code config.json

# Compiler et démarrer / Compile and start
npm run compile
npm start
```

### Configuration Détaillée / Detailed Configuration

1. **Token Discord / Discord Token:**
   ```json
   {
     "token": "votre_token_discord_ici"
   }
   ```

2. **Permissions requises / Required Permissions:**
   - `SEND_MESSAGES`
   - `EMBED_LINKS` 
   - `USE_APPLICATION_COMMANDS`
   - `READ_MESSAGE_HISTORY`

3. **Domaines Amazon / Amazon Domains:**
   Le bot supporte automatiquement tous les domaines européens configurés dans `config.europe.json`.

## 📚 Exemples d'Utilisation / Usage Examples

### Recherche Simple / Basic Search
```
!search iphone 15
```
→ Affiche les résultats avec boutons de navigation et actions rapides

### Surveillance avec Limite de Prix / Watch with Price Limit
```
!watch -l https://amazon.fr/dp/B08L5R1CCC -p 299.99
```
→ Surveille le produit et alerte si le prix descend sous 299,99€

### Recherche avec Filtrage Prix / Search with Price Filter
```
!search "écouteurs bluetooth" -p 50
```
→ Trouve uniquement les écouteurs sous 50€

## 🔧 Dépannage / Troubleshooting

### Problèmes Fréquents / Common Issues

**🇫🇷 Problème : Le bot ne répond pas**
- Vérifiez que le token est correct dans `config.json`
- Assurez-vous que le bot a les bonnes permissions
- Vérifiez les logs avec `npm start`

**🇬🇧 Issue: Bot not responding**
- Check token is correct in `config.json`
- Ensure bot has proper permissions
- Check logs with `npm start`

**🇫🇷 Problème : Erreurs de compilation**
- Installez les dépendances : `npm install`
- Utilisez Node.js 16+ : `node --version`
- Compilez : `npm run compile`

**🇬🇧 Issue: Compilation errors**
- Install dependencies: `npm install`
- Use Node.js 16+: `node --version`
- Compile: `npm run compile`

### Logs et Debug / Logs and Debug
```bash
# Activer le debug / Enable debug
# Dans config.json / In config.json:
"debug_enabled": true

# Voir les logs en temps réel / View real-time logs
npm start
```

## 🌍 Domaines Amazon Supportés / Supported Amazon Domains

| Pays / Country | TLD | Devise / Currency | Priorité / Priority |
|---|---|---|---|
| 🇫🇷 France | .fr | EUR | 1 (défaut/default) |
| 🇩🇪 Allemagne/Germany | .de | EUR | 2 |
| 🇮🇹 Italie/Italy | .it | EUR | 3 |
| 🇪🇸 Espagne/Spain | .es | EUR | 4 |
| 🇬🇧 Royaume-Uni/UK | .co.uk | GBP | 5 |

## 📝 Changelog

### Version 3.1.0 - Configuration Europe
- ✅ Configuration européenne avec Amazon.fr prioritaire
- ✅ Interface utilisateur modernisée avec boutons Discord
- ✅ Messages en français avec icônes colorées
- ✅ Pagination intelligente pour les résultats
- ✅ Actions rapides via boutons interactifs
- ✅ Support complet des domaines Amazon européens
- ✅ Système de traduction français/anglais
- ✅ Embeds améliorés avec couleurs thématiques
- ✅ Documentation bilingue complète

## 🤝 Contribuer / Contributing

**Français :** Les contributions sont les bienvenues ! Issues, PRs, suggestions, tout est apprécié !

**English :** Contributions are welcome! Issues, PRs, suggestions, everything is appreciated!

## 📄 Licence / License

ISC License - voir LICENSE file

---

<div align="center">
  <p><strong>Fait avec ❤️ pour la communauté européenne / Made with ❤️ for the European community</strong></p>
  <p>🇫🇷 Priorité France | 🇪🇺 Support Europe | 🤖 Discord Bot</p>
</div>