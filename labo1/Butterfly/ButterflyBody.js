class ButterflyBody {
	constructor() {
        this.pos = mat4.create();
		let width = 0.3;
		let height = 1.7;

		const nb = 40; //sampling
		const step = 2 * Math.PI / nb;
		this.vertices = [];
		this.colors = [];
		this.indices = [];

		this.vertices.push(0, 0, 0);
		this.colors.push(230/255.0, 0, 98/255.0, 1);
		this.indices.push(0);

		for (let theta = 0; theta < 2 * Math.PI; theta += step) {
			//Polar circle function
			let r = Math.sin(theta);
			//Polar to cartesian adding coef on x and y to reshape the circle like an oval
			let x = width * r * Math.cos(theta);
			let y = height * r * Math.sin(theta) - height / 2;

			this.vertices.push(x, y, 0); // x = y symmetry
			this.colors.push(0, 0, 1, 1);
			this.indices.push(this.indices.length-1);
			this.indices.push(0);
		}

		this.drawMode = gl.TRIANGLE_STRIP;
	}

	update(frame) {

	}
}
