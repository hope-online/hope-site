import { useEffect, useRef, useState } from 'react'
import { Canvas, useFrame } from '@react-three/fiber'
import { RoundedBox, Sparkles } from '@react-three/drei'
import * as THREE from 'three'

export type ProgressRef = { current: number }

const CAMINHO_PANORAMA = './panorama/igreja.jpg'

function usarArraste(alvo: { current: { drag: number; pitch: number } }) {
  const arrastando = useRef(false)
  const ultimo = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onDown = (e: PointerEvent) => {
      arrastando.current = true
      ultimo.current = { x: e.clientX, y: e.clientY }
    }
    const onMove = (e: PointerEvent) => {
      if (!arrastando.current) return
      alvo.current.drag -= (e.clientX - ultimo.current.x) * 0.004
      alvo.current.pitch -= (e.clientY - ultimo.current.y) * 0.0025
      alvo.current.pitch = Math.max(-0.35, Math.min(0.35, alvo.current.pitch))
      ultimo.current = { x: e.clientX, y: e.clientY }
    }
    const onUp = () => {
      arrastando.current = false
    }
    window.addEventListener('pointerdown', onDown)
    window.addEventListener('pointermove', onMove)
    window.addEventListener('pointerup', onUp)
    window.addEventListener('pointercancel', onUp)
    return () => {
      window.removeEventListener('pointerdown', onDown)
      window.removeEventListener('pointermove', onMove)
      window.removeEventListener('pointerup', onUp)
      window.removeEventListener('pointercancel', onUp)
    }
  }, [alvo])
}

function Cruz({ progressRef, dark }: { progressRef: ProgressRef; dark: boolean }) {
  const grupo = useRef<THREE.Group>(null)
  const anel1 = useRef<THREE.Group>(null)
  const anel2 = useRef<THREE.Group>(null)
  const mouse = useRef({ x: 0, y: 0 })

  useEffect(() => {
    const onMove = (e: PointerEvent) => {
      mouse.current.x = (e.clientX / window.innerWidth) * 2 - 1
      mouse.current.y = -(e.clientY / window.innerHeight) * 2 + 1
    }
    window.addEventListener('pointermove', onMove)
    return () => window.removeEventListener('pointermove', onMove)
  }, [])

  useFrame((state) => {
    const p = progressRef.current
    const t = state.clock.elapsedTime

    if (grupo.current) {
      grupo.current.rotation.y = t * 0.15 + p * Math.PI * 2.2 + mouse.current.x * 0.2
      grupo.current.rotation.x = Math.sin(t * 0.25) * 0.05 + mouse.current.y * -0.1
      grupo.current.position.y = Math.sin(t * 0.6) * 0.12
      grupo.current.scale.setScalar(1 + p * 1.6)
    }
    if (anel1.current) {
      anel1.current.rotation.z = t * 0.2
      anel1.current.scale.setScalar(1 + p * 2.4)
    }
    if (anel2.current) {
      anel2.current.rotation.z = -t * 0.12
      anel2.current.scale.setScalar(1 + p * 3)
    }

    const cam = state.camera
    cam.position.z = 9 - p * 7.6
    cam.position.y = 0.6 + p * 0.4
    cam.lookAt(0, 0.5, 0)
  })

  const corCruz = dark ? '#f1f5f9' : '#0f172a'

  return (
    <>
      <group ref={grupo}>
        <RoundedBox args={[0.55, 3.4, 0.55]} radius={0.09} position={[0, 0.4, 0]}>
          <meshStandardMaterial color={corCruz} roughness={0.2} metalness={0.45} />
        </RoundedBox>
        <RoundedBox args={[2.0, 0.55, 0.55]} radius={0.09} position={[0, 1.15, 0]}>
          <meshStandardMaterial color={corCruz} roughness={0.2} metalness={0.45} />
        </RoundedBox>
      </group>
      <group ref={anel1} rotation={[Math.PI / 2.4, 0.4, 0]}>
        <mesh>
          <torusGeometry args={[2.6, 0.012, 12, 128]} />
          <meshBasicMaterial color="#84cc16" transparent opacity={0.6} />
        </mesh>
      </group>
      <group ref={anel2} rotation={[Math.PI / 1.8, -0.6, 0.4]}>
        <mesh>
          <torusGeometry args={[3.1, 0.008, 12, 128]} />
          <meshBasicMaterial color="#a3e635" transparent opacity={0.35} />
        </mesh>
      </group>
    </>
  )
}

function Esfera360({ progressRef, textura }: { progressRef: ProgressRef; textura: THREE.Texture }) {
  const esfera = useRef<THREE.Mesh>(null)
  const alvo = useRef({ drag: 0, pitch: 0 })
  const atual = useRef({ yaw: 0, pitch: 0 })
  usarArraste(alvo)

  useFrame((state) => {
    const p = progressRef.current
    const t = state.clock.elapsedTime

    alvo.current.drag += 0.0009
    const desejado = alvo.current.drag + p * Math.PI * 1.3
    atual.current.yaw += (desejado - atual.current.yaw) * 0.07
    atual.current.pitch += (alvo.current.pitch - atual.current.pitch) * 0.07

    if (esfera.current) {
      esfera.current.rotation.y = atual.current.yaw + t * 0.012
      esfera.current.rotation.x = atual.current.pitch
    }

    const cam = state.camera as THREE.PerspectiveCamera
    cam.fov = 62 - p * 12
    cam.updateProjectionMatrix()
  })

  return (
    <mesh ref={esfera}>
      <sphereGeometry args={[50, 64, 64]} />
      <meshBasicMaterial map={textura} side={THREE.BackSide} />
    </mesh>
  )
}

