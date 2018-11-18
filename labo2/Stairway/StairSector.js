class StairSector {
    constructor(parent, y) {
        this.parent = parent;
        this.y = y;

        this.vertices = [];
        this.colors = [];
        this.indices = [];

        this.generate();
    }

    generate() {
        //Start the fan from the center
		this.vertices.push(this.parent.centerX, this.parent.centerY, this.y);

		for (let i = 0; i <= this.parent.theta; i += this.parent.theta / this.parent.sampling) {
			let innerX = this.parent.radius1 * Math.cos(i);
			let innerY = this.parent.radius1 * Math.sin(i);
			this.vertices.push(innerX, innerY, this.y);
		}

		//in the reverse odrer to start from the top
		for (let i = this.parent.theta; i >= 0; i -= this.parent.theta / this.parent.sampling) {
			let outerX = this.parent.radius2 * Math.cos(i);
			let outerY = this.parent.radius2 * Math.sin(i);
			this.vertices.push(outerX, outerY, this.y);
		}

		this.vertices.push(this.parent.radius1, 0, this.y); //To close the shape

		for (let i = 0; i < this.vertices.length; i++) {
			this.colors.push(1, 0, 0, 1);
			this.indices.push(this.indices.length);
		}
    }

    draw() {
        let vertexBuffer = getBufferFromArrayElement(gl, gl.ARRAY_BUFFER, Float32Array, this.vertices);
        let colorBuffer = getBufferFromArrayElement(gl, gl.ARRAY_BUFFER, Float32Array, this.colors);
        let indexBuffer = getBufferFromArrayElement(gl, gl.ELEMENT_ARRAY_BUFFER, Uint16Array, this.indices);

        gl.uniformMatrix4fv(prg.mvMatrixUniform, false, this.parent.pos);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(prg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(prg.colorAttribute, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);

        gl.drawElements(gl.TRIANGLE_FAN, this.vertices.length / 3, gl.UNSIGNED_SHORT, 0);
    }
}
