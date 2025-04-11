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

        // Initialize with empty plot to ensure Plotly is working
        const emptyLayout = {
            showlegend: false,
            xaxis: {
                title: 'X Axis',
                showgrid: true,
                zeroline: true,
                showline: true,
                mirror: true
            },
            yaxis: {
                title: 'Y Axis',
                showgrid: true,
                zeroline: true,
                showline: true,
                mirror: true
            },
            margin: {
                l: 50,
                r: 30,
                b: 50,
                t: 30,
                pad: 4
            },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white'
        };

        Plotly.newPlot(this.plotlyDiv, [], emptyLayout);
    }

    public update(options: VisualUpdateOptions) {
        if (!options.dataViews || !options.dataViews[0]) return;
        
        const dataView = options.dataViews[0];
        const categorical = dataView.categorical;
        if (!categorical || !categorical.categories || !categorical.values) return;

        const xValues = categorical.categories[0].values;
        const yValues = categorical.values[0].values;

        if (!xValues || !yValues || xValues.length !== yValues.length) return;

        // Clear the previous plot
        while (this.plotlyDiv.firstChild) {
            this.plotlyDiv.removeChild(this.plotlyDiv.firstChild);
        }

        const data = [{
            x: Array.from(xValues),
            y: Array.from(yValues),
            type: 'scatter',
            mode: 'markers',
            marker: {
                size: 50,
                color: 'rgb(232, 14, 14)',
                line: {
                    color: 'rgb(231, 99, 250)',
                    width: 1
                }
            }
        }];

        const layout = {
            showlegend: false,
            xaxis: {
                title: 'X Axis',
                showgrid: true,
                zeroline: true,
                showline: true,
                mirror: true,
                range: [Math.min(...xValues as number[]) - 1, Math.max(...xValues as number[]) + 1]
            },
            yaxis: {
                title: 'Y Axis',
                showgrid: true,
                zeroline: true,
                showline: true,
                mirror: true,
                range: [Math.min(...yValues as number[]) - 1, Math.max(...yValues as number[]) + 1]
            },
            margin: {
                l: 50,
                r: 30,
                b: 50,
                t: 30,
                pad: 4
            },
            plot_bgcolor: 'white',
            paper_bgcolor: 'white'
        };

        const config = {
            displayModeBar: false,
            responsive: true,
            staticPlot: false
        };

        Plotly.newPlot(this.plotlyDiv, data, layout, config);
    }

    public destroy(): void {
        if (this.plotlyDiv) {
            Plotly.purge(this.plotlyDiv);
        }
    }
}