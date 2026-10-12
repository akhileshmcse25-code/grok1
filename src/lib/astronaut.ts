/** Scroll rig taken from the original Campus Ambassador astronaut layer. */
export const ASTRONAUT = {
  /** This GLB is already the reduced suit. 1 keeps its authored size (the old page scaled a heavier mesh by 1.2). */
  scale: 1,
  positionY: -2.5,
  startX: 3,
  endX: -3,
  cameraZ: 6,
  cameraY: 0.5,
  fov: 50,
  initialRotationY: 0.2 * Math.PI,
  initialRotationX: 0.1,
  rotationMultiplierY: 2 * Math.PI,
  rotationMultiplierX: 0.3,
  floatAmplitude: 0.1,
  floatSpeed: 0.8,
  ambientIntensity: 0.6,
  mainLightIntensity: 1.5,
  rimLightIntensity: 0.8,
  /** ScrollTrigger scrub (seconds to catch the scroll). */
  scrub: 0.35,
} as const;

export const LIGHTS = {
  key: "#ffffff",
  rim: "#8b5cf6",
  pink: "#ec4899",
  cyan: "#06b6d4",
} as const;

export const MODEL_URL = "/models/astronaut.glb";
