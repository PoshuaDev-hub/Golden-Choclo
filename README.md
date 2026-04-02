# 🌽 Golden Choclo — Sistema de Gestión Operativa

> Plataforma SaaS para la gestión de ventas, pedidos y finanzas de un negocio de Pastel de Choclo artesanal en Puerto Aysén, Patagonia, Chile.

---

## ¿Qué es este proyecto?

**Golden Choclo** es una aplicación web full-stack construida con **Next.js 16 + Supabase** que reemplaza el uso de planillas Excel y WhatsApp informales para la operación diaria de un negocio de comida artesanal.

El sistema tiene **dos interfaces separadas**:

- 🧑‍💼 **Panel de Administración** — para el dueño del negocio
- 🛒 **Portal de Cliente** — para que los clientes vean el menú y hagan pedidos

---

## 🚀 Stack Tecnológico

| Tecnología | Rol |
|---|---|
| **Next.js 16.2 (App Router)** | Framework principal, Turbopack para builds |
| **React 19** | UI components |
| **TypeScript** | Tipado estático completo |
| **Tailwind CSS v4** | Estilos utilitarios via `@theme` en globals.css |
| **Supabase** | Base de datos PostgreSQL + Auth + Storage |
| **html-to-image** | Generación de comprobantes PNG descargables |
| **Lucide React** | Librería de íconos |
| **Vitest + Testing Library** | Suite de tests automatizados |

---

## 📁 Estructura del Proyecto

```
golden-choclo/
├── app/                          # App Router de Next.js
│   ├── layout.tsx                # Layout raíz: fuentes, metadata, viewport
│   ├── globals.css               # Sistema de diseño: tokens de color, tipografía
│   ├── page.tsx                  # Landing page (acceso al panel admin)
│   │
│   ├── admin/                    # 🔒 Panel de Administración
│   │   ├── layout.tsx            # Layout con sidebar de navegación
│   │   ├── page.tsx              # Dashboard: resumen de ventas del mes
│   │   ├── login/                # Autenticación del administrador
│   │   └── mode/
│   │       ├── pedidos/          # Gestión de pedidos en tiempo real
│   │       ├── productos/        # CRUD del catálogo de productos
│   │       ├── comprobante/      # Generador de boletas PNG
│   │       ├── finanzas/         # Registro de ingresos y gastos
│   │       ├── venta-manual/     # Registro de ventas directas (sin web)
│   │       └── configuracion/    # Configuración general del negocio
│   │
│   └── cliente/                  # 🌐 Portal Público de Cliente
│       └── mode/
│           ├── catalogo/         # Catálogo de productos disponibles
│           └── formulario/       # Formulario de pedido online
│
├── components/
│   └── ui/
│       ├── NavAdmin.tsx          # Sidebar de navegación del admin (responsive)
│       └── Boleta.tsx            # Componente de comprobante descargable en PNG
│
├── hooks/                        # Hooks reutilizables de datos (Supabase)
│   ├── useOrders.ts              # Pedidos del mes actual y anterior
│   ├── useProducts.ts            # Catálogo de productos (admin y cliente)
│   ├── useTransactions.ts        # Movimientos financieros
│   └── useSettings.ts            # Configuración del negocio (gc_settings)
│
├── lib/
│   ├── gc-data.ts                # Tipos TypeScript y helpers de datos
│   └── supabase.ts               # Cliente singleton de Supabase
│
├── public/
│   └── logo.png                  # Logotipo del negocio
│
├── tests/                        # Suite de tests (Vitest)
│   ├── setup.ts                  # Configuración global de Testing Library
│   ├── unit/                     # Tests unitarios (ej: gc-data.ts)
│   └── integration/              # Tests de integración (ej: Boleta.tsx)
│
├── next.config.ts                # Configuración Next.js (remote images Supabase)
├── vitest.config.ts              # Configuración de Vitest
├── tsconfig.json                 # Configuración TypeScript
└── .env.local                    # Variables de entorno (NO se sube a Git)
```

---

## ⚙️ Configuración del Entorno

### 1. Clonar el repo e instalar dependencias

```bash
git clone https://github.com/tu-usuario/golden-choclo.git
cd golden-choclo
npm install
```

### 2. Variables de entorno

Crear un archivo `.env.local` en la raíz con:

