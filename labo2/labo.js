//WebGL Varaibles
let gl; //webgl context
let prg; //webgl program

let cnv; //canvas

//Refresh
let interval;
const FRAMERATE = 120.0 / 1000.0; // images/milliseconds
const PERIOD = 1 / FRAMERATE;

let frame = 0; //framecount

//Camera
let mvMatrix;
let pMatrix;

const vertexShader = `
	attribute vec4 aVertexPosition;
	attribute vec2 aTextureCoord;

	uniform mat4 uMVMatrix;
	uniform mat4 upMatrix;

	varying highp vec2 vTextureCoord;

	void main(void)
	{
		gl_Position = upMatrix * uMVMatrix * aVertexPosition;
		vTextureCoord = aTextureCoord;
	}
`;

const fragmentShader = `
	varying highp vec2 vTextureCoord;

	uniform sampler2D uSampler;

	void main(void)
	{
		gl_FragColor = texture2D(uSampler, vTextureCoord);
	}
`;

let stairway = null;

function labo() {
	initWebGL();

	mvMatrix = mat4.create();
	pMatrix = mat4.create();

	gl.clearColor(0, 0, 0, 0.01);

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
	prg.textureCoord = gl.getAttribLocation(prg, "aTextureCoord");
	prg.pMatrixUniform = gl.getUniformLocation(prg, 'upMatrix');
	prg.mvMatrixUniform = gl.getUniformLocation(prg, 'uMVMatrix');
	prg.uSampler = gl.getUniformLocation(prg, 'uSampler')

	gl.enableVertexAttribArray(prg.vertexPositionAttribute);
}

//add a shader
function addShader(shaderType, shaderCode) {
	let shader = gl.createShader(shaderType);
	gl.shaderSource(shader, shaderCode);
	gl.compileShader(shader);
	gl.getProgramParameter(prg, gl.LINK_STATUS)
	gl.attachShader(prg, shader);
}

//loop triggered by a setInterval
function loop(frame) {
	update(frame);
	draw(frame);
}

//update the geometry
function update(frame) {
	if (stairway != null)
		stairway.update(frame);
}

//draw to the screen using webgl
function draw(frame) {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
	gl.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	gl.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);

	if (stairway != null)
		stairway.draw(frame);
}
