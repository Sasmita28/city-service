console.log("Hello Team")
d3.json("/query").then((data) => {
    console.log(data)
});