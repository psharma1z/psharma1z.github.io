var WIDTH = 1000, HEIGHT = 600;

var filterValueOfCountry;
var filterData;
var filterDataCountry="";

function renderSuicideCountByYearsLineChart(svgId) {
    var svg = d3.select(svgId)
                    .append("svg")
                    .attr("width", WIDTH)
                    .attr("height", HEIGHT);
    const margin = {
            top: 120,
            right: 20,
            bottom: 130,
            left: 50
            };

    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var duration=1000;

    const data =  d3.csv('data/who_suicide_statistics.csv').then(function(data) {

     data = d3.nest()
      .key(function (d){return d.year;})
      .sortKeys(d3.ascending)
      .rollup(function (v) {
        var sum=0;
        for (let i=0; i<v.length;i++){
         if(v[i].suicides_no && !(v[i].suicides_no===''))
          sum+=parseInt(v[i].suicides_no)
        }
        return sum;
       })
      .entries(data);


             // The number of datapoints
            var n = data.length;

            var x = d3.scaleBand()
                .range([0, width]);

            var y = d3.scaleLinear()
                .range([height, 0]);

            x.domain(data.map(function (d) {
                return parseInt(d.key);
                }));
                //tochange 50000
            y.domain([0, 300000]);
//
            console.log("I am here")
            var line = d3.line()
                .x(function(d, i) {
                console.log(d)
                    return x(parseInt(d.key));
                })
                .y(function(d) {
                    return y(d.value);
                })
                .curve(d3.curveMonotoneX)

            // Create Tooltips
            var tip = d3.tip().attr('class', 'd3-tip')
            .html(function(d) {
                var content = "<span style='margin-left: 2.5px;'><h8>No.Of Suicides: <b style='color:lightblue'>" + d.value + "</b></h8></span><br>";
                content += "<span style='margin-left: 2.5px;'><h8>Year : <b style='color:lightblue'>" + d.key + "</b></h8></span><br>";
                return content;
            });
            svg.call(tip);
            //Listing the annotations
            var annotations = [{
                note: {
                align: "left",
                label: "Suicides Decreasing in World after recession(2008) but high overall",
                title: "Suicide Trend"
                },
                x: 700 + margin.left, y: 40 + margin.bottom * 0.25,
                dy: -30,
                dx: 0
            }];
            //Create groups to transform
            var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

          g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("No. Of suicides");

              g.append("path")
                .data([data])
                .attr("class", "line")
                .attr("d", line);

            g.selectAll(".dot")
                .data(data)
            .enter().append("circle")
                .attr("cx", function(d, i) { return x(d.key) })
                .attr("cy", function(d) { return y(d.value) })
                .attr("fill","grey")
                .attr("r", 5)
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);

            var makeAnnotations = d3.annotation()
                .editMode(false)
                .type(d3.annotationCalloutElbow)
                .annotations(annotations);
            g.append("g")
                .attr("class", "annotation-group")
                .call(makeAnnotations);
        });
}

