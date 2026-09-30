import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { parse3D } from '../lib/graphics';

interface Props {
  stdout: string;
}

export default function PlayCanvas3D({ stdout }: Props) {
  const mountRef = useRef<HTMLDivElement>(null);
  const sceneRef = useRef<THREE.Scene | null>(null);
  const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
  const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
  const frameRef = useRef<number>(0);

  // init once
  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    scene.background = new THREE.Color(0x141428);
    sceneRef.current = scene;

    const camera = new THREE.PerspectiveCamera(60, 1, 0.1, 100);
    camera.position.set(5, 5, 5);
    camera.lookAt(0, 0, 0);
    cameraRef.current = camera;

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(400, 400);
    mount.appendChild(renderer.domElement);
    rendererRef.current = renderer;

    const animate = () => {
      frameRef.current = requestAnimationFrame(animate);
      scene.rotation.y += 0.005;
      renderer.render(scene, camera);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameRef.current);
      renderer.dispose();
      if (mount.contains(renderer.domElement)) mount.removeChild(renderer.domElement);
    };
  }, []);

  // re-render scene when stdout changes
  useEffect(() => {
    const scene = sceneRef.current;
    const camera = cameraRef.current;
    if (!scene || !camera) return;

    // clear old objects
    const toRemove = scene.children.filter((c) => c instanceof THREE.Mesh);
    for (const m of toRemove) {
      scene.remove(m);
      (m as THREE.Mesh).geometry?.dispose();
    }

    const cmds = parse3D(stdout);
    let color = 0xffffff;

    for (const cmd of cmds) {
      switch (cmd.type) {
        case 'CLEAR':
          for (const m of scene.children.filter((c) => c instanceof THREE.Mesh)) {
            scene.remove(m);
            (m as THREE.Mesh).geometry?.dispose();
          }
          break;
        case 'COLOR':
          color = (cmd.r << 16) | (cmd.g << 8) | cmd.b;
          break;
        case 'CUBE': {
          const geo = new THREE.BoxGeometry(cmd.size, cmd.size, cmd.size);
          const mat = new THREE.MeshStandardMaterial({ color });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(cmd.x, cmd.y, cmd.z);
          scene.add(mesh);
          break;
        }
        case 'SPHERE': {
          const geo = new THREE.SphereGeometry(cmd.r, 32, 32);
          const mat = new THREE.MeshStandardMaterial({ color });
          const mesh = new THREE.Mesh(geo, mat);
          mesh.position.set(cmd.x, cmd.y, cmd.z);
          scene.add(mesh);
          break;
        }
        case 'CAMERA':
          camera.position.set(cmd.x, cmd.y, cmd.z);
          camera.lookAt(cmd.lx, cmd.ly, cmd.lz);
          break;
      }
    }
  }, [stdout]);

  return (
    <div className="play-area">
      <div className="play-label">3D Scene</div>
      <div ref={mountRef} className="play-canvas-3d" />
    </div>
  );
}
