class Butterfly {
    constructor(gl, sampleSize, scale = 0.2) {
        this.scale = scale;
        this.gl = gl;
        this.x = 0;
        this.y = 0;
        this.dstX = 0;
        this.dstY = 0;
        this.pos = mat4.create();
        this.translate = mat4.create();
        this.rotate = mat4.create();

        this.color1 = MathPlus.randomColor();
        this.color2 = MathPlus.randomColor();

        this.body = new ButterflyBody(this.color1, this.color2, this.scale);
        this.wingL = new ButterflyWingL(this.color1, this.color2, this.scale, sampleSize);
        this.wingR = new ButterflyWingR(this.color1, this.color2, this.scale, sampleSize);
        this.parts = [this.body, this.wingL, this.wingR];
    }

    update(frame) {
        //Lerp to destination
        this.x = MathPlus.lerp(this.x, this.dstX, 0.15);
        this.y = MathPlus.lerp(this.y, this.dstY, 0.15);
        mat4.fromTranslation(this.translate, [this.x, this.y, 0]);

        //Permanant rotation
        this.rotation = mat4.create();
        mat4.fromRotation(this.rotation, frame * 0.01, [0.3, 0.5, 0.1]);

        //Apply transformations
        this.applyTransform();

        for (let i = 0; i < this.parts.length; i++)
            this.parts[i].update(frame);
    }

    applyTransform() {
        this.pos = mat4.create();
        mat4.multiply(this.pos, this.pos, this.translate);
        mat4.multiply(this.pos, this.pos, this.rotation);
    }

    draw() {
        for (let i = 0; i < this.parts.length; i++)
            this.drawPart(this.parts[i]);
    }

    drawPart(part) {
        let vertexBuffer = getBufferFromArrayElement(gl, gl.ARRAY_BUFFER, Float32Array, part.vertices);
        let colorBuffer = getBufferFromArrayElement(gl, gl.ARRAY_BUFFER, Float32Array, part.colors);
        let indexBuffer = getBufferFromArrayElement(gl, gl.ELEMENT_ARRAY_BUFFER, Uint16Array, part.indices);

        let partMat = mat4.create();
        mat4.multiply(partMat, this.pos, part.pos);
        gl.uniformMatrix4fv(prg.mvMatrixUniform, false, partMat);

        gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
        gl.vertexAttribPointer(prg.vertexPositionAttribute, 3, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(prg.colorAttribute, 4, gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
        gl.drawElements(part.drawMode, part.vertices.length / 3 + 1, gl.UNSIGNED_SHORT, 0);
    }

    setDstPos(x, y) {
        this.dstX = x;
        this.dstY = y;
    }
}
