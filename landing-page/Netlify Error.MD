Netlify Build                                                 
4:24:12 PM: ────────────────────────────────────────────────────────────────
4:24:12 PM: ​
4:24:12 PM: ❯ Version
4:24:12 PM:   @netlify/build 35.1.6
4:24:12 PM: ​
4:24:12 PM: ❯ Flags
4:24:12 PM:   accountId: 5e58ca2764600eaf0568b701
4:24:12 PM:   baseRelDir: true
4:24:12 PM:   buildId: 68c19803e79d0309c3d93267
4:24:12 PM:   deployId: 68c19803e79d0309c3d93269
4:24:12 PM: ​
4:24:12 PM: ❯ Current directory
4:24:12 PM:   /opt/build/repo/landing-page
4:24:12 PM: ​
4:24:12 PM: ❯ Config file
4:24:12 PM:   No config file was defined: using default values.
4:24:12 PM: ​
4:24:12 PM: ❯ Context
4:24:12 PM:   production
4:24:13 PM: ​
4:24:13 PM: ❯ Using Next.js Runtime - v5.13.1
4:24:14 PM: No Next.js cache to restore
4:24:14 PM: ​
4:24:14 PM: Build command from Netlify app                                
4:24:14 PM: ────────────────────────────────────────────────────────────────
4:24:14 PM: ​
4:24:14 PM: $ npm run build
4:24:14 PM: > landing-page@1.0.0 build
4:24:14 PM: > next build
4:24:14 PM: ⚠ No build cache found. Please configure build caching for faster rebuilds. Read more: https://nextjs.org/docs/messages/no-cache
4:24:14 PM:    ▲ Next.js 15.5.2
4:24:14 PM:    Linting and checking validity of types ...
4:24:15 PM: Failed during stage 'building site': Build script returned non-zero exit code: 2 (https://ntl.fyi/exit-code-2)
4:24:15 PM: It looks like you're trying to use TypeScript but do not have the required package(s) installed.
4:24:15 PM: Please install @types/node by running:
4:24:15 PM: 	yarn add --dev @types/node
4:24:15 PM: If you are not trying to use TypeScript, please remove the tsconfig.json file from your package root (and any TypeScript files in your app and pages directories).
4:24:15 PM: Next.js build worker exited with code: 1 and signal: null
4:24:15 PM: ​
4:24:15 PM: "build.command" failed                                        
4:24:15 PM: ────────────────────────────────────────────────────────────────
4:24:15 PM: ​
4:24:15 PM:   Error message
4:24:15 PM:   Command failed with exit code 1: npm run build (https://ntl.fyi/exit-code-1)
4:24:15 PM: ​
4:24:15 PM:   Error location
4:24:15 PM:   In Build command from Netlify app:
4:24:15 PM:   npm run build
4:24:15 PM: ​
4:24:15 PM:   Resolved config
4:24:15 PM:   build:
4:24:15 PM:     base: /opt/build/repo/landing-page
4:24:15 PM:     command: npm run build
4:24:15 PM:     commandOrigin: ui
4:24:15 PM:     publish: /opt/build/repo/landing-page/.next
4:24:15 PM:     publishOrigin: ui
4:24:15 PM:   plugins:
4:24:15 PM:     - inputs: {}
4:24:15 PM:       origin: ui
4:24:15 PM:       package: "@netlify/plugin-nextjs"
4:24:15 PM: Build failed due to a user error: Build script returned non-zero exit code: 2
4:24:15 PM: Failing build: Failed to build site
4:24:15 PM: Finished processing build request in 24.056s