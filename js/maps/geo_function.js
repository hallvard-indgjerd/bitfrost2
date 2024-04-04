function artifactMap(){
  map = L.map('map',{maxBounds:mapExt})
  map.setMinZoom(4);
  osm = L.tileLayer(osmTile, { maxZoom: 18, attribution: osmAttrib}).addTo(map);
  gStreets = L.tileLayer(gStreetTile,{maxZoom: 18, subdomains:gSubDomains });
  gSat = L.tileLayer(gSatTile,{maxZoom: 18, subdomains:gSubDomains});
  gTerrain = L.tileLayer(gTerrainTile,{maxZoom: 18, subdomains:gSubDomains});
  baseLayers = {
    "OpenStreetMap": osm,
    "Google Terrain":gTerrain,
    "Google Satellite": gSat,
    "Google Street": gStreets
  };

  var layerControl = L.control.layers(baseLayers, overlayMaps).addTo(map);
  
  let markerGroup = L.featureGroup().addTo(map);

  storagePlaceMarker = L.marker(markerArr['storage'],{icon:storagePlaceIco}).addTo(markerGroup);
  if(markerArr['findplace']){
    findPlaceMarker = L.marker(markerArr['findplace'],{icon:findplaceIco}).addTo(markerGroup);
  }

  if(Object.keys(polyArr).length>0){
    ajaxSettings.url=API+"get.php";
    if(polyArr.county){
      ajaxSettings.data = {
        trigger:'getSelectOptions', 
        list:'jsonCounty', 
        orderBy:'1', 
        filter:'id = '+polyArr.county
      }
      $.ajax(ajaxSettings)
      .done(function(data){
        let geojsonFeature = {
          "type": "Feature",
          "properties": {type:data[0].type, name:data[0].name},
          "geometry": JSON.parse(data[0].geometry)
        };
        let county = L.geoJson(geojsonFeature, {style:countyStyle}).addTo(markerGroup);
        county.bindPopup(data[0].type+': '+data[0].name)
        layerControl.addOverlay(county, "County");
        map.fitBounds(markerGroup.getBounds())
      })
    }
    
    if(polyArr.city){
      ajaxSettings.data = {
        trigger:'getSelectOptions', 
        list:'jsonCity', 
        orderBy:'1', 
        filter:'id = '+polyArr.city
      }
      $.ajax(ajaxSettings)
      .done(function(data){
        let geojsonFeature = {
          "type": "Feature",
          "properties": {type:data[0].type, name:data[0].name},
          "geometry": JSON.parse(data[0].geometry)
        };
        let city = L.geoJson(geojsonFeature, {style:cityStyle}).addTo(markerGroup);
        city.bindPopup(data[0].type+': '+data[0].name)
        layerControl.addOverlay(city, "City");
        map.fitBounds(markerGroup.getBounds())
      })
    }
  }
  map.fitBounds(markerGroup.getBounds());
  let myToolbar = L.Control.extend({
    options: { position: 'topleft'},
    onAdd: function (map) {
      let container = L.DomUtil.create('div', 'extentControl leaflet-bar leaflet-control leaflet-touch');
      let btnHome = $("<a/>",{href:'#', title:'max zoom', id:'maxZoomBtn'}).attr({"data-bs-toggle":"tooltip","data-bs-placement":"right"}).appendTo(container)
      $("<i/>",{class:'mdi mdi-home'}).appendTo(btnHome)
      let btnFullscreen = $("<a/>",{href:'#', title:'toggle fullscreen mode', id:'toggleFullscreenBtn'}).attr({"data-bs-toggle":"tooltip","data-bs-placement":"right"}).appendTo(container)
      $("<i/>",{class:'mdi mdi-fullscreen'}).appendTo(btnFullscreen)
      btnHome.on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        map.fitBounds(markerGroup.getBounds());
      });
      btnFullscreen.on('click', function(e){
        e.preventDefault()
        e.stopPropagation()
        toggleFullScreen('map')
      })
      return container;
    }
  })
  map.addControl(new myToolbar());
}


