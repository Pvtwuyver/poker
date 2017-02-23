var d = new Date();
document.getElementById("demo").innerHTML = d.toDateString();

var margin = {
        top: 20,
        right: 20,
        bottom: 200,
        left: 100
    },
    width = 1000 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom;

// set the ranges, small gap between the bars (0.05)
var x = d3.scale.ordinal().rangeRoundBands([0, width], .05);
var y = d3.scale.linear().range([height, 0]);

// create the tooltip for hover effect (based on W3schools.com)
var hover = d3.select("body").append("hover")
    .attr("class", "tooltip")
    .style("opacity", 0);

// create x axis at bottom
var xAxis = d3.svg.axis()
    .scale(x)
    .orient("bottom")

// create y axis on left side
var yAxis = d3.svg.axis()
    .scale(y)
    .orient("left")
    .ticks(20);

// svg element in body
var svg = d3.select("body").append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

// load the data
d3.json("pokerstand.json", function(error, data) {
    data.forEach(function(d) {
        
        // change strings into real numbers
        d.indexscore = +d.indexscore;
        d.persoonlijk = +d.persoonlijk;
        d.absoluut = +d.absoluut;
        d.gewonnen = +d.gewonnen;
        d.gespeeld = +d.gespeeld;
    });

    // scale the range of the data
    x.domain(data.map(function(d) {
        return d.naam;
    }));
    // scale y axis .5 extra for lay-out purpose
    y.domain([0, 0.5 + d3.max(data, function(d) {
        return d.indexscore;
    })]);

    // chart title
    svg.append('text')
        .attr("class", "title")
        .text('beweeg muis over bar voor extra info')
        .attr('x', 200)
        .attr('y', 0)
        .attr('fill', 'black')
    // x axis title
    svg.append('text')
        .attr("class", "axis")
        .text('spelers')
        .attr('x', 850)
        .attr('y', 400)
        .attr('fill', 'black')
    // append the two axis
    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis)
        .selectAll("text")
        .style("text-anchor", "midle")
        .attr("dx", "-.8em")
        .attr("dy", ".9em")
        // rotate text for readability
        .attr("transform", "rotate(0)");
    svg.append("g")
        .attr("class", "y axis")
        .call(yAxis)
        .append("text")
        .attr("transform", "rotate(-0)")
        .attr("y", -10)
        .attr("dy", ".71em")
        .style("text-anchor", "end")
        .text("index");

    // create barchart based on Total responsetime
    svg.selectAll("bar")
        .data(data)
        .enter().append("rect")
        .attr("class", "bar")
        .attr("x", function(d) {
            return x(d.naam)
        })
        .attr("width", x.rangeBand())
        .attr("y", function(d) {
            return y(d.indexscore)
        })
        .attr("height", function(d) {
            return height - y(d.indexscore)
        })
        // hover function with additiona information window
        // based on code from W3schools.com
        .on("mouseover", function(d) {
            hover.transition()
                .duration(200)
                .style("opacity", .9);
            hover.html("<b>" + d.naam + "</b>" + "<br/>" + "Totale indexscore: " + d.indexscore + "<br/>" + "Aantal gewonnen: " + d.gewonnen  + "<br/>" + "Aantal gespeeld: " + d.gespeeld  + "<br/>" +
                    "Persoonlijke score: " + d.persoonlijk +" %" + "<br/>" + "Totale score: " + d.absoluut +" %" )
                .style("left", (d3.event.pageX) + "px")
                .style("top", (d3.event.pageY - 128) + "px");
        })
        .on("mouseout", function(d) {
            hover.transition()
                .duration(500)
                .style("opacity", 0);
        });

});