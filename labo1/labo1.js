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

let butterflies = [];

let vertexShader = `
	attribute vec3 aVertexPosition;
	attribute vec4 aColor;
	uniform mat4 uMVMatrix;
	varying vec4 vColor;

	void main(void)
	{
		vColor = aColor;
		gl_Position = uMVMatrix * vec4(aVertexPosition, 1.0);
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

function labo1() {
	initWebGL();
	gl.clearColor(0, 0, 0, 0.02);

	setButterfliesQte(nbButterfliesRange.value);

	//Start the animation loop
	interval = setInterval(function() {
		loop();
		frame++;
	}, PERIOD);
}

function setButterfliesQte(qte) {
	if (butterflies.length == 0)
		butterflies = [new Butterfly(gl, 80)]; //adding the butterfly 0

	if (qte < butterflies.length)
		butterflies.splice(qte, butterflies.length - qte); //removing extra butterflies
	else
		for (let i = butterflies.length; i < qte; i++) //adding every missing butterfly
			butterflies[i] = new Butterfly(gl, 20, butterflies[i - 1].scale / 1.2); // each consecutive butterfly is 1.2 time smaller than the previous one
}

function initWebGL() {
	cnv = document.getElementById("cnv-labo1");
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
	prg.mvMatrixUniform = gl.getUniformLocation(prg, 'uMVMatrix');
}

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
function loop() {
	update();
	draw();
}

//update the geometry
function update() {
	for (let i = 0; i < butterflies.length; i++)
		butterflies[i].update(frame + ((butterflies.length - 1 - i) * 10)); // dephase the next butterfly so that they will follow the main butterfly rythme
}

//draw to the screen using webgl
function draw() {
	gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	for (let i = butterflies.length - 1; i >= 0; i--) // start from last to have the main in front
		butterflies[i].draw(frame);
}

function moveButterfliesTo(x, y)
{
    butterflies[0].setDstPos(x, y); // the mainbutterfly will follow the mouse
    for (let i = 1; i < butterflies.length; i++)
        butterflies[i].setDstPos(butterflies[i - 1].x, butterflies[i - 1].y); // the other butterfly will follow the previous butterfly
}

function changeButterfliesColors() {
	for (let i = 0; i < butterflies.length; i++) {
		let butterfly = butterflies[i];
		butterfly.setRandomColors();
		butterfly.generateParts();
	}
}
