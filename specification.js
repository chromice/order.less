(function () {
	// 
	// Font availability is ripped from http://www.samclarke.com/2013/06/javascript-is-font-available/
	// 
	// Copyright 2013 Sam Clarke <sam@samclarke.com> under MIT licence
	// 
	var calculateWidth, monoWidth, serifWidth, sansWidth, width,
		body         = document.body,
		container    = document.createElement('div'),
		containerCss = [
			'position:absolute',
			'width:auto',
			'font-size:128px',
			'right:100%;',
			'bottom:0',
		];

	// Create a span element to contain the test text.
	// Use innerHTML instead of createElement as it's easier
	// to apply CSS to.
	container.innerHTML = '<span style="' + containerCss.join(' !important;') + '">' +
		Array(100).join('wi') +
	'</span>';
	container = container.firstChild;

	calculateWidth = function(fontFamily) {
		container.style.fontFamily = fontFamily;

		body.appendChild(container);
		width = container.clientWidth;
		body.removeChild(container);

		return width;
	};

	// Precalculate the widths of monospace, serif & sans-serif
	// to improve performance.
	monoWidth  = calculateWidth('monospace');
	serifWidth = calculateWidth('serif');
	sansWidth  = calculateWidth('sans-serif');

	// 
	// Checks, if a font is available to be used on a web page.
	// 
	// Parameters: fontName - The name of the font to check
	// Returns: true || false
	// 
	function isFontAvailable(fontName) {
		return monoWidth !== calculateWidth(fontName + ',monospace') ||
			sansWidth !== calculateWidth(fontName + ',sans-serif') ||
			serifWidth !== calculateWidth(fontName + ',serif');
	};
	
	// 
	// Based on http://stackoverflow.com/a/10073788/341041
	// 
	function pad_right(n, width, z) {
		z = z || '0';
		n = n + '';
		return n.length >= width ? n : n + new Array(width - n.length + 1).join(z);
	}
	
	// 
	// Baseline offset value
	// 
	function fontBaselineOffsetValue(fontFamily) {
		var testScale = document.getElementById('scale-test'),
			testScaleSteps = document.querySelectorAll('#scale-test span'),
			candidateSum = 0,
			weightSum = 0,
			previousHeight = 0,
			previousOffset = 0;
		
		testScale.style.fontFamily = fontFamily;
		
		[].forEach.call(testScaleSteps, function (el, i) {
			var height = el.offsetHeight,
				offset = el.getBoundingClientRect().top + document.body.scrollTop;
			
			if (i === 0) {
				previousHeight = height;
				previousOffset = offset;
				
				return;
			}
			
			var topIncrement = previousOffset - offset,
				heightIncrement = height - previousHeight,
				candidate = topIncrement / heightIncrement;
			
			candidateSum+= height * candidate;
			weightSum+= height;
			
			previousHeight = height;
			previousOffset = offset;
		});
		
		return pad_right(Math.round(1000 * candidateSum / weightSum) / 1000, 5);
	}
	
	// 
	// Calculate baseline offset values for in all tables
	// 
	[].forEach.call(document.querySelectorAll('.offset-table tbody th'), function(th, i){
		var fontFamily = th.textContent;
		
		// Calculate value if font family is installed
		if (isFontAvailable(fontFamily)) {
			th.style.fontFamily = fontFamily;
			th.nextElementSibling.textContent = fontBaselineOffsetValue(fontFamily);
		}
		
		// Highlight rows that do not meet expectations
		if (th.nextElementSibling.textContent !== th.nextElementSibling.nextElementSibling.textContent) {
			th.parentNode.className += ' error';
		}
	});
})();