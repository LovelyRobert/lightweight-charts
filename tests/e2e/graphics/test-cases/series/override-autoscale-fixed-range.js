function generateData() {
	const res = [];
	const time = new Date(Date.UTC(2018, 0, 1, 0, 0, 0, 0));
	for (let i = 0; i < 500; ++i) {
		res.push({
			time: time.getTime() / 1000,
			value: 50 + 30 * Math.sin(Math.PI * i / 50),
		});

		time.setUTCDate(time.getUTCDate() + 1);
	}
	return res;
}

function runTestCase(container) {
	const chart = LightweightCharts.createChart(container, {
		priceScale: {
			scaleMargins: {
				bottom: 0,
				top: 0,
			},
		},
	});

	const mainSeries = chart.addLineSeries({
		lineWidth: 1,
		color: '#ff0000',
		autoscaleInfoProvider: function() {
			return {
				priceRange: {
					minValue: 0,
					maxValue: 100,
				},
			};
		},
	});

	mainSeries.setData(generateData());
}
