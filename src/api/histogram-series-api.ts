import { Palette } from '../model/palette';

import { HistogramData } from './data-consumer';
import { SeriesApi } from './series-api';

function generatePalette(points: HistogramData[], defaultColor: string): Palette {
	const res = new Palette();
	res.addColor(defaultColor);
	points.forEach((point: HistogramData) => {
		if (point.color !== undefined) {
			res.addColor(point.color);
		}
	});
	return res;
}

export class HistogramSeriesApi extends SeriesApi<'Histogram'> {
	public setData(data: HistogramData[]): void {
		const palette = generatePalette(data, this._series.options().color);
		this._dataUpdatesConsumer.applyNewData(this._series, data, palette);
	}
}
