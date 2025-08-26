## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

## Installation setup for this project
- Would you like to use TypeScript? -> Yes
- Would you like to use ESLint? -> Yes
- Would you like to use Tailwind CSS? -> Yes
- Would you like your code inside a `src/` directory? -> Yes
- Would you like to use App Router? (recommended) -> Yes
- Would you like to use Turbopack? (recommended) -> Yes
- Would you like to customize the import alias (`@/*` by default)? -> No

### rule of thumb:
- if logic is only for one component, keep it there.
- if logic is reused or complex, move it into a hook.

### hooks
Types of hooks
1. Built-in React hooks
- useState → keep state in a component
- useEffect → run side effects (fetch data, subscribe/unsubscribe)
- useContext → access context
- useRef → keep a mutable value across renders
- useMemo, useCallback → performance optimizations

### services
- Encapsulation – hide implementation details (REST, GraphQL, Firebase, etc.) behind a clean API.
- Reusability – one service can be used in many hooks/features.
- Swapability – if backend changes, you only update the service, not every component.
- Testability – you can mock services in tests without touching UI.

### shortcuts
- rafce → React Arrow Function Component Export
- rafcp → React Arrow Function Component with PropTypes
- rafc → React Arrow Function Component

