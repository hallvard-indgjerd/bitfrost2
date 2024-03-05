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
  
  let markerGroup = L.featureGroup().addTo(map);
  let polyStyle;

  storagePlaceMarker = L.marker(markerArr['storage'],{icon:storagePlaceIco}).addTo(markerGroup);
  if(markerArr['findplace']){
    findPlaceMarker = L.marker(markerArr['findplace'],{icon:findplaceIco}).addTo(markerGroup);
  }

  if(Object.keys(polyArr).length>0){
    ajaxSettings.url=API+"get.php";
    if(polyArr.city){
      ajaxSettings.data = {
        trigger:'getSelectOptions', 
        list:'jsonCity', 
        orderBy:'1', 
        filter:'id = '+polyArr.city
      }
      polyStyle=cityStyle;
    }
    if(polyArr.county){
      ajaxSettings.data = {
        trigger:'getSelectOptions', 
        list:'jsonCounty', 
        orderBy:'1', 
        filter:'id = '+polyArr.county
      }
      polyStyle=countyStyle;
    }
    $.ajax(ajaxSettings)
    .done(function(data){
      let geojsonFeature = {
        "type": "Feature",
        "properties": {type:data[0].type, name:data[0].name},
        "geometry": JSON.parse(data[0].geometry)
      };
      let poly = L.geoJson(geojsonFeature, {style:polyStyle}).addTo(markerGroup);
      poly.bindPopup(data[0].type+': '+data[0].name)
      data[0].type == 'city' ? overlayMaps.city = poly : overlayMaps.county = poly
      map.fitBounds(markerGroup.getBounds())
      L.control.layers(baseLayers, overlayMaps).addTo(map);
    })
  }else{
    map.fitBounds(markerGroup.getBounds())
    L.control.layers(baseLayers, overlayMaps).addTo(map);
  }

  map.setZoom(9);
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

function mapStat(data){
  map = L.map('mapStat',{maxBounds:mapExt})
  map.setZoom(9);
  map.setMinZoom(4);
  map.fitBounds(mapExt)
  osm = L.tileLayer(osmTile, { maxZoom: 18, attribution: osmAttrib}).addTo(map);
}