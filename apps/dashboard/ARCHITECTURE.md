# Dashboard boundaries

Browser code, server code, and shared types stay in separate folders.

- `lib/client`: browser calls. Components call these wrappers. They do not call `fetch` themselves.
- `lib/server`: cookies, Supabase, and anything that must not ship to the browser.
- `lib/shared`: types and config both sides can import.

A client file must not import `lib/server`. `scripts/check-boundaries.mjs` enforces that.
