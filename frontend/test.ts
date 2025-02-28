{
  "compilerOptions": {
    "target": "ES2020",                  // Target ECMAScript version for the output
    "module": "ESNext",                   // Use ESNext module system
    "moduleResolution": "node",           // Resolve modules in the Node.js style
    "esModuleInterop": true,              // Enable interop with CommonJS modules
    "strict": true,                       // Enable strict type-checking options
    "skipLibCheck": true,                 // Skip checking declaration files for performance
    "noEmit": true,                       // Do not generate output files (used with ts-node)
    "jsx": "react-jsx",                   // Enable JSX syntax for React (frontend)
    "lib": ["ES2020", "DOM"],             // Include library files for ES2020 and DOM (frontend)
    "allowJs": true,                      // Allow JavaScript files in the project
    "resolveJsonModule": true,            // Allow importing .json files
    "isolatedModules": true,              // Ensure each file is treated as an isolated module
    "noUnusedLocals": true,               // Report unused local variables
    "noUnusedParameters": true,           // Report unused function parameters
    "noFallthroughCasesInSwitch": true,   // Prevent fallthrough in switch statements
    "noUncheckedSideEffectImports": true,  // Prevent importing modules with side effects
    "moduleDetection": "force",           // Force module detection
    "allowImportingTsExtensions": true    // Allow importing TypeScript extensions
  },
  "include": [
    "src/**/*.ts"                         // Include all TypeScript files under the src directory
, "src/test.mjs"  ],
  "exclude": [
    "node_modules"                        // Exclude node_modules from compilation
  ]
}