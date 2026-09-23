import { useEffect, useRef, useState } from 'react'
import { Mesh, Program, Renderer, Triangle } from 'ogl'

type Origin = 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left'

interface SideRaysProps {
  speed?: number
  rayColor1?: string
  rayColor2?: string
  intensity?: number
  spread?: number
  origin?: Origin
  tilt?: number
  saturation?: number
  blend?: number
  falloff?: number
  opacity?: number
  className?: string
}

type UniformValue = { value: number | number[] }

const hexToRgb = (hex: string): [number, number, number] => {
  const match = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return match ? [parseInt(match[1], 16) / 255, parseInt(match[2], 16) / 255, parseInt(match[3], 16) / 255] : [1, 1, 1]
}

const originToFlip = (origin: Origin): [number, number] => {
  switch (origin) {
    case 'top-left': return [1, 0]
    case 'bottom-right': return [0, 1]
    case 'bottom-left': return [1, 1]
    default: return [0, 0]
  }
}

export default function SideRays({
  speed = 2.5,
  rayColor1 = '#EAB308',
  rayColor2 = '#96c8ff',
  intensity = 2,
  spread = 2,
  origin = 'top-right',
  tilt = 0,
  saturation = 1.5,
  blend = 0.75,
  falloff = 1.6,
  opacity = 1,
  className = '',
}: SideRaysProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    const container = containerRef.current
    if (!container) return
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { threshold: 0.1 })
    observer.observe(container)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    const container = containerRef.current
    if (!isVisible || !container) return

    let cancelled = false
    let frameId = 0
    let renderer: Renderer | null = null
    let mesh: Mesh | null = null
    let uniforms: Record<string, UniformValue> | null = null

    const initialize = async () => {
      await new Promise<void>((resolve) => window.setTimeout(resolve, 10))
      if (cancelled || !containerRef.current) return

      try {
        renderer = new Renderer({ dpr: Math.min(window.devicePixelRatio || 1, 2), alpha: true, premultipliedAlpha: false })
        const gl = renderer.gl
        gl.canvas.style.width = '100%'
        gl.canvas.style.height = '100%'
        gl.canvas.style.display = 'block'
        container.replaceChildren(gl.canvas)

        const vertex = `attribute vec2 position;
void main() { gl_Position = vec4(position, 0.0, 1.0); }`
        const fragment = `precision highp float;
uniform float iTime; uniform vec2 iResolution; uniform float iSpeed;
uniform vec3 iRayColor1; uniform vec3 iRayColor2; uniform float iIntensity;
uniform float iSpread; uniform float iFlipX; uniform float iFlipY; uniform float iTilt;
uniform float iSaturation; uniform float iBlend; uniform float iFalloff; uniform float iOpacity;
float rayStrength(vec2 source, vec2 direction, vec2 coord, float seedA, float seedB, float speed) {
  vec2 delta = coord - source; float angle = dot(normalize(delta), direction);
  return clamp((0.45 + 0.15 * sin(angle * seedA + iTime * speed)) + (0.3 + 0.2 * cos(-angle * seedB + iTime * speed)), 0.0, 1.0) * clamp((iResolution.x - length(delta)) / iResolution.x, 0.5, 1.0);
}
void main() {
  vec2 frag = gl_FragCoord.xy; if (iFlipX > 0.5) frag.x = iResolution.x - frag.x; if (iFlipY > 0.5) frag.y = iResolution.y - frag.y;
  vec2 coord = vec2(frag.x, iResolution.y - frag.y); vec2 source = vec2(iResolution.x * 1.1, -0.5 * iResolution.y);
  float angle = iTilt * 3.14159265 / 180.0; float cs = cos(angle); float sn = sin(angle); vec2 rel = coord - source;
  vec2 tilted = vec2(rel.x * cs - rel.y * sn, rel.x * sn + rel.y * cs) + source; float spread = iSpread * 0.275;
  vec2 dir1 = normalize(vec2(cos(0.785398 + spread), sin(0.785398 + spread))); vec2 dir2 = normalize(vec2(cos(0.785398 - spread), sin(0.785398 - spread)));
  vec3 rays1 = iRayColor1 * rayStrength(source, dir1, tilted, 36.2214, 21.11349, iSpeed);
  vec3 rays2 = iRayColor2 * rayStrength(source, dir2, tilted, 22.3991, 18.0234, iSpeed * 0.2);
  vec3 color = rays1 * (1.0 - iBlend) * 0.9 + rays2 * iBlend * 0.9;
  float distanceToLight = length(frag - vec2(source.x, iResolution.y - source.y)) / iResolution.y;
  color *= iIntensity * 0.4 / pow(max(distanceToLight, 0.001), iFalloff);
  float gray = dot(color, vec3(0.299, 0.587, 0.114)); color = mix(vec3(gray), color, iSaturation);
  gl_FragColor = vec4(color, max(color.r, max(color.g, color.b)) * iOpacity);
}`
        const [flipX, flipY] = originToFlip(origin)
        uniforms = {
          iTime: { value: 0 }, iResolution: { value: [1, 1] }, iSpeed: { value: speed },
          iRayColor1: { value: hexToRgb(rayColor1) }, iRayColor2: { value: hexToRgb(rayColor2) },
          iIntensity: { value: intensity }, iSpread: { value: spread }, iFlipX: { value: flipX }, iFlipY: { value: flipY },
          iTilt: { value: tilt }, iSaturation: { value: saturation }, iBlend: { value: blend }, iFalloff: { value: falloff }, iOpacity: { value: opacity },
        }
        const program = new Program(gl, { vertex, fragment, uniforms })
        mesh = new Mesh(gl, { geometry: new Triangle(gl), program })

        const resize = () => {
          if (!renderer || !containerRef.current) return
          const dpr = Math.min(window.devicePixelRatio || 1, 2)
          renderer.dpr = dpr
          const { clientWidth, clientHeight } = containerRef.current
          renderer.setSize(clientWidth, clientHeight)
          if (uniforms) uniforms.iResolution.value = [clientWidth * dpr, clientHeight * dpr]
        }
        const resizeObserver = new ResizeObserver(resize)
        resizeObserver.observe(container)
        resize()

        const render = (time: number) => {
          if (cancelled || !renderer || !mesh || !uniforms) return
          uniforms.iTime.value = time * 0.001
          renderer.render({ scene: mesh })
          frameId = requestAnimationFrame(render)
        }
        frameId = requestAnimationFrame(render)

        cleanup = () => {
          resizeObserver.disconnect()
          cancelAnimationFrame(frameId)
          renderer?.gl.getExtension('WEBGL_lose_context')?.loseContext()
          if (containerRef.current?.contains(gl.canvas)) containerRef.current.removeChild(gl.canvas)
          renderer = null
          mesh = null
          uniforms = null
        }
      } catch {
        container.dataset.webglUnavailable = 'true'
      }
    }

    let cleanup = () => {}
    void initialize()
    return () => {
      cancelled = true
      cleanup()
    }
  }, [isVisible, speed, rayColor1, rayColor2, intensity, spread, origin, tilt, saturation, blend, falloff, opacity])

  return <div ref={containerRef} aria-hidden="true" className={`side-rays relative h-full w-full overflow-hidden pointer-events-none ${className}`.trim()} />
}
