//// Grid functions ////////////////////////////////////
function startupGrid(grid){
  for(inst in presenter._scene.modelInstances){
    let vv = presenter._scene.meshes[presenter._scene.modelInstances[inst].mesh].renderable.mesh.basev;
    if (typeof vv === 'undefined') {
      setTimeout(function(){startupGrid(grid)},50)
      return;
    }
  }
  // computeEncumbrance();
  switch (grid) {
    case 'gridBase': addBaseGrid(); break;
    case 'gridBox': addBoxGrid(); break;
    case 'gridBB': addBBGrid(); break;
  }
}

function getBBox(instance) {
  var mname = presenter._scene.modelInstances[instance].mesh;
  var vv = presenter._scene.meshes[mname].renderable.mesh.basev;
  var bbox = [-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE];
  var point,tpoint;

  for(var vi=1; vi<(vv.length / 3); vi++){
    point = [vv[(vi*3)+0], vv[(vi*3)+1], vv[(vi*3)+2], 1.0]
    tpoint = SglMat4.mul4(presenter._scene.modelInstances[instance].transform.matrix, point);
    if(tpoint[0] > sceneBB[0]) sceneBB[0] = tpoint[0];
    if(tpoint[1] > sceneBB[1]) sceneBB[1] = tpoint[1];
    if(tpoint[2] > sceneBB[2]) sceneBB[2] = tpoint[2];
    if(tpoint[0] < sceneBB[3]) sceneBB[3] = tpoint[0];
    if(tpoint[1] < sceneBB[4]) sceneBB[4] = tpoint[1];
    if(tpoint[2] < sceneBB[5]) sceneBB[5] = tpoint[2];
  }
  return bbox;
}

function computeSceneBB() {
  for(inst in presenter._scene.modelInstances){
    let bb = getBBox(inst);
    if(bb[0] > sceneBB[0]) sceneBB[0] = bb[0];
    if(bb[1] > sceneBB[1]) sceneBB[1] = bb[1];
    if(bb[2] > sceneBB[2]) sceneBB[2] = bb[2];
    if(bb[3] < sceneBB[3]) sceneBB[3] = bb[3];
    if(bb[4] < sceneBB[4]) sceneBB[4] = bb[4];
    if(bb[5] < sceneBB[5]) sceneBB[5] = bb[5];
  }
}

function addBaseGrid() {
  computeSceneBB();
  var rad = 1.0 / presenter.sceneRadiusInv;
  var XC = (sceneBB[0] + sceneBB[3]) / 2.0;
  var YC = sceneBB[4];
  var ZC = (sceneBB[2] + sceneBB[5]) / 2.0;

  var gStep = 10.0;
  var numDivMaj = Math.floor(rad/gStep);
  var linesBuffer;

  // major
  var gridBase;
  linesBuffer = [];
  for (gg = -numDivMaj; gg <= numDivMaj; gg+=1){
    linesBuffer.push([XC + (gg*gStep), YC, ZC + (-gStep*numDivMaj)]);
    linesBuffer.push([XC + (gg*gStep), YC, ZC + ( gStep*numDivMaj)]);
    linesBuffer.push([XC + (-gStep*numDivMaj), YC, ZC + (gg*gStep)]);
    linesBuffer.push([XC + ( gStep*numDivMaj), YC, ZC + (gg*gStep)]);
  }
  gridBase = presenter.createEntity("gridBase", "lines", linesBuffer);
  gridBase.color = [0.9, 0.9, 0.9, 1.0];
  gridBase.zOff = 0.0;
  presenter.repaint();
}

