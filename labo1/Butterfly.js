class Butterfly {
	constructor(gl) {
		this.gl = gl;
		this.body = new ButterflyBody();
		this.wingL = new ButterflyWingL();
		this.wingR = new ButterflyWingR();
		this.parts = [this.body, this.wingL, this.wingR];
	}

	update(frame) {
		for (let i = 0; i < this.parts.length; i++)
			this.parts[i].update(frame);
	}

	draw() {
		for (let i = 0; i < this.parts.length; i++)
			this.drawPart(this.parts[i]);
	}

	drawPart(part) {
		let vertexBuffer = getBufferFromArrayElement(gl, gl.ARRAY_BUFFER, Float32Array, part.vertices);
		let colorBuffer = getBufferFromArrayElement(gl, gl.ARRAY_BUFFER, Float32Array, part.colors);
		let indexBuffer = getBufferFromArrayElement(gl, gl.ELEMENT_ARRAY_BUFFER, Uint16Array, part.indices);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(prg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.vertexAttribPointer(prg.colorAttribute, 4, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(part.drawMode, part.vertices.length/3+1, gl.UNSIGNED_SHORT, 0);
	}
}
