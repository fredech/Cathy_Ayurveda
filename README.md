# Cathy Ayurveda — site vitrine

Site React + Vite, pré-rendu en HTML statique. Le contenu éditorial vit dans
`data/content/*.json`.

## Démarrer

```bash
npm install
npm run dev        # serveur de développement
npm run build      # site de production dans dist/
npm run preview    # prévisualisation du build
npm run typecheck  # vérification TypeScript
npm run lint       # ESLint
```

`./run.sh` enchaîne installation, génération des médias et lancement.

## Formulaire de contact (Resend)

Le formulaire envoie un `POST` à `/api/contact`. Cette route est une fonction
Vercel définie dans `api/contact.ts` : elle valide les champs puis transmet le
message par [Resend](https://resend.com) à l'adresse définie dans la variable
d'environnement `email_contact`.

La clé API n'est **jamais** exposée au navigateur : elle est lue uniquement
côté serveur, dans `process.env`.

### Déploiement sur Vercel

1. Créer une clé API sur <https://resend.com/api-keys>.
2. Vérifier le domaine `cathyayurveda.com` dans Resend (onglet **Domains**).
   L'expéditeur est `Cathy Ayurveda <contact@cathyayurveda.com>`.
3. Dans le projet Vercel → **Settings → Environment Variables**, ajouter :
   - `RESEND_API_KEY` : la clé `re_…` (obligatoire).
   - `email_contact` : destinataire des messages (obligatoire).
4. Redéployer le site.

L'adresse saisie par le visiteur est utilisée comme adresse de réponse
(`reply_to`) : il est possible de répondre directement depuis sa boîte mail.

### Tester en local

`npm run dev` ne sert que le front : la route `/api/contact` n'existe pas.
Pour tester le formulaire de bout en bout, utiliser Vercel CLI, qui sert à la
fois Vite et la fonction :

```bash
cp .env.example .env   # renseigner RESEND_API_KEY et email_contact
npx vercel dev
```

Vercel CLI charge `.env` pour les fonctions. Le fichier `.env` est ignoré par
Git ; seul `.env.example` est versionné.
