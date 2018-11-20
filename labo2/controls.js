let xCamera = 0;
let yCamera = 0;
let xzPos = 0;
let yPos = 0;

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

function loadControls() {
	ui();
	capture();
	updateLabels();
    generateStairway();
}

function ui() {
	nbStairs = document.getElementById("nbStairs-input");
	nbStairs.addEventListener("input", updateLabels);

	widthStair = document.getElementById("widthStair-input");
	widthStair.addEventListener("input", updateLabels);

	radius1 = document.getElementById("radius1-input");
	radius1.addEventListener("input", updateLabels);

	nbStairsPerRound = document.getElementById("nbStairsPerRound-input");
	nbStairsPerRound.addEventListener("input", updateLabels);

	height = document.getElementById("height-input");
	height.addEventListener("input", updateLabels);

	sampling = document.getElementById("sampling-input");
	sampling.addEventListener("input", updateLabels);

    generateStairway_input = document.getElementById("generateStairway-input");
	generateStairway_input.addEventListener("click", generateStairway);

	sensibility = document.getElementById("sensibility-input");
	sensibility.addEventListener("input", updateLabels);
}

function updateLabels() {
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

	sensibility_value = sensibility.value / 100;
	document.getElementById("sensibility-label").innerHTML = sensibility_value;
}

function generateStairway()
{
    stairway = new Stairway(nbStairsy_value, radius1_value, widthStair_value, nbStairsPerRound_value, height_value, sampling_value);
}

function capture() {
	cnv.addEventListener("click", function() {
		cnv.requestPointerLock();
	});

	document.addEventListener("pointerlockchange", function() {
		if (document.pointerLockElement == cnv) {
			document.addEventListener("mousemove", updateCameraRotation);
			document.addEventListener("keypress", updatePosition);
			playerControl = true;
		} else {
			document.removeEventListener("mousemove", updateCameraRotation);
			document.removeEventListener("keypress", updatePosition);
			playerControl = false;
		}
	});

	function updateCameraRotation(e) {
		xCamera += (e.movementX / 1000) * (sensibility_value);
		yCamera += (e.movementY / 1000) * (sensibility_value);
	}

	function updatePosition(e) {
		if (e.code == "KeyW") {
			xzPos += 20;
		} else {

		}
		if (e.code == "KeyS") {
			xzPos -= 20;
		}

		if (e.code == "KeyA") {
			yPos += 0.1;
		}

		if (e.code == "KeyD") {
			yPos -= 0.1;
		}
	}
}
