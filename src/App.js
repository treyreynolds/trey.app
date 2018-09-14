// @flow

import React from 'react';
import {range} from 'd3-array';
import {hexbin as d3hexbin} from 'd3-hexbin';
import {randomNormal} from 'd3-random';
import {scaleLinear} from 'd3-scale';
import {interpolateLab} from 'd3-interpolate';

const width = 1200;
const height = 700;
let i = -1;
let theta = 0;
const deltaTheta = 0.3;
const n = 2000;
const k = 20;

let randomX = randomNormal(width / 2, 80);
let randomY = randomNormal(height / 2, 80);
let points = range(n).map(function() { return [randomX(), randomY()]; });

const color = scaleLinear()
  .domain([0, 20])
  .range(["rgba(0, 0, 0, 0)", "steelblue"])
  .interpolate(interpolateLab);

const hexbin = d3hexbin().radius(20);

type State = {
  points: any
}

export default class DynamicHexbin extends React.Component<{}, State> {

  state = {
    points: points
  };

  componentDidMount() {
    this.handle = window.setInterval(() => { this._update(); }, 20);
  }

  componentWillUnmount() {
    window.clearInterval(this.handle);
  }

  _update() {
    theta += deltaTheta;
    randomX = randomNormal(width / 2 + 80 * Math.cos(theta), 80);
    randomY = randomNormal(height / 2 + 80 * Math.sin(theta), 80);

    for (let j = 0; j < k; ++j) {
      i = (i + 1) % n;
      points[i][0] = randomX();
      points[i][1] = randomY();
    }

    this.setState({ points });
  }

  render() {
    const hexagons = hexbin(this.state.points).map(point => (
      <path
        d={hexbin.hexagon(19.5)}
        transform={`translate(${point.x}, ${point.y})`}
        fill={color(point.length)}
      />
    ));

    return (
      <svg width={width} height={height}>
        <g className="hexagons">
          {hexagons}
        </g>
      </svg>
    );
  }
}