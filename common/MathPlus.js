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
		return [Math.random(), Math.random(), Math.random(), 1];
	}

	static randomColorHue(hue, saturation, value) {
		let randomHue = MathPlus.randomInRange(hue);
		let randomSaturation = MathPlus.randomInRange(saturation);
		let randomValue = MathPlus.randomInRange(value);

		let rgb = MathPlus.HSVtoRGB(randomHue, randomSaturation, randomValue);
		return [rgb.r, rgb.g, rgb.b, 1];
	}

    //https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/Math/random#Getting_a_random_number_between_two_values
	static randomInRange(range) {
        let min = range[0];
        let max = range[1];
		return Math.random() * (max - min) + min;
	}

	//https://stackoverflow.com/questions/17242144/javascript-convert-hsb-hsv-color-to-rgb-accurately
	/* accepts parameters
	 * h  Object = {h:x, s:y, v:z}
	 * OR
	 * h, s, v
	 */
	static HSVtoRGB(h, s, v) {
		var r, g, b, i, f, p, q, t;
		if (arguments.length === 1) {
			s = h.s, v = h.v, h = h.h;
		}
		i = Math.floor(h * 6);
		f = h * 6 - i;
		p = v * (1 - s);
		q = v * (1 - f * s);
		t = v * (1 - (1 - f) * s);
		switch (i % 6) {
			case 0:
				r = v, g = t, b = p;
				break;
			case 1:
				r = q, g = v, b = p;
				break;
			case 2:
				r = p, g = v, b = t;
				break;
			case 3:
				r = p, g = q, b = v;
				break;
			case 4:
				r = t, g = p, b = v;
				break;
			case 5:
				r = v, g = p, b = q;
				break;
		}
		return {
			r: r,
			g: g,
			b: b
		};
	}
}
