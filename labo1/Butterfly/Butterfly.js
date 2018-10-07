class Butterfly {
	constructor(gl) {
		this.gl = gl;
        this.pos = mat4.create();
		this.body = new ButterflyBody();
		this.wingL = new ButterflyWingL();
		this.wingR = new ButterflyWingR();
		this.parts = [this.body, this.wingL, this.wingR];
	}

	update(frame) {
        //Rotate it to the
        //mat4.multiply(this.pos, mat4.create(), mat4.fromRotation(mat4.create(), Math.PI / 2, [0, 0, 1]));
        //Rotate with the time
        let rotation = mat4.create();
        mat4.fromRotation(rotation, frame*0.01, [0.3, 0.5, 0.1]);
        mat4.multiply(this.pos, mat4.create(), rotation);

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

        let partMat = mat4.create();
        mat4.multiply(partMat, this.pos, part.pos);
    	gl.uniformMatrix4fv(prg.mvMatrixUniform, false, partMat);

		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.vertexAttribPointer(prg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
		gl.vertexAttribPointer(prg.colorAttribute, 4, gl.FLOAT, false, 0, 0);
		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
		gl.drawElements(part.drawMode, part.vertices.length/3+1, gl.UNSIGNED_SHORT, 0);
	}
}