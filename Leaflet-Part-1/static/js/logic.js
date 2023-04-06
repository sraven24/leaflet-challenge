//create the map base
var myMap = L.map("map", {
    center: [37.09, -95.71],
    zoom:5
});

//adding tile layer
L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
}).addTo(myMap);

//setup color values to pass through for later
const dataRange = [-10,90];
const cscale= chroma.scale(['purple','blue','green', 'yellow','orange','red']).domain (dataRange);

//get the data from the website and get all earthquakes in the past 7 days
//https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson
var url = "https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/all_week.geojson";

 d3.json(url).then(function(data){
    //create 
    let quakes = data.features;
    for (var i = 0; i<quakes.length;i++) {
        console.log(i);
        let longitude = quakes[i].geometry.coordinates[0];
        let latitude = quakes[i].geometry.coordinates[1];
        let depth = quakes[i].geometry.coordinates[2];
        let magnitude = quakes[i].properties.mag;
        let place = quakes[i].properties.place;
        //set the variables to a marker to be added to the map
        var quakeMarker = L.circleMarker([latitude, longitude],{
            radius: magnitude**2,
            color: "black",
            fillColor: cscale(depth),
            fillOpacity: 1,
            weight: 1
        });
        quakeMarker.addTo(myMap);
        quakeMarker.bindPopup((`<h1>${magnitude} earthquake, ${depth} miles deep. </h1> <hr> <h3>At ${place}</h3>`));
        
    }
    //Adding a legend
    var legend = L.control({
        position: 'bottomright'
    });

legend.onAdd = function(map){
    var div = L.DomUtil.create('div', 'legend');
    div.innerHTML += "<h4>Depth Range</h4>";
    var levels = ['<10', '10-30', '30-50', '50-70', '70-90', '90+'];
    var colors = ['purple','blue','green', 'yellow','orange','red'];
    for (var i = 0; i < levels.length; i++) {
    div.innerHTML += '<i style="background:' + colors[i] + '"></i><span>' + levels[i] + '</span><br>';
}
return div;
};
legend.addTo(myMap);

 });



