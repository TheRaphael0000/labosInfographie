class ButterflyWingR {
	constructor() {
		this.vertices = [];
		this.vertices.push(0.1, 0, 0);
		this.vertices.push(1, 1, 0);
		this.vertices.push(1, -1, 0);

		this.colors = [];
		this.colors.push(0, 0, 1, 1);
		this.colors.push(1, 0, 0, 1);
		this.colors.push(1, 0, 0, 1);

		this.indices = [];
		this.indices.push(0, 1, 2);

		this.drawMode = gl.TRIANGLE_STRIP;
	}

	update(frame) {
	}
}
