// initialize dashboard
function initialize()
{
    // access dropdown selector
    let dropdown = d3.select("#selDataset");

    // use D3.json() to access jsonified data
    d3.json("static/js/samples.json").then(function(data) {
        //check if data was accessed
        // console.log(data);
        let names = data.names; // array of names

        names.forEach((sample) => {
            dropdown.append("option").text(sample)
            .property("value", sample)
        });

        let sample1 = names[0];
        demoInfo(sample1) // function that pulls metadata
        buildBar(sample1) // function that builds bar chart
        buildBubble(sample1) // function that builds bubble chart
        buildGauge(sample1) // function that build gauge chart

    });
}

// pull metadata
function demoInfo(sample)
{
    d3.json("static/js/samples.json").then((data) => {
        let metaData = data.metadata; // pull metadata

        // filter based on value of sample
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
        
        // access indexes from array to pull data
        let resultData = result[0]

        // clear the metadata so it doesn't just keep appending
        d3.select("#sample-metadata").html(""); 
        
        // get value key pairs
        Object.entries(resultData).forEach(([key, value]) => {
            d3.select("#sample-metadata").append("h5").text(`${key}: ${value} `)
        })
    })
}

// build bar chart
function buildBar(sample)
{
    d3.json("static/js/samples.json").then((data) => {
        let sampleData = data.samples; // pull sample data

        // filter based on value of sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        
        // access indexes from array to pull data
        let resultData = result[0]
        

        // OTU ids, labels, and sample values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;
        
        // build trace & get only top 10 values
        let y = otu_ids.slice(0,10).map(id => `OTU ${id}`).reverse();
        let x = sample_values.slice(0, 10).reverse()
        let labels = otu_labels.slice(0, 10).reverse()

        let barChart = {
            x: x,
            y: y,
            text: labels,
            type: "bar",
            orientation: "h"
        };

        let layout = {
            title: "Top 10 Belly Button Bacteria"
        };

        // draw the chart
        Plotly.newPlot("bar", [barChart], layout);

        }
    )
}

// build bubble chart
function buildBubble(sample)
{
    d3.json("static/js/samples.json").then((data) => {
        let sampleData = data.samples; // pull sample data

        // filter based on value of sample
        let result = sampleData.filter(sampleResult => sampleResult.id == sample);
        
        // access indexes from array to pull data
        let resultData = result[0]

        // OTU ids, labels, and sample values
        let otu_ids = resultData.otu_ids;
        let otu_labels = resultData.otu_labels;
        let sample_values = resultData.sample_values;

        let bubbleChart = {
            x: otu_ids,
            y: sample_values,
            text: otu_labels,
            mode: "markers",
            marker: {
                size: sample_values,
                color: otu_ids,
                colorscale: "Earth"
            }
        };

        let layout = {
            title: "Bacteria Cultures Per Sample",
            hovermode: "closest",
            xaxis: {title: "OTU ID"}
        };

        // draw the chart
        Plotly.newPlot("bubble", [bubbleChart], layout);

    })
}

//build gauge 
function buildGauge(sample)
{
    d3.json("static/js/samples.json").then((data) => {

        let metaData = data.metadata; // pull meta data

        // filter based on value of sample
        let result = metaData.filter(sampleResult => sampleResult.id == sample);
                
        // access indexes from array to pull wash frequency
        let washFrequency = result[0]['wfreq']
        console.log(washFrequency)
        
        let gaugeChart = [
            {
                value: washFrequency,
                type:"indicator",
                mode: "gauge+number",
                title: {text: "Belly Button Washing Frequency"},
                gauge: {
                    axis: { range: [0,9], visible: false},
                    steps:[
                        {range: [0,1], color: "#ffffe5"},
                        {range: [1,2], color: "#f7fcb9"},
                        {range: [2,3], color: "#d9f0a3"},
                        {range: [3,4], color: "#addd8e"},
                        {range: [4,5], color: "#78c679"},
                        {range: [5,6], color: "#41ab5d"},
                        {range: [6,7], color: "#238443"},
                        {range: [7,8], color: "#006837"},
                        {range: [8,9], color: "#004529"}

                    ]
                }
            }
        ];

        let layout = { width: 600, height: 500, margin: { t: 0, b: 0 } }
    
        // draw the chart
        Plotly.newPlot("gauge", gaugeChart, layout);

    })
}

// update dashboard
function optionChanged(item)
{
    demoInfo(item); 
    buildBar(item);
    buildBubble(item);
    buildGauge(item);
}

// call the function initialize
initialize()

