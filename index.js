/*
var margin = {top: 10, right: 30, bottom: 30, left: 40},
    width = 460 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;
*/

const margin = {top: 20, right: 30, bottom: 60, left: 40},
  width = 800 - margin.left - margin.right,
  height = 500 - margin.top - margin.bottom,
  pieWidth = 400,
  pieHeight = 400; // Height for the pie chart SVG

var svg;
function create_svg() {
    svg = d3.select("#container")
        .append("svg")
          .attr("width", width + margin.left + margin.right)
          .attr("height", height + margin.top + margin.bottom + 400)
        .append("g")
          .attr("transform",
                "translate(" + margin.left + "," + margin.top + ")");
}

create_svg();

let clickCount = 0;

var button = document.querySelector("button")

button.addEventListener("click", event => {
    clickCount++;
    if (clickCount === 1) {
        //console.log('First click event triggered!')
        document.querySelector('#container').innerHTML = '';
        create_svg();
        original_data.then(handler)
        select.style.display = "block"
    };
    if (clickCount > 1) {
        //console.log('Second click event triggered!')
        document.querySelector('#container').innerHTML = '';
        create_svg();
        original_data.then(handler)
        select.style.display = "block"
    };
})

var tooltip = d3.select("body")
  .append("div")
  .style("position", "absolute")
  .style("z-index", "10")
  .style("visibility", "hidden")
  .style("background", "white")
  .text("a simple tooltip");

var ed_level;
const select = document.querySelector("select");
var filter_ed = (data, level) => {
    if (clickCount <= 1){
        return data.filter(row => row.education === level)
    }
    return data.filter(row => row.occupation === level)
    
}
select.addEventListener("change", event => {
    ed_level = event.target.value;
    original_data.then(_data => {
        const filtered_data = filter_ed(_data, ed_level);
        document.querySelector('#container').innerHTML = '';
        create_svg();
        handler(filtered_data);
    })
})

