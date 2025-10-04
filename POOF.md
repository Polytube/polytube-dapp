# 🎨 Vite Frontend Development Guide

This is a modern React + TypeScript + Vite frontend application with Tarobase integration for real-time data and authentication. Built for AI app generation with comprehensive UI component libraries and development tools.

## 🏗️ Project Structure

**Base template structure:**

```
src/
├── components/
│   ├── ui/                    # Reusable UI components (Shadcn/UI)
│   └── *.tsx                  # All custom components (flat structure)
├── hooks/
│   ├── use-tarobase-data.tsx  # Real-time data subscription hook
│   ├── use-mobile.tsx         # Mobile detection hook
│   └── use-auth.tsx           # Authentication hook
├── lib/
│   ├── tarobase.ts            # Auto-generated Tarobase SDK
│   ├── api-client.ts          # Auto-copied backend API client (when available)
│   ├── constants.ts           # Auto-injected app constants
│   └── utils.ts               # Utility functions
└── styles/
    └── globals.css            # Global styles and theme
```

**Note:** Components are created with a flat structure directly in `src/components/` rather than nested in feature folders.

Component filenames should be created to be obvious and intuitive to what they are doing and used for. If a component is made to represent a 'Page', use add a suffix of 'Page' on the created file. For example, the Home page should be at 'HomePage.tsx'.

## 🔧 Available Dependencies

### UI & Styling
- **React 19** with TypeScript for component development
- **Tailwind CSS** for utility-first styling
- **Shadcn/UI** for accessible, composable UI components
- **Lucide React** for consistent iconography
- **Sonner** for modern toast notifications (preferred over shadcn toast)

### Visualization & Rich Content
- **D3.js** for complex data visualization and interactive charts
- **Three.js** for 3D graphics and WebGL-based visualizations  
- **Recharts** for standard charts and data visualization
- **React-Markdown** for rendering Markdown content

### Blockchain Integration
- **Jupiter Swap Widget** for embeddable Solana token swap interface
- **Tarobase SDK** for authentication, data storage, and blockchain APIs

### Responsive Design
- **useMobile Hook** for responsive layouts and mobile detection

## 🔐 Authentication & Data

### useAuth Hook
```tsx
import { useAuth } from '@tarobase/js-sdk';

function AuthStatus() {
  const { login, logout, user, loading } = useAuth();
  
  if (loading) return <div>Loading...</div>;
  if (user) return (
    <div className="flex items-center gap-2">
      <span className="text-sm truncate">{user.address}</span>
      <Button onClick={logout} variant="outline" size="sm">Disconnect</Button>
    </div>
  );
  return <Button onClick={login} size="sm">Connect Wallet</Button>;
}
```

### Real-time Data with useTarobaseData
```tsx
import { useTarobaseData } from '@/hooks/use-tarobase-data';

// Subscribe to real-time data
const { data: posts, loading, error } = useTarobaseData<Post[]>(
  subscribeManyPosts, true, 'isPublished=true limit 10'
);

// Subscribe to single item with user dependency
const { user } = useAuth();
const { data: profile } = useTarobaseData<UserProfile | null>(
  subscribeUserProfile, !!user, user?.address
);
```

## 🎨 Styling & Theme

### Global CSS Theme
Use `src/globals.css` for consistent theming. If no specific theme is provided, implement a cool, unique theme like:
- Modern gradient
- Retro/vintage
- Neon/cyberpunk  
- Terminal/console

### Component Styling
- **Tailwind CSS** for all component styling
- **High contrast colors** for text readability
- **Responsive design** using Tailwind breakpoints
- **useMobile hook** for conditional mobile layouts

```tsx
import { useMobile } from '@/hooks/use-mobile';

function ResponsiveLayout() {
  const isMobile = useMobile();
  return (
    <div className={`${isMobile ? 'flex-col' : 'flex-row'} p-4`}>
      {/* Content */}
    </div>
  );
}
```

## 🧩 Component Development

### File Structure
- **One React component per file**
- **PascalCase** for component names
- **camelCase** for variables and functions
- **Components in `src/components/`** with shared UI in `src/components/ui/`

### TypeScript Standards
- **Strict typing** (avoid `any`)
- **Optional chaining** for all object property access: `object?.property`
- **Nullish coalescing** for defaults: `value ?? defaultValue`

