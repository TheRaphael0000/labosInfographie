class ButterflyWing {
    //side true : left, false : right
    constructor(parent, side) {
        this.side = side;

        this.parent = parent;
        this.pos = mat4.create();
        let arr = ButterflyTools.getBasicWing(this.parent.color1, this.parent.color2, 1, this.side?-1:1, true, this.parent.scale, this.parent.sampleSize);

        this.vertices = arr[0];
        this.colors = arr[1];
        this.indices = arr[2];

        this.drawMode = gl.TRIANGLE_STRIP;
    }

    //get rotatation matrix for the wing and apply it 
    update(frame) {
        let rotate = ButterflyTools.getWingRotationFromFrame(frame, this.parent.angle, this.parent.speed, this.side);
        mat4.multiply(this.pos, mat4.create(), rotate);
    }
}
