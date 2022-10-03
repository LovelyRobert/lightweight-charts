function generateData() {
	const result = [];
	for (let i = 0; i < 100; ++i) {
		result.push({
			time: i,
			value: 0.000000001 * i,
		});
	}

	return result;
}

let chart;
function getChartInstance() {
	return chart;
}

function runTestCase(container) {
	chart = LightweightCharts.createChart(container, {
		rightPriceScale: {
			mode: LightweightCharts.PriceScaleMode.Logarithmic,
		},
	});

	const mainSeries = chart.addAreaSeries({
		priceFormat: {
			minMove: 1e-9,
			precision: 9,
		},
	});

	mainSeries.setData(generateData());

	chart.timeScale().fitContent();
}
