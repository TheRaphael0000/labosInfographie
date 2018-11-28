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

		this.texture = null;

		this.textureBASE64 = "data:image/png;base64," + "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAACFSURBVDhPY3wro/KfgQIANkAomRnKJQ28m/sXyYDim1BhIkGvOqYB77RUoLL4gdC1O3ADmKBicAAyDB9GBxgGgAHIO9gwFoDdACAAeQcZ4wI4DQABXM5GBngNIAbgNQAUyiCMD+A0ABRVyBgXwG4AMI6xYiyA4oRExaRMBoAbAOWTARgYAOATUzn0CE+YAAAAAElFTkSuQmCC";
		this.loadTexture();

		yPos = this.centerOfStairY;

		this.bottomIndex = 0;
		this.oldZpos = 0;

		this.staircase = [];
		this.generate();
	}

	/**
	 * generate stairs and place them so that the camera is placed in a position where he can see a maximum of stairs
	 */
	generate() {
		let bottom;
		let top;

		let artificialOffset = Math.floor(this.nbStairs / 6); // due to perspective, placing the camera right in the middle of stairs will often show
		// a truncated stair at the top and a full one at the bottom
		// to optimise this, an offset to the position of the stairs is introduced

		if (this.nbStairs % 2 == 0) {
			bottom = -this.nbStairs / 2 + artificialOffset;
			top = this.nbStairs / 2 + artificialOffset;
		} else {
			bottom = -Math.floor(this.nbStairs / 2) + artificialOffset;
			top = Math.floor(this.nbStairs / 2) + 1 + artificialOffset;
		}
		for (let i = bottom; i < top; i++) { // create and arrange stairs
			let stair = new Stair(this.radius1, this.radius2, this.angle, this.height, this.sampling);
			stair.rotateBy(i * this.angle);
			stair.translateBy(-i * this.height);
			this.staircase.push(stair);
		}
	}

	loadTexture() {
		const texture = gl.createTexture();
		const image = new Image();
		image.onload = function() {
			gl.bindTexture(gl.TEXTURE_2D, texture);
			gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
			gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
			gl.activeTexture(gl.TEXTURE0);
			gl.uniform1i(prg.uSampler, 0);
		};
		image.src = this.textureBASE64;
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

		let delta = z - this.oldZpos;
		if (Math.abs(delta) > this.height) {
			this.oldZpos = z;
			if (delta >= 0)
				this.shiftUp();
			else
				this.shiftDown();
		}
	}

	shiftUp() {
		this.staircase[this.bottomIndex].rotateBy(this.nbStairs * this.angle);
		this.staircase[this.bottomIndex].translateBy(-this.nbStairs * this.height);

		this.bottomIndex++;
		if (this.bottomIndex >= this.nbStairs)
			this.bottomIndex = 0;
	}

	shiftDown() {
		let topIndex = this.bottomIndex - 1;
		if (topIndex < 0)
			topIndex = this.nbStairs - 1;
		this.staircase[topIndex].rotateBy(-this.nbStairs * this.angle);
		this.staircase[topIndex].translateBy(this.nbStairs * this.height);

		this.bottomIndex--;
		if (this.bottomIndex < 0)
			this.bottomIndex = this.nbStairs - 1;
	}

	draw(frame) {
		let theta = xzPos + Math.PI;
		let z = theta * this.nbStairsPerRound * this.height / (2 * Math.PI);

		let bellowStairIndex = this.bottomIndex;
		let count = 0;
		while (this.staircase[bellowStairIndex].currentZ < z && count < this.nbStairs) //render the stair bellow first
		{
			let stair = this.staircase[bellowStairIndex];
			stair.draw(frame);
			bellowStairIndex++;
			if (bellowStairIndex >= this.nbStairs)
				bellowStairIndex = 0;
			count++;
		}

		let topStairIndex = this.bottomIndex - 1;

		while (count < this.nbStairs) {
			if (topStairIndex < 0)
				topStairIndex = this.nbStairs - 1;

			let stair = this.staircase[topStairIndex];
			stair.draw(frame);

			topStairIndex--;
			count++;
		}
	}
}