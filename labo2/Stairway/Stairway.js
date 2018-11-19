class Stairway {
	constructor(nbStairs, radius1, radius2, nbStairsPerRound, height, sampling) {
		this.nbStairs = nbStairs;
		this.radius1 = radius1;
		this.radius2 = radius2;
        this.nbStairsPerRound = nbStairsPerRound;
		this.height = height;
		this.sampling = sampling;

		this.angle = 2 * Math.PI / nbStairsPerRound;

        this.staircase = [];
		this.generate();
	}

	generate() {
        for(let i = 0; i < this.nbStairs; i++)
        {
            let stair = new Stair(this.radius1, this.radius2, this.angle, this.height, this.sampling);
            stair.rotateBy(i * this.angle);
            stair.translateBy(-i * this.height);
            this.staircase.push(stair);
        }
    }

	update(frame) {
        //todo : move in the shader code and only link the theta when finish
        mvMatrix = mat4.create();
        let theta = frame * PERIOD / 2000 - 1.25*Math.PI; //2000 = slow coef

        let c = this.radius2;
        let x = c * Math.cos(theta);
        let y = c * Math.sin(theta);

        mat4.rotate(mvMatrix, mvMatrix, Math.PI/2, [1,0,0]);
        mat4.rotate(mvMatrix, mvMatrix, -theta - 2*Math.PI/8, [0,0,1]);
        let h = 1//(theta / 2 * Math.PI) * (this.height * this.nbStairsPerRound);
        mat4.translate(mvMatrix, mvMatrix, [x, y, h]);

        // console.log(theta);
	}

	draw(frame) {
        for(let i = 0; i < this.nbStairs; i++)
        {
            let stair = this.staircase[i];
            stair.draw(frame);
        }
	}
}