```env
NEXT_PUBLIC_GC_SUPABASE_URL=https://tu-proyecto.supabase.co
NEXT_PUBLIC_GC_SUPABASE_ANON_KEY=tu-anon-key-aqui
```

Estos valores los encuentras en tu proyecto de Supabase → **Settings → API**.

### 3. Correr en desarrollo

```bash
npm run dev
```

La app estará disponible en `http://localhost:3000`.

---

## 🗄️ Base de Datos — Tablas de Supabase

| Tabla | Descripción |
|---|---|
| `gc_products` | Catálogo de productos con variantes (nombre, precio, disponibilidad) |
| `gc_orders` | Pedidos (web y manual) con items, estado, tipo de entrega y folio |
| `gc_transactions` | Movimientos financieros: ingresos y gastos categorizados |
| `gc_settings` | Configuración del negocio en clave-valor (ej: `whatsapp_number`) |

---

## 🧭 Flujos Principales

### Flujo Admin
```
Landing (/) → Login (/admin/login) → Dashboard (/admin)
                                        ├── Pedidos del día
                                        ├── Agregar venta manual
                                        ├── Gestionar productos
                                        ├── Ver/generar comprobantes
│                                       ├── Registrar gastos e ingresos
                                        └── Configuración general
```

### Flujo Cliente
```
Catálogo (/cliente/mode/catalogo)
    └── Selecciona productos
        └── Formulario (/cliente/mode/formulario)
            └── Confirma pedido → notificación WhatsApp al negocio
```

---

## 📦 Scripts Disponibles

```bash
npm run dev        # Servidor de desarrollo con hot reload
npm run build      # Build de producción optimizado
npm run start      # Corre el build de producción
npm run lint       # Linter ESLint sobre archivos TS/TSX
npm run test       # Corre todos los tests (Vitest)
npm run test:watch # Tests en modo watch
npm run test:ui    # Tests con interfaz gráfica de Vitest
```

---

## 🎨 Sistema de Diseño

El sistema de diseño usa **Tailwind CSS v4** con tokens definidos directamente en `app/globals.css`:

```css
@theme {
  --font-sans: var(--font-dm-sans);       /* Texto general */
  --font-heading: var(--font-syne);       /* Títulos e íconos */
  --color-golden-main: #FCA311;           /* Dorado principal */
  --color-dark-bg: #000000;              /* Fondo oscuro */
  --color-dark-card: #14213D;            /* Fondo de cards */
  --color-soft-gray: #E5E5E5;            /* Texto suave */
}
```

Fuentes cargadas via `next/font/google`:
- **Syne** → Headings (font-heading)
- **DM Sans** → Texto general (font-sans)

---

## 🔒 Autenticación

El sistema usa autenticación simple por localStorage:
- La contraseña admin se verifica contra la tabla `gc_settings` (clave: `admin_password`)
- Al hacer login, se guarda `gc_admin: true` en `localStorage`
- El layout de admin verifica esta clave y redirige al login si no existe

---

## 🧪 Tests

Los tests usan **Vitest + Testing Library** con entorno JSDOM. Están organizados en:

- `tests/unit/` — lógica pura (funciones de `lib/gc-data.ts`)
- `tests/integration/` — renderizado de componentes (ej: `Boleta.tsx`)

```bash
npm run test   # Corre toda la suite
```

---

## 📝 Notas de Desarrollo

- El proyecto usa **App Router** de Next.js — no hay carpeta `pages/`
- Todos los componentes del cliente llevan `"use client"` al inicio
- Los hooks en `hooks/` encapsulan todas las consultas a Supabase para reutilización
- Las imágenes de productos se sirven desde **Supabase Storage** (CDN configurado en `next.config.ts`)
- El comprobante de venta se genera como imagen PNG descargable usando `html-to-image`

---

## 📍 Contexto del Negocio

**Golden Choclo** es un emprendimiento de comida artesanal ubicado en **Puerto Aysén, Región de Aysén, Patagonia, Chile**. Vende Pastel de Choclo en diferentes formatos (individual, familiar) y ofrece modalidades de retiro en local y delivery.

---

*Desarrollado por [PoshuaDev](https://github.com/PoshuaDev) • Aysén, Chile 🇨🇱*
