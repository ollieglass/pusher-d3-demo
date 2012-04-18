var next_value = 0,
  t = 1297110663, // start time (seconds since epoch)
  v = 70, // start value (tweets),
  data = [],
  data = d3.range(31).map(function(){ return { time: t, value: 0 }; }), // starting dataset,
  pusher_key = 'f528ced7bacc3e5920f3', // Replace with your app key
  currentMaxValue = 0,
  allTimeMaxValue = 0,

// ====================================
// pusher
// ====================================

  pusher = new Pusher(pusher_key),
  channel = pusher.subscribe('my-channel');

channel.bind('my-event', function(update) {
  data.shift();
  data.push(updateNextValue(update.count));
  updateMaxValue(update.count);
  redraw();
});

// ====================================
// general - called when we recieve data from pusher
// ====================================

function updateNextValue(value) {
    var result = { time: ++t, value: value };
    d3.select('div.count p span.current').html(value);
    return result;
}

function updateMaxValue(value){
  currentMaxValue = 0;
  for(var x = 0; x < data.length; x = x + 1){
    currentMaxValue = data[x].value > currentMaxValue ? data[x].value : currentMaxValue;
  }
  
  allTimeMaxValue = currentMaxValue > allTimeMaxValue ? currentMaxValue : allTimeMaxValue;
  
  // update the scale of the chart according to our current max value
  y = d3.scale.linear()
      .domain([0, currentMaxValue])
      .rangeRound([0, h]);
  
  d3.select('div.count p span.max').html(allTimeMaxValue);
}


// ====================================
// d3 - static
// ====================================

var w = 20,
    h = 160;

var x = d3.scale.linear()
    .domain([0, 1])
    .range([0, w]);

var y = d3.scale.linear()
    .domain([0, currentMaxValue])
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
// d3 - update the chart
// ====================================

function redraw() {
    var rect = chart.selectAll("rect")
        .data(data, function(d) { return d.time; });

    rect.enter().insert("rect", "line")
        .attr("x", function(d, i) { return x(i + 1) - .5; })
        .attr("y", function(d) { return h - y(d.value) - .5; })
        .attr("width", w)
        .attr("height", function(d) { return y(d.value); })
        .transition()
        .duration(800)
        .attr("x", function(d, i) { return x(i) - .5; });

    rect.transition()
        .duration(800)
        .attr("x", function(d, i) { return x(i) - .5; })
        .attr("y", function(d) { return h - y(d.value) - .5; })
        .attr("height", function(d) { return y(d.value); });

    rect.exit().transition()
        .duration(800)
        .attr("x", function(d, i) { return x(i - 1) - .5; })
        .remove();
}