(function () {
	// Based on http://stackoverflow.com/a/10073788/341041
	function pad_right(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : n + new Array(width - n.length + 1).join(z);
	}
	
	// Baseline offset value
	function font_offset_value(fontFamily) {
		var testScale = document.getElementById('scale-test'),
			testScaleSteps = document.querySelectorAll('#scale-test span'),
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
				heightIncrement = height - firstHeight,
				candidate = topIncrement / heightIncrement;
			
			candidateSum+= height * candidate;
			weightSum+= height;
			
			firstHeight = height;
			firstOffset = offset;
		});
		
		return pad_right(Math.round(1000 * candidateSum / weightSum) / 1000, 5);
	}
	
	// Calculate baseline offset values for in all tables
	var fallbackFont = 'Comic Sans MS',
		fallbackOffset = font_offset_value(fallbackFont);
	
	[].forEach.call(document.querySelectorAll('.offset-table tbody th'), function(th, i){
		var fontFamily = '"' + th.textContent + '", "' + fallbackFont + '"',
			fontOffset = font_offset_value(fontFamily);
		
		th.style.fontFamily = fontFamily;
		
		if (fontOffset !== fallbackOffset || th.textContent === fallbackFont) {
			th.nextElementSibling.textContent = fontOffset;
		}
		
		// Highlight rows that do not meet expectations
		if (th.nextElementSibling.textContent !== th.nextElementSibling.nextElementSibling.textContent) {
			th.parentNode.className += ' error';
		}
		
	});
})();