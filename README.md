# new-marko-app

To get started, install the command line tool globally.  This will be used to start a new application.

```
npm install new-marko-app --global
```

## Creating a new app

First, call `new-marko-app` and pass the name of the application that you want to create.

```
new-marko-app test-app
```

This creates a new directory and bootstraps your application inside of it.  To start the app, change into the app directory and run `npm start`.

```
cd test-app
npm start
```

## Adding pages

Adding a page to your application simply requires adding a new directory under the `src/routes` directory.  Inside this directory, you can put either an `index.marko` template and/or a `route.js` file that exports a `handler` method.

<details>
<summary>Example scenario</summary>
>
> Given a directory structure like this:
>
> ```
> ⤷ src/
>    ⤷ routes/
>       ⤷ my-page/
>          ⤷ index.marko
> ```
>
> Hitting `/my-page` will render `index.marko`.
</details>

### Custom routes and params

By default, the route for a page is determined by the page's directory name, but you can also define a custom route for your page.  This route can include custom express-style url parameters.  You do this by exporting a `path` from a `route.js` file in your page's directory:

```js
exports.path = '/people/:name';
```

If using an `index.marko` template for the route, the data passed to the template will be any values in the url query string and url parameters.  

<details>
<summary>Example scenario</summary>
>
> Given a route:
> ```
> /people/:name
> ```
>
> And a template:
> ```html
> <ul>
>     <li>${data.name}</li>
>     <li>${data.age}</li>
</ul>
> ```
>
> When you hit the following url:
> ```
> /people/frank?age=27
> ```
>
> The rendered output would be:
> ```html
> <ul>
>     <li>frank</li>
>     <li>27</li>
> </ul>
> ```
</details>

### Custom handler entry

If you need more control over the data passed to the template or don't even want to render a template, you can define a custom `handler` function in your `route.js` file:

```js
const template = require('./index.marko');

exports.handler = (req, res) => {
    res.marko(template, {});
}
```


## Adding components

To add a component, simply create a new directory under the `src/components` directory.  The directory name will be used as the component name.  Inside the directory you should put an `index.marko` file.

```
⤷ components/
  ⤷ my-component/
     ⤷ index.marko
```

Given the above structure, you will be able to use `<my-component>` in any other component template or page template.

### Client-side behavior

Adding client-side behavior to a component is as simple as defining methods in your `index.marko` in a script tag and exporting them within the template, or defining a `component.js` file next to your `index.marko` file that exports the methods.

<details>
<summary>Example single file component</summary>
**index.marko**
```html
<script>
    module.exports = {
        onInput(input) {
            this.state = {
                count: input.count
            }
            this.initialCount = input.count
        },
        incrementCount() {
            this.state.count++
        },
        resetCount() {
            this.state.count = this.initialCount
        }
    }
</script>

<div>${state.count}</div>
<button on-click('incrementCount')>+</button>
<button on-click('resetCount')>reset</button>
```
</details>

<details>
<summary>Example split component</summary>
**index.marko**
```html
<div>${state.count}</div>
<button on-click('incrementCount')>+</button>
<button on-click('resetCount')>reset</button>
```
**component.js**
```js
module.exports = {
    onInput(input) {
        this.state = {
            count: input.count
        }
        this.initialCount = input.count
    },
    incrementCount() {
        this.state.count++
    },
    resetCount() {
        this.state.count = this.initialCount
    }
}
```
</details>

### Styles

To add styles to your components, either add a top-level `<style>` tag in your `index.marko` file or define a `style.css` file next to your `index.marko` file.

### Page specific components

You can create a `components` directory under a page directory and those components will only be available to that page.

<details>
<summary>Example page specific component</summary>
>
> Given a directory structure like this:
>
> ```
> ⤷ pages/
>    ⤷ my-page/
>       ⤷ components/
>          ⤷ my-page-component/
>             ⤷ index.marko
>       ⤷ index.marko
> ```
>
> You will only be able to use `<my-page-component>` from the `my-page/index.marko` template or other components defined under `my-page/components`.
</details>

### Subcomponents

You can also create a `components` directory under another component and those components will only be available to the parent component.

<details>
<summary>Example subcomponent</summary>
>
> Given a directory structure like this:
>
> ```
> ⤷ components/
>    ⤷ my-component/
>       ⤷ components/
>          ⤷ my-subcomponent/
>             ⤷ index.marko
>       ⤷ index.marko
> ```
>
> You will only be able to use `<my-subcomponent>` from the `my-component/index.marko` template or other subcomponents defined under `my-component/components`.
</details>

## Building a static site

Generating a static site is simple:

```
npm run build
```

The build tool will hit all your page routes and generate the resulting html files and assets in a `build` directory at your project root.  You can then take this build directory and host it on any provider that provides static hosting.

### Dynamic routes

If you have routes that have custom parameters, the build tool needs to know which parameters can be passed.  You can export a `params` array from the `index.js` file for a page.

```js
import template from './template.marko';

export const route = '/people/:name';

export const params = [
    { name:'reyna' },
    { name:'dakota' },
    { name:'jordan' },
];

export const handler = (req, res) => {
    res.marko(template, { name:req.params.name });
}
```

`params` may be programmatically generated and may also be a `Promise`.

### Publishing to GitHub Pages (or other remote repo)

Simply add a `static-repo` entry to your `package.json` which is a git url.  When running `npm run build`, a new commit will be created and pushed to the remote repository.

```js
{
  ...
  "static-repo": "git@github.com:user/repo.git#branch"
}
```

If you're publishing a project site at a subdirectory, you'll also want to set a `baseurl` entry which will be prepended to any root-relative urls.

```js
{
  ...
  "static-repo": "git@github.com:user/repo.git#branch",
  "baseurl": "/repo"
}
```

## Ejecting (advanced)

If you need to do something that is not supported by `new-marko-app`, you can run:

```
npm run eject
```

This will uninstall `new-marko-app` and install a bunch of other modules, and add some additional files to your project which you can then fully customize.

**Beware:** This is a one way operation, if you want to undo it, you better be using `git` or some other form of version control.
