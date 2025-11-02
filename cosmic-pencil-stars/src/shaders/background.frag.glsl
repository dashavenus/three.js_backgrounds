varying vec2 vUv;
uniform float uTime;
uniform vec3 uMainColor;
uniform vec3 uShadeColor;

float rand(vec2 co) {
    return fract(sin(dot(co.xy, vec2(12.9898, 78.233))) * 43758.5453);
}

void main() {
    vec2 uv = vUv * 8.0;
    float n = rand(floor(uv + uTime * 0.05));
    float m = rand(floor(uv.yx + uTime * 0.03));
    float shade = (n * 0.5 + m * 0.5);
    
    vec3 col = mix(uShadeColor, uMainColor, 0.7 + 0.3 * shade);
    gl_FragColor = vec4(col, 1.0);
}