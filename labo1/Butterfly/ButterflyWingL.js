class ButterflyWingL {
	constructor(scale, sampleSize) {
        this.pos = mat4.create();
		let arr = ButterflyTools.getBasicWing(1, -1, true, scale, sampleSize);

        this.vertices = arr[0];
        this.colors = arr[1];
        this.indices = arr[2];

		this.drawMode = gl.TRIANGLE_STRIP;
	}

	update(frame) {
        let rotate = ButterflyTools.getWingRotationFromFrame(frame, true);
        mat4.multiply(this.pos, mat4.create(), rotate);
	}
}
