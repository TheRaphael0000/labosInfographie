let glContext = null;
let c_width = 0;
let c_height = 0;
let prg = null;

function degToRad(degrees) {
    return (degrees * Math.PI / 180.0);
}

/**
 * Allow to initialize Shaders.
 */
function getShader(gl, id) {
    let script = document.getElementById(id);
    if (!script) {
        return null;
    }

    let str = "";
    let k = script.firstChild;
    while (k) {
        if (k.nodeType == 3) {
            str += k.textContent;
        }
        k = k.nextSibling;
    }

    let shader;
    if (script.type == "x-shader/x-fragment") {
        shader = glContext.createShader(glContext.FRAGMENT_SHADER);
    } else if (script.type == "x-shader/x-vertex") {
        shader = glContext.createShader(glContext.VERTEX_SHADER);
    } else {
        return null;
    }

    glContext.shaderSource(shader, str);
    glContext.compileShader(shader);

    if (!glContext.getShaderParameter(shader, glContext.COMPILE_STATUS)) {
        alert(glContext.getShaderInfoLog(shader));
        return null;
    }
    return shader;
}

/**
 * The program contains a series of instructions that tell the Graphic Processing Unit (GPU)
 * what to do with every vertex and fragment that we transmit.
 * The vertex shader and the fragment shaders together are called through that program.
 */
function initProgram() {
    let fgShader = getShader(glContext, "shader-fs");
    let vxShader = getShader(glContext, "shader-vs");

    prg = glContext.createProgram();
    glContext.attachShader(prg, vxShader);
    glContext.attachShader(prg, fgShader);
    glContext.linkProgram(prg);

    if (!glContext.getProgramParameter(prg, glContext.LINK_STATUS)) {
        alert("Could not initialise shaders");
    }

    glContext.useProgram(prg);

    initShaderParameters(prg);

}

function requestAnimFrame(o) {
    requestAnimFrame(o);
}

/**
 * Provides requestAnimationFrame in a cross browser way.
 */
requestAnimFrame = (function() {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        window.oRequestAnimationFrame ||
        window.msRequestAnimationFrame ||
        function( /* function FrameRequestCallback */ callback, /* DOMElement Element */ element) {
            window.setTimeout(callback, 1000.0 / 60.0);
        };
})();

/**
 * Render Loop: frame rate and scene drawing.
 */
function renderLoop() {
    requestAnimFrame(renderLoop);
    drawScene();
}

/**
 * Verify that WebGL is supported by your machine
 */
function getGLContext(canvasName) {
    let canvas = document.getElementById(canvasName);
    if (canvas == null) {
        alert("there is no canvas on this page");
        return;
    } else {
        c_width = canvas.width;
        c_height = canvas.height;
    }

    let gl = null;
    let names = ["webgl",
        "experimental-webgl",
        "webkit-3d",
        "moz-webgl"
    ];

    for (let i = 0; i < names.length; i++) {
        try {
            gl = canvas.getContext(names[i]); // no blending

            //*** for transparency (Blending) ***
            //gl = canvas.getContext(names[i], {premultipliedAlpha: false});
            //gl.enable(gl.BLEND);
            //gl.blendEquation(gl.FUNC_ADD);
            //gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
        } catch (e) {}

        if (gl) break;
    }

    if (gl == null) {
        alert("WebGL is not available");
    } else {
        //alert("We got a WebGL context: "+names[i]);
        return gl;
    }
}



/**
 * The following code snippet creates a vertex buffer and binds the vertices to it.
 */
function getVertexBufferWithVertices(vertices) {
    let vBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(vertices), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);

    return vBuffer;
}

/**
 * The following code snippet creates a vertex buffer and binds the indices to it.
 */
function getIndexBufferWithIndices(indices) {
    let iBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, iBuffer);
    glContext.bufferData(glContext.ELEMENT_ARRAY_BUFFER, new Uint16Array(indices), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ELEMENT_ARRAY_BUFFER, null);

    return iBuffer;
}


