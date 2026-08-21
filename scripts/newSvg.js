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

function getRoundedRectPath(width, height, cornerRadius) {
  // Offset by 0.5px for a centered 1px stroke
  const strokeOffset = 0.5;
  const minX = strokeOffset;
  const minY = strokeOffset;
  const maxX = width - strokeOffset;
  const maxY = height - strokeOffset;

  // Clamp corner radius to prevent visual artifacts if it exceeds half of width or height
  const maxRadius = Math.min(width / 2, height / 2);
  const r = Math.min(Math.max(cornerRadius, 0), maxRadius);

  // Calculate segment coordinates
  const leftX = minX + r;
  const rightX = maxX - r;
  const topY = minY + r;
  const bottomY = maxY - r;

  // Construct SVG path command
  return [
    `M ${leftX} ${minY}`,
    `H ${rightX}`,
    `A ${r} ${r} 0 0 1 ${maxX} ${topY}`,
    `V ${bottomY}`,
    `A ${r} ${r} 0 0 1 ${rightX} ${maxY}`,
    `H ${leftX}`,
    `A ${r} ${r} 0 0 1 ${minX} ${bottomY}`,
    `V ${topY}`,
    `A ${r} ${r} 0 0 1 ${leftX} ${minY}`,
    `Z`
  ].join(' ');
}




// 
function getRoundedRectPath(width, height, radii) {
  const strokeOffset = 0.5;
  const minX = strokeOffset;
  const minY = strokeOffset;
  const maxX = width - strokeOffset;
  const maxY = height - strokeOffset;

  // Expects a normalized 4-element array: [tl, tr, br, bl]
  const [tl, tr, br, bl] = radii;

  return [
    `M ${minX + tl} ${minY}`,
    `H ${maxX - tr}`,
    tr ? `A ${tr} ${tr} 0 0 1 ${maxX} ${minY + tr}` : `L ${maxX} ${minY}`,
    `V ${maxY - br}`,
    br ? `A ${br} ${br} 0 0 1 ${maxX - br} ${maxY}` : `L ${maxX} ${maxY}`,
    `H ${minX + bl}`,
    bl ? `A ${bl} ${bl} 0 0 1 ${minX} ${maxY - bl}` : `L ${minX} ${maxY}`,
    `V ${minY + tl}`,
    tl ? `A ${tl} ${tl} 0 0 1 ${minX + tl} ${minY}` : `L ${minX} ${minY}`,
    `Z`
  ].join(' ');
}

