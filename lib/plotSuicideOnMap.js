
function renderWorldMap(svgId) {
  var suicideData = d3.csv('data/who_suicide_statistics.csv').then(function (suicideData) {
    var mapWIDTH = 1000, mapHEIGHT = 700;
    var margin = { top: 40, right: 20, bottom: 50, left: 70 },
      width = mapWIDTH - margin.left - margin.right,
      height = mapHEIGHT - margin.top - margin.bottom;
    var svg = d3.select(svgId).append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom);

    console.log("svg: " + svg + " svg width: " + svg.style("width") + " svg height: " + svg.style("height"));

    //format the data by state and number of markets
    worldDataState = d3.nest()
      .key(function (d) { return d.country; })
      .rollup(function (v) {
        var sum=0;
        for (let i=0; i<v.length;i++){
         if(v[i].suicides_no && !(v[i].suicides_no===''))
          sum+=parseInt(v[i].suicides_no)
        }

        return sum;
       })
      .entries(suicideData);

    // Create Tooltips
    var tip = d3.tip().attr('class', 'd3-tip')
      .html(function (worldData) {
        var countryData = fetchAStateData(worldData);
        var suicideCount = 0
        if (countryData && countryData.length > 0) {
          suicideCount = countryData[0].value;
        }
        var content = "<span style='margin-left: 2.5px;'><h6>Country Name: " + worldData.properties.name + "</h6></span><br>";
        content += "<span style='margin-left: 2.5px;'><h6>No. Of suicides : " + suicideCount + "</h6></span><br>";
        return content;
      });
    svg.call(tip);

    //Creating legend for maps

    var log = d3.scaleLog()
      .domain([1,2000000])
      .range(["rgb(0, 0, 0)", "rgb(120, 166, 255)"]);

    svg.append("g")
      .attr("class", "legendLog")
      .attr("transform", "translate(20,20)");

    var logLegend = d3.legendColor()
      .cells([1,2,100,300,6000,100000])
      .scale(log);

    svg.select(".legendLog")
      .call(logLegend);

      //Setting geoPath
    var projection=d3.geoEquirectangular()
    var path = d3.geoPath().projection(projection);

    d3.json("data/countries.json").then(function (worldData) {
      var g = svg.append("g").attr("transform", "translate(" + margin.left + "," + margin.top + ")");
      g.append("g")
        .attr("class", "country")
       .selectAll("path")
        .data(topojson.feature(worldData, worldData.objects.countries).features)
        .enter().append("path")
        .attr("fill", function (data) {
          var countryData = fetchAStateData(data);
          if (countryData && countryData.length > 0) {
            return log(countryData[0].value);
          }
          return log(0);
        })
        .attr("d", path)
        .on("mouseover", tip.show)
        .on("mouseout", tip.hide);

      g.append("path")
        .attr("class", "country-borders")
        .attr("d", path(topojson.mesh(worldData, worldData.objects.countries, (a, b) => a !== b)));
      //Listing the annotations
      var annotations = [{
        note: {
          align: "right",
          label: "Most number of suicides: 1500992",
          title: "Russia"
        },
        x: 800, y: 100,
        dy: -20,
        dx: 0
      }];
      var makeAnnotations = d3.annotation()
        .editMode(false)
        .type(d3.annotationCalloutElbow)
        .annotations(annotations);
      g.append("g")
        .attr("class", "annotation-group")
        .call(makeAnnotations);
    });


  });

}


renderWorldMap("#map-svg");


function fetchAStateData(worldMapData) {
  return worldDataState.filter(marketDataStateItem => marketDataStateItem.key.toUpperCase().includes( worldMapData.properties.name.toUpperCase()));
}
