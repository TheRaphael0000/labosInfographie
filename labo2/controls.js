let xCamera = 0;
let yCamera = 0;
let xzPos = 0;
let yPos = 0;

let keyW;
let keyS;
let keyA;
let keyD;

let playerControl = false;

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

let generateStairway_input;

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
    setFOV();
}

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
    mat4.perspective(pMatrix, fov_value * Math.PI / 180, cnv.width / cnv.height, 0.01, 10000);
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
	generateStairway_input.style.display = "none";
	stairway = new Stairway(nbStairsy_value, radius1_value, widthStair_value, nbStairsPerRound_value, height_value, sampling_value);
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

	function updateCameraRotation(e) {
		xCamera += (e.movementX / 1000) * (sensibility_value);
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
