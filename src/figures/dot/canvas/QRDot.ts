import dotTypes from "../../../constants/dotTypes";
import {
  DotType,
  GetNeighbor,
  RotateFigureArgsCanvas,
  BasicFigureDrawArgsCanvas,
  DrawArgsCanvas
} from "../../../types";

export default class QRDot {
  _context: CanvasRenderingContext2D;
  _type: DotType;

  constructor({ context, type }: { context: CanvasRenderingContext2D; type: DotType }) {
    this._context = context;
    this._type = type;
  }

  draw({
    x,
    y,
    size,
    getNeighbor,
    isDark
  }: {
    x: number;
    y: number;
    size: number;
    getNeighbor: GetNeighbor;
    isDark?: boolean;
  }): void {
    const context = this._context;
    const type = this._type;
    let drawFunction;

    switch (type) {
      case dotTypes.dots:
        drawFunction = this._drawDot;
        break;
      case dotTypes.classy:
        drawFunction = this._drawClassy;
        break;
      case dotTypes.classyRounded:
        drawFunction = this._drawClassyRounded;
        break;
      case dotTypes.rounded:
        drawFunction = this._drawRounded;
        break;
      case dotTypes.extraRounded:
        drawFunction = this._drawExtraRounded;
        break;
      case dotTypes.rhombus:
        drawFunction = this._drawRhombus;
        break;
      case dotTypes.thinDots:
        drawFunction = this._drawThinDots;
        break;
      case dotTypes.thinRhombus:
        drawFunction = this._drawThinRhombus;
        break;
      case dotTypes.thinSquare:
        drawFunction = this._drawThinSquare;
        break;
      case dotTypes.squareRounded:
        drawFunction = this._drawSquareRounded;
        break;
      case dotTypes.extraSquareRounded:
        drawFunction = this._drawExtraSquareRounded;
        break;
      case dotTypes.square:
      default:
        drawFunction = this._drawSquare;
    }

    drawFunction.call(this, { x, y, size, context, getNeighbor, isDark });
  }

  _rotateFigure({ x, y, size, context, rotation = 0, draw }: RotateFigureArgsCanvas): void {
    const cx = x + size / 2;
    const cy = y + size / 2;

    context.translate(cx, cy);
    rotation && context.rotate(rotation);
    draw();
    context.closePath();
    rotation && context.rotate(-rotation);
    context.translate(-cx, -cy);
  }

