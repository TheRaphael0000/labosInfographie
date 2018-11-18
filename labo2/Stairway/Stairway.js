class Stairway {
	constructor(nbStairs, radius1, radius2, angle, height, sampling) {
		this.nbStairs = nbStairs;
		this.radius1 = radius1;
		this.radius2 = radius2;
		this.angle = angle;
		this.height = height;
		this.sampling = sampling;

        this.staircase = [];
		this.generate();
	}

	generate() {
        for(let i = 0; i < this.nbStairs; i++)
        {
            let stair = new Stair(this.radius1, this.radius2, this.angle, this.height, this.sampling)
            this.staircase.push(stair);
        }
    }

	update(frame) {
        for(let i = 0; i < this.nbStairs; i++)
        {
            let stair = this.staircase[i];
            stair.update(frame);
        }
	}

	draw(frame) {
        for(let i = 0; i < this.nbStairs; i++)
        {
            let stair = this.staircase[i];
            stair.draw(frame);
        }
	}
}
