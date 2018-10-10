class ButterflyBody {
	constructor(color1, color2, scale) {
        this.pos = mat4.create();
		let width = 0.3;
		let height = 1.7;

		const nb = 40; //sampling
		const step = 2 * Math.PI / nb;
		this.vertices = [];
		this.colors = [];
		this.indices = [];

		this.vertices.push(0, 0, 0);
		this.colors.concat(color1); //concat merge the two array (push the values)
		this.indices.push(0);

		for (let theta = 0; theta < 2 * Math.PI; theta += step) {
			//Polar circle function
			let r = Math.sin(theta);
			//Polar to cartesian adding coef on x and y to reshape the circle like an oval
			let x = width * r * Math.cos(theta);
			let y = height * r * Math.sin(theta) - height / 2;

			this.vertices.push(x, y, 0); // x = y symmetry
			this.colors.concat(color2);
			this.indices.push(this.indices.length-1);
			this.indices.push(0);
		}

		vec3.forEach(this.vertices, 0, 0, 0, vec3.scale, scale);

		this.drawMode = gl.TRIANGLE_STRIP;
	}

	update(frame) {

	}
}
