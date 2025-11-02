varying vec2 vUv;
uniform float uTime;
uniform vec3 uMainColor;
uniform vec3 uOutlineColor;

void main() {
    float starSize = 0.1; // Base size of the star
    float glowSize = 0.2; // Size of the glow effect
    float brightness = 1.0; // Brightness of the star

    // Calculate distance from the center of the star
    float dist = length(vUv - vec2(0.5, 0.5));

    // Create a star shape using a simple threshold
    float star = smoothstep(starSize, starSize + 0.01, dist) - smoothstep(glowSize, glowSize + 0.01, dist);

    // Set the color based on the star shape
    vec3 color = mix(uOutlineColor, uMainColor, star * brightness);

    // Apply a glow effect
    float glow = smoothstep(glowSize, glowSize + 0.05, dist);
    color += glow * vec3(1.0, 0.5, 0.0); // Light orange glow

    gl_FragColor = vec4(color, 1.0);
}