### Component Example
```tsx
import { Button } from '@/components/ui/button';
import { useMobile } from '@/hooks/use-mobile';

interface FeatureCardProps {
  title: string;
  description?: string;
  onAction?: () => void;
}

export function FeatureCard({ title, description, onAction }: FeatureCardProps) {
  const isMobile = useMobile();
  
  return (
    <div className={`p-6 border rounded-lg ${isMobile ? 'w-full' : 'w-96'}`}>
      <h3 className="text-lg font-semibold">{title}</h3>
      {description && (
        <p className="text-muted-foreground mt-2">{description}</p>
      )}
      {onAction && (
        <Button onClick={onAction} className="mt-4">
          Take Action
        </Button>
      )}
    </div>
  );
}
```

## 📡 Tarobase SDK Integration

### Direct API Calls
```tsx
import { getItem, setItem, uploadAppFiles, getWalletTokenBalance, getTokenMetadata } from '@/lib/tarobase';
import { Time, Token } from '@/lib/tarobase';

// Basic CRUD operations
const item = await getItem('itemId');
await setItem('itemId', { 
  name: 'Example',
  timestamp: Time.Now,
  tokenAmount: Token.amount('SOL', 1.5)
});

// File operations
const success = await uploadAppFiles('fileId', file);
const fileItem = await getAppFiles('fileId');

// Blockchain data via Uniblock
const tokenData = await getWalletTokenBalance({
  walletAddress: '45MfLZaA7axCe8rHk3DYTdWU5wyHc1yCK4atDxyGz6S2',
  chainId: 'solana'
});

const tokenMetadata = await getTokenMetadata( {
  tokenAddress : 'pumpCmXqMfrsAkQ5r49WcJnRayYRqmXz6ae8H7H9Dfn'
})
```

### Special Values
- **`Time.Now`** - Server-side timestamp (Unix seconds)
- **`Token.amount(name, amount)`** - Cryptocurrency values with decimal handling
  - `'SOL'` - Native Solana (9 decimals)
  - `'USDC'` - USDC on Solana (6 decimals)  
  - `'other'` - All other SPL tokens (6 decimals)

### Data Handling
- **Timestamps**: All Tarobase timestamps are in SECONDS, convert with `new Date(timestamp * 1000)`
- **Token decimals**: Tarobase values need division by correct power of 10 for display
- **Uniblock values**: Already in human-readable format, no conversion needed

## 🚀 Development Workflow

### Component Creation
1. Create new component in `src/components/`
2. Import required UI components from `src/components/ui/`
3. Use `useMobile` for responsive behavior
4. Implement proper TypeScript typing
5. Add to parent component or route


### State Management
- **Local state**: Use React `useState` and `useEffect`
- **Authentication**: Use `useAuth` hook
- **Real-time data**: Use `useTarobaseData` hook
- **Global state**: Consider React Context for app-wide state

### Error Handling
- **Wrap async calls** in `try/catch` blocks
- **Display user feedback** with Sonner toasts
- **Handle loading states** with spinners or skeleton components
- **Graceful degradation** for failed API calls

### Performance
- **Optimize renders** with React.memo when needed
- **Avoid deep component nesting**
- **Use appropriate React hooks** for state management

## 🎯 Key Development Principles

1. **Responsive First** - Design for mobile, enhance for desktop
3. **Type Safety** - Leverage TypeScript for better development experience
4. **Consistency** - Follow established patterns and conventions
5. **Performance** - Optimize for fast loading and smooth interactions
6. **User Experience** - Provide clear feedback and intuitive interfaces

## General Principles
- Create clean and responsive interfaces
- Prioritize simplicity and usability
- Follow accessibility best practices
- Use consistent spacing, alignment, and visual hierarchy

## Component Structure
- Use Tailwind CSS for styling all components
- use global.css for styling. Make it follow a consistent theme and vibe. If no vibe or theme is provided, use something cool and unique. Examples are retro, neon, cyberpunk, terminal, etc.
- Leverage existing UI components from src/components/ui/ when possible
- Use icons from lucide-react library
- Organize components with proper separation of concerns

## Layout Approaches
- Use flex and grid layouts appropriately
- Ensure responsive behavior across device sizes
- Implement proper spacing with Tailwind's spacing utilities