let county;
function mapStat(countyData){
  map2 = L.map('mapChart',{maxBounds:mapExt}).fitBounds(mapExt)
  map2.setMinZoom(3);
  L.maptilerLayer({apiKey: mapTilerKey, style: "dataviz-light"}).addTo(map2)
  let countyGroup = L.featureGroup().addTo(map2);
  let countyJson = {"type":"FeatureCollection", "features": []}
  countyData.forEach(el => {
    countyJson.features.push({
      "type": "Feature",
      "properties": {area:'county',name:el.name, tot:el.tot},
      "geometry": JSON.parse(el.geometry)
    })
  });
  
  county = L.geoJson(countyJson, {
    style: styleByGroup,
    onEachFeature: onEachFeature
  }).addTo(countyGroup);
  
  
  let myToolbar = L.Control.extend({
    options: { position: 'topleft'},
    onAdd: function (map) {
      let container = L.DomUtil.create('div', 'extentControl leaflet-bar leaflet-control leaflet-touch');
      let btnHome = $("<a/>",{href:'#', title:'max zoom', id:'maxZoomBtn'}).attr({"data-bs-toggle":"tooltip","data-bs-placement":"right"}).appendTo(container)
      $("<i/>",{class:'mdi mdi-home'}).appendTo(btnHome)
      
      btnHome.on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        map.fitBounds(countyGroup.getBounds())
      });
      return container;
    }
  })
  map2.addControl(new myToolbar());
  
  let legend = L.control({position: 'bottomright'});
  legend.onAdd = function (map2) {
    let div = L.DomUtil.create('div', 'info legend border rounded')
    let grades = [0, 10, 20, 50, 100, 200, 500, 1000]
    let labels = [];
    for (var i = 0; i < grades.length; i++) {
      let row = $("<div/>").appendTo(div)
      let img = $("<img/>",{class:'arrowGroup arrow'+grades[i], src:'img/ico/play.png'}).appendTo(row)
      $("<i/>").css("background-color",getColorByGroup(grades[i] + 1)).appendTo(row)
      $("<small/>").text(grades[i] + (grades[i + 1] ? '-' + grades[i + 1] : '+')).appendTo(row)
      // div.innerHTML += '<i style="background:' + getColorByGroup(grades[i] + 1) + '"></i> ' + grades[i] + (grades[i + 1] ? '&ndash;' + grades[i + 1] + '<br>' : '+');
    }
    return div;
  };
  legend.addTo(map2);
  $(".arrowGroup").css('visibility','hidden')
  map2.fitBounds(countyGroup.getBounds())
}

function getGroup(d) {
  return d > 1000 ? 1000 :
  d > 500  ? 500 :
  d > 200  ? 200 :
  d > 100  ? 100 :
  d > 50   ? 50 :
  d > 20   ? 20 :
  d > 10   ? 10 :
  0;
}

function getColorByGroup(d) {
  return d > 1000 ? '#188977' :
  d > 500  ? '#1D9A6C' :
  d > 200  ? '#39A96B' :
  d > 100  ? '#56B870' :
  d > 50   ? '#74C67A' :
  d > 20   ? '#99D492' :
  d > 10   ? '#BFE1B0' :
  '#DEEDCF';
}
function styleByGroup(feature) {
  let color = getColorByGroup(feature.properties.tot)
  return {
    fillColor: color
    ,fillOpacity: 0.5
    ,weight: 2
    ,opacity: 1
    ,color: color
  };
}

function highlightFeature(e) {
  var layer = e.target;
  layer.setStyle({fillOpacity: 0.9});
  layer.bringToFront();
  mapInfo(layer.feature.properties);
}
function resetHighlight(e) {
  county.resetStyle(e.target);
  mapInfo();
  $(".arrowGroup").css('visibility','hidden')
}
function zoomToFeature(e) {map.fitBounds(e.target.getBounds());}
function onEachFeature(feature, layer) {
  layer.on({
      mouseover: highlightFeature,
      mouseout: resetHighlight,
      click: zoomToFeature
  });
}

function mapInfo(props){
  if(props){
    let group = getGroup(props.tot)
    console.log('arrow'+group);
    $(".arrow"+group).css("visibility",'visible')
  }
  $("#mapInfoTitle").text(props ? '' : 'Map info')
  $("#nameProp").text(props ? props.name : '')
  $("#totProp").text(props ? 'Number of artifacts: '+props.tot : '')
}