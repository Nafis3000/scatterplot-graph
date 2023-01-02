let url =
  "https://raw.githubusercontent.com/freeCodeCamp/ProjectReferenceData/master/cyclist-data.json";
let req = new XMLHttpRequest();

let values = [];

let xScale
let yScale;

let xAxis
let yAxis

let width = 800;
let height = 600;
let padding = 40;

let svg = d3.select("svg");
let tooltip = d3.select('#tooltip')


let generateScales = () => {

  xScale = d3.scaleLinear()
    .domain([
      d3.min(values, (d) => {
        return d["Year"];
      }) - 1,
      d3.max(values, (d) => {
        return d["Year"];
      }) + 1
    ])
    .range([padding, width - padding]);

  yScale = d3.scaleTime()
    .domain([d3.min(values, (d) =>{
      return new Date(d["Seconds"] * 1000)
    }), d3.max(values, (d) => {
      return new Date(d["Seconds"] * 1000)
    })])
    .range([padding, height - padding]);
};

let drawCanvas = () => {
  svg.attr("width", width);
  svg.attr("height", height);
};

let drawPoints = () => {
   svg
     .selectAll("circle")
     .data(values)
     .enter()
     .append("circle")
     .attr("class", "dot")
     .attr("r", "5")
     .attr("data-xvalue", (d) => {
       return d["Year"];
     })
     .attr("data-yvalue", (d) => {
       return new Date(d["Seconds"] * 1000);
     })
     .attr("cx", (d) => {
       return xScale(d["Year"]);
     })
     .attr("cy", (d) => {
       return yScale(new Date(d["Seconds"] * 1000));
     })
     .attr("fill", (d) => {
       if (d["Doping"] === "") {
         return "cyan";
       } else {
         return "red";
       }
     })
     .on("mouseover", (d) => {
        tooltip.style("visibility", "visible")
        console.log(d["toElement"].__data__['Doping']);
        if (d["toElement"].__data__["Doping"] != "") {
          tooltip.text(
            d["toElement"].__data__["Year"] +
              "-" +
              d["toElement"].__data__["Name"] +
              "-" +
              d["toElement"].__data__["Time"] +
              "-" +
              d["toElement"].__data__["Doping"]
          );
        } else {
          tooltip.text(
            d["toElement"].__data__["Year"] +
              "-" +
              d["toElement"].__data__["Name"] +
              "-" +
              d["toElement"].__data__["Time"] +
              "-" +
              'No Doping Allegations'
          );
        }
        tooltip.attr("data-year", d["toElement"].__data__["Year"]);
      })
      .on("mouseout", (d) => {
        tooltip.style("visibility", "hidden");
      }
      )
};

let drawAxes = () => {
  xAxis = d3.axisBottom(xScale)
  .tickFormat(d3.format('d'));
  yAxis = d3.axisLeft(yScale).tickFormat(d3.timeFormat('%M:%S'));

  svg.append("g")
    .call(xAxis)
    .attr("transform", "translate(0, " + (height - padding) + ")")
    .attr("id", "x-axis");

  svg.append("g")
    .call(yAxis)
    .attr("transform", "translate(" + padding + ", 0)")
    .attr("id", "y-axis");
};

req.open("GET", url, true);
req.onload = () => {
  values = JSON.parse(req.responseText);
  console.log(values['Year']);
  drawCanvas();
  generateScales();
  drawPoints();
  drawAxes();
};
req.send();
