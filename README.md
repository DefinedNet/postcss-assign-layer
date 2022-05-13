# postcss-assign-layer <!-- omit in toc -->

[PostCSS] plugin to assign a css cascade layer to files based on a glob pattern

[postcss]: https://github.com/postcss/postcss

## Table of Contents <!-- omit in toc -->

- [Why?](#why)
- [Usage](#usage)
  - [**Step 1:** Install plugin](#step-1-install-plugin)
  - [**Step 2:** Check your project for existing PostCSS config:](#step-2-check-your-project-for-existing-postcss-config)
  - [**Step 3:** Add the plugin to plugins list (at the end)](#step-3-add-the-plugin-to-plugins-list-at-the-end)
  - [**Step 4:** Configure the plugin](#step-4-configure-the-plugin)
    - [`include`](#include)
    - [`layerName`](#layername)

## Why?

[CSS Cascade Layers] are a powerful new tool to give us more control over the cascade. [A Complete Guide to CSS Cascade Layers] is an excellent introduction that goes in depth into the details of how it works and the reasons you might want to use it.

One useful approach is to create different layers for defaults, components, and utilities, with increasing order of priority. So, components will always override a selector with the same specificity in the defaults layer, but utilities will override components. Defaults and utilities can be easily assigned up-front, in your global stylesheets imported at the root of your applicaiton. But you might have separate css files spread over your app for your components, especially if you're using an approach like [css modules].

That's where this plugin comes in. By default, it will wrap the contents of each `*.module.css` file into a `components` layer (both the glob and the name of the layer can be changed). So, for example, given a css module file like:

```css
/* component.module.css */

.foo {
  color: rebeccapurple;
}

.bar {
  color: blanchedalmond;
}
```

The end result will be:

```css
/* component.module.css */

@layer components {
  .foo {
    color: rebeccapurple;
  }

  .bar {
    color: blanchedalmond;
  }
}
```

Now, you can be assured that your component css will be added to the correct layer!

## Usage

### **Step 1:** Install plugin

```sh
npm install --save-dev postcss postcss-assign-layer
```

### **Step 2:** Check your project for existing PostCSS config:

`postcss.config.js` in the project root, `"postcss"` section in `package.json` or `postcss` in bundle config.

If you do not use PostCSS, add it according to [official docs] and set this plugin in settings.

### **Step 3:** Add the plugin to plugins list (at the end)

```diff
module.exports = {
  plugins: [
    require('autoprefixer'),
+   require('postcss-assign-layer')({
+     include: '**/*.module.css',
+     layerName: 'components',
+   }),
  ],
}
```

### **Step 4:** Configure the plugin

It's possible to configure the include glob, as well as the layer name.

#### `include`

Default: `"**/*.module.css"`

A valid [picomatch] pattern, or array of patterns. Note that `picomatch` patterns are very similar to [minimatch] patterns, and in most use cases, they are interchangeable. If you have more specific pattern matching needs, you can view [this comparison table] to learn more about where the libraries differ.

#### `layerName`

Default: `'components'`

The [layer name] that will be used.

[css cascade layers]: https://www.w3.org/TR/css-cascade-5/#layering
[a complete guide to css cascade layers]: https://css-tricks.com/css-cascade-layers/
[css modules]: https://github.com/css-modules/css-modules
[official docs]: https://github.com/postcss/postcss#usage
[picomatch]: https://github.com/micromatch/picomatch#globbing-features
[minimatch]: https://github.com/isaacs/minimatch#readme
[this comparison table]: https://github.com/micromatch/picomatch#library-comparisons
[layer name]: https://www.w3.org/TR/css-cascade-5/#typedef-layer-name
