class ButterflyTools {
	static getBasicWing(coefx, coefy, swap) {
		const nb = 500; //sampling
		const step = 2 * Math.PI / nb;
		let vertices = [];
		let colors = [];
		let indices = [];

		for (let theta = 0; theta < 2 * Math.PI; theta += step) {
			//Polar wing function
			let r = Math.sin(theta + Math.sin(theta));
			//Polar to cartesian
			let x = r * Math.cos(theta);
			let y = r * Math.sin(theta);

			if (!swap)
				vertices.push(coefx * x, coefy * y, 0);
			else
				vertices.push(coefy * y, coefx * x, 0); // x = y symmetry

			colors.push(1, 0, 0, 1);
			colors.push(0, 0, 1, 1);
			indices.push(0);
			indices.push(indices.length);
		}
		return [vertices, colors, indices];
	}
}
