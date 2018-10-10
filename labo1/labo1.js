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

let butterflyes;

function labo1() {
    initWebGL();
    gl.clearColor(0, 0, 0, 0.02);

	butterflyMain = new Butterfly(gl,250);
	butterfly1 = new Butterfly(gl,20);
	
	butterflyes = [butterflyMain, butterfly1];

    cnv.onmousemove = function(evt) {
        let cnv = evt.srcElement;
		let mousepos = canvasToScene(cnv.width, cnv.height, evt.offsetX, evt.offsetY);
		butterflyes[0].moveTo(mousepos.x, mousepos.y);
    };

    //Start the draw loop
    interval = setInterval(function() {
        loop();
        frame++;
    }, PERIOD);
}

function canvasToScene(cwidth, cheight, x, y) {
    return {
        x: (x - cwidth / 2.0) / cwidth * 2.0,
        y: (cheight / 2.0 - y) / cheight * 2.0
    };
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
	for (let i = 0; i < butterflyes.length; i++)
		butterflyes[i].update(frame);
	
}

function draw() {
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

	gl.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
	
	
	for (let i = 0; i < butterflyes.length; i++)
		butterflyes[i].draw(frame);
}
