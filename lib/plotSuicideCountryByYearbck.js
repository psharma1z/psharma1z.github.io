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
     console.log(data)
     data = d3.nest()
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
      .entries(data);



      d3.select("#countries-list").selectAll('option .values')
      .data(data)
      .enter()
      .append("option")
      .attr("value", function (d) { return d.key; })
      .text(function (d) { return d.key; });

        console.log(filterValueOfCountry)
        if (typeof filterValueOfCountry == 'undefined'){

        filterValueOfCountry="United States of America";
        console.log(filterValueOfCountry)
        }
        filterDataCountry = (data.filter(function(d){return d.key==filterValueOfCountry}))[0].values

        console.log(filterDataCountry)

            // The number of datapoints
            var n = filterDataCountry.values.length;

            var x = d3.scaleBand()
                .range([0, width]);

            var y = d3.scaleLinear()
                .range([height, 0]);

                console.log(d3.max(filterDataCountry, function (d) {
                    return parseInt(d.value);
                }));

            x.domain(filterDataCountry.map(function (d) {
                return parseInt(d.key);
                }));
                //tochange 50000
            y.domain([0, 50000]);

            console.log("I am here")
            var line = d3.line()
                .x(function(d, i) {
                    return x(d.key);
                })
                .y(function(d) {
                    return y(d.value);
                })
                .curve(d3.curveMonotoneX)

            // Create Tooltips
//            var tip = d3.tip().attr('class', 'd3-tip')
//            .html(function(d) {
//                var content = "<span style='margin-left: 2.5px;'><h8>No.Of Open Markets : <b style='color:lightblue'>" + d.suicides_no + "</b></h8></span><br>";
//                content += "<span style='margin-left: 2.5px;'><h8>Month : <b style='color:lightblue'>" + d.year + "</b></h8></span><br>";
//                return content;
//            });
//            svg.call(tip);
            //Listing the annotations
//            var annotations = [{
//                note: {
//                align: "right",
//                label: "Crop harvest season",
//                title: "Spring/Summer season"
//                },
//                x: 260 + margin.left, y: 90 + margin.bottom * 0.25,
//                dy: -20,
//                dx: 0
//            },{
//                note: {
//                align: "left",
//                label: "Affecting Northern America",
//                title: "Winter season"
//                },
//                x: 650 + margin.left, y: 40 + margin.bottom * 0.25,
//                dy: -30,
//                dx: 0
//            }];
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
                .data([filterDataCountry])
                .attr("class", "line")
                .attr("d", line);

//            g.selectAll(line).data(append("path")
//                .data([filterDataCountry])
//                .attr("class", "line")
//                .attr("d", line);

            g.selectAll(".dot")
                .data(filterDataCountry)
            .enter().append("circle")
                .attr("class", "dot")
                .attr("cx", function(d, i) { return x(d.key) })
                .attr("cy", function(d) { return y(d.value) })
                .attr("r", 5);
//                .on("mouseover", tip.show)
//                .on("mouseout", tip.hide);

//            var makeAnnotations = d3.annotation()
//                .editMode(false)
//                .type(d3.annotationCalloutElbow)
//                .annotations(annotations);
//            g.append("g")
//                .attr("class", "annotation-group")
//                .call(makeAnnotations);
        });
}

function onCountriesValueChange() {
  filterValueOfCountry = d3.select('#countries-list').property('value');
  console.log('changed ' + filterValueOfCountry);
  var svgId = '#plot-suicide-count-by-year-svg';
  d3.select(svgId).select("svg").remove();
  renderSuicideCountByYearsLineChart(svgId);
}

renderSuicideCountByYearsLineChart("#plot-suicide-count-by-year-svg");