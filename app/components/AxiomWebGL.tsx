"use client";

import { useEffect, useRef } from "react";
import * as THREE from "three";
import { RoundedBoxGeometry } from "three/examples/jsm/geometries/RoundedBoxGeometry.js";
import { gsap } from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

type LogoPiece = {
  mesh: THREE.Mesh<RoundedBoxGeometry, THREE.MeshPhysicalMaterial>;
  base: THREE.Vector3;
  rotationZ: number;
  scatter: THREE.Vector3;
  spin: THREE.Vector3;
};

const clamp01 = (value: number) => Math.min(1, Math.max(0, value));
const smooth = (value: number) => {
  const t = clamp01(value);
  return t * t * (3 - 2 * t);
};

function seededRandom(seed: number) {
  let value = seed >>> 0;
  return () => {
    value = (value * 1664525 + 1013904223) >>> 0;
    return value / 4294967296;
  };
}

export default function AxiomWebGL() {
  const hostRef = useRef<HTMLDivElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const blastRef = useRef(0);
  const blastTargetRef = useRef(0);

  useEffect(() => {
    const host = hostRef.current;
    const canvas = canvasRef.current;
    const hero = document.querySelector<HTMLElement>("[data-hero-scroll]");
    if (!host || !canvas || !hero) return;

    gsap.registerPlugin(ScrollTrigger);

    const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
    const scene = new THREE.Scene();
    scene.fog = new THREE.FogExp2(0x050608, 0.052);

    const camera = new THREE.PerspectiveCamera(34, 1, 0.1, 120);
    camera.position.set(0, 0, 9.4);

    const renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    renderer.setClearColor(0x000000, 0);
    renderer.setPixelRatio(Math.min(devicePixelRatio, 1.75));
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 0.82;

    const world = new THREE.Group();
    const mark = new THREE.Group();
    world.add(mark);
    scene.add(world);

    const ambient = new THREE.HemisphereLight(0x343799, 0x02030c, 0.62);
    const key = new THREE.SpotLight(0x8edcff, 15, 28, Math.PI / 5, 0.7, 1.7);
    key.position.set(-5.5, 7, 7);
    key.target = mark;
    const rim = new THREE.PointLight(0x4b4fd8, 9, 17, 1.8);
    rim.position.set(4.5, -1.5, 3.2);
    const ember = new THREE.PointLight(0x5bb8e8, 0, 12, 2);
    ember.position.set(0, -0.2, 1.25);
    scene.add(ambient, key, rim, ember);

    const pieces: LogoPiece[] = [];
    const makePiece = (
      size: [number, number, number],
      position: [number, number, number],
      rotationZ: number,
      scatter: [number, number, number],
      spin: [number, number, number],
      tone = 0x17174f,
    ) => {
      const geometry = new RoundedBoxGeometry(size[0], size[1], size[2], 5, Math.min(size[0], size[1], size[2]) * 0.11);
      const material = new THREE.MeshPhysicalMaterial({
        color: tone,
        metalness: 0.96,
        roughness: 0.24,
        clearcoat: 1,
        clearcoatRoughness: 0.14,
        emissive: 0x05062a,
        emissiveIntensity: 0.2,
        transparent: true,
      });
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(...position);
      mesh.rotation.z = rotationZ;
      const edges = new THREE.LineSegments(
        new THREE.EdgesGeometry(geometry, 32),
        new THREE.LineBasicMaterial({ color: 0x69c9f4, transparent: true, opacity: 0.28 }),
      );
      mesh.add(edges);
      mark.add(mesh);
      pieces.push({
        mesh,
        base: mesh.position.clone(),
        rotationZ,
        scatter: new THREE.Vector3(...scatter),
        spin: new THREE.Vector3(...spin),
      });
    };

    // The A is assembled from independent metal rails so the mark can split apart in depth.
    makePiece([0.58, 4.35, 0.62], [-0.82, 0.05, 0], -0.245, [-2.9, 1.8, 3.3], [-0.7, -1.1, -0.35]);
    makePiece([0.58, 4.35, 0.62], [0.82, 0.05, 0.04], 0.245, [3.2, 1.4, 4.2], [0.8, 1.25, 0.42]);
    makePiece([1.78, 0.5, 0.72], [0, -0.38, 0.16], 0, [-0.5, -2.7, 5.1], [1.1, -0.35, -0.65], 0x5bb8e8);
    makePiece([0.38, 3.25, 0.36], [-0.52, 0.15, -0.7], -0.245, [-4.2, -1.1, -2.8], [0.65, 1.45, -0.85], 0x24266f);
    makePiece([0.38, 3.25, 0.36], [0.52, 0.15, -0.68], 0.245, [4.3, -1.5, -2.2], [-0.8, -1.25, 0.75], 0x24266f);
    makePiece([1.25, 0.28, 0.42], [0, 0.36, -0.58], 0, [1.4, 3.1, -3.8], [-1.2, 0.7, 0.5], 0x5bb8e8);

    // A layered outline remains assembled during the exploded scroll phase.
    const ghostMark = new THREE.Group();
    const ghostMaterials: THREE.LineBasicMaterial[] = [];
    for (let layer = 0; layer < 3; layer += 1) {
      pieces.slice(0, 6).forEach((piece) => {
        const material = new THREE.LineBasicMaterial({
          color: layer === 0 ? 0x3a3f49 : 0x242932,
          transparent: true,
          opacity: 0,
          depthWrite: false,
        });
        const outline = new THREE.LineSegments(new THREE.EdgesGeometry(piece.mesh.geometry, 32), material);
        outline.position.copy(piece.base);
        outline.position.z -= 0.18 + layer * 0.28;
        outline.rotation.z = piece.rotationZ;
        outline.scale.setScalar(1 - layer * 0.025);
        ghostMark.add(outline);
        ghostMaterials.push(material);
      });
    }
    mark.add(ghostMark);

    const random = seededRandom(4129);
    for (let index = 0; index < 44; index += 1) {
      const w = 0.035 + random() * 0.16;
      const h = 0.16 + random() * 1.25;
      const geometry = new RoundedBoxGeometry(w, h, 0.05 + random() * 0.16, 3, 0.018);
      const material = new THREE.MeshPhysicalMaterial({
        color: index % 5 === 0 ? 0x5bb8e8 : 0x17174f,
        metalness: 0.92,
        roughness: 0.3,
        emissive: index % 9 === 0 ? 0x291006 : 0x010204,
        emissiveIntensity: index % 9 === 0 ? 0.7 : 0.28,
        transparent: true,
      });
      const angle = random() * Math.PI * 2;
      const radius = 0.7 + random() * 2.5;
      const mesh = new THREE.Mesh(geometry, material);
      mesh.position.set(Math.cos(angle) * radius, Math.sin(angle) * radius, -0.8 + random() * 1.3);
      mesh.rotation.set(random() * 1.2, random() * 1.2, angle);
      mark.add(mesh);
      pieces.push({
        mesh,
        base: mesh.position.clone(),
        rotationZ: mesh.rotation.z,
        scatter: new THREE.Vector3(
          Math.cos(angle) * (4.5 + random() * 7.5),
          Math.sin(angle) * (3.2 + random() * 5.8),
          -5 + random() * 14,
        ),
        spin: new THREE.Vector3((random() - 0.5) * 3, (random() - 0.5) * 3, (random() - 0.5) * 2),
      });
    }

    const coreMaterial = new THREE.MeshBasicMaterial({
      color: 0x5bb8e8,
      transparent: true,
      opacity: 0,
      blending: THREE.AdditiveBlending,
      depthWrite: false,
    });
    const core = new THREE.Mesh(new THREE.IcosahedronGeometry(0.26, 2), coreMaterial);
    core.position.set(0, -0.2, 1.1);
    mark.add(core);

    const lightning = new THREE.Group();
    mark.add(lightning);
    const lightningLines: THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>[] = [];
    for (let index = 0; index < 6; index += 1) {
      const line = new THREE.Line(
        new THREE.BufferGeometry(),
        new THREE.LineBasicMaterial({
          color: index % 2 ? 0x6db9ff : 0xeaf6ff,
          transparent: true,
          opacity: 0,
          blending: THREE.AdditiveBlending,
          depthWrite: false,
        }),
      );
      lightning.add(line);
      lightningLines.push(line);
    }

    const pointPositions: number[] = [];
    for (let index = 0; index < 420; index += 1) {
      pointPositions.push((random() - 0.5) * 36, (random() - 0.5) * 20, -4 - random() * 28);
    }
    const pointGeometry = new THREE.BufferGeometry();
    pointGeometry.setAttribute("position", new THREE.Float32BufferAttribute(pointPositions, 3));
    const pointMaterial = new THREE.PointsMaterial({
      color: 0x66758a,
      size: 0.026,
      transparent: true,
      opacity: 0.34,
      sizeAttenuation: true,
    });
    scene.add(new THREE.Points(pointGeometry, pointMaterial));

    const rayGroup = new THREE.Group();
    for (let index = 0; index < 24; index += 1) {
      const startX = (random() - 0.5) * 11;
      const startY = (random() - 0.5) * 7;
      const length = 4 + random() * 12;
      const angle = -0.32 + (random() - 0.5) * 0.42;
      const rayGeometry = new THREE.BufferGeometry().setFromPoints([
        new THREE.Vector3(startX, startY, -4 - random() * 9),
        new THREE.Vector3(startX + Math.cos(angle) * length, startY + Math.sin(angle) * length, -4 - random() * 9),
      ]);
      const rayMaterial = new THREE.LineBasicMaterial({
        color: index % 7 === 0 ? 0x5bb8e8 : 0x343799,
        transparent: true,
        opacity: 0.12 + random() * 0.18,
      });
      rayGroup.add(new THREE.Line(rayGeometry, rayMaterial));
    }
    scene.add(rayGroup);

    const pointer = new THREE.Vector2();
    const pointerTarget = new THREE.Vector2();
    const dragRotation = new THREE.Vector2(-0.12, -0.28);
    const dragVelocity = new THREE.Vector2();
    const drag = { active: false, x: 0, y: 0 };
    const introState = { progress: reducedMotion ? 1 : 0 };
    let scrollProgress = 0;
    let lastLightning = 0;
    let frame = 0;

    const introTween = reducedMotion
      ? null
      : gsap.to(introState, {
          progress: 1,
          duration: 2.9,
          delay: 0.12,
          ease: "power4.out",
        });

    const refreshLightning = () => {
      lightningLines.forEach((line, index) => {
        const points: THREE.Vector3[] = [];
        const angle = (index / lightningLines.length) * Math.PI * 2 + (random() - 0.5) * 0.6;
        const length = 1.3 + random() * 2.25;
        for (let step = 0; step < 10; step += 1) {
          const distance = (step / 9) * length;
          points.push(
            new THREE.Vector3(
              Math.cos(angle) * distance + (random() - 0.5) * 0.22,
              -0.2 + Math.sin(angle) * distance + (random() - 0.5) * 0.22,
              1.18 + (random() - 0.5) * 0.35,
            ),
          );
        }
        line.geometry.dispose();
        line.geometry = new THREE.BufferGeometry().setFromPoints(points);
      });
    };

    const setHeroProgress = (progress: number) => {
      const copyOut = smooth(progress / 0.17);
      const worldFade = 1 - smooth((progress - 0.87) / 0.13) * 0.16;
      hero.style.setProperty("--hero-p", String(progress));
      hero.style.setProperty("--hero-copy-opacity", String(1 - copyOut));
      hero.style.setProperty("--hero-copy-y", `${copyOut * -54}px`);
      hero.style.setProperty("--hero-ui-opacity", String(1 - smooth(progress / 0.22)));
      hero.style.setProperty("--hero-world-opacity", String(worldFade));
      hero.style.setProperty("--hero-finale-opacity", String(smooth((progress - 0.75) / 0.14) * worldFade));
    };

    const scrollTrigger = ScrollTrigger.create({
      trigger: hero,
      start: "top top",
      end: "bottom bottom",
      scrub: true,
      invalidateOnRefresh: true,
      onUpdate: (self) => {
        scrollProgress = self.progress;
        setHeroProgress(self.progress);
      },
    });
    setHeroProgress(scrollTrigger.progress);

    const onPointerDown = (event: PointerEvent) => {
      drag.active = true;
      drag.x = event.clientX;
      drag.y = event.clientY;
      dragVelocity.set(0, 0);
      blastTargetRef.current = 1;
      host.setPointerCapture(event.pointerId);
    };
    const onPointerMove = (event: PointerEvent) => {
      pointerTarget.set(event.clientX / innerWidth - 0.5, event.clientY / innerHeight - 0.5);
      if (!drag.active) return;
      const dx = event.clientX - drag.x;
      const dy = event.clientY - drag.y;
      drag.x = event.clientX;
      drag.y = event.clientY;
      dragRotation.y += dx * 0.009;
      dragRotation.x = THREE.MathUtils.clamp(dragRotation.x + dy * 0.007, -1.15, 1.15);
      dragVelocity.set(dy * 0.0007, dx * 0.0009);
    };
    const stopPointer = () => {
      drag.active = false;
      blastTargetRef.current = 0;
    };
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") {
        event.preventDefault();
        blastTargetRef.current = 1;
      }
      if (event.key === "ArrowLeft") dragRotation.y -= 0.16;
      if (event.key === "ArrowRight") dragRotation.y += 0.16;
      if (event.key === "ArrowUp") dragRotation.x -= 0.12;
      if (event.key === "ArrowDown") dragRotation.x += 0.12;
    };
    const onKeyUp = (event: KeyboardEvent) => {
      if (event.key === " " || event.key === "Enter") blastTargetRef.current = 0;
    };
    host.addEventListener("pointerdown", onPointerDown);
    host.addEventListener("pointermove", onPointerMove);
    host.addEventListener("pointerup", stopPointer);
    host.addEventListener("pointercancel", stopPointer);
    host.addEventListener("lostpointercapture", stopPointer);
    host.addEventListener("keydown", onKeyDown);
    host.addEventListener("keyup", onKeyUp);

    const resize = () => {
      const width = Math.max(host.clientWidth, 1);
      const height = Math.max(host.clientHeight, 1);
      renderer.setSize(width, height, false);
      camera.aspect = width / height;
      camera.updateProjectionMatrix();
      const mobile = width < 760;
      world.position.x = mobile ? 0.2 : 1.5;
      world.scale.setScalar(mobile ? 0.76 : 1);
    };
    const observer = new ResizeObserver(resize);
    observer.observe(host);
    resize();

    const clock = new THREE.Clock();
    const render = () => {
      const delta = Math.min(clock.getDelta(), 0.033);
      const elapsed = clock.elapsedTime;
      const explode = smooth((scrollProgress - 0.12) / 0.52);
      const flyThrough = smooth((scrollProgress - 0.58) / 0.36);
      const visibility = 1 - smooth((scrollProgress - 0.88) / 0.12) * 0.16;
      const intro = clamp01(introState.progress);
      const assembly = 1 - intro;
      const assemblyFlash =
        smooth((intro - 0.72) / 0.13) * (1 - smooth((intro - 0.93) / 0.07));

      blastRef.current = THREE.MathUtils.lerp(blastRef.current, blastTargetRef.current, 0.13);
      const blast = blastRef.current;
      pointer.lerp(pointerTarget, 0.055);
      if (!drag.active && !reducedMotion) {
        dragRotation.y += delta * (0.24 + (1 - explode) * 0.18) + dragVelocity.y;
        dragRotation.x += (Math.sin(elapsed * 0.62) * 0.11 - dragRotation.x) * 0.018 + dragVelocity.x;
        dragVelocity.multiplyScalar(0.91);
      }

      mark.rotation.x = dragRotation.x + pointer.y * 0.12 + scrollProgress * 0.35 + assembly * 0.48;
      mark.rotation.y = dragRotation.y + pointer.x * 0.2 + scrollProgress * 1.18 - assembly * 1.05;
      mark.rotation.z = -0.08 + scrollProgress * 0.23 + assembly * 0.28;
      mark.scale.setScalar(0.62 + intro * 0.34 + scrollProgress * 0.12 + flyThrough * 0.52);

      pieces.forEach((piece, index) => {
        const pulse = 1 + blast * (0.1 + (index % 4) * 0.035);
        const introDistance = index < 6 ? -0.82 : -0.42;
        piece.mesh.position
          .copy(piece.base)
          .addScaledVector(piece.scatter, explode * pulse)
          .addScaledVector(piece.scatter, assembly * introDistance);
        piece.mesh.position.z += flyThrough * (3.5 + (index % 5) * 0.58);
        piece.mesh.rotation.set(
          piece.spin.x * (explode + assembly * 0.86) + Math.sin(elapsed + index) * blast * 0.12,
          piece.spin.y * (explode + assembly * 0.86),
          piece.rotationZ + piece.spin.z * (explode + assembly * 0.86),
        );
        piece.mesh.material.opacity =
          visibility *
          (index > 5
            ? 0.06 + assembly * 0.42 + explode * 0.72
            : 0.08 + intro * 0.92);
        piece.mesh.material.emissiveIntensity = 0.42 + blast * 1.65;
        const edge = piece.mesh.children[0] as THREE.LineSegments<THREE.EdgesGeometry, THREE.LineBasicMaterial>;
        if (edge?.material) edge.material.opacity = visibility * intro * (0.16 + blast * 0.4);
      });

      ghostMaterials.forEach((material, index) => {
        material.opacity = visibility * intro * (0.018 + explode * (index < 6 ? 0.25 : 0.11));
      });
      ghostMark.position.z = -flyThrough * 0.8;

      camera.position.z = 9.4 + assembly * 3.2 - flyThrough * 3.8;
      camera.position.x = pointer.x * 0.22 - flyThrough * 0.65;
      camera.position.y = pointer.y * -0.16 + flyThrough * 0.35;
      camera.lookAt(world.position.x, 0, flyThrough * 1.5);

      key.intensity = 13 + assemblyFlash * 18;
      ember.intensity = blast * 54 + explode * 1.5 + assemblyFlash * 24;
      rim.intensity = 7 + blast * 22 + assemblyFlash * 12;
      coreMaterial.opacity = Math.max(blast * 0.92, assemblyFlash * 0.66);
      core.scale.setScalar(0.7 + blast * (1.5 + Math.sin(elapsed * 18) * 0.2) + assemblyFlash * 0.8);
      lightningLines.forEach((line) => {
        line.material.opacity = blast * (0.5 + Math.sin(elapsed * 34) * 0.25);
      });
      if (blast > 0.06 && elapsed - lastLightning > 0.045) {
        refreshLightning();
        lastLightning = elapsed;
      }

      rayGroup.rotation.z = scrollProgress * -0.1;
      rayGroup.position.x = flyThrough * -2;
      rayGroup.scale.setScalar(0.86 + explode * 0.48);
      rayGroup.children.forEach((ray, index) => {
        const material = (ray as THREE.Line<THREE.BufferGeometry, THREE.LineBasicMaterial>).material;
        material.opacity = visibility * (0.025 + explode * (index % 7 === 0 ? 0.22 : 0.11));
      });
      pointMaterial.opacity = 0.12 + explode * 0.24;
      host.style.opacity = String(visibility);
      renderer.render(scene, camera);
      frame = requestAnimationFrame(render);
    };
    frame = requestAnimationFrame(render);

    return () => {
      cancelAnimationFrame(frame);
      introTween?.kill();
      scrollTrigger.kill();
      observer.disconnect();
      host.removeEventListener("pointerdown", onPointerDown);
      host.removeEventListener("pointermove", onPointerMove);
      host.removeEventListener("pointerup", stopPointer);
      host.removeEventListener("pointercancel", stopPointer);
      host.removeEventListener("lostpointercapture", stopPointer);
      host.removeEventListener("keydown", onKeyDown);
      host.removeEventListener("keyup", onKeyUp);
      scene.traverse((object) => {
        const mesh = object as THREE.Mesh;
        if (mesh.geometry) mesh.geometry.dispose();
        if (mesh.material) {
          const materials = Array.isArray(mesh.material) ? mesh.material : [mesh.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    };
  }, []);

  return (
    <div
      ref={hostRef}
      className="webgl-logo-stage"
      role="application"
      tabIndex={0}
      aria-label="Interactive 3D Assistmyday logo. Drag to rotate. Hold to energize. Scroll to move through the mark."
    >
      <canvas ref={canvasRef} className="webgl-logo-canvas" />
    </div>
  );
}
