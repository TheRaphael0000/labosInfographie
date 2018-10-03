class ButterflyBody {
	constructor() {
		this.vertices = [];
		this.vertices.push(-0.2, -1, 0);
		this.vertices.push(0.2, -1, 0);
		this.vertices.push(-0.2, 1, 0);
		this.vertices.push(0.2, 1, 0);

		this.colors = [];
		this.colors.push(0, 0, 1, 1);
		this.colors.push(0, 0, 1, 1);
		this.colors.push(0, 0, 1, 1);
		this.colors.push(0, 0, 1, 1);

		this.indices = [];
		this.indices.push(0, 1, 2, 1, 3);

		this.drawMode = gl.TRIANGLE_STRIP;
	}

	update(frame) {

	}
}
