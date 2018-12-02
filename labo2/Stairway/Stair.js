class Stair {
	constructor(radius1, radius2, theta, height, sampling) {
		this.radius1 = radius1;
		this.radius2 = radius2;
		this.theta = theta;
		this.height = height;
		this.sampling = sampling;

		let lengthInnerArc = 2 * Math.PI * this.radius1 * (2 * Math.PI / this.theta);
		let lengthOuterArc = 2 * Math.PI * this.radius2 * (2 * Math.PI / this.theta);
		let sumLengthArc = lengthInnerArc + lengthOuterArc;
		this.outerSampling = Math.floor((lengthOuterArc / sumLengthArc) * this.sampling); //sampling proporitonel to the length of the arc
		this.innerSampling = this.sampling - this.outerSampling; // remaining

		//this.pos = mat4.create();

		this.width = this.radius2 - this.radius1;

		let centerRadius = this.width / 2 + this.radius1;
		this.centerX = centerRadius * Math.cos(this.theta / 2);
		this.centerY = centerRadius * Math.sin(this.theta / 2);
		this.centerZ = this.height / 2;

		this.currentZ = 0;

		this.vertices = [];
		this.verticesBuff = gl.createBuffer();
		this.indices = [];
		this.indicesBuff = gl.createBuffer();
		this.texCoords = [];
		this.texCoordsBuff = gl.createBuffer();

        this.drawMethod = gl.TRIANGLE_STRIP;

		this.generate();

		gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, this.indicesBuff);
		gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, new Uint16Array(this.indices), gl.STATIC_DRAW);

		gl.bindBuffer(gl.ARRAY_BUFFER, this.texCoordsBuff);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.texCoords), gl.STATIC_DRAW);

		gl.enableVertexAttribArray(prg.textureCoord);
		gl.vertexAttribPointer(prg.textureCoord, 2, gl.FLOAT, false, 0, 0);
	}

	rotateBy(x) {
		vec3.forEach(this.vertices, 0, 0, 0, function(v) {
			vec3.rotateZ(v, v, [0, 0, 0], x)
		});
	}

	translateBy(x) {
		vec3.forEach(this.vertices, 0, 0, 0, function(v) {
			vec3.add(v, v, [0, 0, x])
		});
		this.currentZ -= x;
	}

	generate() {
		this.generateVertex();
		//generate the top sector
		let sectorIndicesTop = this.generateSector(0, 0, 1, 2, 3);
		//retangle 1
		this.indices.push(0);
		this.indices.push(1);
		this.indices.push(4);
		this.indices.push(5);
		//generate the bottom sector
		let sectorIndicesBottom = this.generateSector(this.height, 4, 5, 6, 7);
		//sew the inner part with the top and bottom arcs
		this.sewing(sectorIndicesTop[0], sectorIndicesBottom[0]);
		//retangle 2
		this.indices.push(7);
		this.indices.push(6);
		this.indices.push(3);
		this.indices.push(2);
		//sew the outer part with the top and bottom arcs
		this.sewing(sectorIndicesTop[1], sectorIndicesBottom[1]);
	}

	sewing(array1, array2) {
		for (let i = 0; i < Math.min(array1.length, array2.length); i++) {
			let i1 = array1[i];
			let i2 = array2[i];
			this.indices.push(i1);
			this.indices.push(i2);
		}
	}

	generateVertex() {
		let x1 = this.radius1 * Math.cos(this.theta);
		let x2 = this.radius2 * Math.cos(this.theta);
		let y1 = this.radius1 * Math.sin(this.theta);
		let y2 = this.radius2 * Math.sin(this.theta);

		//Top sector
		this.vertices.push(this.radius1, 0, 0); //0
		this.texCoords.push(0.0, 0.0);
		this.vertices.push(this.radius2, 0, 0); //1
		this.texCoords.push(1.0, 0.0);

		this.vertices.push(x2, y2, 0); //2
		this.texCoords.push(1.0, 1.0);
		this.vertices.push(x1, y1, 0); //3
		this.texCoords.push(0.0, 1.0);

		//Bottom sector
		this.vertices.push(this.radius1, 0, this.height); //4
		this.texCoords.push(0.0, 0.0);
		this.vertices.push(this.radius2, 0, this.height); //5
		this.texCoords.push(1.0, 0.0);

		this.vertices.push(x2, y2, this.height); //6
		this.texCoords.push(1.0, 1.0);
		this.vertices.push(x1, y1, this.height); //7
		this.texCoords.push(0.0, 1.0);
	}

	generateSector(z, a, b, c, d) {
		let centerPos = this.vertices.length / 3;
		this.vertices.push(this.centerX, this.centerY, z);
		this.texCoords.push(0.5, 0.5);

		let outerSector = [];
		let innerSector = [];

		// a - b
		{
			this.indices.push(a);
			this.indices.push(b);
		}

		// b - c : outer
		{
			let beforeSection = this.vertices.length / 3;
			for (let i = 0; i <= this.theta; i += this.theta / this.outerSampling) {
				let outerX = this.radius2 * Math.cos(i);
				let outerY = this.radius2 * Math.sin(i);
				this.vertices.push(outerX, outerY, z);
				this.texCoords.push(1, 1 / this.theta * i);
			}
			let afterSection = this.vertices.length / 3;
			for (let i = beforeSection; i < afterSection; i++) {
				this.indices.push(centerPos);
				this.indices.push(i);
				outerSector.push(i);
			}
		}


		// c - d
		{
			this.indices.push(c);
			this.indices.push(d);
		}

		// d - a : inner
		{
			let beforeSection = this.vertices.length / 3;
			for (let i = this.theta; i >= 0; i -= this.theta / this.innerSampling) {
				let innerX = this.radius1 * Math.cos(i);
				let innerY = this.radius1 * Math.sin(i);
				this.vertices.push(innerX, innerY, z);
				this.texCoords.push(0, 1 / this.theta * i);
			}
			let afterSection = this.vertices.length / 3;
			for (let i = beforeSection; i < afterSection; i++) {
				this.indices.push(centerPos);
				this.indices.push(i);
				innerSector.push(i);
			}
		}

		return [innerSector, outerSector];
	}

	update(frame) {
		let rotation = mat4.create();
		mat4.fromRotation(rotation, Math.PI * 0.005, [1, 3, 5]);
	}

	draw(frame) {
		gl.bindBuffer(gl.ARRAY_BUFFER, this.verticesBuff);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.DYNAMIC_DRAW); //dynamic_draw improve performance

		gl.vertexAttribPointer(prg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		gl.drawElements(this.drawMethod, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}