var original_data = d3.csv("https://raw.githubusercontent.com/sofiagodovykh/DataViz/master/adult.csv");
original_data.then(handler);
function handler(data) {
    select.innerHTML = "";
    var education_level = ""
    if (clickCount <= 1) {
        education_level = new Set(data.map(row => row.education))
    }
    
    if (clickCount > 1) {
        education_level = new Set(data.map(row => row.occupation))
    }

    education_level.forEach(level => {
        const option = document.createElement("option");
        option.setAttribute("value", level);
        option.innerText = level;
        select.appendChild(option);
    })
    var plot_text = ""
    if (clickCount == 0){
        plot_text = "Total population"
    }
    if (clickCount == 1){
        plot_text = "Income by education level"
    }
    if (clickCount >= 2){
        plot_text = "Income by occupation"
    }
    svg.append("text")
        .attr("x", (width / 2))             
        .attr("y", 0 - (margin.top / 2) + 10)
        .attr("text-anchor", "middle")  
        .style("font-size", "26px") 
        .style("font-weight", "bold")  
        .text(plot_text);
    
    // Aggregate the data for the bar chart
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

    // Set up scales for the bar chart
    const x0 = d3.scaleBand()
        .domain(['Women', 'Men'])
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

    // Set up axes for the bar chart
    svg.append("g")
        .call(d3.axisLeft(y));
    
    svg.append("text")
//      .attr("class", "y label")
      .attr("text-anchor", "end")
      .attr("y", 6)
      .attr("dy", ".75em")
      .style("transform", "translateX(150px)")
      //.attr("")
      .style("font-size", "16")
      .text("total number of people");
      //.style("font-weight", "bold");

    svg.append("g")
        .attr("transform", `translate(0,${height})`)
        .call(d3.axisBottom(x0));

    // Draw the bars
    svg.selectAll(".bar-group")
        .data(['Women', 'Men'])
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
        .attr("fill", d => d.Income === '>50K' ? 'steelblue' : 'orange')
        .on("mouseover", function(event, d) {
            /*const [x, y] = d3.pointer(event);
            console.log(x, y)
            const originalColor = d3.select(this).attr("fill");
            const lighterColor = d3.color(originalColor).brighter(0.5);
            d3.select(this)
                .attr("fill", lighterColor);
            svg.append("text")
                .attr("id", "tooltip")
                .attr("x", event.pageX - 25)
                .attr("y", y - 5)
                .text(d.count)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .style("font-size", "24px"); */
            tooltip.text(d.count)
            tooltip.style("visibility", "visible")
        })
        .on("mousemove", function (event, d){
          const [x, y] = d3.pointer(event);
          const originalColor = d3.select(this).attr("fill");
          const lighterColor = d3.color(originalColor).brighter(0.5);
          tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px");
  
        })
        .on("mouseout", function(event, d) {
            tooltip.style("visibility", "hidden")
            d3.select(this)
                .attr("fill", d => d.Income === '>50K' ? 'steelblue' : 'orange'); 
            d3.select("#tooltip").remove(); // Remove the tooltip
        });


    // Add labels to the bars
    svg.selectAll(".bar-group")
        .data(['Women', 'Men'])
        .enter()
        .append("g")
        .attr("transform", d => `translate(${x0(d)},0)`)
        .selectAll(".bar text")
        .data(gender => flatData.filter(d => d.Sex === gender))
        .enter()
        .append("text")
        .attr("x", d => x1(d.Income) + x1.bandwidth() / 2)
        .attr("y", d => y(d.count) - 5)
        //.text(d => d.count)
        .attr("text-anchor", "middle")
        .attr("fill", "black");

    // Add legend for the bar chart
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

    // Prepare data for the pie chart
    const pieDataFemale = d3.rollup(flatData.filter(d => d.Sex === 'Women'), v => d3.sum(v, d => d.count), d => d.Income);
    const pieDataMale = d3.rollup(flatData.filter(d => d.Sex === 'Men'), v => d3.sum(v, d => d.count), d => d.Income);
    const pieDataArrayFemale = Array.from(pieDataFemale, ([key, value]) => ({ key, value }));
    const pieDataArrayMale = Array.from(pieDataMale, ([key, value]) => ({ key, value }));

    // Set up the pie chart
    const pie = d3.pie()
        .value(d => d.value)
        .sort(null);

    const arc = d3.arc()
        .innerRadius(0)
        .outerRadius(Math.min(pieWidth, pieHeight) / 4);

    // Append the pie charts to the existing SVG
    const pieGroupFemale = svg.append("g")
        .attr("transform", `translate(${margin.left + pieWidth / 4},${height + pieHeight / 2})`);

    const pieGroupMale = svg.append("g")
        .attr("transform", `translate(${margin.left + pieWidth + pieWidth / 4},${height + pieHeight / 2})`);

    // Draw the pie chart for females
    pieGroupFemale.selectAll('path')
        .data(pie(pieDataArrayFemale))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.key === '>50K' ? 'steelblue' : 'orange')
        .attr('stroke', 'white')
        .attr('stroke-width', '2px')
        .on("mouseover", function(event, d) {
          d3.select(this)
              .transition()
              .duration(200)
              .attr("d", d3.arc()
                  .outerRadius(Math.min(pieWidth, pieHeight) / 4 + 5) // Slightly increase the radius on hover
                  .innerRadius(0)
              );
          
          const [mouseX, mouseY] = d3.pointer(event);
          const originalColor = d3.select(this).attr("fill");
          const lighterColor = d3.color(originalColor).brighter(0.5);
          
          tooltip.text(`${d.data.value}`)
          tooltip.style("visibility", "visible")
          //console.log(d)
          d3.select(this).attr("fill", lighterColor);
        })
        .on("mousemove", function (event, d){
          const [x, y] = d3.pointer(event);
          //console.log(x, y)
          const originalColor = d3.select(this).attr("fill");
          const lighterColor = d3.color(originalColor).brighter(0.5);
          tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")})
          
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", arc)
                .attr('fill', d => d.data.key === '>50K' ? 'steelblue' : 'orange')// Revert to original size
            tooltip.style("visibility", "hidden")
            d3.select("#tooltip-pie").remove(); // Remove the tooltip
        });

    // Add labels to the pie chart for females
    pieGroupFemale.selectAll('text')
        .data(pie(pieDataArrayFemale))
        .enter()
        .append('text')
        .text(d => `${d.data.key}`)
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black');
    
    // Draw the pie chart for males
    pieGroupMale.selectAll('path')
        .data(pie(pieDataArrayMale))
        .enter()
        .append('path')
        .attr('d', arc)
        .attr('fill', d => d.data.key === '>50K' ? 'steelblue' : 'orange')
        .attr('stroke', 'white')
        .attr('stroke-width', '2px')
        .on("mouseover", function(event, d) {
          d3.select(this)
              .transition()
              .duration(200)
              .attr("d", d3.arc()
                  .outerRadius(Math.min(pieWidth, pieHeight) / 4 + 5) // Slightly increase the radius on hover
                  .innerRadius(0)
              );
          
          const [mouseX, mouseY] = d3.pointer(event);
          const originalColor = d3.select(this).attr("fill");
          const lighterColor = d3.color(originalColor).brighter(0.5);
          tooltip.text(`${d.data.value}`)
          tooltip.style("visibility", "visible")

          d3.select(this).attr("fill", lighterColor);

            /*svg.append("text")
                .attr("id", "tooltip-pie")
                .attr("x", mouseX)
                .attr("y", mouseY - 15)
                .text(`Count: ${d.data.count}`)
                .attr("text-anchor", "middle")
                .attr("fill", "black")
                .style("font-size", "12px")
                .style("font-weight", "bold");*/
        })
        .on("mousemove", function (event, d){
            const [x, y] = d3.pointer(event);
            //console.log(x, y)
            const originalColor = d3.select(this).attr("fill");
            const lighterColor = d3.color(originalColor).brighter(0.5);
            tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")})
        .on("mouseout", function(d) {
            d3.select(this)
                .transition()
                .duration(200)
                .attr("d", arc)
                .attr('fill', d => d.data.key === '>50K' ? 'steelblue' : 'orange')// Revert to original size
            tooltip.style("visibility", "hidden")
            d3.select("#tooltip-pie").remove(); // Remove the tooltip
        });

    // Add labels to the pie chart for males
    pieGroupMale.selectAll('text')
        .data(pie(pieDataArrayMale))
        .enter()
        .append('text')
        .text(d => `${d.data.key}`)
        //.text(d => `${d.data.key}: ${d.data.value}`)
        .attr('transform', d => `translate(${arc.centroid(d)})`)
        .attr('text-anchor', 'middle')
        .attr('fill', 'black');

    // Add titles to the pie charts
    pieGroupFemale.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -pieHeight/4 - 10)
        .text("Women");

    pieGroupMale.append("text")
        .attr("text-anchor", "middle")
        .attr("y", -pieHeight / 4 - 10)
        .text("Men");
}