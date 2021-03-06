A wrapper on top of Rollout.io [rox-ssr](https://www.npmjs.com/package/rox-ssr) SDK to support multiple [entry points](https://webpack.js.org/concepts/entry-points/)

![](https://github.com/g-guirado/rox-ssr-multi-entrypoints/workflows/CI/badge.svg)

# Why?
rox-ssr does not behave well when using multiple webpack entry points. This package aims to solve that issue. Note that none of the code is Webpack specific so this should work with other similar tools.

This was successfully tested with [Next.js](https://nextjs.org/).

# Installation
```
yarn add rox-ssr-multi-entrypoints
```

# Usage
Same as [rox-ssr](https://www.npmjs.com/package/rox-ssr) but use `import from 'rox-ssr-multi-entrypoints'` instead of `import from 'rox-ssr'`

# Caveats
- Rollout offers 3 types of objects: Configuration, Flag and Variant. Because the DynamicApi does not support Configuration, this package also doesn't support it. Use Flag for boolean values and Variant for anything else.
- *This is not an official CloudBees Rollout SDK*. 

# License
MIT
