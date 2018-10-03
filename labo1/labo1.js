//WebGL Varaibles
let gl; //webgl context
let prg; //webgl program

let cnv; //canvas

//Refresh
let interval;
const FRAMERATE = 60.0 / 1000.0; // images/milliseconds
const PERIOD = 1 / FRAMERATE;

let frame = 0; //framecount

//Camera
let mvMatrix = mat4.create();
let pMatrix = mat4.create();

let butterfly;

function labo1() {
	initWebGL();
	gl.clearColor(0, 0, 0, 0.1);

	butterfly = new Butterfly(gl);

	//Start the draw loop
	interval = setInterval(function() {
		loop();
		frame++;
	}, PERIOD);
}

function initWebGL() {
	cnv = document.getElementById("cnv-labo1");
	gl = cnv.getContext("webgl");
	prg = gl.createProgram();

	addShader(gl.VERTEX_SHADER, "shader-vs");
	addShader(gl.FRAGMENT_SHADER, "shader-fs");

	gl.linkProgram(prg);
	gl.getProgramParameter(prg, gl.LINK_STATUS)
	gl.useProgram(prg);
	gl.viewport(0, 0, cnv.width, cnv.height);

	prg.vertexPositionAttribute = gl.getAttribLocation(prg, "aVertexPosition");
	gl.enableVertexAttribArray(prg.vertexPositionAttribute);
	prg.colorAttribute = gl.getAttribLocation(prg, "aColor");
	gl.enableVertexAttribArray(prg.colorAttribute);
	prg.pMatrixUniform = gl.getUniformLocation(prg, 'uPMatrix');
	prg.mvMatrixUniform = gl.getUniformLocation(prg, 'uMVMatrix');
}

function addShader(shaderType, id) {
	let shader = gl.createShader(shaderType);
	let str = document.getElementById(id).textContent;
	gl.shaderSource(shader, str);
	gl.compileShader(shader);
	gl.getProgramParameter(prg, gl.LINK_STATUS)
	gl.attachShader(prg, shader);
}

function getBufferFromArrayElement(gl, gltype, jstype, array) {
	let buff = gl.createBuffer();
	gl.bindBuffer(gltype, buff);
	gl.bufferData(gltype, new jstype(array), gl.STATIC_DRAW);
	return buff;
}

function loop() {
	update();
	draw();
}

function update() {
	butterfly.update(frame);
}

function draw() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

	butterfly.draw();
}
