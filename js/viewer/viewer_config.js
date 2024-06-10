const canvas = document.getElementById("draw-canvas");
const defaultViewSide = '15,15,0,0,0,2';

let presenter = null;
let scene, paradata, gStep, measure_unit;
let meshes = {};
let instances = {};

const trackBallOpt = {
  type: TurntablePanTrackball, 
  trackOptions: {
    startPhi: 15.0, 
    startTheta: 15.0, 
    startDistance: 2.0, 
    minMaxPhi: [-180, 180], 
    minMaxTheta: [-90.0, 90.0], 
    minMaxDist: [0.1, 3.0] 
  }
}

const spaceOpt = {
  centerMode: "scene", 
  radiusMode: "scene", 
  cameraNearFar: [0.01, 5.0]
}

const configOpt = {
  pickedpointColor: [1.0, 0.0, 1.0], 
  measurementColor: [0.5, 1.0, 0.5], 
  showClippingPlanes: true, 
  showClippingBorder: true, 
  clippingBorderSize: 0.5, 
  clippingBorderColor: [0.0, 1.0, 1.0]
}

const sceneBB = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];

let angleStage = 0;
let anglePoints = [[0.0,0.0,0.0],[0.0,0.0,0.0],[0.0,0.0,0.0]];
let lightDir = [-0.17,-0.17];
let viewList = {}
let viewIndex = 0;
let spotList = {}
let spotIndex = 0;

const instanceOpt = {
  "nxz":{ 
    mesh:"nxz", 
    tags: ['Group'], 
    color: [0.5, 0.5, 0.5], 
    backfaceColor: [0.5, 0.5, 0.5, 3.0], 
    specularColor: [0.0, 0.0, 0.0, 256.0]
  }
}

var toolBtnList = [].slice.call(document.querySelectorAll('.toolBtn'))
var tooltipBtnList = toolBtnList.map(function (tooltipBtn) { return new bootstrap.Tooltip(tooltipBtn,{trigger:'hover', html: true, placement:'left' })})