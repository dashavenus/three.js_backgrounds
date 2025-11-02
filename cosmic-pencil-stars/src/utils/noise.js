// This file contains utility functions for generating noise, which can be used in shaders for creating more complex visual effects.

// JS implementation of a simple value-noise (expects array [x,y] or THREE.Vector2)

function _getXY(p) {
    if (p == null) return [0,0];
    if (p.x !== undefined && p.y !== undefined) return [p.x, p.y];
    return [p[0] || 0, p[1] || 0];
}

function fract(x){ return x - Math.floor(x); }
function lerp(a,b,t){ return a + (b - a) * t; }

function rand(p){
    const [x,y] = _getXY(p);
    // pseudo-random based on coordinates
    return fract(Math.sin(x * 127.1 + y * 311.7) * 43758.5453123);
}

function noise(p){
    const [x,y] = _getXY(p);
    const xi = Math.floor(x), yi = Math.floor(y);
    const xf = x - xi, yf = y - yi;

    const a = rand([xi, yi]);
    const b = rand([xi + 1, yi]);
    const c = rand([xi, yi + 1]);
    const d = rand([xi + 1, yi + 1]);

    const ux = xf * xf * (3.0 - 2.0 * xf);
    const uy = yf * yf * (3.0 - 2.0 * yf);

    const mixAB = lerp(a, b, ux);
    const mixCD = lerp(c, d, ux);
    return lerp(mixAB, mixCD, uy);
}

export { rand, noise };