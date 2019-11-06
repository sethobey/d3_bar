const margin = {top: 20, right: 20, bottom: 40, left: 40},
    width = 900 - margin.left - margin.right,
    height = 500 - margin.top - margin.bottom;
const color1 = '#4608ff';
const color2 = '#ad91ff';
const colors = chroma.scale([color1, color2]).mode('hsl');
const colorScale = d3.scaleLinear()

const formatPercent = d3.format(".0%");
const x = d3.scaleBand()
    .rangeRound([0, width], .1);
const y = d3.scaleLinear()
    .range([height, 0]);
const xAxis = d3.axisBottom()
    .scale(x)
const yAxis = d3.axisLeft()
    .scale(y)
    .tickFormat(formatPercent);

const svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

svg.append("g")
    .attr("class", "x axis")
    .attr("transform", "translate(0," + height + ")")
    .call(xAxis);

svg.append("g")
    .attr("class", "y axis")
    .call(yAxis);

function update(url) {
    d3.tsv(url).then(function(data){
        x.domain(data.map(function(d) { return d.letter; }));
        y.domain([0, d3.max(data, function(d) { return d.frequency; })]);

        const colorDomain = d3.extent(data, d => d.frequency);
        colorScale.domain(colorDomain);
        svg.select(".x")
            .transition()
                .call(xAxis);

        svg.select(".y")
            .transition()
                .call(yAxis);
        svg.selectAll("rect")
                .remove();

        var bars = svg.selectAll(".bar")
            .data(data)
        bars.enter().append("rect")
            .attr("class", "bar")
            .attr("x", function(d) { return x(d.letter); })
            .attr("width", x.bandwidth())
            .attr("y", height)
            .attr("height", 0)
            .attr("fill", function(d) { return colors(colorScale(d.frequency)); })
            .transition()
            .attr("height", function(d) { return height - y(d.frequency); })
            .attr("y", function(d) { return y(d.frequency); })
            .delay(250)
            .duration(500)
            .ease(d3.easeExpOut);
    });
};

update("english.tsv");

d3.select("#english").on("click", function(){
    update("english.tsv")
});
d3.select("#spanish").on("click", function(){
    update("spanish.tsv")
});
