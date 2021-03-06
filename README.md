# cssconf 2015
## Installation
After checking out the repository just run `npm install` and `grunt dev` afterwards. The website will be available on `localhost:3000`.

## Coding standards
Please take a look at existing styles and try to code that way. A few things to keep in mind:
* Use variables which are located in the `_variables.scss`.
* Use breakpoints as described in`_breakpoints.scss`.
* If you create new modules please create a separate `_name-of-the-module.scss` file and import it in `_app.scss`(we have no template engine for HTML modules at the current state).
* ALWAYS! use `em` for font-sizing.
* Stick with relative unites like `em`, `%`, `vw`, `vh`, `vmin`, `vmax` if you can.
* If you think your code could be hard to understand or needs explanation, write comments.

## Layout Explanation

To have a gap to the left and right of a section, extend the container class:
`@extend %container`

To ensure a max-width for content within a section, extend the container-content class:
`%container-content`

## Grid Explanation
The whole grid relies on `display: inline-block`. Because of the `whitepsace` issue every `grid__item` followed by a `grid__item` has to be sorrounded by HTML comments like so:

```
<div class="grid__item"></div><!--
--><div class="grid__item"></div>
```
At the given moment you won't find grid classes inside the HTML. Every `grid__item` gets it's styles from Sass `@extend`s. This is something I will change in the near future.

You can find the well documented grid in `_grid.scss`. Variables to overwrite `!default`s are set in `_variables.scss`.

->

`.rw`(row) extends `%grid--full`
`.cl`(column) extends `%grid__item`

To build a layout use `<div class="rw"></div>` to open a new row aka. grid entity. Use `class="cl"` for elements inside. If you want elements with a gutter, wrap the `.cl` elements inside another element like so:

```
<div class="rw">
  <section class="grid-spaces">
    <div class="cl"></div>
    <div class="cl"></div>
    <div class="cl"></div>
    <div class="cl"></div>
  </section>
</div>
```

## Namespaces

* `c-classname` – content sections which do not require much styling
* `g-classname` – grid wrapper to set specific styling options

## Comments

* Sass comments `// I AM A SASS COMMENT`
* Template comments `{{!-- I AM A TEMPLATE COMMENT --}}`

## Breakpoints

Take a look at `_breakpoints.scss` before you alter any styles regarding media queries.
You include breakpoints like this:
```
.classname {
  @include bp(small) {...;}
}
```
Make sure to check for predefined breakpoint names.

## Deployment

You need to have the `config.deployment.json` in your project root.

If a new release is deployed to live, make sure to update the `version` in the `package.json`. This version number is used as a prefix for the assets folder to enable filename based cache busting.

**Deploy to staging:**
```
$ ./deploy.js staging
```

**Deploy to live:**
```
$ ./deploy.js live
```
