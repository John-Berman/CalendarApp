const XMLNS = "http://www.w3.org/2000/svg";
const XLINK = "http://www.w3.org/1999/xlink";

// Constants for node types (nodeName).
const GROUP = 'g';
const CIRCLE = 'circle';
const ELLIPSE = 'ellipse';
const PATH = 'path';
const DEF = 'def';
const TSPAN = 'tspan';
const TEXT = 'text';

function createSvg(params){

    const svg = document.createElementNS(XMLNS, "svg");
	//Loop over params and add attributes to svg node.
    for (o in params) {
        svg.setAttributeNS(null, o, params[o]);
    }
    svg.setAttribute("xmlns", XMLNS);
	
    return svg;
}