class ButterflyTools {
    static getBasicWing(coefx, coefy, swap, scale, sampleSize=250) {
        const nb = sampleSize; //sampling
        const step = 2 * Math.PI / nb;
        let vertices = [];
        let colors = [];
        let indices = [];

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

            colors.push(1, 0, 0, 1);
            colors.push(0, 0, 1, 1);
            indices.push(0);
            indices.push(indices.length);
        }

        vec3.forEach(vertices, 0, 0, 0, vec3.scale, scale);
        return [vertices, colors, indices];
    }

    static getWingRotationFromFrame(frame, inverse) {
        let rotate = mat4.create();
        let angle = Math.PI / 3.5;
        let speed = 0.1;
        let value = Math.sin(frame * speed);
        let angleRad = MathPlus.map(value, -1, 1, (inverse ? -1 : 1) * angle, (inverse ? 1 : -1) * angle);
        return mat4.fromRotation(rotate, angleRad, [0, 1, 0]);
    }
}
