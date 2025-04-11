/*
*  Power BI Visual CLI
*
*  Copyright (c) Microsoft Corporation
*  All rights reserved.
*  MIT License
*
*  Permission is hereby granted, free of charge, to any person obtaining a copy
*  of this software and associated documentation files (the ""Software""), to deal
*  in the Software without restriction, including without limitation the rights
*  to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
*  copies of the Software, and to permit persons to whom the Software is
*  furnished to do so, subject to the following conditions:
*
*  The above copyright notice and this permission notice shall be included in
*  all copies or substantial portions of the Software.
*
*  THE SOFTWARE IS PROVIDED *AS IS*, WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
*  IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
*  FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
*  AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
*  LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
*  OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
*  THE SOFTWARE.
*/
"use strict";

import Plotly from 'plotly.js-dist-min';
import powerbi from "powerbi-visuals-api";
import "./../style/visual.less";

import VisualConstructorOptions = powerbi.extensibility.visual.VisualConstructorOptions;
import VisualUpdateOptions = powerbi.extensibility.visual.VisualUpdateOptions;
import IVisual = powerbi.extensibility.visual.IVisual;

export class Visual implements IVisual {
    private target: HTMLElement;
    private plotlyDiv: HTMLElement;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.plotlyDiv = document.createElement('div');
        this.plotlyDiv.style.width = '100%';
        this.plotlyDiv.style.height = '100%';
        this.target.appendChild(this.plotlyDiv);
    }

    public update(options: VisualUpdateOptions) {
        const dataView = options.dataViews[0];
        if (!dataView || !dataView.categorical) {
            return;
        }

        // Get the raw values without any aggregation
        const xValues = dataView.categorical.categories[0].values;
        const yValues = dataView.categorical.values[0].values;

        const trace = {
            x: xValues,
            y: yValues,
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: 10
            }
        };

        const layout = {
            title: '2D Scatter Plot',
            xaxis: {
                title: 'X Axis'
            },
            yaxis: {
                title: 'Y Axis'
            },
            margin: {
                l: 50,
                r: 50,
                t: 50,
                b: 50
            }
        };

        Plotly.newPlot(this.plotlyDiv, [trace], layout);
    }

    public destroy(): void {
        Plotly.purge(this.plotlyDiv);
    }
}