// Panorâmica parcial (não 360°) mapeada num cilindro, sem distorção —
// como se o visitante estivesse de pé no meio do salão olhando ao redor.
function PanoCilindro({ progressRef, dark, textura }: { progressRef: ProgressRef; dark: boolean; textura: THREE.Texture }) {
  const RAIO = 30
  const ALTURA = 40
  const ABERTURA = THREE.MathUtils.degToRad(250)
  const FOVTELA = 62
  const LIMITE = ABERTURA / 2 - THREE.MathUtils.degToRad(FOVTELA / 2 + 8)

  const grupo = useRef<THREE.Group>(null)
  const alvo = useRef({ drag: 0, pitch: 0 })
  const atual = useRef({ yaw: 0, pitch: 0 })
  usarArraste(alvo)

  useFrame((state) => {
    const p = progressRef.current

    // O scroll varre a panorâmica; o arraste explora livremente dentro do limite
    const desejado = Math.max(-LIMITE, Math.min(LIMITE, (0.5 - p) * 2.4 + alvo.current.drag))
    atual.current.yaw += (desejado - atual.current.yaw) * 0.08
    atual.current.pitch += (alvo.current.pitch - atual.current.pitch) * 0.08

    if (grupo.current) {
      grupo.current.rotation.y = atual.current.yaw
    }

    const cam = state.camera as THREE.PerspectiveCamera
    cam.rotation.x = atual.current.pitch * 0.7
    cam.fov = FOVTELA - p * 8
    cam.updateProjectionMatrix()
  })

  const corBase = dark ? '#0a0f0c' : '#eef1ef'

  return (
    <group ref={grupo}>
      <mesh>
        <cylinderGeometry args={[RAIO, RAIO, ALTURA, 96, 1, true, Math.PI - ABERTURA / 2, ABERTURA]} />
        <meshBasicMaterial map={textura} side={THREE.BackSide} />
      </mesh>
      {/* piso e teto fechando a cena */}
      <mesh position={[0, -ALTURA / 2, 0]} rotation={[-Math.PI / 2, 0, 0]}>
        <circleGeometry args={[RAIO, 64]} />
        <meshBasicMaterial color={corBase} />
      </mesh>
      <mesh position={[0, ALTURA / 2, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <circleGeometry args={[RAIO, 64]} />
        <meshBasicMaterial color={corBase} />
      </mesh>
    </group>
  )
}

export function Cena3D({ progressRef, dark }: { progressRef: ProgressRef; dark: boolean }) {
  const [panorama, setPanorama] = useState<{ textura: THREE.Texture; esfera: boolean } | null>(null)

  // Detecta o modo pela proporção da imagem: ~2:1 = esfera 360° real; caso contrário, cilindro
  useEffect(() => {
    let ativo = true
    new THREE.TextureLoader().load(
      CAMINHO_PANORAMA,
      (t) => {
        if (!ativo) return
        t.colorSpace = THREE.SRGBColorSpace
        const img = t.image as HTMLImageElement
        const proporcao = img.width / img.height
        setPanorama({ textura: t, esfera: Math.abs(proporcao - 2) < 0.2 })
      },
      undefined,
      () => {
        if (ativo) setPanorama(null)
      },
    )
    return () => {
      ativo = false
    }
  }, [])

  return (
    <Canvas
      camera={{ position: [0, 0, 0.1], fov: 62 }}
      dpr={[1, 2]}
      gl={{ antialias: true, alpha: true }}
    >
      {panorama ? (
        panorama.esfera ? (
          <Esfera360 progressRef={progressRef} textura={panorama.textura} />
        ) : (
          <PanoCilindro progressRef={progressRef} dark={dark} textura={panorama.textura} />
        )
      ) : (
        <>
          <ambientLight intensity={dark ? 0.35 : 0.6} />
          <directionalLight position={[4, 6, 6]} intensity={1.4} />
          <pointLight position={[-6, 2, -4]} color="#84cc16" intensity={dark ? 90 : 40} />
          <pointLight position={[6, -3, 2]} color="#a3e635" intensity={dark ? 50 : 20} />
          <fog attach="fog" args={[dark ? '#0a0f0c' : '#f8fafc', 10, 24]} />
          <Cruz progressRef={progressRef} dark={dark} />
          <Sparkles
            count={160}
            scale={[16, 10, 10]}
            size={2.4}
            speed={0.35}
            color={dark ? '#a3e635' : '#4d7c0f'}
            opacity={0.7}
          />
        </>
      )}
    </Canvas>
  )
}
