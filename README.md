# json-view

This is a JavaScript library for displaying JSON data in the DOM.
[Demo link](http://pgrabovets.github.io/json-view/)

## Installation

```javascript
  npm install '@pgrabovets/json-view'
```

## How to use

Import the jsonview library from the npm package:

```javascript
import jsonview from "@pgrabovets/json-view";
import "@pgrabovets/json-view/style.css";
```

Or include jsonview.umd.cjs and jsonview.css from the dist directory in your HTML page:

```html
<link href="jsonview.css" rel="stylesheet" />
<script src="jsonview.umd.cjs"></script>
```

Get JSON data and render the tree into the DOM:

```javascript
// get json data
const data = '{"name": "json-view","version": "1.0.0"}';

// create json tree object
const tree = jsonview.create(data);

// render tree into dom element
jsonview.render(tree, document.querySelector(".tree"));

// you can render JSON data without creating a tree manually
const tree = jsonview.renderJSON(data, document.querySelector(".tree"));
```

Control methods:

```javascript
// expand tree
jsonview.expand(tree);

// collapse tree
jsonview.collapse(tree);

// traverse tree object
jsonview.traverse(tree, function (node) {
  console.log(node);
});

// toggle between show and hide
jsonview.toggleNode(tree);

// destroy and unmount JSON tree from the DOM
jsonview.destroy(tree);
```

## Example 1

```html
<!DOCTYPE html>
<html>
  <head>
    <link href="dist/jsonview.css" rel="stylesheet" />
    <title>JSON VIEW</title>
  </head>
  <body>
    <div class="root"></div>

    <script type="text/javascript" src="dist/jsonview.umd.cjs"></script>
    <script type="text/javascript">
      fetch("dist/example2.json")
        .then((res) => {
          return res.text();
        })
        .then((data) => {
          const tree = jsonview.create(data);
          jsonview.render(tree, document.querySelector("#root"));
          jsonview.expand(tree);
        })
        .catch((err) => {
          console.log(err);
        });
    </script>
  </body>
</html>
```

## Example 2

```javascript
import "@pgrabovets/json-view/style.css";
import jsonview from "@pgrabovets/json-view";

fetch("example2.json")
  .then((res) => {
    return res.text();
  })
  .then((data) => {
    const tree = jsonview.create(data);
    jsonview.render(tree, document.querySelector(".root"));
    jsonview.expand(tree);
  })
  .catch((err) => {
    console.log(err);
  });
```

## Development

### Clone the repository and install dependencies:

```
$ npm install

$ npm run dev
$ npm run build

open http://localhost:5173/
```
