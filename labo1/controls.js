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
 });
