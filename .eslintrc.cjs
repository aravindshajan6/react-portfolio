module.exports = {
  root: true,
  env: { browser: true, es2021: true, node: true },
  globals: { __BUILD_HASH__: 'readonly', __BUILD_DATE__: 'readonly' },
  extends: [
    'eslint:recommended',
    'plugin:react/recommended',
    'plugin:react/jsx-runtime',
    'plugin:react-hooks/recommended',
  ],
  ignorePatterns: ['dist', '.eslintrc.cjs'],
  parserOptions: { ecmaVersion: 'latest', sourceType: 'module' },
  settings: { react: { version: '18.2' } },
  plugins: ['react-refresh'],
  rules: {
    'react-refresh/only-export-components': 'warn',
    'react/prop-types': 'off',
    'react/no-unknown-property': ['error', { ignore: [
      'args', 'position', 'rotation', 'intensity', 'transparent', 'emissive', 'emissiveIntensity',
      'roughness', 'metalness', 'map', 'toneMapped', 'sizeAttenuation', 'depthWrite', 'attach',
      'castShadow', 'receiveShadow', 'dispose', 'frustumCulled', 'stride', 'geometry', 'material',
    ] }],
  },
};
