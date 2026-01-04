# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently, two official plugins are available:

- [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react) uses [Babel](https://babeljs.io/) (or [oxc](https://oxc.rs) when used in [rolldown-vite](https://vite.dev/guide/rolldown)) for Fast Refresh
- [@vitejs/plugin-react-swc](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react-swc) uses [SWC](https://swc.rs/) for Fast Refresh

## React Compiler

The React Compiler is not enabled on this template because of its impact on dev & build performances. To add it, see [this documentation](https://react.dev/learn/react-compiler/installation).

## Expanding the ESLint configuration

If you are developing a production application, we recommend using TypeScript with type-aware lint rules enabled. Check out the [TS template](https://github.com/vitejs/vite/tree/main/packages/create-vite/template-react-ts) for information on how to integrate TypeScript and [`typescript-eslint`](https://typescript-eslint.io) in your project.



---

## **STEP 2: INSTALL DEPENDENCIES** 📦

```bash
npm install axios react-router-dom react-hook-form @headlessui/react lucide-react
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p
```

---


If your backend runs on a different port, update the `API_BASE_URL` in:
```javascript
// src/services/api.js
const API_BASE_URL = 'http://localhost:3000/api/v1';
```

## Development

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

## Troubleshooting

### Backend Connection Issues

If you see connection errors:
1. Make sure your backend is running on `http://localhost:3000`
2. Check CORS is enabled in backend
3. Verify API routes are accessible

### Login Issues

If login fails:
1. Verify backend is running
2. Check admin user exists in database
3. Verify JWT secret is configured in backend

### 401 Unauthorized Errors

If you get logged out:
1. Token may have expired (8 hours by default)
2. Just log in again

## Support

For issues or questions:
1. Check backend logs
2. Check browser console for errors
3. Verify database connection in TablePlus

---

**Made with ❤️ for Dualy Islamic App**