function getArrayBufferWithArray(values) {
    //The following code snippet creates an array buffer and binds the array values to it
    let vBuffer = glContext.createBuffer();
    glContext.bindBuffer(glContext.ARRAY_BUFFER, vBuffer);
    glContext.bufferData(glContext.ARRAY_BUFFER, new Float32Array(values), glContext.STATIC_DRAW);
    glContext.bindBuffer(glContext.ARRAY_BUFFER, null);

    return vBuffer;
}


function initTextureWithImage(sFilename, texturen) {
    let anz = texturen.length;
    texturen[anz] = glContext.createTexture();

    texturen[anz].image = new Image();
    texturen[anz].image.onload = function() {
        glContext.bindTexture(glContext.TEXTURE_2D, texturen[anz]);
        glContext.pixelStorei(glContext.UNPACK_FLIP_Y_WEBGL, true);
        glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, texturen[anz].image);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
        glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);

        glContext.generateMipmap(glContext.TEXTURE_2D);

        glContext.bindTexture(glContext.TEXTURE_2D, null);
    }

    texturen[anz].image.src = sFilename;

    // let's use a canvas to make textures, with by default a random color (red, green, blue)
    function rnd() {
        return Math.floor(Math.random() * 256);
    }

    let c = document.createElement("canvas");
    c.width = 64;
    c.height = 64;
    let ctx = c.getContext("2d");
    let red = rnd();
    let green = rnd();
    let blue = rnd();
    ctx.fillStyle = "rgb(" + red + "," + green + "," + blue + ")";

    ctx.fillRect(0, 0, 64, 64);

    glContext.bindTexture(glContext.TEXTURE_2D, texturen[anz]);
    glContext.texImage2D(glContext.TEXTURE_2D, 0, glContext.RGBA, glContext.RGBA, glContext.UNSIGNED_BYTE, c);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MIN_FILTER, glContext.NEAREST);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_MAG_FILTER, glContext.NEAREST);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_S, glContext.CLAMP_TO_EDGE);
    glContext.texParameteri(glContext.TEXTURE_2D, glContext.TEXTURE_WRAP_T, glContext.CLAMP_TO_EDGE);
}

function calculateTangents(vs, tc, ind) {
    let i;
    let tangents = [];
    for (i = 0; i < vs.length / 3; i++) {
        tangents[i] = [0, 0, 0];
    }
    // Calculate tangents
    let a = [0, 0, 0],
        b = [0, 0, 0];
    let triTangent = [0, 0, 0];
    for (i = 0; i < ind.length; i += 3) {

        let i0 = ind[i + 0];
        let i1 = ind[i + 1];
        let i2 = ind[i + 2];

        let pos0 = [vs[i0 * 3], vs[i0 * 3 + 1], vs[i0 * 3 + 2]];
        let pos1 = [vs[i1 * 3], vs[i1 * 3 + 1], vs[i1 * 3 + 2]];
        let pos2 = [vs[i2 * 3], vs[i2 * 3 + 1], vs[i2 * 3 + 2]];

        let tex0 = [tc[i0 * 2], tc[i0 * 2 + 1]];
        let tex1 = [tc[i1 * 2], tc[i1 * 2 + 1]];
        let tex2 = [tc[i2 * 2], tc[i2 * 2 + 1]];

        vec3.subtract(pos1, pos0, a);
        vec3.subtract(pos2, pos0, b);

        let c2c1t = tex1[0] - tex0[0];
        let c2c1b = tex1[1] - tex0[1];
        let c3c1t = tex2[0] - tex0[0];
        let c3c1b = tex2[0] - tex0[1];

        triTangent = [c3c1b * a[0] - c2c1b * b[0], c3c1b * a[1] - c2c1b * b[1], c3c1b * a[2] - c2c1b * b[2]];

        vec3.add(tangents[i0], triTangent);
        vec3.add(tangents[i1], triTangent);
        vec3.add(tangents[i2], triTangent);
    }

    // Normalize tangents
    let ts = [];
    for (i = 0; i < tangents.length; i++) {
        let tan = tangents[i];
        vec3.normalize(tan);

        ts.push(tan[0]);
        ts.push(tan[1]);
        ts.push(tan[2]);

    }

    return ts;
}
