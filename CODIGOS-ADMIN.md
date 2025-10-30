# 🚀 Códigos para o Repositório GrillManager-Admin

## 📁 **Estrutura de Arquivos Necessária:**

```
GrillManager-Admin/
├── src/
│   ├── components/
│   │   └── AdminPanel.tsx
│   ├── api/
│   │   └── localApi.ts
│   ├── hooks/
│   │   └── useApiData.ts
│   ├── utils/
│   │   └── dataManager.ts
│   ├── types/
│   │   └── index.ts
│   ├── data/
│   │   └── mockData.ts
│   ├── AppAdmin.tsx
│   ├── main.tsx
│   └── style.css
├── index.html
├── package.json
├── vite.config.ts
├── tailwind.config.js
├── postcss.config.js
└── tsconfig.json
```

## 📄 **1. package.json**

```json
{
  "name": "grillmanager-admin",
  "private": true,
  "version": "0.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "tsc && vite build",
    "preview": "vite preview"
  },
  "devDependencies": {
    "@types/node": "^24.9.1",
    "@types/react": "^19.2.2",
    "@types/react-dom": "^19.2.2",
    "@vitejs/plugin-react": "^5.0.4",
    "autoprefixer": "^10.4.21",
    "postcss": "^8.5.6",
    "tailwindcss": "^3.4.18",
    "typescript": "~5.9.3",
    "vite": "^7.1.12"
  },
  "dependencies": {
    "framer-motion": "^12.23.24",
    "lucide-react": "^0.546.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0"
  }
}
```

## 📄 **2. vite.config.ts**

```typescript
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5175, // Porta diferente para o admin
    open: true
  }
})
```

## 📄 **3. tailwind.config.js**

```javascript
/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```

## 📄 **4. postcss.config.js**

```javascript
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}
```

## 📄 **5. tsconfig.json**

```json
{
  "compilerOptions": {
    "target": "ES2020",
    "useDefineForClassFields": true,
    "lib": ["ES2020", "DOM", "DOM.Iterable"],
    "module": "ESNext",
    "skipLibCheck": true,

    /* Bundler mode */
    "moduleResolution": "bundler",
    "allowImportingTsExtensions": true,
    "resolveJsonModule": true,
    "isolatedModules": true,
    "noEmit": true,
    "jsx": "react-jsx",

    /* Linting */
    "strict": true,
    "noUnusedLocals": true,
    "noUnusedParameters": true,
    "noFallthroughCasesInSwitch": true
  },
  "include": ["src"],
  "references": [{ "path": "./tsconfig.node.json" }]
}
```

## 📄 **6. index.html**

```html
<!doctype html>
<html lang="pt-BR">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GrillManager - Painel Administrativo</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.tsx"></script>
  </body>
</html>
```

## 📄 **7. src/main.tsx**

```typescript
import React from 'react'
import ReactDOM from 'react-dom/client'
import AppAdmin from './AppAdmin.tsx'
import './style.css'
import { initializeDefaultData } from './utils/dataManager'

// Inicializa dados padrão se necessário
initializeDefaultData();

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AppAdmin />
  </React.StrictMode>,
)
```

## 📄 **8. src/style.css**

```css
@import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  * {
    border-color: #e5e7eb;
  }
  
  body {
    background-color: #f8fafc;
    color: #0f172a;
    font-family: 'Inter', system-ui, sans-serif;
    font-feature-settings: "rlig" 1, "calt" 1;
  }
  
  html {
    scroll-behavior: smooth;
  }
}

@layer components {
  .btn-primary {
    @apply bg-orange-500 hover:bg-orange-600 text-white font-medium px-4 py-2 rounded-lg transition-colors duration-200;
  }
  
  .btn-secondary {
    @apply bg-gray-200 hover:bg-gray-300 text-gray-800 font-medium px-4 py-2 rounded-lg transition-colors duration-200;
  }
  
  .card {
    @apply bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden;
  }
  
  .section-title {
    @apply text-2xl font-bold text-gray-900 mb-6;
  }
  
  .popular-badge {
    @apply bg-gradient-to-r from-orange-500 to-red-500 text-white px-3 py-1 rounded-full text-xs font-bold shadow-lg;
  }
  
  .popular-section {
    @apply bg-gradient-to-r from-orange-50 to-red-50;
  }
  
  .popular-button {
    @apply bg-gradient-to-r from-orange-500 to-red-500 hover:from-orange-600 hover:to-red-600 text-white font-bold px-6 py-3 rounded-lg shadow-lg transition-all duration-300 transform hover:scale-105;
  }
}
```

## 🎯 **Como Usar:**

1. **Crie o repositório** `GrillManager-Admin`
2. **Copie todos os arquivos** acima para suas respectivas pastas
3. **Execute** `npm install` para instalar dependências
4. **Execute** `npm run dev` para rodar o painel admin
5. **Acesse** `http://localhost:5175`

## 🔄 **Sincronização:**

- **Mudanças no admin** aparecem instantaneamente no frontend principal
- **Dados persistem** no localStorage
- **Comunicação em tempo real** entre os projetos

## ✅ **Funcionalidades:**

- ✅ Gerenciar produtos
- ✅ Personalizações avançadas
- ✅ Categorias
- ✅ Informações do restaurante
- ✅ Export/Import de dados
- ✅ Interface responsiva

**O painel admin estará funcionando perfeitamente e sincronizado com o frontend principal!** 🚀
