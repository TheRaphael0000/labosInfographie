let vertexBuffer = null;
let indexBuffer = null;
let colorBuffer = null;

let indices = [];
let vertices = [];
let colors = [];
let mvMatrix = mat4.create();
let pMatrix = mat4.create();

let wing1Vertex = [];
let wing2Vertex = [];
let bodyVertex = [];

let wing1Colors = [];
let wing2Colors = [];
let bodyColors = [];

let wing1Indices = [];
let wing2Indices = [];
let bodyIndices = [];

function initWebGL() {
    glContext = getGLContext('webgl-canvas');
    initProgram();
    initParts();
    renderLoop();
}

function initShaderParameters(prg) {
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
    prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);
    prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');
}

function initParts() {
    initWing1();
    initWing2();
    initBody();
}

function initWing1() {
    wing1Vertex.push(0.1, 0, 0);
    wing1Vertex.push(1, 1, 0);
    wing1Vertex.push(1, -1, 0);
    wing1Colors.push(0, 0, 1, 1);
    wing1Colors.push(1, 0, 0, 1);
    wing1Colors.push(1, 0, 0, 1);
    wing1Indices.push(0, 1, 2);
}

function initWing2() {
    wing2Vertex.push(-0.1, 0, 0);
    wing2Vertex.push(-1, 1, 0);
    wing2Vertex.push(-1, -1, 0);
    wing2Colors.push(0, 0, 1, 1);
    wing2Colors.push(1, 0, 0, 1);
    wing2Colors.push(1, 0, 0, 1);
    wing2Indices.push(0, 1, 2);
}

function initBody() {
    bodyVertex.push(-0.2, -1, 0);
    bodyVertex.push(0.2, -1, 0);
    bodyVertex.push(-0.2, 1, 0);
    bodyVertex.push(0.2, 1, 0);
    bodyColors.push(0, 0, 1, 1);
    bodyColors.push(0, 0, 1, 1);
    bodyColors.push(0, 0, 1, 1);
    bodyColors.push(0, 0, 1, 1);
    bodyIndices.push(0, 1, 2, 1, 3);
}

function drawScene() {
    glContext.clearColor(0.9, 0.9, 0.9, 1);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
    drawPart(bodyVertex, bodyColors, bodyIndices);
    drawPart(wing1Vertex, wing1Colors, wing1Indices);
    drawPart(wing2Vertex, wing2Colors, wing2Indices);
}

function drawPart(vertices, colors, indices) {
    vertexBuffer = getVertexBufferWithVertices(vertices);
    colorBuffer = getVertexBufferWithVertices(colors);
    indexBuffer = getIndexBufferWithIndices(indices);
    //glContext.enable(glContext.DEPTH_TEST);
    glContext.viewport(0, 0, c_width, c_height);
    mat4.identity(pMatrix);
    mat4.identity(mvMatrix);
    glContext.uniformMatrix4fv(prg.pMatrixUniform, false, pMatrix);
    glContext.uniformMatrix4fv(prg.mvMatrixUniform, false, mvMatrix);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vertexBuffer);
    glContext.vertexAttribPointer(prg.vertexPositionAttribute, 3, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, colorBuffer);
    glContext.vertexAttribPointer(prg.colorAttribute, 4, glContext.FLOAT, false, 0, 0);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, indexBuffer);
    glContext.drawElements(glContext.TRIANGLE_STRIP, indices.length, glContext.UNSIGNED_SHORT, 0);

}
