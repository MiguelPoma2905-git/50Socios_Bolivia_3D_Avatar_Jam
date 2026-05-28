import { useEffect, useRef } from 'react';
import { useFrame } from '@react-three/fiber';
import { useFBX } from '@react-three/drei';
import * as THREE from 'three';

export default function BuilderModel({ mode, isPaused, modelPath }) {
  const fbx = useFBX(modelPath);
  const groupRef = useRef(null);
  const mixerRef = useRef(null);
  const tempMats = useRef([]);

  useEffect(() => {
    fbx.traverse((child) => {
      if (child.isMesh && !child.userData._origMat) {
        child.userData._origMat = child.material;
      }
    });
  }, [fbx]);

  useEffect(() => {
    if (!groupRef.current) return;

    const box = new THREE.Box3().setFromObject(fbx);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);
    const target = 2;
    const s = target / maxDim;
    groupRef.current.scale.set(s, s, s);

    const center = box.getCenter(new THREE.Vector3());
    groupRef.current.position.set(-center.x * s, -center.y * s, -center.z * s);
  }, [fbx]);

  useEffect(() => {
    fbx.traverse((child) => {
      if (!child.isMesh) return;
      const toRemove = [];
      child.children.forEach((c) => {
        if (c.type === 'LineSegments' && c.userData._isEdge) {
          toRemove.push(c);
        }
      });
      toRemove.forEach((c) => {
        c.geometry.dispose();
        c.material.dispose();
        child.remove(c);
      });
    });

    tempMats.current.forEach((m) => m.dispose());
    tempMats.current = [];

    fbx.traverse((child) => {
      if (!child.isMesh) return;
      const orig = child.userData._origMat;
      if (!orig) return;

      if (mode === 'solid') {
        const mat = new THREE.MeshStandardMaterial({
          color: '#8a8a8a',
          roughness: 0.8,
          metalness: 0.1,
        });
        tempMats.current.push(mat);
        child.material = mat;
      } else if (mode === 'textured') {
        child.material = orig;
      } else if (mode === 'polygons') {
        const mat = new THREE.MeshStandardMaterial({
          color: '#0d1117',
          transparent: true,
          opacity: 0.3,
          roughness: 1,
          metalness: 0,
          side: THREE.DoubleSide,
        });
        tempMats.current.push(mat);
        child.material = mat;

        const edges = new THREE.EdgesGeometry(child.geometry);
        const lineMat = new THREE.LineBasicMaterial({
          color: '#00ff88',
          transparent: true,
          opacity: 0.85,
        });
        const line = new THREE.LineSegments(edges, lineMat);
        line.userData._isEdge = true;
        child.add(line);
      }
    });
  }, [mode, fbx]);

  useEffect(() => {
    if (fbx.animations.length > 0) {
      const mixer = new THREE.AnimationMixer(fbx);
      fbx.animations.forEach((clip) => mixer.clipAction(clip).play());
      mixerRef.current = mixer;
    }
    return () => {
      if (mixerRef.current) {
        mixerRef.current.stopAllAction();
        mixerRef.current = null;
      }
    };
  }, [fbx]);

  useFrame((_, delta) => {
    if (mixerRef.current && !isPaused) {
      mixerRef.current.update(delta);
    }
  });

  return (
    <group ref={groupRef}>
      <primitive object={fbx} />
    </group>
  );
}
