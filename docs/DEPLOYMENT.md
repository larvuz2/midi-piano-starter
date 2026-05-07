# Deployment

## Netlify

This project includes `netlify.toml` so Netlify can connect to the GitHub repo and deploy automatically.

- Build command: `npm run build`
- Publish directory: `dist`
- Node version: 20

Web MIDI requires HTTPS in production. Netlify preview and production deploys satisfy that requirement.