  _basicDot(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, 0, Math.PI * 2);
      }
    });
  }

  _basicSquare(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.rect(-size / 2, -size / 2, size, size);
      }
    });
  }

  //if rotation === 0 - right side is rounded
  _basicSideRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, -Math.PI / 2, Math.PI / 2);
        context.lineTo(-size / 2, size / 2);
        context.lineTo(-size / 2, -size / 2);
        context.lineTo(0, -size / 2);
      }
    });
  }

  //if rotation === 0 - top right corner is rounded
  _basicCornerRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, -Math.PI / 2, 0);
        context.lineTo(size / 2, size / 2);
        context.lineTo(-size / 2, size / 2);
        context.lineTo(-size / 2, -size / 2);
        context.lineTo(0, -size / 2);
      }
    });
  }

  //if rotation === 0 - top right corner is rounded
  _basicCornerExtraRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
        context.lineTo(-size / 2, size / 2);
        context.lineTo(-size / 2, -size / 2);
      }
    });
  }

  _basicCornersRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(0, 0, size / 2, -Math.PI / 2, 0);
        context.lineTo(size / 2, size / 2);
        context.lineTo(0, size / 2);
        context.arc(0, 0, size / 2, Math.PI / 2, Math.PI);
        context.lineTo(-size / 2, -size / 2);
        context.lineTo(0, -size / 2);
      }
    });
  }

  _basicCornersExtraRounded(args: BasicFigureDrawArgsCanvas): void {
    const { size, context } = args;

    this._rotateFigure({
      ...args,
      draw: () => {
        context.arc(-size / 2, size / 2, size, -Math.PI / 2, 0);
        context.arc(size / 2, -size / 2, size, Math.PI / 2, Math.PI);
      }
    });
  }

  _drawDot({ x, y, size, context, isDark }: DrawArgsCanvas): void {
    if (isDark === false) {
      return;
    }

    this._basicDot({ x, y, size, context, rotation: 0 });
  }

  _drawSquare({ x, y, size, context, isDark }: DrawArgsCanvas): void {
    if (isDark === false) {
      return;
    }

    this._basicSquare({ x, y, size, context, rotation: 0 });
  }

  _drawRounded({ x, y, size, context, getNeighbor, isDark }: DrawArgsCanvas): void {
    if (isDark === false) {
      return;
    }

    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicDot({ x, y, size, context, rotation: 0 });
      return;
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      this._basicSquare({ x, y, size, context, rotation: 0 });
      return;
    }

    if (neighborsCount === 2) {
      let rotation = 0;

      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicCornerRounded({ x, y, size, context, rotation });
      return;
    }

    if (neighborsCount === 1) {
      let rotation = 0;

      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicSideRounded({ x, y, size, context, rotation });
      return;
    }
  }

  _drawExtraRounded({ x, y, size, context, getNeighbor, isDark }: DrawArgsCanvas): void {
    if (isDark === false) {
      return;
    }

    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicDot({ x, y, size, context, rotation: 0 });
      return;
    }

    if (neighborsCount > 2 || (leftNeighbor && rightNeighbor) || (topNeighbor && bottomNeighbor)) {
      this._basicSquare({ x, y, size, context, rotation: 0 });
      return;
    }

    if (neighborsCount === 2) {
      let rotation = 0;

      if (leftNeighbor && topNeighbor) {
        rotation = Math.PI / 2;
      } else if (topNeighbor && rightNeighbor) {
        rotation = Math.PI;
      } else if (rightNeighbor && bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicCornerExtraRounded({ x, y, size, context, rotation });
      return;
    }

    if (neighborsCount === 1) {
      let rotation = 0;

      if (topNeighbor) {
        rotation = Math.PI / 2;
      } else if (rightNeighbor) {
        rotation = Math.PI;
      } else if (bottomNeighbor) {
        rotation = -Math.PI / 2;
      }

      this._basicSideRounded({ x, y, size, context, rotation });
      return;
    }
  }

  _drawClassy({ x, y, size, context, getNeighbor, isDark }: DrawArgsCanvas): void {
    if (isDark === false) {
      return;
    }

    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicCornersRounded({ x, y, size, context, rotation: Math.PI / 2 });
      return;
    }

    if (!leftNeighbor && !topNeighbor) {
      this._basicCornerRounded({ x, y, size, context, rotation: -Math.PI / 2 });
      return;
    }

    if (!rightNeighbor && !bottomNeighbor) {
      this._basicCornerRounded({ x, y, size, context, rotation: Math.PI / 2 });
      return;
    }

    this._basicSquare({ x, y, size, context, rotation: 0 });
  }

  _drawClassyRounded({ x, y, size, context, getNeighbor, isDark }: DrawArgsCanvas): void {
    if (isDark === false) {
      return;
    }

    const leftNeighbor = getNeighbor ? +getNeighbor(-1, 0) : 0;
    const rightNeighbor = getNeighbor ? +getNeighbor(1, 0) : 0;
    const topNeighbor = getNeighbor ? +getNeighbor(0, -1) : 0;
    const bottomNeighbor = getNeighbor ? +getNeighbor(0, 1) : 0;

    const neighborsCount = leftNeighbor + rightNeighbor + topNeighbor + bottomNeighbor;

    if (neighborsCount === 0) {
      this._basicCornersRounded({ x, y, size, context, rotation: Math.PI / 2 });
      return;
    }

    if (!leftNeighbor && !topNeighbor) {
      this._basicCornerExtraRounded({ x, y, size, context, rotation: -Math.PI / 2 });
      return;
    }

    if (!rightNeighbor && !bottomNeighbor) {
      this._basicCornerExtraRounded({ x, y, size, context, rotation: Math.PI / 2 });
      return;
    }

    this._basicSquare({ x, y, size, context, rotation: 0 });
  }

  _drawRhombus({ x, y, size, context, isDark }: DrawArgsCanvas): void {
    if (isDark === false) {
      return;
    }

    this._rotateFigure({
      x,
      y,
      size,
      context,
      draw: () => {
        context.moveTo(0, -size / 2);
        context.lineTo(size / 2, 0);
        context.lineTo(0, size / 2);
        context.lineTo(-size / 2, 0);
      }
    });
  }

  _drawThinDots({ x, y, size, context, isDark }: DrawArgsCanvas): void {
    if (isDark === false) {
      return;
    }

    this._rotateFigure({
      x,
      y,
      size,
      context,
      draw: () => {
        context.arc(0, 0, size / 2.5, 0, Math.PI * 2);
      }
    });
  }

  _drawThinRhombus({ x, y, size, context, isDark }: DrawArgsCanvas): void {
    if (isDark === false) {
      return;
    }

    const ratio = size / 2.5;

    this._rotateFigure({
      x,
      y,
      size,
      context,
      draw: () => {
        context.moveTo(0, -ratio);
        context.lineTo(ratio, 0);
        context.lineTo(0, ratio);
        context.lineTo(-ratio, 0);
      }
    });
  }

  _drawThinSquare({ x, y, size, context, isDark }: DrawArgsCanvas): void {
    if (isDark === false) {
      return;
    }

    const ratio = size / 4;

    this._rotateFigure({
      x,
      y,
      size,
      context,
      draw: () => {
        context.rect(-ratio, -ratio, ratio * 2, ratio * 2);
      }
    });
  }

  _drawSquareRounded({ x, y, size, context, radius: _radius = 4, isDark }: DrawArgsCanvas & { radius?: number }): void {
    if (isDark === false) {
      return;
    }

    this._rotateFigure({
      x,
      y,
      size,
      context,
      draw: () => {
        // rect with 4 radiuses
        // draw rounded rectangle
        const radius = size / _radius;
        const halfSize = size / 2.3;

        context.moveTo(-halfSize + radius, -halfSize);
        context.lineTo(halfSize - radius, -halfSize);
        context.arc(halfSize - radius, -halfSize + radius, radius, -Math.PI / 2, 0);
        context.lineTo(halfSize, halfSize - radius);
        context.arc(halfSize - radius, halfSize - radius, radius, 0, Math.PI / 2);
        context.lineTo(-halfSize + radius, halfSize);
        context.arc(-halfSize + radius, halfSize - radius, radius, Math.PI / 2, Math.PI);
        context.lineTo(-halfSize, -halfSize + radius);
        context.arc(-halfSize + radius, -halfSize + radius, radius, Math.PI, -Math.PI / 2);
      }
    });
  }

  _drawExtraSquareRounded({ x, y, size, context, isDark }: DrawArgsCanvas): void {
    this._drawSquareRounded({
      x,
      y,
      size,
      context,
      radius: 2.5,
      isDark
    });
  }
}
