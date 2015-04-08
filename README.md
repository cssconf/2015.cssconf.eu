# cssconf 2015
## Installation
After checking out the repository just run `npm install` and `npm start` afterwards. The website will be available on `localhost:3000`.

## Coding standards
Please take a look at existing styles and try to code that way. A few things to keep in mind:
* Use variables which are located in the `_variables.scss`.
* Use breakpoints as described in`_breakpoints.scss`.
* If you create new modules please create a separate `_name-of-the-module.scss` file and import it in `_app.scss`(we have no template engine for HTML modules at the current state).
* ALWAYS! use `em` for font-sizing.
* Stick with relative unites like `em`, `%`, `vw`, `vh`, `vmin`, `vmax` if you can.
* If you think your code could be hard to understand or needs explanation, write comments.

## Grid Explanation
The whole grid relies on `display: inline-block`. Because of the ``whitepsace` issue every `grid__item` followed by a `grid__item` has to be sorrounded by HTML comments like so:

```
<div class="grid__item"></div><!--
--><div class="grid__item"></div>
```
At the given moment you won't find grid classes inside the HTML. Every `grid__item` gets it's styles from Sass `@extend`s. This is something I will change in the near future.
