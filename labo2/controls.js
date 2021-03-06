// Messiest file, used to bind the ui interactions with the program
//current position
let xCamera = 0;
let yCamera = 0;
let xzPos = 0;
let yPos = 0;

//movements
let keyW;
let keyS;
let keyA;
let keyD;

let playerControl = false;

//sliders generation
let nbStairs;
let nbStairs_value;

let radius1;
let radius1_value;

let widthStair;
let widthStair_value;

let nbStairsPerRound;
let nbStairsPerRound_value;

let height;
let height_value;

let sampling;
let sampling_value;

let method_value = 1; //default method
let texture_value = textureWood; //default texture
let modcoefx = 1;
let modcoefy = 1;

let generateStairway_input;

//controls camera
let sensibility;
let sensibility_value;

let fov;
let fov_value;

let xzSpeed;
let xzSpeed_value;

function loadControls() {
	ui();
	capture();
	updateValuesAndLabelsGeneration(true);
	updateValuesAndLabelsControles();
	generateStairway();
	changeGenerationMethod();
	changeGenerationTexture();
	setFOV();
	topright();
}

//every function below are juste binding of ui and parameters

function ui() {
	//Generation
	nbStairs = document.getElementById("nbStairs-input");
	nbStairs.addEventListener("input", updateValuesAndLabelsGeneration);

	widthStair = document.getElementById("widthStair-input");
	widthStair.addEventListener("input", updateValuesAndLabelsGeneration);

	radius1 = document.getElementById("radius1-input");
	radius1.addEventListener("input", updateValuesAndLabelsGeneration);

	nbStairsPerRound = document.getElementById("nbStairsPerRound-input");
	nbStairsPerRound.addEventListener("input", updateValuesAndLabelsGeneration);

	height = document.getElementById("height-input");
	height.addEventListener("input", updateValuesAndLabelsGeneration);

	sampling = document.getElementById("sampling-input");
	sampling.addEventListener("input", updateValuesAndLabelsGeneration);

	generateStairway_input = document.getElementById("generateStairway-input");
	generateStairway_input.addEventListener("click", generateStairway);

	//Controls
	sensibility = document.getElementById("sensibility-input");
	sensibility.addEventListener("input", updateValuesAndLabelsControles);

	fov = document.getElementById("fov-input");
	fov.addEventListener("input", setFOV);

	xzSpeed = document.getElementById("xzSpeed-input");
	xzSpeed.addEventListener("input", updateValuesAndLabelsControles);
}

function setFOV() {
	fov_value = fov.value;
	document.getElementById("fov-label").innerHTML = fov_value + "°";
	mat4.perspective(pMatrix, fov_value * Math.PI / 180, cnv.width / modcoefx / cnv.height / modcoefy, 0.01, 1000);
}

function updateValuesAndLabelsGeneration(showbutton = false) {
	//Controls to be applied via generateStairway are set here
	nbStairsy_value = nbStairs.value;
	document.getElementById("nbStairs-label").innerHTML = nbStairsy_value;

	radius1_value = radius1.value / 100;
	document.getElementById("radius1-label").innerHTML = radius1_value;

	widthStair_value = widthStair.value / 100;
	document.getElementById("widthStair-label").innerHTML = widthStair_value;

	nbStairsPerRound_value = nbStairsPerRound.value;
	document.getElementById("nbStairsPerRound-label").innerHTML = nbStairsPerRound_value;

	height_value = height.value / 100;
	document.getElementById("height-label").innerHTML = height_value;

	sampling_value = sampling.value;
	document.getElementById("sampling-label").innerHTML = sampling_value;

	generateStairway_input.style.display = showbutton ? "block" : "none";
}

function updateValuesAndLabelsControles() {
	//controls that are totaly dynamic
	sensibility_value = sensibility.value / 100;
	document.getElementById("sensibility-label").innerHTML = sensibility_value;

	xzSpeed_value = xzSpeed.value / 100;
	document.getElementById("xzSpeed-label").innerHTML = xzSpeed_value;
}

function generateStairway() {
	xCamera = 0;
	yCamera = 0;
	xzPos = 0;
	yPos = 0;
	generateStairway_input.style.display = "none";
	stairway = new Stairway(nbStairsy_value, radius1_value, widthStair_value, nbStairsPerRound_value, height_value, sampling_value, method_value, texture_value);
}

function changeGenerationMethod() {
	let generationMethod = document.getElementById("generationMethod").children;
	for (let i = 0; i < generationMethod.length; i++) {
		let li = generationMethod[i];
		let label = li.children[0];
		let input = label.children[0];
		input.addEventListener("change", function() {
			method_value = i;
			generateStairway_input.style.display = "block";
		});
	}
}

function changeGenerationTexture() {
	let texture = document.getElementById("texture").children;
	for (let i = 0; i < texture.length; i++) {
		let li = texture[i];
		let label = li.children[0];
		let input = label.children[0];
		input.addEventListener("change", function() {
			let textures = [textureWood, textureStone, texturePsy];
			texture_value = textures[i];
			generateStairway_input.style.display = "block";
		});
	}
}

function topright() {
	let cover = document.getElementById("topright");
	let player = document.getElementById("player");
	cover.addEventListener("mouseenter", function(e) {
		player.style.opacity = 1;
	});
	cover.addEventListener("mouseleave", function(e) {
		player.style.opacity = 0;
	});
}

function capture() {
	cnv.addEventListener("click", function() {
		cnv.requestPointerLock();
	});

	document.addEventListener("pointerlockchange", function() {
		if (document.pointerLockElement == cnv) {
			document.addEventListener("mousemove", updateCameraRotation);
			document.addEventListener("keydown", function(e) {
				updatePosition(e, true)
			});
			document.addEventListener("keyup", function(e) {
				updatePosition(e, false)
			});
			playerControl = true;
		} else {
			document.removeEventListener("mousemove", updateCameraRotation);
			document.removeEventListener("keydown", function(e) {
				updatePosition(e, true)
			});
			document.removeEventListener("keyup", function(e) {
				updatePosition(e, false)
			});
			playerControl = false;
		}
	});


	document.addEventListener("fullScreenChange", function() {
		if (document.mozFullScreen || document.webkitIsFullScreen) {
			var rect = cnv.getBoundingClientRect();
			cnv.width = rect.width;
			cnv.height = rect.height;
		} else {
			cnv.width = 500;
			cnv.height = 400;
		}
	});

	function updateCameraRotation(e) {
		xCamera += (e.movementX / 1000) * (sensibility_value); // divide by 1000 to have a good sensibility with a sensibility_value coef at 1
		yCamera += (e.movementY / 1000) * (sensibility_value);
	}

	//Not really beautiful w/e
	function updatePosition(e, b) {
		if (e.code == "KeyW")
			keyW = b;
		if (e.code == "KeyS")
			keyS = b;
		if (e.code == "KeyA")
			keyA = b;
		if (e.code == "KeyD")
			keyD = b;
	}
}
