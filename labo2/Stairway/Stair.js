class Stair {
	constructor(radius1, radius2, theta, height, sampling) {
		this.radius1 = radius1;
		this.radius2 = radius2;
		this.theta = theta;
		this.height = height;
		this.sampling = sampling;

		this.pos = mat4.create();
		this.rotation = mat4.create();
		this.translation = mat4.create();

        mat4.fromRotation(this.rotation, 2*Math.PI/ 6, [4,0,0]);

		this.width = this.radius2 - this.radius1;

		let centerRadius = this.width / 2 + this.radius1;
		this.centerX = centerRadius * Math.cos(this.theta / 2);
		this.centerY = centerRadius * Math.sin(this.theta / 2);
        this.centerZ = this.height / 2;

        this.parts = [];

		this.generate();
	}

	generate() {
        this.parts.push(new StairRectangle(this, this.theta));
        this.parts.push(new StairSector(this, 0));
        this.parts.push(new StairSector(this, this.height));
        this.parts.push(new StairRectangle(this, 0));
	}

	update(frame) {
		mat4.fromRotation(this.rotation, frame * 0.005, [0.3, 0, 0]);

		this.applyTransform();
	}

	applyTransform() {
        this.pos = mat4.create();
        mat4.multiply(this.pos, this.pos, this.rotation);
    }

	draw() {
        for(let i = 0; i < this.parts.length; i++)
        {
            let part = this.parts[i];
            part.draw();
        }
	}
}
