import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useGLTF, Environment, Lightformer } from "@react-three/drei";
import { Component, Suspense, useEffect, useMemo, useRef, useState, type ReactNode } from "react";
import { Box3, Vector3, type Group } from "three";
import { MeshoptDecoder } from "three/examples/jsm/libs/meshopt_decoder.module.js";
import { ASTRONAUT, LIGHTS, MODEL_URL } from "@/lib/astronaut";

class StageError extends Component<{ children: ReactNode }, { message: string | null }> {
  state = { message: null as string | null };
  static getDerivedStateFromError(error: unknown) {
    const message = error instanceof Error ? error.message : String(error);
    const w = window as Window & { __astroError?: string };
    w.__astroError = message;
    return { message };
  }
  render() {
    if (this.state.message) return null;
    return this.props.children;
  }
}

function readScrollProgress() {
  const max = document.documentElement.scrollHeight - window.innerHeight;
  return max > 0 ? window.scrollY / max : 0;
}

function Suit() {
  const gltf = useGLTF(MODEL_URL, false, false, (loader) => {
    loader.setMeshoptDecoder(MeshoptDecoder);
  });
  const scene = useMemo(() => gltf.scene.clone(true), [gltf.scene]);

  useEffect(() => {
    const box = new Box3().setFromObject(scene);
    const size = new Vector3();
    box.getSize(size);
    const w = window as Window & { __astro?: unknown };
    w.__astro = {
      size: size.toArray(),
      min: box.min.toArray(),
      max: box.max.toArray(),
      children: scene.children.map((c) => c.name),
    };
  }, [scene]);

  const group = useRef<Group>(null);
  const target = useRef(0);
  const smooth = useRef(0);
  const reduce = useRef(false);
  const { size } = useThree();

  useEffect(() => {
    const read = () => {
      target.current = readScrollProgress();
    };
    read();
    const motion = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onMotion = () => {
      reduce.current = motion.matches;
    };
    onMotion();
    motion.addEventListener("change", onMotion);
    window.addEventListener("scroll", read, { passive: true });
    window.addEventListener("resize", read);
    return () => {
      motion.removeEventListener("change", onMotion);
      window.removeEventListener("scroll", read);
      window.removeEventListener("resize", read);
    };
  }, []);

  useFrame((state, delta) => {
    const g = group.current;
    if (!g) return;
    const dt = Math.min(delta, 0.05);
    const goal = target.current;
    if (reduce.current) {
      smooth.current = goal;
    } else {
      const k = 1 - Math.exp(-dt / ASTRONAUT.scrub);
      smooth.current += (goal - smooth.current) * k;
    }
    const c = smooth.current;
    const aspect = size.width / Math.max(1, size.height);
    // Keep the same screen-fraction as the 16:9 rig when the frame is narrower.
    const xFit = Math.min(1, aspect / (16 / 9));
    g.position.x = (ASTRONAUT.startX + c * (ASTRONAUT.endX - ASTRONAUT.startX)) * xFit;
    const bob = reduce.current
      ? 0
      : Math.sin(state.clock.elapsedTime * ASTRONAUT.floatSpeed) * ASTRONAUT.floatAmplitude;
    // Measured feet of astronaut-small.glb. Shift so they rest on the original floor (positionY).
    const foot = -0.38;
    g.position.y = ASTRONAUT.positionY - foot * ASTRONAUT.scale + bob;
    g.position.z = 0;
    const extra =
      typeof window !== "undefined" && typeof (window as Window & { __yaw?: number }).__yaw === "number"
        ? (window as Window & { __yaw?: number }).__yaw!
        : -Math.PI / 2;
    g.rotation.y = extra + ASTRONAUT.initialRotationY + c * ASTRONAUT.rotationMultiplierY;
    g.rotation.x = ASTRONAUT.initialRotationX + c * ASTRONAUT.rotationMultiplierX;
  });

  return (
    <group ref={group} position={[ASTRONAUT.startX, ASTRONAUT.positionY, 0]}>
      <primitive object={scene} scale={ASTRONAUT.scale} />
    </group>
  );
}

export function AstronautStage() {
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const w = window as Window & { __stage?: string };
    w.__stage = "mounted";
    setReady(true);
    useGLTF.preload(MODEL_URL, false, false, (loader) => {
      loader.setMeshoptDecoder(MeshoptDecoder);
    });
  }, []);
  if (!ready) return null;

  return (
    <div className="astronaut-layer" aria-hidden="true">
      <Canvas
        camera={{
          position: [0, ASTRONAUT.cameraY, ASTRONAUT.cameraZ],
          fov: ASTRONAUT.fov,
          near: 0.1,
          far: 40,
        }}
        dpr={[1, 1.75]}
        gl={{
          antialias: true,
          alpha: true,
          powerPreference: "high-performance",
        }}
        onCreated={({ gl }) => {
          gl.setClearColor(0x000000, 0);
          gl.toneMappingExposure = 1.35;
        }}
      >
        <ambientLight intensity={ASTRONAUT.ambientIntensity} />
        <directionalLight
          position={[5, 5, 5]}
          intensity={ASTRONAUT.mainLightIntensity}
          color={LIGHTS.key}
        />
        <directionalLight
          position={[-5, 0, -5]}
          intensity={ASTRONAUT.rimLightIntensity}
          color={LIGHTS.rim}
        />
        <pointLight position={[0, -3, 2]} intensity={0.5} color={LIGHTS.pink} distance={10} />
        <pointLight position={[3, 2, -2]} intensity={0.4} color={LIGHTS.cyan} distance={10} />
        <directionalLight position={[0, 1, 8]} intensity={0.35} color={LIGHTS.key} />
        <Environment resolution={128} frames={1}>
          <Lightformer form="rect" intensity={2.4} color={LIGHTS.key} position={[0, 2, 6]} scale={[12, 6, 1]} />
          <Lightformer form="rect" intensity={1.6} color={LIGHTS.rim} position={[-5, 1, -2]} scale={[4, 8, 1]} />
          <Lightformer form="rect" intensity={1.1} color={LIGHTS.pink} position={[0, -2, 3]} scale={[8, 3, 1]} />
          <Lightformer form="rect" intensity={1} color={LIGHTS.cyan} position={[4, 2, 2]} scale={[3, 4, 1]} />
        </Environment>
        <Suspense fallback={null}>
          <StageError>
            <Suit />
          </StageError>
        </Suspense>
      </Canvas>
    </div>
  );
}
