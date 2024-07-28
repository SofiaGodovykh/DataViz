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

/*
d3.csv("https://raw.githubusercontent.com/sofiagodovykh/DataViz/master/adult.csv").then(function (data) {
    var x = d3.scaleBand()
      .range([ 0, width ])
      .domain(data.map(function(d) { return d['sex']; }))
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
        .attr("x", function(d) { return x(d['sex']); })
        .attr("y", function(d) { return y(d.age); })
        .attr("width", x.bandwidth())
        .attr("height", function(d) { return height - y(d.age); })
        .attr("fill", "#69b3a2")
    
});
*/

/*
d3.csv("https://raw.githubusercontent.com/sofiagodovykh/DataViz/master/adult.csv").then(data => {
    // Aggregate the data
    const aggregatedData = {};
    data.forEach(d => {
        const key = `${d.Sex}_${d.Income}`;
        if (!aggregatedData[key]) {
            aggregatedData[key] = { Sex: d.Sex, Income: d.Income, count: 0 };
        }
        aggregatedData[key].count++;
    });

    // Convert aggregated data to array
    const flatData = Object.values(aggregatedData);

    // Set up scales
    const x0 = d3.scaleBand()
        .domain(flatData.map(d => d.Sex))
        .range([0, width])
        .paddingInner(0.1);

    const x1 = d3.scaleBand()
        .domain(['less than 50k', 'more than 50k'])
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(flatData, d => d.count)])
        .nice()
        .range([height, 0]);

    // Set up axes
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0));

    // Draw the bars
    svg.selectAll(".bars")
        .data(flatData)
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d.Sex)},0)`)
        .selectAll("rect")
        .data(d => [d])
        .enter()
        .append("rect")
        .attr("x", d => x1(d.Income))
        .attr("y", d => y(d.count))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("class", "bar")
        .attr("fill", d => d.Income === '>50K' ? 'steelblue' : 'orange');

    // Add labels
    svg.selectAll(".bar text")
        .data(flatData)
        .enter()
        .append("text")
        .attr("x", d => x0(d.Sex) + x1(d.Income) + x1.bandwidth() / 2)
        .attr("y", d => y(d.count) - 5)
        .text(d => d.count);
});
*/

d3.csv("https://raw.githubusercontent.com/sofiagodovykh/DataViz/master/adult.csv").then(data => {
    // Aggregate the data
    const aggregatedData = {};
    data.forEach(d => {
        const key = `${d.sex}_${d.income}`;
        if (!aggregatedData[key]) {
            aggregatedData[key] = { Sex: d.sex, Income: d.income, count: 0 };
        }
        aggregatedData[key].count++;
    });

    // Convert aggregated data to array
    const flatData = Object.values(aggregatedData);

    // Set up scales
    const x0 = d3.scaleBand()
        .domain(['Female', 'Male'])
        .range([0, width])
        .paddingInner(0.1);

    const x1 = d3.scaleBand()
        .domain(['<=50K', '>50K'])
        .range([0, x0.bandwidth()])
        .padding(0.05);

    const y = d3.scaleLinear()
        .domain([0, d3.max(flatData, d => d.count)])
        .nice()
        .range([height, 0]);

    // Set up axes
    svg.append("g")
        .call(d3.axisLeft(y));

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0));

    // Draw the bars
    svg.selectAll(".bar-group")
        .data(['Female', 'Male'])
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d)},0)`)
        .selectAll("rect")
        .data(gender => flatData.filter(d => d.Sex === gender))
        .enter()
        .append("rect")
        .attr("x", d => x1(d.Income))
        .attr("y", d => y(d.count))
        .attr("width", x1.bandwidth())
        .attr("height", d => height - y(d.count))
        .attr("class", "bar")
        .attr("fill", d => d.Income === '>50K' ? 'steelblue' : 'orange');

    // Add labels
    svg.selectAll(".bar-group")
        .data(['Female', 'Male'])
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d)},0)`)
        .selectAll(".bar text")
        .data(gender => flatData.filter(d => d.Sex === gender))
        .enter()
        .append("text")
        .attr("x", d => x1(d.Income) + x1.bandwidth() / 2)
        .attr("y", d => y(d.count) - 5)
        .text(d => d.count)
        .attr("text-anchor", "middle")
        .attr("fill", "black");

    // Add legend
    const legendData = [
        {label: "<=50K", color: "orange"},
        {label: ">50K", color: "steelblue"}
    ];

    const legend = svg.selectAll(".legend")
        .data(legendData)
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", (d, i) => `translate(0,${i * 20})`);

    legend.append("rect")
        .attr("x", width - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", d => d.color);

    legend.append("text")
        .attr("x", width - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(d => d.label);
});

