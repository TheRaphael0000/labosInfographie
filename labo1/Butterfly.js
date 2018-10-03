class Butterfly {
	constructor(gl) {
		this.gl = gl;

		this.wing1Vertex = [];
		this.wing1Colors = [];
		this.wing1Indices = [];

		this.wing2Vertex = [];
		this.wing2Colors = [];
		this.wing2Indices = [];

		this.bodyVertex = [];
		this.bodyColors = [];
		this.bodyIndices = [];

		this.initParts();
	}

	initParts() {
		this.initWing1();
		this.initWing2();
		this.initBody();
	}

	initWing1() {
		this.wing1Vertex.push(0.1, 0, 0);
		this.wing1Vertex.push(1, 1, 0);
		this.wing1Vertex.push(1, -1, 0);
		this.wing1Colors.push(0, 0, 1, 1);
		this.wing1Colors.push(1, 0, 0, 1);
		this.wing1Colors.push(1, 0, 0, 1);
		this.wing1Indices.push(0, 1, 2);
	}

	initWing2() {
		this.wing2Vertex.push(-0.1, 0, 0);
		this.wing2Vertex.push(-1, 1, 0);
		this.wing2Vertex.push(-1, -1, 0);
		this.wing2Colors.push(0, 0, 1, 1);
		this.wing2Colors.push(1, 0, 0, 1);
		this.wing2Colors.push(1, 0, 0, 1);
		this.wing2Indices.push(0, 1, 2);
	}

	initBody() {
		this.bodyVertex.push(-0.2, -1, 0);
		this.bodyVertex.push(0.2, -1, 0);
		this.bodyVertex.push(-0.2, 1, 0);
		this.bodyVertex.push(0.2, 1, 0);
		this.bodyColors.push(0, 0, 1, 1);
		this.bodyColors.push(0, 0, 1, 1);
		this.bodyColors.push(0, 0, 1, 1);
		this.bodyColors.push(0, 0, 1, 1);
		this.bodyIndices.push(0, 1, 2, 1, 3);
	}

	draw() {
		this.drawPart(this.bodyVertex, this.bodyColors, this.bodyIndices);
		this.drawPart(this.wing1Vertex, this.wing1Colors, this.wing1Indices);
		this.drawPart(this.wing2Vertex, this.wing2Colors, this.wing2Indices);
	}

	drawPart(vertices, colors, indices) {
		let vertexBuffer = getBufferFromArrayElement(gl, gl.ARRAY_BUFFER, Float32Array, vertices);
		let colorBuffer = getBufferFromArrayElement(gl, gl.ARRAY_BUFFER, Float32Array, colors);
		let indexBuffer = getBufferFromArrayElement(gl, gl.ELEMENT_ARRAY_BUFFER, Uint16Array, indices);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(prg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.vertexAttribPointer(prg.colorAttribute, 4, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(gl.TRIANGLE_STRIP, indices.length, gl.UNSIGNED_SHORT, 0);
	}
}
