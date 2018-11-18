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

let vertexShader = `
	attribute vec3 aVertexPosition;
	attribute vec4 aColor;
	uniform mat4 uMVMatrix;
	uniform mat4 upMatrix;
	varying vec4 vColor;

	void main(void)
	{
		vColor = aColor;
		gl_Position = upMatrix * uMVMatrix * vec4(aVertexPosition, 1.0);
		gl_PointSize = 5.0;
	}
`;

let fragmentShader = `
	#ifdef GL_ES
		precision highp float;
	#endif
	varying vec4 vColor;

	void main(void)
	{
		gl_FragColor = vColor;
	}
`;

let stair;

function labo() {
	initWebGL();
	gl.clearColor(0, 0, 0, 0.02);

    stair = new Stair(0.1, 0.8, 2*Math.PI/8, 0.2, 500);

	//Start the animation loop
	interval = setInterval(function() {
		loop(frame);
		frame++;
	}, PERIOD);
}

function initWebGL() {
	cnv = document.getElementById("cnv");
	gl = cnv.getContext("webgl");
	prg = gl.createProgram();

	addShader(gl.VERTEX_SHADER, vertexShader);
	addShader(gl.FRAGMENT_SHADER, fragmentShader);

	gl.linkProgram(prg);
	gl.getProgramParameter(prg, gl.LINK_STATUS)
	gl.useProgram(prg);
	gl.viewport(0, 0, cnv.width, cnv.height);

	prg.vertexPositionAttribute = gl.getAttribLocation(prg, "aVertexPosition");
	gl.enableVertexAttribArray(prg.vertexPositionAttribute);
	prg.colorAttribute = gl.getAttribLocation(prg, "aColor");
	gl.enableVertexAttribArray(prg.colorAttribute);
	prg.pMatrixUniform = gl.getUniformLocation(prg, 'upMatrix');
	prg.mvMatrixUniform = gl.getUniformLocation(prg, 'uMVMatrix');
}

//add a shader
function addShader(shaderType, shaderCode) {
	let shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderCode);
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

//loop triggered by a setInterval
function loop(frame) {
	update(frame);
	draw(frame);
}

//update the geometry
function update(frame) {
    stair.update(frame);
}

//draw to the screen using webgl
function draw(frame) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

    stair.draw();
}