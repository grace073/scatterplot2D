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
import IViewport = powerbi.IViewport;

export class Visual implements IVisual {
    private target: HTMLElement;
    private plotlyDiv: HTMLElement;

    constructor(options: VisualConstructorOptions) {
        this.target = options.element;
        this.target.style.position = 'relative';
        
        this.plotlyDiv = document.createElement('div');
        this.plotlyDiv.style.width = '100%';
        this.plotlyDiv.style.height = '100%';
        this.target.appendChild(this.plotlyDiv);

        // Draw an empty plot immediately to ensure Plotly is working
        const emptyTrace = {
            x: [1],
            y: [1],
            mode: 'markers',
            type: 'scatter'
        };
        
        const defaultLayout = {
            autosize: true,
            margin: { t: 20, l: 40, r: 20, b: 40 }
        };

        Plotly.newPlot(this.plotlyDiv, [emptyTrace], defaultLayout);
    }

    public update(options: VisualUpdateOptions) {
        if (!options.dataViews || !options.dataViews[0]) return;
        
        const dataView = options.dataViews[0];
        const categorical = dataView.categorical;
        if (!categorical || !categorical.categories || !categorical.values) return;

        const xValues = categorical.categories[0].values;
        const yValues = categorical.values[0].values;

        if (!xValues || !yValues || xValues.length !== yValues.length) return;

        const trace = {
            x: xValues,
            y: yValues,
            mode: 'markers',
            type: 'scatter',
            marker: {
                size: 8,
                color: '#0078D4'
            }
        };

        const layout = {
            autosize: true,
            margin: { t: 20, l: 40, r: 20, b: 40 },
            xaxis: {
                title: 'X Axis',
                automargin: true
            },
            yaxis: {
                title: 'Y Axis',
                automargin: true
            }
        };

        Plotly.react(this.plotlyDiv, [trace], layout);
    }

    public destroy(): void {
        if (this.plotlyDiv) {
            Plotly.purge(this.plotlyDiv);
        }
    }
}