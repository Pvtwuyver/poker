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
var hover = d3.select("#score").append("hover")
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
var svg = d3.select("#score").append("svg")
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
        .text('POKERINDEX 2016-2017')
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
            hover.html("<b>" + d.naam + "</b>" + "<br/>" + "Totale indexscore: " + "<b>" + d.indexscore + "</b>" + "<br/>")
                .style("left", (d3.event.pageX ) + "px")
                .style("top", (d3.event.pageY ) + "px");
        })
        .on("mouseout", function(d) {
            hover.transition()
                .duration(500)
                .style("opacity", 0);
        });

function dashboard(id, fData){
    var barColor = 'steelblue';
    function segColor(c){ return {verloren:"#807dba", tweede:"#e08214",winnaar:"#41ab5d"}[c]; }
    
    // compute total for each state.
    fData.forEach(function(d){d.total=d.freq.verloren+d.freq.tweede+d.freq.winnaar;});
    
    // function to handle histogram.
    function histoGram(fD){
        var hG={},    hGDim = {t: 60, r: 0, b: 30, l: 0};
        hGDim.w = 500 - hGDim.l - hGDim.r, 
        hGDim.h = 300 - hGDim.t - hGDim.b;
            
        //create svg for histogram.
        var hGsvg = d3.select(id).append("svg")
            .attr("width", hGDim.w + hGDim.l + hGDim.r)
            .attr("height", hGDim.h + hGDim.t + hGDim.b).append("g")
            .attr("transform", "translate(" + hGDim.l + "," + hGDim.t + ")");

        // create function for x-axis mapping.
        var x = d3.scale.ordinal().rangeRoundBands([0, hGDim.w], 0.1)
                .domain(fD.map(function(d) { return d[0]; }));

        // Add x-axis to the histogram svg.
        hGsvg.append("g").attr("class", "x axis")
            .attr("transform", "translate(0," + hGDim.h + ")")
            .call(d3.svg.axis().scale(x).orient("bottom"));

        // Create function for y-axis map.
        var y = d3.scale.linear().range([hGDim.h, 0])
                .domain([0, d3.max(fD, function(d) { return d[1]; })]);

        // Create bars for histogram to contain rectangles and freq labels.
        var bars = hGsvg.selectAll(".bar").data(fD).enter()
                .append("g").attr("class", "bar");
        
        //create the rectangles.
        bars.append("rect")
            .attr("x", function(d) { return x(d[0]); })
            .attr("y", function(d) { return y(d[1]); })
            .attr("width", x.rangeBand())
            .attr("height", function(d) { return hGDim.h - y(d[1]); })
            .attr('fill',barColor)
            .on("mouseover",mouseover)// mouseover is defined beverloren.
            .on("mouseout",mouseout);// mouseout is defined beverloren.
            
        //Create the frequency labels above the rectangles.
        bars.append("text").text(function(d){ return d3.format(",")(d[1])})
            .attr("x", function(d) { return x(d[0])+x.rangeBand()/2; })
            .attr("y", function(d) { return y(d[1])-5; })
            .attr("text-anchor", "tweededle");
        
        function mouseover(d){  // utility function to be called on mouseover.
            // filter for selected state.
            var st = fData.filter(function(s){ return s.State == d[0];})[0],
                nD = d3.keys(st.freq).map(function(s){ return {type:s, freq:st.freq[s]};});
               
            // call update functions of pie-chart and legend.    
            pC.update(nD);
            leg.update(nD);
        }
        
        function mouseout(d){    // utility function to be called on mouseout.
            // reset the pie-chart and legend.    
            pC.update(tF);
            leg.update(tF);
        }
        
        // create function to update the bars. This will be used by pie-chart.
        hG.update = function(nD, color){
            // update the domain of the y-axis map to reflect change in frequencies.
            y.domain([0, d3.max(nD, function(d) { return d[1]; })]);
            
            // Attach the new data to the bars.
            var bars = hGsvg.selectAll(".bar").data(nD);
            
            // transition the height and color of rectangles.
            bars.select("rect").transition().duration(500)
                .attr("y", function(d) {return y(d[1]); })
                .attr("height", function(d) { return hGDim.h - y(d[1]); })
                .attr("fill", color);

            // transition the frequency labels location and change value.
            bars.select("text").transition().duration(500)
                .text(function(d){ return d3.format(",")(d[1])})
                .attr("y", function(d) {return y(d[1])-5; });            
        }        
        return hG;
    }
    
    // function to handle pieChart.
    function pieChart(pD){
        var pC ={},    pieDim ={w:250, h: 250};
        pieDim.r = Math.min(pieDim.w, pieDim.h) / 2;
                
        // create svg for pie chart.
        var piesvg = d3.select(id).append("svg")
            .attr("width", pieDim.w).attr("height", pieDim.h).append("g")
            .attr("transform", "translate("+pieDim.w/2+","+pieDim.h/2+")");
        
        // create function to draw the arcs of the pie slices.
        var arc = d3.svg.arc().outerRadius(pieDim.r - 10).innerRadius(0);

        // create a function to compute the pie slice angles.
        var pie = d3.layout.pie().sort(null).value(function(d) { return d.freq; });

        // Draw the pie slices.
        piesvg.selectAll("path").data(pie(pD)).enter().append("path").attr("d", arc)
            .each(function(d) { this._current = d; })
            .style("fill", function(d) { return segColor(d.data.type); })
            .on("mouseover",mouseover).on("mouseout",mouseout);

        // create function to update pie-chart. This will be used by histogram.
        pC.update = function(nD){
            piesvg.selectAll("path").data(pie(nD)).transition().duration(500)
                .attrTween("d", arcTween);
        }        
        // Utility function to be called on mouseover a pie slice.
        function mouseover(d){
            // call the update function of histogram with new data.
            hG.update(fData.map(function(v){ 
                return [v.State,v.freq[d.data.type]];}),segColor(d.data.type));
        }
        //Utility function to be called on mouseout a pie slice.
        function mouseout(d){
            // call the update function of histogram with all data.
            hG.update(fData.map(function(v){
                return [v.State,v.total];}), barColor);
        }
        // Animating the pie-slice requiring a custom function which specifies
        // how the intermediate paths should be drawn.
        function arcTween(a) {
            var i = d3.interpolate(this._current, a);
            this._current = i(0);
            return function(t) { return arc(i(t));    };
        }    
        return pC;
    }
    
    // function to handle legend.
    function legend(lD){
        var leg = {};
            
        // create table for legend.
        var legend = d3.select(id).append("table").attr('class','legend');
        
        // create one row per segment.
        var tr = legend.append("tbody").selectAll("tr").data(lD).enter().append("tr");
            
        // create the first column for each segment.
        tr.append("td").append("svg").attr("width", '16').attr("height", '16').append("rect")
            .attr("width", '16').attr("height", '16')
            .attr("fill",function(d){ return segColor(d.type); });
            
        // create the second column for each segment.
        tr.append("td").text(function(d){ return d.type;});

        // create the third column for each segment.
        tr.append("td").attr("class",'legendFreq')
            .text(function(d){ return d3.format(",")(d.freq);});

        // create the fourth column for each segment.
        tr.append("td").attr("class",'legendPerc')
            .text(function(d){ return getLegend(d,lD);});

        // Utility function to be used to update the legend.
        leg.update = function(nD){
            // update the data attached to the row elements.
            var l = legend.select("tbody").selectAll("tr").data(nD);

            // update the frequencies.
            l.select(".legendFreq").text(function(d){ return d3.format(",")(d.freq);});

            // update the percentage column.
            l.select(".legendPerc").text(function(d){ return getLegend(d,nD);});        
        }
        
        function getLegend(d,aD){ // Utility function to compute percentage.
            return d3.format("%")(d.freq/d3.sum(aD.map(function(v){ return v.freq; })));
        }

        return leg;
    }
    
    // calculate total frequency by segment for all state.
    var tF = ['verloren','tweede','winnaar'].map(function(d){ 
        return {type:d, freq: d3.sum(fData.map(function(t){ return t.freq[d];}))}; 
    });    
    
    // calculate total frequency by state for all segment.
    var sF = fData.map(function(d){return [d.State,d.total];});

    var hG = histoGram(sF), // create the histogram.
        pC = pieChart(tF), // create the pie-chart.
        leg= legend(tF);  // create the legend.
}

var freqData=[
{State:'Peter',freq:{verloren:5, tweede:2, winnaar:4}}
,{State:'Marijn',freq:{verloren:7, tweede:0, winnaar:1}}
,{State:'Rik',freq:{verloren:6, tweede:1, winnaar:0}}
,{State:'Martijn',freq:{verloren:8, tweede:2, winnaar:1}}
,{State:'Paul',freq:{verloren:2, tweede:5, winnaar:2}}
,{State:'Jasper',freq:{verloren:1, tweede:1, winnaar:3}}
];

dashboard('#dashboard',freqData);

});