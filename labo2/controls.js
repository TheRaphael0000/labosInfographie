let xCamera = 0;
let yCamera = 0;
let xzPos = 0;
let yPos = 0;

let sensibility;

let playerControl = false;

function loadControls() {
	ui();
	capture();
    updateLabels();
}

function ui() {
	sensibility = document.getElementById("sensibility-input");
	sensibility.addEventListener("input", updateLabels);
}

function updateLabels() {
	document.getElementById("sensibility-label").innerHTML = sensibility.value / 100;
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
		xCamera += (e.movementX / 1000) * (sensibility.value / 100);
		yCamera += (e.movementY / 1000) * (sensibility.value / 100);
	}

    function updatePosition(e) {
        if (e.code == "KeyW")
        {
            xzPos+= 20;
        }
        else
        {

        }
        if(e.code == "KeyS")
        {
            xzPos-= 20;
        }

        if(e.code == "KeyA")
        {
            yPos+= 0.1;
        }

        if(e.code == "KeyD")
        {
            yPos-= 0.1;
        }
	}
}
