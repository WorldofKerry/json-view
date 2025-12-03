import jsonview from "./json-view";

fetch("example2.json")
  .then((res) => {
    return res.text();
  })
  .then((data) => {
    const tree = jsonview.create(data);
    jsonview.expand(tree);
    jsonview.render(tree, document.getElementById("root"));
  })
  .catch((err) => {
    console.log(err);
  });
