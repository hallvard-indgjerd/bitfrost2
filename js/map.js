map = L.map('map').fitWorld().setZoom(2)
osm = L.tileLayer(osmTile, { maxZoom: 20, attribution: osmAttrib}).addTo(map);
gStreets = L.tileLayer(gStreetTile,{maxZoom: 20, subdomains:gSubDomains });
gSat = L.tileLayer(gSatTile,{maxZoom: 20, subdomains:gSubDomains});
gTerrain = L.tileLayer(gTerrainTile,{maxZoom: 20, subdomains:gSubDomains});
baseLayers = {
  "OpenStreetMap": osm,
  "Google Terrain":gTerrain,
  "Google Satellite": gSat,
  "Google Street": gStreets
};
countyGroup = L.featureGroup().addTo(map);
countyJson = {"type":"FeatureCollection", "features": []}

layerControl = L.control.layers(baseLayers, null,{collapsed:false}).addTo(map);
L.control.betterscale({metric:true, imperial:false}).addTo(map);
L.control.mousePosition({emptystring:'',prefix:'WGS84'}).addTo(map);

artifactByCounty()

let myToolbar = L.Control.extend({
  options: { position: 'topleft'},
  onAdd: function (map) {
    let container = L.DomUtil.create('div', 'extentControl leaflet-bar leaflet-control leaflet-touch');
    btnHome = $("<a/>",{href:'#', title:'max zoom', id:'maxZoomBtn'}).attr({"data-bs-toggle":"tooltip","data-bs-placement":"right"}).appendTo(container)
    $("<i/>",{class:'mdi mdi-home'}).appendTo(btnHome)
    
    btnHome.on('click', function (e) {
      e.preventDefault()
      e.stopPropagation()
      map.fitBounds(countyGroup.getBounds());
    });
    return container;
  }
})
map.addControl(new myToolbar());

function artifactByCounty(){
  ajaxSettings.url=API+"stats.php";
  ajaxSettings.data={
    trigger:'artifactByCounty',
    filter:["artifact.category_class > 0"]
  };
  $.ajax(ajaxSettings).done(function(data) {
    // $("#loadingDiv").remove()
    data.forEach(el => {
      countyJson.features.push({
        "type": "Feature",
        "properties": {area:'county',name:el.name, tot:el.tot},
        "geometry": JSON.parse(el.geometry)
      })
    });
    L.geoJson(countyJson).addTo(countyGroup);
    map.fitBounds(countyGroup.getBounds())
  })
}
