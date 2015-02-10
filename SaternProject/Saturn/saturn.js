// Constructor
SaturnApp = function()
{
	Sim.App.call(this);
}

// Subclass Sim.App
SaturnApp.prototype = new Sim.App();

// Our custom initializer
SaturnApp.prototype.init = function(param)
{
	// Call superclass init code to set up scene, renderer, default camera
	Sim.App.prototype.init.call(this, param);
	
    // Create the Earth and add it to our sim
    var saturn = new Saturn();
    saturn.init();
    this.addObject(saturn);
}

// Custom Earth class
Saturn = function()
{
	Sim.Object.call(this);
}

Saturn.prototype = new Sim.Object();

Saturn.prototype.init = function()
{
    // Create our Earth with nice texture
    var saturnmap = "../images/saturn_bjoernjonsson.jpg";
    var geometry = new THREE.SphereGeometry(1, 32, 32);
    var texture = THREE.ImageUtils.loadTexture(saturnmap);
    var material = new THREE.MeshBasicMaterial( { map: texture } );
    var mesh = new THREE.Mesh( geometry, material ); 

    // Let's work in the tilt
    mesh.rotation.x = Saturn.TILT;
    
    // Tell the framework about our object
    this.setObject3D(mesh);    
}

Saturn.prototype.createRings = function()
{
    // Create our Saturn with nice texture
    var ringsmap = "../images/SatRing.png";
    var geometry = new Saturn.Rings(0, 1.867, 64);
    
    var texture = THREE.ImageUtils.loadTexture(ringsmap);
    var material = new THREE.MeshLambertMaterial( {map: texture, transparent:true, ambient:0xffffff } );
    var ringsMesh = new THREE.Mesh( geometry, material );
    ringsMesh.doubleSided = true;
    ringsMesh.rotation.x = Math.PI / 2;

    // Add it to our group
    this.planetGroup.add(ringsMesh);
	
    // Save it away so we can rotate it
    this.ringsMesh = ringsMesh;
}

Saturn.prototype.update = function()
{
	// "I feel Saturn move..."
	this.object3D.rotation.y += Saturn.ROTATION_Y;
}

// The rings
Saturn.Rings = function ( innerRadius, outerRadius, nSegments ) {

	THREE.Geometry.call( this );

	var outerRadius = outerRadius || 1,
	innerRadius = innerRadius || .5,
	gridY = nSegments || 10;
	
	var i, twopi = 2 * Math.PI;
	var iVer = Math.max( 2, gridY );

	var origin = new THREE.Vector3(0, 0, 0);	
	//this.vertices.push(new THREE.Vertex(origin));

	for ( i = 0; i < ( iVer + 1 ) ; i++ ) {

		var fRad1 = i / iVer;
		var fRad2 = (i + 1) / iVer;
		var fX1 = innerRadius * Math.cos( fRad1 * twopi );
		var fY1 = innerRadius * Math.sin( fRad1 * twopi );
		var fX2 = outerRadius * Math.cos( fRad1 * twopi );
		var fY2 = outerRadius * Math.sin( fRad1 * twopi );
		var fX4 = innerRadius * Math.cos( fRad2 * twopi );
		var fY4 = innerRadius * Math.sin( fRad2 * twopi );
		var fX3 = outerRadius * Math.cos( fRad2 * twopi );
		var fY3 = outerRadius * Math.sin( fRad2 * twopi );
		
		var v1 = new THREE.Vector3( fX1, fY1, 0 );
		var v2 = new THREE.Vector3( fX2, fY2, 0 );
		var v3 = new THREE.Vector3( fX3, fY3, 0 );
		var v4 = new THREE.Vector3( fX4, fY4, 0 );
		this.vertices.push( new THREE.Vertex( v1 ) );
		this.vertices.push( new THREE.Vertex( v2 ) );
		this.vertices.push( new THREE.Vertex( v3 ) );
		this.vertices.push( new THREE.Vertex( v4 ) );
		
	}

	for ( i = 0; i < iVer ; i++ ) {

		this.faces.push(new THREE.Face3( i * 4, i * 4 + 1, i * 4 + 2));
		this.faces.push(new THREE.Face3( i * 4, i * 4 + 2, i * 4 + 3));
		this.faceVertexUvs[ 0 ].push( [
			       						new THREE.UV(0, 1),
			       						new THREE.UV(1, 1),
			       						new THREE.UV(1, 0) ] );
		this.faceVertexUvs[ 0 ].push( [
			       						new THREE.UV(0, 1),
			       						new THREE.UV(1, 0),
			       						new THREE.UV(0, 0) ] );
	}	

	this.computeCentroids();
	this.computeFaceNormals();

	this.boundingSphere = { radius: outerRadius };
};

Saturn.Rings.prototype = new THREE.Geometry();
Saturn.Rings.prototype.constructor = Saturn.Rings;


Saturn.ROTATION_Y = 0.003;
Saturn.TILT = -0.466;
