// Calculate baseline offsets for common font families
(function () {
	var fontFamilies = document.querySelectorAll('#baseline-offset-table tbody th'),
		testScale = document.getElementById('scale-test'),
		testScaleSteps = document.querySelectorAll('#scale-test span');
	
	[].forEach.call(fontFamilies, function(th, i){
		var fontFamily = th.textContent,
			candidateSum = 0,
			weightSum = 0,
			firstHeight = 0,
			firstOffset = 0;
		
		testScale.style.fontFamily = fontFamily;
		
		[].forEach.call(testScaleSteps, function (el, i) {
			var height = el.offsetHeight,
				offset = el.getBoundingClientRect().top + document.body.scrollTop;
			
			if (i === 0) {
				firstHeight = height;
				firstOffset = offset;
				
				return;
			}
			
			var topIncrement = firstOffset - offset,
				bottomIncrement = (offset + height) - (firstOffset + firstHeight),
				heightIncrement = height - firstHeight,
				candidate = topIncrement / heightIncrement - 0.5;
			
			candidateSum+= height * candidate;
			weightSum+= height;
			
			firstHeight = height;
			firstOffset = offset;
		});
		
		th.nextElementSibling.textContent = Math.round(1000 * candidateSum / weightSum) / 1000;
	});
})();