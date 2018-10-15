 document.addEventListener("DOMContentLoaded", function(event) {
 	//nb butterflies
 	let nbButterfliesRange = document.getElementById('nbButterfliesRange');
 	let nbButterfliesValue = document.getElementById('nbButterfliesValue');
 	nbButterfliesRange.addEventListener('input', function() {
 		setButterfliesQte(nbButterfliesRange.value);
 	});
 	nbButterfliesRange.addEventListener('input', function() {
 		nbButterfliesValue.innerHTML = nbButterfliesRange.value;
 	});

 	let changeButterfliesColorsButton = document.getElementById('changeButterfliesColorsButton');
 	changeButterfliesColorsButton.addEventListener('click', changeButterfliesColors);

 	//cursor
 	let disableCursor = document.getElementById('disableCursor');
 	disableCursor.addEventListener('input', function() {
 		cnv.classList.toggle("nocursor");
 	});

 	//movements
 	let cnv = document.getElementById('cnv-labo1');
 	cnv.addEventListener("mousemove", function(evt) {
 		let xCnv = evt.offsetX;
 		let yCnv = evt.offsetY;
 		let xClipSpace = (xCnv - cnv.width / 2.0) / cnv.width * 2.0;
 		let yClipSpace = (cnv.height / 2.0 - yCnv) / cnv.height * 2.0;
 		moveButterfliesTo(xClipSpace, yClipSpace);
 	});
 });
