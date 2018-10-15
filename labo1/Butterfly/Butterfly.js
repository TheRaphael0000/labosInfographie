class Butterfly {
    constructor(gl, sampleSize, scale = 0.2) {
        //graphic context
        this.gl = gl;

        //config of the butterfly
        this.sampleSize = sampleSize;
        this.scale = scale; //size of the butterfly
        this.lerp = 0.15; //
        this.angle = Math.PI / 3.5; //wings angle
        this.speed = 0.1; //wings speed

        //generating colorful butterflies colors
        this.color1 = MathPlus.randomColorHue([0.0, 1.0], [0.9, 1.0], [0.6, 1.0]); //light color
        this.color2 = MathPlus.randomColorHue([0.0, 1.0], [0.9, 1.0], [0.0, 0.4]); //dark color

        if(Math.random() > 0.5) //swap randomly between the light and dark color
            this.color1 = [this.color2, this.color2 = this.color1][0];

        //x, y are the actual position which are slowly lerped to the real position
        this.x = 0;
        this.y = 0;
        //dstx and dsty are the cursor position
        this.dstX = 0;
        this.dstY = 0;

        this.pos = mat4.create();
        this.translate = mat4.create();
        this.rotate = mat4.create();

        //assembling the butterfly with subclasses, giving this (the parent to load properties)
        this.body = new ButterflyBody(this);
        this.wingL = new ButterflyWing(this, true);
        this.wingR = new ButterflyWing(this, false);
        this.parts = [this.body, this.wingL, this.wingR];
    }

    //function call every frame with the frame number to do the peridicals animations
    update(frame) {
        //Lerp to destination
        this.x = MathPlus.lerp(this.x, this.dstX, this.lerp);
        this.y = MathPlus.lerp(this.y, this.dstY, this.lerp);
        mat4.fromTranslation(this.translate, [this.x, this.y, 0]);

        //Permanant rotation
        this.rotation = mat4.create();
        mat4.fromRotation(this.rotation, frame * 0.04, [0.3, 0.5, 0.1]);

        //Apply transformations
        this.applyTransform();

        for (let i = 0; i < this.parts.length; i++)
            this.parts[i].update(frame);
    }

    //do the maths
    applyTransform() {
        this.pos = mat4.create(); //reset the matrix and apply the current transformations
        mat4.multiply(this.pos, this.pos, this.translate);
        mat4.multiply(this.pos, this.pos, this.rotation);
    }

    //draw every part
    draw() {
        for (let i = 0; i < this.parts.length; i++)
            this.drawPart(this.parts[i]);
    }

    //draw a part with webgl
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

    //double setter for the position
    setDstPos(x, y) {
        this.dstX = x;
        this.dstY = y;
    }
}
