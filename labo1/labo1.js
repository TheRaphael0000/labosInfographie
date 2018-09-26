var vertexBuffer = null;
var indexBuffer = null;
var colorBuffer = null;
var indices = [];
var vertices = [];
var colors = [];
var mvMatrix = mat4.create();
var pMatrix = mat4.create();

function initShaderParameters(prg) {
    prg.vertexPositionAttribute = glContext.getAttribLocation(prg, "aVertexPosition");
    glContext.enableVertexAttribArray(prg.vertexPositionAttribute);
    prg.colorAttribute = glContext.getAttribLocation(prg, "aColor");
    glContext.enableVertexAttribArray(prg.colorAttribute);
    prg.pMatrixUniform = glContext.getUniformLocation(prg, 'uPMatrix');
    prg.mvMatrixUniform = glContext.getUniformLocation(prg, 'uMVMatrix');
}

function initBuffers() {
    vertices.push(-1.0, -1.0, 0.0);
    vertices.push(1.0, -1.0, 0.0);
    vertices.push(0.0, 1.0, 0.0);
    colors.push(1.0, 0.0, 0.0, 1.0);
    colors.push(0.0, 1.0, 0.0, 1.0);
    colors.push(0.0, 0.0, 1.0, 1.0);
    indices.push(0, 1, 2);
    vertexBuffer = getVertexBufferWithVertices(vertices);
    colorBuffer = getVertexBufferWithVertices(colors);
    indexBuffer = getIndexBufferWithIndices(indices);
}

function drawScene() {
    glContext.clearColor(0.9, 0.9, 0.9, 1.0);
    glContext.enable(glContext.DEPTH_TEST);
    glContext.clear(glContext.COLOR_BUFFER_BIT | glContext.DEPTH_BUFFER_BIT);
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

function initWebGL() {
    glContext = getGLContext('webgl-canvas');
    initProgram();
    initBuffers();
    renderLoop();
}
