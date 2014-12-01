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
	function fontBaselineOffsetValue(fontFamily, fontStyle, fontWeight) {
		var testScale = document.getElementById('scale-test'),
			testScaleSteps = document.querySelectorAll('#scale-test span'),
			candidateSum = 0,
			weightSum = 0,
			previousHeight = 0,
			previousOffset = 0;
		
		testScale.style.fontFamily = fontFamily;
		testScale.style.fontStyle = fontStyle || 'normal';
		testScale.style.fontWeight = fontWeight || '400';
		
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
	function calculateBaselineValue(th, i) {
		var next, nextOffsetValue, fontStyle, fontWeight,
			fontFamily = th.textContent;
		
		// Calculate value if font family is installed
		if (!isFontAvailable(fontFamily)) {
			return;
		} else {
			th.parentNode.className += ' available';
		}
		
		// th.style.fontFamily = fontFamily;
		next = th.nextElementSibling;
		
		do {
			if (next.textContent === '') {
				continue;
			}
			
			fontStyle = next.className.substr(0, 1) === 'i' ? 'italic' : 'normal';
			fontWeight = next.className.substr(1, 1) * 100;
			
			nextOffsetValue = fontBaselineOffsetValue(fontFamily, fontStyle, fontWeight);
			
			if (nextOffsetValue === next.textContent) {
				continue;
			} else if (Math.abs((nextOffsetValue / next.textContent) - 1) < 0.01) {
				next.className += ' notice';
			} else {
				next.className += ' error';
			}
			
			next.setAttribute('title', 'Expected: ' + next.textContent);
			next.textContent = nextOffsetValue;
			
		} while (next = next.nextElementSibling);
	}
	
	//
	// Create "Calculate offsets" buttons for each table
	//
	var b, i, c, tables = ['baseline-offset-table', 'baseline-offset-table-non-existent', 'baseline-offset-table-mac-fonts', 'baseline-offset-table-google-fonts'];
	
	for (i = 0; i < tables.length; i++) {
		c = document.getElementById(tables[i]);
		
		b = document.createElement('button');
		b.textContent = 'Calculate offsets';
		c.parentNode.insertBefore(b, c);
		
		b.addEventListener('click', function (e) {
			var table = this.nextElementSibling.getAttribute('id');
			
			if (table === 'baseline-offset-table-google-fonts') {
				calculateGoogleFontsOffsets();
			} else {
				[].forEach.call(document.querySelectorAll('#' + table + ' tbody th'), calculateBaselineValue);
			}
			
			this.parentNode.removeChild(this);
		});
	}
	
	// 
	// Calculate values for online fonts
	// 
	function calculateGoogleFontsOffsets() {
		// Collect font family names to load
		var googleFontFamilies = [];
	
		[].forEach.call(document.querySelectorAll('#baseline-offset-table-google-fonts tbody th'), function (th, i) {
			var next, 
				fontFamily = th.textContent,
				fontVariations = [];
		
			next = th.nextElementSibling;
		
			do {
				if (next.textContent === '') {
					continue;
				}
			
				var fontStyle = next.className.substr(0, 1) === 'i' ? 'italic' : '',
					fontWeight = next.className.substr(1, 1) * 100;
			
				fontVariations.push(fontWeight + fontStyle);
			
			} while (next = next.nextElementSibling);
		
		
			if (fontVariations.length > 0) {
				googleFontFamilies.push(fontFamily + ':' + fontVariations.join(','));
			}
		});
	
		// Configure the font loader
		WebFontConfig = {
			google: {
				families: googleFontFamilies,
				text: 'wiA'
			},
			active: function () {
				[].forEach.call(document.querySelectorAll('#baseline-offset-table-google-fonts tbody th'), calculateBaselineValue);
			}
		};
	
		// Init the font loader
		(function() {
			var wf = document.createElement('script');
			wf.src = ('https:' == document.location.protocol ? 'https' : 'http') +
				'://ajax.googleapis.com/ajax/libs/webfont/1.4.7/webfont.js';
			wf.type = 'text/javascript';
			wf.async = 'true';
			var s = document.getElementsByTagName('script')[0];
			s.parentNode.insertBefore(wf, s);
		})();
	}
	
})();