//class use among all the butterflies classes
class ButterflyTools {
    //generate a wing with colors and original rotation to be clipped on the butterfly on 0,0
    static getBasicWing(color1, color2, coefx, coefy, swap, scale, sampleSize=250) {
        let nb = sampleSize; //sampling : how many triangles per wing
        let step = 2 * Math.PI / nb;
        let vertices = [];
        let colors = [];
        let indices = [];

        //generating the wings with this polar function : f(x) = Sin[x + Sin[x]] and the converting into cartesian
        for (let theta = 0; theta < 2 * Math.PI; theta += step) {
            //Polar wing function
            let r = Math.sin(theta + Math.sin(theta));
            //Polar to cartesian
            let x = r * Math.cos(theta);
            let y = r * Math.sin(theta);

            if (!swap)
                vertices.push(coefx * x, coefy * y, 0);
            else
                vertices.push(coefy * y, coefx * x, 0); // x = y symmetry

            colors = colors.concat(color1);
            colors = colors.concat(color2);
            indices.push(0);
            indices.push(indices.length);
        }

        vec3.forEach(vertices, 0, 0, 0, vec3.scale, scale);

        return [vertices, colors, indices];
    }

    //return a matrix the whill do an animation for the butterfly wings
    static getWingRotationFromFrame(frame, angle, speed, inverse) {
        let rotate = mat4.create();
        let value = Math.sin(frame * speed);
        let angleRad = MathPlus.map(value, -1, 1, (inverse ? -1 : 1) * angle, (inverse ? 1 : -1) * angle);
        return mat4.fromRotation(rotate, angleRad, [0, 1, 0]);
    }
}
