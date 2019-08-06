
window.addEventListener("load", setupWebGL, false);

var gl, program;
var uStage, uVal1, uVal2;

function setupWebGL (evt) {
	window.removeEventListener(evt.type, setupWebGL, false);
	if (!(gl = getRenderingContext()))
    return;

	var source = document.querySelector("#vertex-shader").innerHTML;
	var vertexShader = gl.createShader(gl.VERTEX_SHADER);
	gl.shaderSource(vertexShader,source);
	gl.compileShader(vertexShader);
	
	source = document.querySelector("#fragment-shader").innerHTML;
	var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
	gl.shaderSource(fragmentShader,source);
	gl.compileShader(fragmentShader);
	
    console.log(gl.getShaderInfoLog(vertexShader));
    console.log(gl.getShaderInfoLog(fragmentShader));
	program = gl.createProgram();
	
	gl.attachShader(program, vertexShader);
	gl.attachShader(program, fragmentShader);
	
	gl.linkProgram(program);
	
	gl.detachShader(program, vertexShader);
	gl.detachShader(program, fragmentShader);
	
	gl.deleteShader(vertexShader);
	gl.deleteShader(fragmentShader);
	
	uStage = gl.getUniformLocation(program, "stage");
	uVal1 = gl.getUniformLocation(program, "val1");
	uVal2 = gl.getUniformLocation(program, "val2");
	
	if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
		var linkErrLog = gl.getProgramInfoLog(program);
		cleanup();
		document.querySelector("p").innerHTML = "Shader program did not link successfully. Error log: " + linkErrLog;
		return;
	} 
	
	var rstage;
	var stage=420.0;	
	var val1 = 1, val2 = 1.5;
	var pEnabled = true;

	document.getElementById("check").addEventListener('change', (event) => {
	  pEnabled = event.target.checked;
	})

	var permute = setInterval(
	function (e) {
		if(pEnabled)
		{
			stage+=val1;
			draw();
		}
		}, 16);
		
	document.querySelector("#stage").addEventListener("input",
		function (evt) {
		rstage = this.value; 
		draw();
		}, false);

	document.querySelector("#val1").addEventListener("input",
		function (evt) {
		val1 = (this.value-50)/10; 
		}, false);
		
	document.querySelector("#val2").addEventListener("input",
		function (evt) {
		val2 = (this.value-50)/10; 
		}, false);
		
	function draw()
	{
		gl.uniform1f(uStage, (pEnabled?stage:rstage)/100);
		gl.uniform1f(uVal1, val1);
		gl.uniform1f(uVal2, val2);
		gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([0.]), gl.DYNAMIC_DRAW);
		gl.clearColor(0.0, 0.0, 0.0, 1.0);
		gl.clear(gl.COLOR_BUFFER_BIT);
		gl.drawArrays(gl.POINTS, 0, 1);
	}
		
	var vertexArray;
	var vertexBuffer;
	function initializeAttributes() {
		vertexBuffer = gl.createBuffer();  
		vertexArray = new Float32Array([
			-0.5, 0.5, 0.5,  0.5,  0.5, -0.5,
			-0.5, 0.5, 0.5, -0.5, -0.5, -0.5
		  ]);
		gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
		gl.bufferData(gl.ARRAY_BUFFER, vertexArray, gl.STATIC_DRAW);
		gl.enableVertexAttribArray(0);
		gl.vertexAttribPointer(0, 1, gl.FLOAT, true, 0, 0);
	}
	
	initializeAttributes();
	gl.useProgram(program);
	gl.drawArrays(gl.POINTS, 0, 1);
}


function getRenderingContext() {
	var canvas = document.querySelector("canvas");
	canvas.width = canvas.clientWidth;
	canvas.height = canvas.clientHeight;
	
	var gl = canvas.getContext("webgl") || canvas.getContext("experimental-webgl");
	
	if (!gl) {
		var paragraph = document.querySelector("p");
		paragraph.innerHTML = "Failed to get WebGL context. Your browser or device may not support WebGL.";
		return null;
	}

	gl.viewport(0, 0, gl.drawingBufferWidth, gl.drawingBufferHeight);
	gl.clearColor(0.0, 0.0, 0.0, 1.0);
	gl.clear(gl.COLOR_BUFFER_BIT);
	return gl;
}