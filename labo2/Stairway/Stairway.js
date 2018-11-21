class Stairway {
	constructor(nbStairs, radius1, widthStair, nbStairsPerRound, height, sampling) {
		this.nbStairs = nbStairs;
		this.radius1 = radius1;
		this.widthStair = widthStair
		this.radius2 = radius1 + widthStair;
		this.nbStairsPerRound = nbStairsPerRound;
		this.height = height;
		this.sampling = sampling;

		this.angle = 2 * Math.PI / nbStairsPerRound;
		this.centerOfStairY = (this.radius2 + this.radius1) / 2;

		yPos = this.centerOfStairY;

		this.bottomIndex = 0;
		this.oldZpos = 0;

		this.staircase = [];
		this.generate();
	}

	generate() {
		let bottom;
		let top;
		if (this.nbStairs %2 == 0)
		{
			bottom = -this.nbStairs/2;
			top = this.nbStairs/2;
		}
		else
		{
			bottom = -Math.floor(this.nbStairs/2);
			top = Math.floor(this.nbStairs/2)+1;
		}
		for (let i = bottom; i < top; i++) { // create and arrange stairs to have the camera in the middle of them
			let stair = new Stair(this.radius1, this.radius2, this.angle, this.height, this.sampling);
			stair.rotateBy(i * this.angle);
			stair.translateBy(-i * this.height);
			this.staircase.push(stair);
		}
	}

	update(frame) {
		let theta;
		let positionOnTheStairY;

        const speedConstant = PERIOD / 1000; //i used the period to be relevent at any fps

		if (playerControl) {
			if (keyW)
				xzPos += xzSpeed_value * speedConstant;
			if (keyS)
				xzPos -= xzSpeed_value * speedConstant;
			if (keyA)
				yPos += xzSpeed_value * speedConstant;
			if (keyD)
				yPos -= xzSpeed_value * speedConstant;

			//Bounding ypos
			if (yPos > this.radius2)
				yPos = this.radius2;
			if (yPos < this.radius1)
				yPos = this.radius1;

			positionOnTheStairY = yPos;
		} else {
			positionOnTheStairY = this.centerOfStairY;
			xzPos += xzSpeed_value * speedConstant;
		}
		theta = xzPos + Math.PI; //theta == positon on the spiral

		//todo : move in the shader code and only link the theta when finish
		mvMatrix = mat4.create();
		let x = positionOnTheStairY * Math.cos(theta);
		let y = positionOnTheStairY * Math.sin(theta);
		let z = theta * this.nbStairsPerRound * this.height / (2 * Math.PI);

		mat4.rotate(mvMatrix, mvMatrix, Math.PI / 2 + yCamera, [1, 0, 0]);
		mat4.rotate(mvMatrix, mvMatrix, -theta - 2 * Math.PI / 8 - xCamera, [0, 0, 1]);
		mat4.translate(mvMatrix, mvMatrix, [x, y, z]);

		let delta = z-this.oldZpos;
		if(Math.abs(delta)>this.height)
		{
			this.oldZpos = z;
			if(delta>=0)
				this.shiftUp();
			else
				this.shiftDown();
		}
	}

	shiftUp(){
		this.staircase[this.bottomIndex].rotateBy(this.nbStairs * this.angle);
		this.staircase[this.bottomIndex].translateBy(-this.nbStairs * this.height);

		this.bottomIndex++;
		if(this.bottomIndex>=this.nbStairs)
			this.bottomIndex=0;
	}
	shiftDown(){
		let topIndex = this.bottomIndex-1;
		if(topIndex<0)
			topIndex = this.nbStairs-1;
		this.staircase[topIndex].rotateBy(-this.nbStairs * this.angle);
		this.staircase[topIndex].translateBy(this.nbStairs * this.height);

		this.bottomIndex--;
		if(this.bottomIndex<0)
			this.bottomIndex=this.nbStairs-1;
	}

	draw(frame) {
		let theta = xzPos + Math.PI;
		let z = theta * this.nbStairsPerRound * this.height / (2 * Math.PI);

		let bellowStairIndex = this.bottomIndex;
		let count =0;
		while(this.staircase[bellowStairIndex].currentZ<z && count<this.nbStairs)//render the stair bellow first
		{
			let stair = this.staircase[bellowStairIndex];
			stair.draw(frame);
			bellowStairIndex++;
			if(bellowStairIndex >= this.nbStairs)
				bellowStairIndex=0;
			count++;
		}

		let topStairIndex = this.bottomIndex-1;
		
		while(count<this.nbStairs)
		{
			if(topStairIndex<0)
			topStairIndex = this.nbStairs-1;

			let stair = this.staircase[topStairIndex];
			stair.draw(frame);

			topStairIndex--;
			count++;
		}
	}
}
