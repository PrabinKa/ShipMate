# ShipMate
Mini delivery application demonstrating offline-first architecture, background location tracking, and post-shipment payment integration. The app consolidates local and remote orders, supports offline shipment creation with sync capability, and provides real-time delivery tracking with platform-specific background services for Android and iOS.


## Setup Instructions

- Node.js (v22 or higher)
## Install yarn gobally
- npm install -g yarn
- corepack enable
## Install dependencies
- yarn install

## Build app
- yarn android
- yarn ios


## Libraries Used

- react-native-background-geolocation:geolocation	Background & foreground location tracking
- react-native-maps: Map rendering & marker animation
- @reduxjs/toolkit: State management
- RTK Query: API data fetching & caching
- react-native-mmkv: Secure and fast local storage
- react-native-permissions: Runtime permission handling
- react-native-skeleton-placeholder: Loading skeleton placeholder
- @react-native-community/netinfo: Checking network status
- @react-native-vector-icons/ionicons: For icons

## Key Technical Decisions & Justifications

1. Decision: Used react-native-background-geolocation

- Supports Android Foreground Service
- Persistent notification while tracking
- Continues tracking when: App is backgrounded, Screen is locked or App is terminated
- Production-grade stability
- Battery optimized via: distanceFilter

2. Decision: Used Redux Toolkit for global state and RTK Query for API handling

- Built-in caching
- Automatic re-fetching
- Clean interceptor support (token refresh handling)

3. Decision: Used react-native-mmkv instead of AsyncStorage

- Faster
- Encrypted storage
- Suitable for: Access tokens, Refresh tokens and Last known location

## AI Tools Usage

AI tools (including ChatGPT and kilo code AI vscode extension ) were used for:


- Refactoring token refresh interceptor logic
- Optimizing background tracking configuration
- Improving TypeScript typings
