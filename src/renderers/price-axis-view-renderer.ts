import { drawScaled } from '../helpers/canvas-helpers';

import { TextWidthCache } from '../model/text-width-cache';

import { CanvasRenderingTarget } from './canvas-rendering-target';
import {
	IPriceAxisViewRenderer,
	PriceAxisViewRendererCommonData,
	PriceAxisViewRendererData,
	PriceAxisViewRendererOptions,
} from './iprice-axis-view-renderer';

export class PriceAxisViewRenderer implements IPriceAxisViewRenderer {
	private _data!: PriceAxisViewRendererData;
	private _commonData!: PriceAxisViewRendererCommonData;

	public constructor(data: PriceAxisViewRendererData, commonData: PriceAxisViewRendererCommonData) {
		this.setData(data, commonData);
	}

	public setData(data: PriceAxisViewRendererData, commonData: PriceAxisViewRendererCommonData): void {
		this._data = data;
		this._commonData = commonData;
	}

	public draw(
		target: CanvasRenderingTarget,
		rendererOptions: PriceAxisViewRendererOptions,
		textWidthCache: TextWidthCache,
		width: number,
		align: 'left' | 'right'
	): void {
		if (!this._data.visible) {
			return;
		}

		const { context: ctx, horizontalPixelRatio, verticalPixelRatio } = target;

		ctx.font = rendererOptions.font;

		const tickSize = (this._data.tickVisible || !this._data.moveTextToInvisibleTick) ? rendererOptions.tickLength : 0;
		const horzBorder = rendererOptions.borderSize;
		const paddingTop = rendererOptions.paddingTop;
		const paddingBottom = rendererOptions.paddingBottom;
		const paddingInner = rendererOptions.paddingInner;
		const paddingOuter = rendererOptions.paddingOuter;
		const text = this._data.text;
		const textWidth = Math.ceil(textWidthCache.measureText(ctx, text));
		const baselineOffset = rendererOptions.baselineOffset;
		const totalHeight = rendererOptions.fontSize + paddingTop + paddingBottom;
		const halfHeigth = Math.ceil(totalHeight * 0.5);
		const totalWidth = horzBorder + textWidth + paddingInner + paddingOuter + tickSize;

		let yMid = this._commonData.coordinate;
		if (this._commonData.fixedCoordinate) {
			yMid = this._commonData.fixedCoordinate;
		}

		yMid = Math.round(yMid);

		const yTop = yMid - halfHeigth;
		const yBottom = yTop + totalHeight;

		const alignRight = align === 'right';

		const xInside = alignRight ? width : 0;

		let xOutside = xInside;
		let xTick: number;
		let xText: number;

		ctx.fillStyle = this._commonData.background;
		ctx.lineWidth = 1;
		ctx.lineCap = 'butt';

		if (text) {
			if (alignRight) {
				// 2               1
				//
				//              6  5
				//
				// 3               4
				xOutside = xInside - totalWidth;
				xTick = xInside - tickSize;
				xText = xOutside + paddingOuter;
			} else {
				// 1               2
				//
				// 6  5
				//
				// 4               3
				xOutside = xInside + totalWidth;
				xTick = xInside + tickSize;
				xText = xInside + horzBorder + tickSize + paddingInner;
			}

			const tickHeight = Math.max(1, Math.floor(verticalPixelRatio));

			const horzBorderScaled = Math.max(1, Math.floor(horzBorder * horizontalPixelRatio));
			const rightScaled = Math.ceil(width * horizontalPixelRatio);
			const xInsideScaled = alignRight ? rightScaled : 0;
			const yTopScaled = Math.round(yTop * verticalPixelRatio);
			const xOutsideScaled = Math.round(xOutside * horizontalPixelRatio);
			const yMidScaled = Math.round(yMid * verticalPixelRatio) - Math.floor(verticalPixelRatio * 0.5);

			const yBottomScaled = yMidScaled + tickHeight + (yMidScaled - yTopScaled);
			const xTickScaled = Math.round(xTick * horizontalPixelRatio);

			ctx.save();

			ctx.beginPath();
			ctx.moveTo(xInsideScaled, yTopScaled);
			ctx.lineTo(xOutsideScaled, yTopScaled);
			ctx.lineTo(xOutsideScaled, yBottomScaled);
			ctx.lineTo(xInsideScaled, yBottomScaled);
			ctx.fill();

			// draw border
			ctx.fillStyle = this._data.borderColor;
			ctx.fillRect(alignRight ? rightScaled - horzBorderScaled : 0, yTopScaled, horzBorderScaled, yBottomScaled - yTopScaled);

			if (this._data.tickVisible) {
				ctx.fillStyle = this._commonData.color;
				ctx.fillRect(xInsideScaled, yMidScaled, xTickScaled - xInsideScaled, tickHeight);
			}

			ctx.textAlign = 'left';
			ctx.fillStyle = this._commonData.color;

			drawScaled(ctx, horizontalPixelRatio, verticalPixelRatio, () => {
				ctx.fillText(text, xText, yBottom - paddingBottom - baselineOffset);
			});

			ctx.restore();
		}
	}

	public height(rendererOptions: PriceAxisViewRendererOptions, useSecondLine: boolean): number {
		if (!this._data.visible) {
			return 0;
		}

		return rendererOptions.fontSize + rendererOptions.paddingTop + rendererOptions.paddingBottom;
	}
}
