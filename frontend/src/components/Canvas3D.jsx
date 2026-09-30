import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function Canvas3D({ commands }) {
  const containerRef = useRef(null);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    const width = container.clientWidth || 400;
    const height = container.clientHeight || 400;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111122);

    const camera = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
    camera.position.set(6, 5, 6);

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(width, height);
    renderer.setPixelRatio(window.devicePixelRatio);
    container.innerHTML = '';
    container.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;

    scene.add(new THREE.AmbientLight(0xffffff, 0.5));
    const dirLight = new THREE.DirectionalLight(0xffffff, 1);
    dirLight.position.set(5, 10, 5);
    scene.add(dirLight);

    const grid = new THREE.GridHelper(20, 20, 0x444466, 0x222233);
    scene.add(grid);

    let currentColor = new THREE.Color(1, 1, 1);

    for (const cmd of commands) {
      switch (cmd.cmd) {
        case 'clear3d':
          scene.background = new THREE.Color(cmd.r, cmd.g, cmd.b);
          break;
        case 'color':
          currentColor = new THREE.Color(cmd.r, cmd.g, cmd.b);
          break;
        case 'sphere': {
          const geom = new THREE.SphereGeometry(cmd.r, 32, 32);
          const mat = new THREE.MeshPhongMaterial({ color: currentColor });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.set(cmd.x, cmd.y, cmd.z);
          scene.add(mesh);
          break;
        }
        case 'box': {
          const geom = new THREE.BoxGeometry(cmd.w, cmd.h, cmd.d);
          const mat = new THREE.MeshPhongMaterial({ color: currentColor });
          const mesh = new THREE.Mesh(geom, mat);
          mesh.position.set(cmd.x, cmd.y, cmd.z);
          scene.add(mesh);
          break;
        }
        case 'line3d': {
          const geom = new THREE.BufferGeometry().setFromPoints([
            new THREE.Vector3(cmd.x1, cmd.y1, cmd.z1),
            new THREE.Vector3(cmd.x2, cmd.y2, cmd.z2),
          ]);
          const mat = new THREE.LineBasicMaterial({ color: currentColor });
          scene.add(new THREE.Line(geom, mat));
          break;
        }
        default:
          break;
      }
    }

    let animId;
    const animate = () => {
      animId = requestAnimationFrame(animate);
      controls.update();
      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      const w = container.clientWidth || 400;
      const h = container.clientHeight || 400;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener('resize', handleResize);
      renderer.dispose();
      container.innerHTML = '';
    };
  }, [commands]);

  return <div ref={containerRef} className="canvas-3d" />;
}