## Code Style & Conventions
- PascalCase for component names
- camelCase for variables and functions
- 2-space indentation and 80-100 character line length
- TypeScript with proper typing (avoid 'any')
- Use '@/' path alias for src folder imports
- Create console logs when taking critical actions, BUT refreain from leaking any sensitive data
- Create descriptive console logs for errors, BUT refrain from leaking any sensitive data
- When doing console logs, be sure to 'JSON.stringify' any objects.

## Performance Optimization
- Optimize component rendering
- Avoid deep nesting of components
- Use appropriate React hooks for state management
- Implement lazy loading for large resources

### PartyServer websocket backend

When the application includes a PartyServer backend, WebSocket connections are available at:
```
ws://backend-url/parties/state/[roomId]
```

Use the existing `usePartyServerAuth` hook for real-time features like chat, collaboration, or live updates. Available websocket routes would be present in 'api-client.ts' if any exists.

### Hono REST API

When the application includes a backend with API routes, an 'api-client.ts' will be available in the lib folder at `src/lib/api-client.ts`. The API client automatically handles authentication for different route types.

#### Available API Clients

**1. Default Public API Client (for public routes)**
```typescript
import api from '@/lib/api-client';

// Use for public routes (health checks, public data, etc.)
const healthResponse = await api.health();
const publicData = await api.getPublicData();
```

**2. Authenticated API Client (for routes that require authentication)**
```typescript
import { createAdminApiClient } from '@/lib/api-client';
import { useAuth, getIdToken } from '@tarobase/js-sdk';

// Create authenticated client for protected routes
const { user } = useAuth();

if (user) {
  const token = await getIdToken();
  const authenticatedApi = createAdminApiClient({
    token: token,
    walletAddress: user.address
  });

  // Any route that requires authentication (user auth or admin auth)
  const userProfile = await authenticatedApi.getUserProfile();
  const adminData = await authenticatedApi.getAdminData();
  const protectedData = await authenticatedApi.getProtectedEndpoint();
}
```

#### When to Use Which Client

**Use `api` (default client) when:**
- Route has `requiresAuth: false` or is marked as public
- Making calls to public routes (health checks, public data)
- No authentication needed

**Use `createAdminApiClient()` when:**
- Route has `requiresAuth: true` or is marked as admin
- User is authenticated with Tarobase
- Calling any protected endpoint (user data, admin functions, etc.)

#### Practical Usage in Components

```typescript
import { createAdminApiClient } from '@/lib/api-client';
import { useAuth, getIdToken } from '@tarobase/js-sdk';
import { useState, useEffect } from 'react';

function ProtectedComponent() {
  const { user } = useAuth();
  const [protectedData, setProtectedData] = useState(null);
  
  useEffect(() => {
    async function fetchProtectedData() {
      if (user) {
        try {
          const token = await getIdToken();
          const authenticatedApi = createAdminApiClient({
            token: token,
            walletAddress: user.address
          });
          
          // Call any route that requires authentication
          const userData = await authenticatedApi.getUserProfile();
          const adminData = await authenticatedApi.getAdminData(); // if user is admin
          
          setProtectedData({ userData, adminData });
        } catch (error) {
          console.error('Failed to fetch protected data:', error);
        }
      }
    }
    
    fetchProtectedData();
  }, [user]);
  
  if (!user) return <div>Please login</div>;
  
  return <div>{/* Render protected data */}</div>;
}
```

#### How It Works

**For public routes:** Use the default `api` client - no authentication needed.
```typescript
import api from '@/lib/api-client';
const health = await api.health(); // Simple, no auth required
```

**For protected routes (requiresAuth: true or admin routes):** The authenticated client automatically adds the required headers:
- `Authorization: Bearer <token>` 
- `X-Wallet-Address: <address>`

#### Error Handling

```typescript
try {
  const result = await authenticatedApi.someEndpoint();
  console.log(result);
} catch (error) {
  if (error instanceof ApiError) {
    console.error(`API Error [${error.code}]: ${error.message}`);
  }
}
```

#### Response Types

All API responses follow this structure:
```typescript
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  error?: {
    code: string;
    message: string;
    details?: any;
  };
  timestamp: number;
  requestId?: string;
}

export class ApiError extends Error {
  constructor(
    public code: string,
    message: string,
    public details?: any,
    public response?: Response
  ) {
    super(message);
    this.name = 'ApiError';
  }
}
```
