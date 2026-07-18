# Yearify

Turn your Google Calendar into a colorful snapshot of your year.

Questions / contributions: ryan.j.lee99@gmail.com

## Develop

```bash
npm install
npm start
```

Use the mock datastore (no Google OAuth) with:

```bash
REACT_APP_USE_MOCK=true npm start
```

- Yearify: `/`
- Halfify: `/halfify`
- Quarterify: `/quarterify`
- Monthify: `/monthify`

## Deploy

Pushes to `main` deploy to [ryazlee.github.io/yearify](https://ryazlee.github.io/yearify) via GitHub Actions (GitHub Pages).

You can also run the workflow manually from the Actions tab.
