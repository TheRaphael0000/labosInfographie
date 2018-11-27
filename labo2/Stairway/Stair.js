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

		this.vertices = [];
		this.indices = [];
        this.texCoords = [];

        this.texture = null;
        this.textureBASE64 = "data:image/png;base64," + "iVBORw0KGgoAAAANSUhEUgAAABAAAAAQCAYAAAAf8/9hAAAAAXNSR0IArs4c6QAAAARnQU1BAACxjwv8YQUAAAAJcEhZcwAADsQAAA7EAZUrDhsAAACFSURBVDhPY3wro/KfgQIANkAomRnKJQ28m/sXyYDim1BhIkGvOqYB77RUoLL4gdC1O3ADmKBicAAyDB9GBxgGgAHIO9gwFoDdACAAeQcZ4wI4DQABXM5GBngNIAbgNQAUyiCMD+A0ABRVyBgXwG4AMI6xYiyA4oRExaRMBoAbAOWTARgYAOATUzn0CE+YAAAAAElFTkSuQmCC";

		this.width = this.radius2 - this.radius1;

		let centerRadius = this.width / 2 + this.radius1;
		this.centerX = centerRadius * Math.cos(this.theta / 2);
		this.centerY = centerRadius * Math.sin(this.theta / 2);
		this.centerZ = this.height / 2;

		this.currentZ = 0;

		this.generate();
	}

    rotateBy(x){
        vec3.forEach(this.vertices, 0, 0, 0, function(v){vec3.rotateZ(v, v, [0,0,0], x)});
    }

    translateBy(x){
		vec3.forEach(this.vertices, 0, 0, 0, function(v){vec3.add(v, v, [0,0,x])});
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

        this.loadTexture();
		bindBufferWithData(gl.ELEMENT_ARRAY_BUFFER, Uint16Array, this.indices);
        bindBufferWithData(gl.ARRAY_BUFFER, Float32Array, this.texCoords);
	}

    loadTexture() {
        const texture = gl.createTexture();

        const level = 0;
        const internalFormat = gl.RGBA;
        const width = 1;
        const height = 1;
        const border = 0;
        const srcFormat = gl.RGBA;
        const srcType = gl.UNSIGNED_BYTE;

        const image = new Image();
        image.onload = function() {
          gl.bindTexture(gl.TEXTURE_2D, texture);
          gl.texImage2D(gl.TEXTURE_2D, level, internalFormat, srcFormat, srcType, image);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
          gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
        };
        image.src = this.textureBASE64;

        gl.activeTexture(gl.TEXTURE0);
        gl.bindTexture(gl.TEXTURE_2D, texture);
        gl.uniform1i(prg.uSampler, 0);
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
		this.vertices.push(this.radius2, 0, 0); //1

		this.vertices.push(x2, y2, 0); //2
		this.vertices.push(x1, y1, 0); //3

		//Bottom sector
		this.vertices.push(this.radius1, 0, this.height); //4
		this.vertices.push(this.radius2, 0, this.height); //5

		this.vertices.push(x2, y2, this.height); //6
		this.vertices.push(x1, y1, this.height); //7
	}

	generateSector(z, a, b, c, d) {
		let centerPos = this.vertices.length / 3;
		this.vertices.push(this.centerX, this.centerY, z);

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
        mat4.fromRotation(rotation, Math.PI * 0.005, [1,3,5]);
	}

	draw(frame) {
		bindBufferWithData(gl.ARRAY_BUFFER, Float32Array, this.vertices);
        //

		gl.vertexAttribPointer(prg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);

		// gl.drawElements(gl.LINE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0);
		// gl.drawElements(gl.POINTS, this.indices.length, gl.UNSIGNED_SHORT, 0);
		gl.drawElements(gl.TRIANGLE_STRIP, this.indices.length, gl.UNSIGNED_SHORT, 0);
	}
}
