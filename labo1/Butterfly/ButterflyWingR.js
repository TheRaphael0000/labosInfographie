class ButterflyWingR {
	constructor(parent) {
		this.parent = parent;
        this.pos = mat4.create();
		let arr = ButterflyTools.getBasicWing(this.parent.color1, this.parent.color2, 1, 1, true, this.parent.scale, this.parent.sampleSize);

        this.vertices = arr[0];
        this.colors = arr[1];
        this.indices = arr[2];

		this.drawMode = gl.TRIANGLE_STRIP;
	}

	update(frame) {
        let rotate = ButterflyTools.getWingRotationFromFrame(frame, this.parent.angle, this.parent.speed,false);
        mat4.multiply(this.pos, mat4.create(), rotate);
	}
}
