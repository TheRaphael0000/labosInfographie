class ButterflyWingR {
	constructor() {
		let arr = ButterflyTools.getBasicWing(1, 1, true);

        this.vertices = arr[0];
        this.colors = arr[1];
        this.indices = arr[2];

		this.drawMode = gl.TRIANGLE_STRIP;
	}

	update(frame) {
	}
}
