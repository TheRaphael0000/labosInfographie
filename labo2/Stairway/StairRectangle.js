class StairRectangle {
    constructor(parent, angle) {
        this.parent = parent;
        this.angle = angle;

        this.vertices = [];
        this.colors = [];
        this.indices = [];

        this.generate();
    }

    generate() {
        let x1 = this.parent.radius1 * Math.cos(this.angle);
        let x2 = this.parent.radius2 * Math.cos(this.angle);
        let y1 = this.parent.radius1 * Math.sin(this.angle);
        let y2 = this.parent.radius2 * Math.sin(this.angle);

        this.vertices.push(x1, y1, 0);
        this.vertices.push(x2, y2, 0);
        this.vertices.push(x1, y1, this.parent.height);
        this.vertices.push(x2, y2, this.parent.height);

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

        gl.drawElements(gl.TRIANGLE_STRIP, this.vertices.length / 3, gl.UNSIGNED_SHORT, 0);
    }
}