function addBoxGrid() {
	computeSceneBB();

	var Xsteps,Ysteps,Zsteps,ii;
	var XC = (sceneBB[0] + sceneBB[3]) / 2.0;
	var YC = (sceneBB[1] + sceneBB[4]) / 2.0;
	var ZC = (sceneBB[2] + sceneBB[5]) / 2.0;
	
	Xsteps = Math.trunc(Math.ceil((sceneBB[0]-sceneBB[3])/gStep)+1);
	Ysteps = Math.trunc(Math.ceil((sceneBB[1]-sceneBB[4])/gStep)+1);
	Zsteps = Math.trunc(Math.ceil((sceneBB[2]-sceneBB[5])/gStep)+1);	
	
	var boxG = [0.0, 0.0, 0.0, 0.0, 0.0, 0.0];
	boxG[0] = XC + ((Xsteps/2.0) * gStep);
	boxG[1] = YC + ((Ysteps/2.0) * gStep);
	boxG[2] = ZC + ((Zsteps/2.0) * gStep);
	boxG[3] = XC - ((Xsteps/2.0) * gStep);
	boxG[4] = YC - ((Ysteps/2.0) * gStep);
	boxG[5] = ZC - ((Zsteps/2.0) * gStep);

	var gridBox;
	var linesBuffer = [];	
	//--------------------X
	for (ii=0; ii<=Ysteps; ii+=1){
			linesBuffer.push([boxG[3], boxG[4]+(gStep*ii), boxG[2]]);
			linesBuffer.push([boxG[3], boxG[4]+(gStep*ii), boxG[5]]);
			linesBuffer.push([boxG[0], boxG[4]+(gStep*ii), boxG[2]]);
			linesBuffer.push([boxG[0], boxG[4]+(gStep*ii), boxG[5]]);
	}
	for (ii=0; ii<=Zsteps; ii+=1){
			linesBuffer.push([boxG[3], boxG[1], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[3], boxG[4], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[0], boxG[1], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[0], boxG[4], boxG[5]+(gStep*ii)]);
	}
	//--------------------Y
	for (ii =0; ii <= Xsteps; ii+=1){
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[2]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[5]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[2]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[5]]);
	}
	for (ii = 0; ii <= Zsteps; ii+=1){
			linesBuffer.push([boxG[0], boxG[4], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[3], boxG[4], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[0], boxG[1], boxG[5]+(gStep*ii)]);
			linesBuffer.push([boxG[3], boxG[1], boxG[5]+(gStep*ii)]);
	}
	//--------------------Z
	for (ii =0; ii <= Xsteps; ii+=1){
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[5]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[5]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[1], boxG[2]]);
			linesBuffer.push([boxG[3]+(gStep*ii), boxG[4], boxG[2]]);
	}
	for (ii = 0; ii <= Ysteps; ii+=1){
			linesBuffer.push([boxG[0], boxG[4]+(gStep*ii), boxG[5]]);
			linesBuffer.push([boxG[3], boxG[4]+(gStep*ii), boxG[5]]);
			linesBuffer.push([boxG[0], boxG[4]+(gStep*ii), boxG[2]]);
			linesBuffer.push([boxG[3], boxG[4]+(gStep*ii), boxG[2]]);
	}

	gridBox = presenter.createEntity("gridBox", "lines", linesBuffer);
	gridBox.color = [0.8, 0.8, 0.8, 0.5];
	gridBox.zOff = 0.0;
	gridBox.useTransparency = true;		
	presenter.repaint();
}

function addBBGrid() {
	var rad = (1.0 / presenter.sceneRadiusInv) * 1.0;
	var XC = 0.0;
	var YC = 0.0;
	var ZC = 0.0;

	var numDiv = Math.floor(rad / gStep);
	var linesBuffer = [];
	var gridBB;
	
	for (gg = -numDiv; gg <= numDiv; gg+=1){
			linesBuffer.push([XC + (gg*gStep), YC + (-gStep*numDiv), ZC]);
			linesBuffer.push([XC + (gg*gStep), YC + ( gStep*numDiv), ZC]);
			linesBuffer.push([XC + (-gStep*numDiv), YC + (gg*gStep), ZC]);
			linesBuffer.push([XC + ( gStep*numDiv), YC + (gg*gStep), ZC]);
	}
	gridBB = presenter.createEntity("gridBB", "lines", linesBuffer);
	gridBB.color = [0.7, 0.7, 0.7, 0.5];
	gridBB.zOff = 0.5;
	gridBB.useTransparency = true;		
	presenter.repaint();
}

function changeGrid(currentGrid,newGrid) {
  if (currentGrid !== 'gridOff') { presenter.deleteEntity(currentGrid); }
  switch (newGrid) {
    case 'gridBase': addBaseGrid(); break;
    case 'gridBox': addBoxGrid(); break;
    case 'gridBB': addBBGrid(); break;
    case 'gridOff': presenter.deleteEntity(currentGrid); break;
  }
}