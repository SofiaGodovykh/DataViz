var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

const svg = d3.select("#container")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
      .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

const textBlock = svg.append("text")
  .attr("x", 50)
  .attr("y", 100)
  .attr("class", "text-block");



svg.append("text")
  .attr("x", 300) // X position
  .attr("y", 40)  // Y position
  .attr("text-anchor", "middle") // Center the text
  .attr("class", "title")
  .text("Gender pay gap problem");

const lines = [
            "It is widely known that the gender pay gap persists, reflecting the difference",
            "in earnings between men and women. However, this disparity is narrower when comparing",
            "men and women with similar education levels and work experience.",
            "Factors like occupation type, industry, and work hours also contribute to the gap.",
            "We will explore how these factors influence men and women earnings."
        ];

textBlock.selectAll("tspan")
  .data(lines)
  .enter()
  .append("tspan")
  .attr("x", textBlock.attr("x"))
  .attr("dy", (d, i) => i * 20) // Line spacing
  .text(d => d);

d3.csv("https://raw.githubusercontent.com/sofiagodovykh/DataViz/master/adult.csv").then(function (data) {
    // X axis

    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(function(d) { return d['native.country']; }))
      .padding(0.2);
    svg.append("g")
      .attr("transform", "translate(0," + height + ")")
      .call(d3.axisBottom(x))
      .selectAll("text")
        .attr("transform", "translate(-10,0)rotate(-45)")
        .style("text-anchor", "end");
    
    // Add Y axis
    var y = d3.scaleLinear()
      .domain([0, 100])
      .range([ height, 0]);
    svg.append("g")
      .call(d3.axisLeft(y));
    
    // Bars
    svg.selectAll("mybar")
      .data(data)
      .enter()
      .append("rect")
        .attr("x", function(d) { return x(d['native.country']); })
        .attr("y", function(d) { return y(d.age); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.age); })
        .attr("fill", "#69b3a2")
    
    
})