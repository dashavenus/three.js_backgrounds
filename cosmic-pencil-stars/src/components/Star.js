import * as THREE from "three";

class Star {
    constructor(scene) {
        this.scene = scene;

        // Используем квадратик + шейдер чтобы надежно управлять UV
        this.geometry = new THREE.PlaneGeometry(1, 1);

        this.material = new THREE.ShaderMaterial({
            uniforms: {
                uTime: { value: 0.0 },
                uColor: { value: new THREE.Color(0xfff67a) },       // ярче желтая середина
                uOutlineColor: { value: new THREE.Color(0xff9a00) },// оранжевая обводка
                uGlowColor: { value: new THREE.Color(0xffe08a) }    // тёплое свечение
            },
            vertexShader: `
                varying vec2 vUv;
                void main() {
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
                }`,
            fragmentShader: `
                varying vec2 vUv;
                uniform float uTime;
                uniform vec3 uColor;
                uniform vec3 uOutlineColor;
                uniform vec3 uGlowColor;

                // простой псевдошум для лёгкого мерцания
                float hash(vec2 p) {
                  return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453123);
                }

                void main() {
                  vec2 uv = vUv - 0.5;
                  float r = length(uv);

                  // core, outline, glow masks — увеличены для более заметных звёзд
                  float core = smoothstep(0.42, 0.0, r);
                  float outline = smoothstep(0.28, 0.34, r) - smoothstep(0.34, 0.6, r);
                  float glow = smoothstep(0.35, 1.1, r);

                  // чуть более заметное мерцание
                  float tw = 0.7 + 0.3 * sin(uTime * 3.0 + hash(uv * 8.0) * 6.2831);

                  vec3 col = uColor * core * tw + uOutlineColor * outline * 1.0 + uGlowColor * glow * 1.0;

                  // alpha falls off smoothly — увеличено для видимости
                  float alpha = clamp(core + (1.0 - r) * 0.34, 0.0, 1.0);

                  // slightly soften edges
                  alpha *= smoothstep(0.98, 0.0, r);

                  gl_FragColor = vec4(col, alpha);
                }`,
            transparent: true,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
            side: THREE.DoubleSide
        });

        // ensure stars draw above other scene objects and not clipped by depth
        this.material.depthTest = false;

        this.starMesh = new THREE.Mesh(this.geometry, this.material);
        // draw last
        this.starMesh.renderOrder = 9999;
        this.resetPosition();
        this.scene.add(this.starMesh);
    }

    resetPosition() {
        // расположить звезду ВПЕРЕДИ фоновой плоскости (фон в проекте обычно около -20)
        this.starMesh.position.x = (Math.random() - 0.5) * 48;
        this.starMesh.position.y = (Math.random() - 0.5) * 32;
        // держим звёзды перед фоном (z ~ -2 ... -18) — чтобы они не скрывались за фоном
        this.starMesh.position.z = -2 - Math.random() * 16;
        // более крупные и разнообразные размеры — увеличены по умолчанию
        const s = 1.0 + Math.random() * 3.0;
        this.starMesh.scale.set(s, s, 1);
        this.userData = {
            driftX: (Math.random() - 0.5) * 0.06,
            driftY: (Math.random() - 0.5) * 0.04,
            rotSpeed: (Math.random() - 0.5) * 0.02
        };
    }

    update(time) {
        this.material.uniforms.uTime.value = time;
        // плавное движение/дрейф
        this.starMesh.position.x += Math.sin(time * 0.1 + this.userData.driftX) * 0.006;
        this.starMesh.position.y += Math.cos(time * 0.08 + this.userData.driftY) * 0.004;
        this.starMesh.rotation.z += this.userData.rotSpeed * 0.5;
        // при выходе из кадра — ресет
        if (this.starMesh.position.x < -48 || this.starMesh.position.x > 48 ||
            this.starMesh.position.y < -36 || this.starMesh.position.y > 36) {
            if (Math.random() < 0.03) this.resetPosition();
        }
    }
}

export default Star;