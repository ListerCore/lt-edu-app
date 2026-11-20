# lt-edu-app

Estructura inicial (réplica vacía de `lister-app`): Next.js 16, React 19, Tailwind 4, shadcn (base-vega), sileo y tema claro/oscuro/sistema.

## Desarrollo

```sh
cp .env.example .env.local
pnpm install
pnpm dev
```

## Estructura

Sigue `ARCHITECTURE.md`: `features/<módulo>/{components,hooks,actions,types,data}`, componente → hook → action. UI en `components/ui`, providers en `components/providers`, tokens de color en `app/globals.css`.
