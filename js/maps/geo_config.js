const mapTilerKey = 'CMQ8bWOfjncCKWV3MfHg';
const osmTile = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttrib='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const gStreetTile = 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
const gSatTile = 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
const gHybridTile = 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}';
const gTerrainTile = 'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
const gSubDomains = ['mt0','mt1','mt2','mt3'];
let osmReverse = 'https://nominatim.openstreetmap.org/reverse?format=jsonv2&'
//osm reverse param
//append to api -> lat=x.xx&lon=x.xx
//json variables to use -> address.road, address.house_number

let geoNamesReverse = 'http://api.geonames.org/addressJSON?username=darklab&'
//geoNames reverse param
//append to api -> lat=x.xx&lng=x.xx
//json variables to use -> address.street, address.houseNumber

let baseLayers, osm, gStreets, gSat, gTerrain;
let overlayMaps = {}
let mapClick = false;

// const mapExt = [[60,5],[70,30]];
const mapExt = [[72,63],[51,-11]];
let map,marker, countyGroup, cityGroup;
let countyStyle = {
  weight: 2,
  color: 'rgb(51,136,255)',
  opacity: 0.8,
  fillColor: 'rgb(51,136,255)',
  fillOpacity: 0.1
}
let cityStyle = {
  weight: 2,
  color: 'rgb(220,53,69)',
  opacity: 1,
  fillColor: 'rgb(220,53,69)',
  fillOpacity: 0.2
}
const storagePlaceIco = L.icon({
  iconUrl: 'img/ico/storagePlace.png',
  iconSize:     [30, 30],
  iconAnchor:   [15, 15],
  popupAnchor:  [0,-15]
});
const findplaceIco = L.icon({
  iconUrl: 'img/ico/findPlace.png',
  iconSize:     [30, 30],
  iconAnchor:   [15, 15],
  popupAnchor:  [-3, -76]
});