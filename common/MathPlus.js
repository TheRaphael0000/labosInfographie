class MathPlus {
    //https://github.com/processing/p5.js/blob/master/src/math/calculation.js line 461
    static map(n, start1, stop1, start2, stop2) {
        return ((n - start1) / (stop1 - start1)) * (stop2 - start2) + start2;
    }

    //https://en.wikipedia.org/wiki/Linear_interpolation#Programming_language_support
    static lerp(v0, v1, t) {
        return (1 - t) * v0 + t * v1;
    }

    static randomColor() {
        return [this.randomColorComposante(), this.randomColorComposante(), this.randomColorComposante(), 1];
    }

    static randomColorComposante() {
        return Math.floor(Math.random() * 255);
    }
}
