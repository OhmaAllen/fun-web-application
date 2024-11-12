const canvas = document.getElementById("webgl-canvas");
const gl = canvas.getContext("webgl");

if (!gl) {
    alert("WebGL not supported in this browser.");
}

let lineWidth = 1.0;
let points = [0.0, 0.0];  // Starting with one point

function initShaders() {
    const vertexShaderSource = `
        attribute vec2 a_position;
        void main() {
            gl_Position = vec4(a_position, 0, 1);
        }
    `;
    const fragmentShaderSource = `
        precision mediump float;
        void main() {
            gl_FragColor = vec4(1, 0, 0, 1);  // Red color
        }
    `;

    const vertexShader = createShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = createShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);
    gl.useProgram(program);
    gl.program = program;
}

function createShader(gl, type, source) {
    const shader = gl.createShader(type);
    gl.shaderSource(shader, source);
    gl.compileShader(shader);
    return shader;
}

function createProgram(gl, vertexShader, fragmentShader) {
    const program = gl.createProgram();
    gl.attachShader(program, vertexShader);
    gl.attachShader(program, fragmentShader);
    gl.linkProgram(program);
    return program;
}

function render() {
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.lineWidth(lineWidth);
    const positionBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(points), gl.STATIC_DRAW);
    const positionLocation = gl.getAttribLocation(gl.program, "a_position");
    gl.enableVertexAttribArray(positionLocation);
    gl.vertexAttribPointer(positionLocation, 2, gl.FLOAT, false, 0, 0);
    gl.drawArrays(gl.LINE_STRIP, 0, points.length / 2);
}

initShaders();
render();

// Event listeners
document.getElementById("line-width").addEventListener("input", (e) => {
    lineWidth = parseFloat(e.target.value);
    render();
});

document.getElementById("add-random-point").addEventListener("click", () => {
    const x = Math.random() * 2 - 1;
    const y = Math.random() * 2 - 1;
    points.push(x, y);
    render();
});
