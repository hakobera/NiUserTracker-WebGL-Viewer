(function(){
  var proxy;
  var player;
  var scene, renderer, camera;

  function debug(message) {
    console.log(message);
  }

  // Proxy
  function Proxy() {
    var self = this;
    
    this.socket = io.connect();
    this.socket.on('connect', function() {
      debug('socket open.');
      self.socket.on('message', function(data) {
        //console.log(data);
        self.handleMessage(data);
      });
    });
  }

  Proxy.prototype.handleMessage = function(data){
    var pos = JSON.parse(data);
    player.setPartPosition(pos);
  };

  /**
   * Cube object.
   */
  function Cube(width, height, depth, material) {
    var geometry = new THREE.CubeGeometry(width, height, depth);
    this.mesh = new THREE.Mesh(geometry, material);
  }

  /**
   * Ground object.
   * @param groundSize Size of ground
   */
  function Ground(groundSize){
    var geometry = new THREE.Geometry();
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( -groundSize / 2, 0, 0 ) ) );
    geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( groundSize / 2, 0, 0 ) ) );

    var material = new THREE.LineBasicMaterial( { color: 0xffffff, opacity: 1.0 } );

    var width_cell_num = 20;
    var line_num = width_cell_num + 1;
    var line;
    for (var i = 0; i < line_num; i ++) {
      line = new THREE.Line( geometry, material );
      line.position.z = (i * groundSize / width_cell_num) - groundSize / 2;
      scene.addObject( line );

      line = new THREE.Line( geometry, material );
      line.position.x = (i * groundSize / width_cell_num) - groundSize / 2;
      line.rotation.y = 90 * Math.PI / 180;
      scene.addObject( line );
    }
  }

  // Part
  function Part(in_id){
    this.id = in_id;
    this.geometry = new THREE.Geometry();
    this.geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 0, 0 ) ) );
    this.geometry.vertices.push( new THREE.Vertex( new THREE.Vector3( 0, 0, 0 ) ) );

    var material = new THREE.LineBasicMaterial( { color: 0xffff00, opacity: 1.0 } );
    this.line = new THREE.Line( this.geometry, material );
    scene.addObject( this.line );

    this.edge1 = new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    this.edge1.overdraw = true;
    scene.addObject(this.edge1);
    this.edge2 = new THREE.Mesh(new THREE.CubeGeometry(20, 20, 20), new THREE.MeshBasicMaterial({ color: 0xff0000 }));
    this.edge2.overdraw = true;
    scene.addObject(this.edge2);
  }

  Part.ids = [
    'HEAD-NECK',
    'NECK-LEFT_SHOULDER',
    'LEFT_SHOULDER-LEFT_ELBOW',
    'LEFT_ELBOW-LEFT_HAND',
    'NECK-RIGHT_SHOULDER',
    'RIGHT_SHOULDER-RIGHT_ELBOW',
    'RIGHT_ELBOW-RIGHT_HAND',
    'LEFT_SHOULDER-TORSO',
    'RIGHT_SHOULDER-TORSO',
    'TORSO-LEFT_HIP',
    'LEFT_HIP-LEFT_KNEE',
    'LEFT_KNEE-LEFT_FOOT',
    'TORSO-RIGHT_HIP',
    'RIGHT_HIP-RIGHT_KNEE',
    'RIGHT_KNEE-RIGHT_FOOT',
    'LEFT_HIP-RIGHT_HIP'
  ];
  
  Part.prototype.setPosition = function(in_update){
    function translate(in_update){
      return {
        from: {
          x: -in_update.from.x,
          y: in_update.from.y,
          z: in_update.from.z - 1500
        },
        to: {
          x: -in_update.to.x,
          y: in_update.to.y,
          z: in_update.to.z - 1500
        }
      };
    }
    var line = this.line;
    var points = translate(in_update);
    this.edge1.position.x = line.position.x = points.from.x;
    this.edge1.position.y = line.position.y = points.from.y;
    this.edge1.position.z = line.position.z = points.from.z;
    this.edge2.position.x = points.to.x;
    this.edge2.position.y = points.to.y;
    this.edge2.position.z = points.to.z;

    this.geometry.vertices[1].position.x = points.to.x - points.from.x;

    console.log(this.geometry.vertices[1].position.x);
  };

  // Player
  function Player(in_x, in_y, in_z, in_camera){
    this.camera = in_camera;
    this.camera.position.x = in_x;
    this.camera.position.y = in_y;
    this.camera.position.z = in_z;
    this._updateCameraTarget();

    this._parts = {};
    var len = Part.ids.length;
    for (var i = 0; i < len; i++) {
      var id = Part.ids[i];
      this._parts[id] = new Part(id);
    }
  }

  Player.prototype.setPartPosition = function(in_update){
    this._parts[in_update.from.name + '-' + in_update.to.name].setPosition(in_update);
  };

  Player.prototype._updateCameraTarget = function(){
    this.camera.target.position.x = this.camera.position.x;
    this.camera.target.position.y = this.camera.position.y;
    this.camera.target.position.z = this.camera.position.z + 100;
  };

  function initScene() {
    var container = document.getElementById('container');
    var width = window.innerWidth * 0.9 | 0;
    var height = window.innerHeight * 0.9 | 0;

    camera = new THREE.Camera(70, width / height, 10, 10000);

    scene = new THREE.Scene();
    renderer = new THREE.WebGLRenderer( { clearColor: 0x000000, clearAlpha: 1, antialias: false } );
    renderer.setSize(width, height);

    container.appendChild(renderer.domElement);
  }

  function animate() {
    requestAnimationFrame(animate);
    render();
  }

  function render() {
    renderer.clear();
    renderer.render(scene, camera);
  }

  window.addEventListener('load', function(){
    initScene();
    proxy = new Proxy();
    player = new Player(0, 100, -100, camera);
    new Ground(1000);

    animate();
    
  }, false);
})();