function renderSuicideCountByYearsCountryLineChart(svgId) {
    var svg = d3.select(svgId)
                    .append("svg")
                    .attr("width", WIDTH)
                    .attr("height", HEIGHT);
    const margin = {
            top: 120,
            right: 20,
            bottom: 130,
            left: 50
            };

    var width = +svg.attr("width") - margin.left - margin.right;
    var height = +svg.attr("height") - margin.top - margin.bottom;
    var duration=1000;

    const data1 =  d3.csv('data/who_suicide_statistics.csv').then(function(data1) {

     data1 = d3.nest()
      .key(function (d) {return d.country; })
      .key(function (d){return d.year;})
      .rollup(function (v) {
        var sum=0;
        for (let i=0; i<v.length;i++){
         if(v[i].suicides_no && !(v[i].suicides_no===''))
          sum+=parseInt(v[i].suicides_no)
        }
        return sum;
       })
      .entries(data1);
       console.log(data1)


      d3.select("#countries-list").selectAll('option .values')
      .data(data1)
      .enter()
      .append("option")
      .attr("value", function (d) { return d.key; })
      .text(function (d) { return d.key; });

        console.log(filterValueOfCountry)
        if (typeof filterValueOfCountry == 'undefined'){
        filterValueOfCountry="United States of America";
        console.log(filterValueOfCountry)
        }
        filterDataCountry = (data1.filter(function(d){return d.key==filterValueOfCountry|| d.key=="United States Of America"}))
        console.log(filterDataCountry)

            // The number of datapoints
            var n = filterDataCountry[0].values.length;

            var x = d3.scaleBand()
                .range([0, width]);

            var y = d3.scaleLinear()
                .range([height, 0]);

            x.domain(filterDataCountry[0].values.map(function (d) {
                return parseInt(d.key);
                }));
                //tochange 50000
            y.domain([0, 50000]);

            console.log("I am here")
            var line = d3.line()
                .x(function(d, i) {
                    return x(parseInt(d.key));
                })
                .y(function(d) {
                    return y(d.value);
                })
                .curve(d3.curveMonotoneX)

            // Create Tooltips
            var tip = d3.tip().attr('class', 'd3-tip')
            .html(function(d) {
                var content = "<span style='margin-left: 2.5px;'><h8>No.Of Suicides: <b style='color:lightblue'>" + d.value + "</b></h8></span><br>";
                content += "<span style='margin-left: 2.5px;'><h8>Year : <b style='color:lightblue'>" + d.key + "</b></h8></span><br>";
                return content;
            });
            svg.call(tip);
            //Listing the annotations
            var annotations = [{
                note: {
                align: "right",
                label: "Crop harvest season",
                title: "Spring/Summer season"
                },
                x: 260 + margin.left, y: 90 + margin.bottom * 0.25,
                dy: -20,
                dx: 0
            },{
                note: {
                align: "left",
                label: "Affecting Northern America",
                title: "Winter season"
                },
                x: 650 + margin.left, y: 40 + margin.bottom * 0.25,
                dy: -30,
                dx: 0
            }];
            //Create groups to transform
            var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
            g.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x))
            .selectAll("text")
            .attr("y", 0)
            .attr("x", 9)
            .attr("dy", ".35em")
            .attr("transform", "rotate(90)")
            .style("text-anchor", "start");

          g.append("g")
            .call(d3.axisLeft(y))
            .append("text")
            .attr("fill", "#000")
            .attr("transform", "rotate(-90)")
            .attr("y", 6)
            .attr("dy", "0.71em")
            .attr("text-anchor", "end")
            .text("No. Of suicides");

            g.selectAll(".line").data(filterDataCountry).enter().append("path")
                .attr("class", "line")
                .attr("d", d=> line(d.values));

            var groups=g.selectAll(".dot")
                .data(filterDataCountry)
            .enter().append("g")
                .attr("class", "dot")

                groups.selectAll("dot").data(function(d){
                return d.values
                }).enter().append("circle")
                .attr("cx",function(d,i){
                    if (!(d.key=="" ||d.key=="undefined"||d.key=="null")){
                   // console.log(d.key+"iiiii"+x(d.key))
                    return x(d.key)
                    }

                })
                .attr("cy", function(d) {
                    if (!(d.value=="" ||d.value=="undefined"||d.value=="null"))
                    return y(d.value)
                    else if(d.value=="")
                    return 50000
                })
                .attr("r", 5)
                .attr("fill","grey")
                .on("mouseover", tip.show)
                .on("mouseout", tip.hide);
        });
}



renderSuicideCountByYearsLineChart("#plot-suicide-count-by-year-svg");
function onCountriesValueChange() {
  filterValueOfCountry = d3.select('#countries-list').property('value');
  console.log('changed ' + filterValueOfCountry);
  var svgId = '#plot-suicide-count-by-country-svg';
  d3.select(svgId).select("svg").remove();
  renderSuicideCountByYearsCountryLineChart(svgId);
}
renderSuicideCountByYearsCountryLineChart("#plot-suicide-count-by-country-svg");