function buildMetadata(sample) {

  // @TODO: Complete the following function that builds the metadata panel

  // Use `d3.json` to fetch the metadata for a sample
    var url = `/metadata/${sample}`;
    d3.json(url).then(function(data) {
    // Use d3 to select the panel with id of `#sample-metadata`
    var metadata = d3.select("#sample-metadata");
    // Use `.html("") to clear any existing metadata
     metadata.html("");
    // Use `Object.entries` to add each key and value pair to the panel
    // Hint: Inside the loop, you will need to use d3 to append new
    // tags for each key-value in the metadata.
    Object.entries(data).forEach(([key, value]) => {
      metadata.append("p").text(`${key}: ${value}`);
      });
    // BONUS: Build the Gauge Chart
    // buildGauge(data.WFREQ);
  });
};

function buildCharts(sample) {

  // @TODO: Use `d3.json` to fetch the sample data for the plots
d3.json(`/samples/${sample}`).then (function(data)  {
  // @TODO: Build a Bubble Chart using the sample data
      var x_value = data.otu_ids;
      var y_value = data.sample_values;
      var marker_size = data.sample_values;
      var marker_color = data.otu_ids;
      var text = data.otu_labels;

      var data = [
        {
  x: x_value,
  y: y_value,
  text: text,
  mode: 'markers',
  marker: {
    color: marker_color,
    size: marker_size
  }

}];

  Plotly.newPlot('bubble', data);


  // @TODO: Build a Pie Chart
  // HINT: You will need to use slice() to grab the top 10 sample_values,
  // otu_ids, and labels (10 each).
  d3.json(`/samples/${sample}`).then (function(data)  {
      var pie_value = data.sample_values.slice(0,10);
      var pie_lable = data.otu_ids.slice(0,10);
      var pie_hover = data.otu_labels.slice(0,10);

      var data = [{
            values : pie_value,
            labels: pie_lable,
            hovertext: pie_hover,
            type:'pie'
          }];
      Plotly.newPlot("pie", data);

});
});

};

function init() {
  // Grab a reference to the dropdown select element
  var selector = d3.select("#selDataset");

  // Use the list of sample names to populate the select options
  d3.json("/names").then((sampleNames) => {
    sampleNames.forEach((sample) => {
      selector
        .append("option")
        .text(sample)
        .property("value", sample);
    });

    // Use the first sample from the list to build the initial plots
    const firstSample = sampleNames[0];
    buildCharts(firstSample);
    buildMetadata(firstSample);
  });
}

function optionChanged(newSample) {
  // Fetch new data each time a new sample is selected
  buildCharts(newSample);
  buildMetadata(newSample);
}

// Initialize the dashboard
init();
