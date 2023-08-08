const osmTile = 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png';
const osmAttrib='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors';
const gStreetTile = 'http://{s}.google.com/vt/lyrs=m&x={x}&y={y}&z={z}';
const gSatTile = 'http://{s}.google.com/vt/lyrs=s&x={x}&y={y}&z={z}';
const gHybridTile = 'http://{s}.google.com/vt/lyrs=s,h&x={x}&y={y}&z={z}';
const gTerrainTile = 'http://{s}.google.com/vt/lyrs=p&x={x}&y={y}&z={z}';
const gSubDomains = ['mt0','mt1','mt2','mt3'];
let baseLayers, osm, gStreets, gSat, gTerrain;
