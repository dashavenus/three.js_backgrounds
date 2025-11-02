import * as THREE from "three";

class Mist {
    constructor(scene) {
        this.scene = scene;
        this.group = new THREE.Group();

        this.uniforms = {
            uTime: { value: 0.0 },
            uColor: { value: new THREE.Color(0x0b2a4a) }, // тёмно-голубой/синий тон для дымки
            uContrast: { value: 1.6 }
        };

        const mat = new THREE.ShaderMaterial({
            uniforms: this.uniforms,
            vertexShader: `
                varying vec2 vUv;
                void main(){
                    vUv = uv;
                    gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0);
                }`,
            fragmentShader: `
                varying vec2 vUv;
                uniform float uTime;
                uniform vec3 uColor;
                uniform float uContrast;

                // очень простая "шумовая" функция на триггерах — быстрый фейк объёмной туманности
                float noise(vec2 p){
                  return fract(sin(dot(p ,vec2(127.1,311.7))) * 43758.5453123);
                }
                float fbm(vec2 p){
                  float v = 0.0;
                  float a = 0.5;
                  for(int i=0;i<5;i++){
                    v += a * noise(p);
                    p *= 2.0;
                    a *= 0.5;
                  }
                  return v;
                }

                void main(){
                    vec2 uv = vUv * vec2(2.0, 1.2);
                    float t = uTime * 0.03;
                    float n = fbm(uv * 1.5 + vec2(t, -t*0.5));
                    float n2 = fbm(uv * 3.0 - vec2(t*0.6, t*0.3));
                    float clouds = smoothstep(0.35, 0.7, (n * 0.6 + n2 * 0.4));
                    // invert so clouds are lighter/dense in center, multiplied to keep subtle
                    float alpha = clouds * 0.28;
                    vec3 col = mix(vec3(0.02,0.06,0.12), uColor, clouds);
                    col *= uContrast;
                    gl_FragColor = vec4(col, alpha);
                }`,
            transparent: true,
            depthWrite: false,
            side: THREE.DoubleSide
        });

        // несколько слоёв дымки на разных глубинах для объёма
        const geo = new THREE.PlaneGeometry(120, 70);
        const depths = [-4, -8, -12];
        depths.forEach((z, i) => {
            const mesh = new THREE.Mesh(geo, mat.clone());
            mesh.material.uniforms = {
                uTime: this.uniforms.uTime,
                uColor: { value: new THREE.Color(0x0b2a4a) },
                uContrast: { value: 1.1 + i * 0.2 }
            };
            mesh.position.z = z;
            mesh.material.opacity = 0.6 - i * 0.18;
            this.group.add(mesh);
        });

        scene.add(this.group);
    }

    update(time) {
        this.uniforms.uTime.value = time;
    }
}

export default Mist;