# MediLabo — Frontend

Frontend de l'application **MediLabo**, développé avec **React** et **Vite**.

L'application permet d'interagir avec les différents services backend de MediLabo via leur API REST.

## 🛠️ Technologies

* [React](https://react.dev/) 19
* [Vite](https://vite.dev/) 7
* [Material UI](https://mui.com/) 7
* [Emotion](https://emotion.sh/) pour le styling
* [Axios](https://axios-http.com/) pour les appels HTTP
* Nginx pour servir l'application en production
* Docker pour la conteneurisation

---

## 📁 Structure

```text
front-medilabo/
├── public/
├── src/
│   ├── config/
│   │   └── config-prod-template.js
│   └── ...
├── Dockerfile
├── entrypoint.sh
├── package.json
├── package-lock.json
└── ...
```

---

## ⚙️ Prérequis

Pour lancer le projet en développement :

* Node.js 20 ou supérieur
* npm

Pour lancer l'application avec Docker :

* Docker

---

## 🚀 Installation

Cloner le dépôt puis installer les dépendances :

```bash
git clone <URL_DU_REPOSITORY>
cd front-medilabo
npm install
```

---

## 💻 Développement

Lancer le serveur de développement Vite :

```bash
npm run dev
```

Par défaut, Vite démarre l'application en mode développement.

Le serveur indique dans le terminal l'URL permettant d'accéder à l'application.

---

## 🔨 Build

Créer le build de production :

```bash
npm run build
```

Les fichiers générés sont placés dans le dossier :

```text
dist/
```

Pour tester localement le build de production :

```bash
npm run preview
```

---

# 🐳 Docker

L'image Docker utilise une construction en **deux étapes** :

1. Une image Node.js pour installer les dépendances et compiler l'application React.
2. Une image Nginx Alpine pour servir les fichiers statiques générés.

### Construction de l'image

```bash
docker build -t front-medilabo .
```

### Lancer le conteneur

```bash
docker run -d -p 8080:80 front-medilabo
```

L'application est alors accessible sur :

```text
http://localhost:8080
```

---

## 🔧 Configuration de l'API

La configuration de l'URL de l'API est externalisée afin de pouvoir modifier la configuration au démarrage du conteneur sans reconstruire l'application React.

Le fichier de configuration est généré au démarrage du conteneur par `entrypoint.sh`.

### Fonctionnement

Lors du build Docker, le template de configuration est copié dans :

```text
/usr/share/nginx/html/config/config-template.js
```

Au démarrage du conteneur, le script `entrypoint.sh` utilise `envsubst` pour remplacer les variables du template et générer :

```text
/usr/share/nginx/html/config/config.js
```

Nginx est ensuite lancé afin de servir l'application :

```bash
exec nginx -g 'daemon off;'
```

---

## 🏗️ Image Docker

Le `Dockerfile` utilise un **multi-stage build**.

### Étape 1 — Build React

L'image `node:20-alpine` permet de :

* installer les dépendances npm ;
* copier le code source ;
* générer le build de production avec :

```bash
npm run build
```

### Étape 2 — Nginx

L'image finale utilise :

```text
nginx:alpine
```

Seuls les fichiers nécessaires à l'exécution de l'application sont conservés dans l'image finale :

```text
dist/
config-template.js
entrypoint.sh
```

Cette approche permet de ne pas embarquer Node.js et les dépendances de développement dans l'image finale.

---

# 🔄 CI/CD

La construction et la publication de l'image Docker sont automatisées avec **GitHub Actions**.

Le workflow est déclenché :

* automatiquement lors d'un `push` sur la branche `main` ;
* manuellement via `workflow_dispatch`.

## Gestion des versions

La version de l'application est récupérée directement depuis le fichier `package.json`.

Exemple :

```json
{
  "version": "1.0.4"
}
```

Le workflow vérifie ensuite si un tag Git correspondant à cette version existe déjà :

```text
v1.0.4
```

Si la version a déjà été construite, le workflow est arrêté afin d'éviter de reconstruire et republier une image identique.

Lorsqu'une nouvelle version est détectée, le workflow :

1. récupère le code source ;
2. extrait la version depuis `package.json` ;
3. vérifie que cette version n'a pas déjà été construite ;
4. construit l'image Docker ;
5. publie l'image dans **GitHub Container Registry (GHCR)** ;
6. crée un tag Git correspondant à la version.

### Image publiée

L'image Docker est publiée avec le tag correspondant à la version du frontend :

```text
ghcr.io/<repository>:<version>
```

Par exemple :

```text
ghcr.io/<repository>:1.0.4
```

Les images utilisées par le déploiement peuvent ensuite être récupérées depuis **GitHub Container Registry**.

Cette automatisation permet notamment à Jenkins de récupérer (`pull`) les images Docker déjà construites par GitHub Actions plutôt que de reconstruire l'image sur le serveur.

---

## 📦 Scripts npm

| Commande          | Description                              |
| ----------------- | ---------------------------------------- |
| `npm run dev`     | Lance le serveur de développement Vite   |
| `npm run build`   | Compile l'application pour la production |
| `npm run preview` | Sert localement le build de production   |

---

## 🔐 Bonnes pratiques

* Ne pas intégrer de configuration spécifique à un environnement directement dans le build React.
* Utiliser la configuration externalisée lors du déploiement Docker.
* Utiliser le build de production pour les environnements de déploiement.
* Servir les fichiers statiques avec Nginx plutôt qu'avec le serveur de développement Vite.
* Versionner les images Docker à partir de la version définie dans `package.json`.

