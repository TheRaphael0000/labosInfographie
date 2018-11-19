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
        let theta;
        let positionOnTheStairY;

        if(playerControl)
        {
            //Bounding ypos
            if(yPos > this.radius2)
                yPos = this.radius2;
            if(yPos < this.radius1)
                yPos = this.radius1;

            positionOnTheStairY = yPos;
            theta = xzPos * PERIOD / 2000 + 5*Math.PI / 8;
            frame = xzPos;
        }
        else
        {
            positionOnTheStairY = (this.radius2 + this.radius1) / 2;
            theta = frame * PERIOD / 2000 + 5*Math.PI / 8;//2000 = slow coef
            xzPos = frame;
        }

        //todo : move in the shader code and only link the theta when finish
        mvMatrix = mat4.create();
        let x = positionOnTheStairY * Math.cos(theta);
        let y = positionOnTheStairY * Math.sin(theta);
        let z = theta * this.nbStairsPerRound * this.height / (2 * Math.PI);

        mat4.rotate(mvMatrix, mvMatrix, Math.PI/2 + yCamera, [1,0,0]);
        mat4.rotate(mvMatrix, mvMatrix, -theta - 2*Math.PI/8 - xCamera, [0,0,1]);
        mat4.translate(mvMatrix, mvMatrix, [x, y, z]);
	}

	draw(frame) {
        for(let i = 0; i < this.nbStairs; i++)
        {
            let stair = this.staircase[i];
            stair.draw(frame);
        }
	}
}
