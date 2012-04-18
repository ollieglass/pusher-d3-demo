var next_value = 0;
var t = 1297110663; // start time (seconds since epoch)
var v = 70, // start value (tweets),
    data = [],
    data = d3.range(31).map(next), // starting dataset,
    pusher_key = 'c9f5043738b6f7e428fa'; // Replace with your app key

// ====================================
// pusher
// ====================================

var pusher = new Pusher(pusher_key); 
var channel = pusher.subscribe('my-channel');

channel.bind('my-event', function(update) {
    next_value+=parseInt(update.tweet_count, 10);
  
    data.shift();
    data.push(next());
    maxValue();
    redraw();
});

// ====================================
// d3 - static
// ====================================

var w = 20,
    h = 80;

var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, w]);

var max_value = 0;
var y = d3.scale.linear()
    .domain([0, max_value])
    .rangeRound([0, h]);

var chart = d3.select("div#chart").append("svg")
    .attr("class", "chart")
    .attr("width", w * data.length - 1)
    .attr("height", h);

chart.selectAll("rect")
    .data(data)
    .enter().append("rect")
    .attr("x", function(d, i) { return x(i) - .5; })
    .attr("y", function(d) { return h - y(d.value) - .5; })
    .attr("width", w)
    .attr("height", function(d) { return y(d.value); });

chart.append("line")
    .attr("x1", 0)
    .attr("x2", w * data.length)
    .attr("y1", h - .5)
    .attr("y2", h - .5)
    .style("stroke", "#000");

// ====================================
// d3 - animation
// ====================================

// returns next data object
function next() {
    var result = { time: ++t, value: next_value };
    d3.select('div.count p span.current').html(next_value);
    next_value = 0;
    return result;
}

function maxValue(){
  max_value = 0;
  for(var x = 0; x < data.length; x = x + 1){
    max_value = data[x].value > max_value ? data[x].value : max_value;
  }
  
  y = d3.scale.linear()
      .domain([0, max_value])
      .rangeRound([0, h]);
  
  d3.select('div.count p span.max').html(max_value);
}

function redraw() {
    var rect = chart.selectAll("rect")
        .data(data, function(d) { return d.time; });

    rect.enter().insert("rect", "line")
        .attr("x", function(d, i) { return x(i + 1) - .5; })
        .attr("y", function(d) { return h - y(d.value) - .5; })
        .attr("width", w)
        .attr("height", function(d) { return y(d.value); })
        .transition()
        .duration(1000)
        .attr("x", function(d, i) { return x(i) - .5; });

    rect.transition()
        .duration(1000)
        .attr("x", function(d, i) { return x(i) - .5; })
        .attr("y", function(d) { return h - y(d.value) - .5; })
        .attr("height", function(d) { return y(d.value); });

    rect.exit().transition()
        .duration(1000)
        .attr("x", function(d, i) { return x(i - 1) - .5; })
        .remove();
}