function osmSearch(city){
  let api = nominatim+city
  $.getJSON( api, function( data ) {
    citySuggested.html('')
    if (data.features.length > 0) {
      data.features.forEach((item,i) => {
        let geom = item.geometry.coordinates;
        let prop = item.properties.geocoding;
        $("<button/>", {class:'list-group-item list-group-item-action', type:'button'})
          .text(prop.country+", "+prop.name)
          .appendTo(citySuggested)
          .on('click', function(){
            $("[name=city]").val(prop.name)
            map.setView([geom[1],geom[0]],13)
            citySuggested.fadeOut('fast').html('');
            autocompleted = true;
          })
      })
    }else{
      $("<button/>", {class:'list-group-item list-group-item-action', type:'button'})
        .text('No cities found')
        .appendTo(citySuggested)
        .on('click', function(){ citySuggested.fadeOut('fast').html(''); })
    }
    citySuggested.fadeIn('fast')
  });
}
function osmReverseSearch(ll){
  let api = nominatimReverse+'lat='+ll.lat+'&lon='+ll.lng;
  $.getJSON( api, function( data ) {
    if (marker != undefined) { map.removeLayer(marker)};
    marker = L.marker(ll).addTo(map);
    let city; 
    if(data.address.city && data.address.city !== 'undefined'){
      city = data.address.city;
    }
    else if(data.address.town && data.address.town !== 'undefined'){
      city = data.address.town;
    }else{
      city = data.address.village;
    }
    $("[name=city]").val(city)

    let addr = data.address.road;
    if(data.address.house_number && data.address.house_number !== 'undefined'){addr = addr+" "+data.address.house_number;}
    $("#address").val(addr)

    $("#latitude").val(ll.lat.toFixed(4))
    $("#longitude").val(ll.lng.toFixed(4))
  });
}

function mapInit(){
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
  layerControl = L.control.layers(baseLayers, null,{collapsed:false}).addTo(map);
  countyGroup = L.featureGroup().addTo(map);
  cityGroup = L.featureGroup().addTo(map);
    
  map.on({
    zoomend: handleAlert,
    click:function(e){
      mapClick = true;
      let zoom = map.getZoom()
      if (zoom<14) { return false;}
      let ll = map.mouseEventToLatLng(e.originalEvent);
      // getCityFromLonLat([parseFloat(ll.lng),parseFloat(ll.lat)], zoom)
      osmReverseSearch(ll)
    }
  })
  function handleAlert(){
    let alertClass, alertText;
    let zoom = map.getZoom();
    if (zoom>=14) {
      alertClass = 'alert alert-success';
      alertText = 'Ok, you can click on map to create a marker';
      map.removeLayer(countyGroup);
      map.removeLayer(cityGroup);
    }else {
      alertClass = 'alert alert-warning'
      alertText = 'To put a marker on map you have to zoom in';
      map.addLayer(countyGroup);
      map.addLayer(cityGroup);
    }
    $("#mapAlert").removeClass().addClass(alertClass).text(alertText)
  }

  let myToolbar = L.Control.extend({
    options: { position: 'topleft'},
    onAdd: function (map) {
      let container = L.DomUtil.create('div', 'extentControl leaflet-bar leaflet-control leaflet-touch');
      btnHome = $("<a/>",{href:'#', title:'max zoom', id:'maxZoomBtn'}).attr({"data-bs-toggle":"tooltip","data-bs-placement":"right"}).appendTo(container)
      $("<i/>",{class:'mdi mdi-home'}).appendTo(btnHome)
      btnFullscreen = $("<a/>",{href:'#', title:'toggle fullscreen mode', id:'toggleFullscreenBtn'}).attr({"data-bs-toggle":"tooltip","data-bs-placement":"right"}).appendTo(container)
      $("<i/>",{class:'mdi mdi-fullscreen'}).appendTo(btnFullscreen)

      btnHome.on('click', function (e) {
        e.preventDefault()
        e.stopPropagation()
        map.fitWorld().setZoom(2);
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

function artifactMap(){
  if (map !== undefined) { map.remove(); }
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

  layerControl = L.control.layers(baseLayers, overlayMaps).addTo(map);
  
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
      btnHome = $("<a/>",{href:'#', title:'max zoom', id:'maxZoomBtn'}).attr({"data-bs-toggle":"tooltip","data-bs-placement":"right"}).appendTo(container)
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
  // L.tileLayer(osmTile, { maxZoom: 20, attribution: osmAttrib}).addTo(map2);
  // L.tileLayer('https://tiles.stadiamaps.com/tiles/stamen_toner_lite/{z}/{x}/{y}{r}.png', {
  //   maxZoom: 20,
  //   attribution: '&copy; <a href="https://stadiamaps.com/" target="_blank">Stadia Maps</a> &copy; <a href="https://stamen.com/" target="_blank">Stamen Design</a> &copy; <a href="https://openmaptiles.org/" target="_blank">OpenMapTiles</a> &copy; <a href="https://www.openstreetmap.org/copyright" target="_blank">OpenStreetMap</a>', 
  // }).addTo(map2);
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
      btnHome = $("<a/>",{href:'#', title:'max zoom', id:'maxZoomBtn'}).attr({"data-bs-toggle":"tooltip","data-bs-placement":"right"}).appendTo(container)
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
    $(".arrow"+group).css("visibility",'visible')
  }
  $("#mapInfoTitle").text(props ? '' : 'Map info')
  $("#nameProp").text(props ? props.name : '')
  $("#totProp").text(props ? 'Number of artifacts: '+props.tot : '')
}

function layername(){
// Ottieni tutti i layer aggiunti alla mappa
var mapLayers = map._layers;

// Crea un array per memorizzare i nomi dei layers
var layerNames = [];

// Itera su tutti i layer presenti nella mappa
for (var layerId in mapLayers) {
    var layer = mapLayers[layerId];
    
    // Verifica se il layer è un Layer di Leaflet e ha un nome
    if (layer.options && layer.options.name) {
      var layerName = layer.options.name;
      
      // Assicurati che il nome del layer non sia duplicato
      if (!layerNames.includes(layerName)) {
        layerNames.push(layerName);
      }
    }
  }
  
  // Ora puoi utilizzare l'array layerNames che contiene i nomi dei layers presenti nella mappa
  console.log(layerNames);

}