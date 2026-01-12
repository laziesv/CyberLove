import { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { Button } from '@/components/ui/button';
import { Challenge } from '@/types/game';
import { CheckCircle2, ZoomIn, AlertCircle, RefreshCcw } from 'lucide-react';

interface ScytaleCipherProps {
    challenge: Challenge;
    onComplete: (correct: boolean) => void;
}

const ScytaleCipher = ({ challenge, onComplete }: ScytaleCipherProps) => {
    const mountRef = useRef<HTMLDivElement>(null);

    // Refs
    const sceneRef = useRef<THREE.Scene | null>(null);
    const cameraRef = useRef<THREE.PerspectiveCamera | null>(null);
    const rendererRef = useRef<THREE.WebGLRenderer | null>(null);
    const cylindersRef = useRef<THREE.Mesh[]>([]);
    const isDraggingRef = useRef(false);
    const prevMouseRef = useRef({ x: 0, y: 0 });
    const selectedCylinderRef = useRef<number | null>(null);
    const hoveredCylinderRef = useRef<number | null>(null);

    // State
    const [selectedCylinder, setSelectedCylinder] = useState<number | null>(null);
    const [isSubmitted, setIsSubmitted] = useState(false);
    const [confirming, setConfirming] = useState(false);

    // State สำหรับตำแหน่งคำตอบ
    const [targetIndex, setTargetIndex] = useState<number>(() => Math.floor(Math.random() * 5));
    const [feedback, setFeedback] = useState<string | null>(null);
    const [isShuffling, setIsShuffling] = useState(false);

    const targetWord = "TRIMESTER";

    // --- 1. Scene Setup ---
    useEffect(() => {
        if (!mountRef.current) return;

        // Scene
        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x0f0f13);
        sceneRef.current = scene;

        // Camera
        const width = mountRef.current.clientWidth;
        const height = mountRef.current.clientHeight;
        const camera = new THREE.PerspectiveCamera(50, width / height, 0.1, 1000);
        camera.position.z = 22;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: "high-performance" });
        renderer.setSize(width, height);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        mountRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Lights
        const ambientLight = new THREE.AmbientLight(0xffffff, 1.5);
        scene.add(ambientLight);
        const dirLight = new THREE.DirectionalLight(0xff00ff, 3.0);
        dirLight.position.set(5, 5, 10);
        scene.add(dirLight);
        const blueLight = new THREE.DirectionalLight(0x00ffff, 3.0);
        blueLight.position.set(-5, -5, 10);
        scene.add(blueLight);

        // Create Cylinders Placeholders
        const geometry = new THREE.CylinderGeometry(1.5, 1.5, 8, 64);
        const cylinders: THREE.Mesh[] = [];

        for (let i = 0; i < 5; i++) {
            const material = new THREE.MeshStandardMaterial({
                color: 0xffffff,
                roughness: 0.4,
                metalness: 0.1,
                emissive: 0x222222,
                emissiveIntensity: 0.2
            });

            const cylinder = new THREE.Mesh(geometry, material);
            cylinder.position.x = (i - 2) * 6;
            cylinder.userData = { id: i };

            cylinder.rotation.y = Math.random() * Math.PI * 2;
            cylinder.rotation.x = Math.random() * 0.5 - 0.25;

            scene.add(cylinder);
            cylinders.push(cylinder);
        }
        cylindersRef.current = cylinders;

        // Interaction
        const raycaster = new THREE.Raycaster();
        const mouse = new THREE.Vector2();
        let currentInterectedCylinder: THREE.Mesh | null = null;

        const onMouseDown = (e: MouseEvent) => {
            if (isSubmitted) return;
            isDraggingRef.current = true;
            prevMouseRef.current = { x: e.clientX, y: e.clientY };

            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cylinders);

            if (intersects.length > 0) {
                currentInterectedCylinder = intersects[0].object as THREE.Mesh;
                const clickedId = intersects[0].object.userData.id;
                window.dispatchEvent(new CustomEvent('cylinder-clicked', { detail: clickedId }));
            }
        };

        const onMouseMove = (e: MouseEvent) => {
            const rect = renderer.domElement.getBoundingClientRect();
            mouse.x = ((e.clientX - rect.left) / rect.width) * 2 - 1;
            mouse.y = -((e.clientY - rect.top) / rect.height) * 2 + 1;

            raycaster.setFromCamera(mouse, camera);
            const intersects = raycaster.intersectObjects(cylinders);

            if (intersects.length > 0) {
                hoveredCylinderRef.current = intersects[0].object.userData.id;
                document.body.style.cursor = 'grab';
            } else {
                hoveredCylinderRef.current = null;
                document.body.style.cursor = 'default';
            }

            if (isDraggingRef.current && currentInterectedCylinder) {
                document.body.style.cursor = 'grabbing';
                const deltaX = e.clientX - prevMouseRef.current.x;
                const deltaY = e.clientY - prevMouseRef.current.y;
                currentInterectedCylinder.rotation.y += deltaX * 0.005;
                currentInterectedCylinder.rotation.x += deltaY * 0.005;
                prevMouseRef.current = { x: e.clientX, y: e.clientY };
            }
        };

        const onMouseUp = () => {
            isDraggingRef.current = false;
            currentInterectedCylinder = null;
        };

        renderer.domElement.addEventListener('mousedown', onMouseDown);
        window.addEventListener('mousemove', onMouseMove);
        window.addEventListener('mouseup', onMouseUp);

        // Animation Loop
        let animationId: number;
        const animate = () => {
            animationId = requestAnimationFrame(animate);

            const targetId = selectedCylinderRef.current;
            let targetX = 0;
            let targetZ = 22;

            if (targetId !== null) {
                targetX = (targetId - 2) * 6;
                targetZ = 12;
            }

            if (cameraRef.current) {
                cameraRef.current.position.x = THREE.MathUtils.lerp(cameraRef.current.position.x, targetX, 0.05);
                cameraRef.current.position.z = THREE.MathUtils.lerp(cameraRef.current.position.z, targetZ, 0.05);
                cameraRef.current.lookAt(targetX, 0, 0);
            }

            cylindersRef.current.forEach((cyl, idx) => {
                const mat = cyl.material as THREE.MeshStandardMaterial;
                const isSelected = selectedCylinderRef.current === idx;
                const isHovered = hoveredCylinderRef.current === idx;

                if (isSelected) {
                    mat.emissive.setHex(0x222222);
                    mat.emissiveIntensity = 0.5;
                } else if (isHovered) {
                    mat.emissive.setHex(0xff00ff);
                    mat.emissiveIntensity = 0.4;
                } else {
                    mat.emissive.setHex(0x222222);
                    mat.emissiveIntensity = 0.2;
                }

                if (!isDraggingRef.current || currentInterectedCylinder !== cyl) {
                    cyl.rotation.y += 0.0005;
                }
            });

            if (rendererRef.current && sceneRef.current && cameraRef.current) {
                rendererRef.current.render(sceneRef.current, cameraRef.current);
            }
        };
        animate();

        return () => {
            cancelAnimationFrame(animationId);
            if (renderer.domElement) {
                renderer.domElement.removeEventListener('mousedown', onMouseDown);
            }
            window.removeEventListener('mousemove', onMouseMove);
            window.removeEventListener('mouseup', onMouseUp);
            if (mountRef.current && renderer.domElement) {
                mountRef.current.removeChild(renderer.domElement);
            }
            geometry.dispose();
            renderer.dispose();
        };
    }, []);

    // --- 2. Texture Generation (Modified for Highlighting) ---
    useEffect(() => {
        if (!rendererRef.current || cylindersRef.current.length === 0) return;

        const createTextTexture = (word: string, isCorrect: boolean) => {
            const canvas = document.createElement('canvas');
            const ctx = canvas.getContext('2d');
            const size = 2048;
            canvas.width = size;
            canvas.height = size;

            // Background
            ctx!.fillStyle = '#1a1a1a';
            ctx!.fillRect(0, 0, size, size);

            const rows = 10;
            const cols = 10;
            const cellW = size / cols;
            const cellH = size / rows;

            // Grid Lines
            ctx!.strokeStyle = '#00ffff';
            ctx!.lineWidth = 5;
            ctx!.beginPath();
            for (let i = 0; i <= cols; i++) { ctx!.moveTo(i * cellW, 0); ctx!.lineTo(i * cellW, size); }
            for (let i = 0; i <= rows; i++) { ctx!.moveTo(0, i * cellH); ctx!.lineTo(size, i * cellH); }
            ctx!.stroke();

            const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
            ctx!.textBaseline = 'middle';
            ctx!.textAlign = 'center';
            ctx!.font = 'bold 150px "Courier New", monospace';

            for (let r = 0; r < rows; r++) {
                for (let c = 0; c < cols; c++) {
                    let char = "";
                    let isTargetChar = false;

                    // ตรวจสอบว่าเป็นตัวอักษรของคำตอบหรือไม่
                    if (isCorrect && c === (r + 1) % cols && r < word.length) {
                        char = word[r];
                        isTargetChar = true;
                    } else {
                        char = alphabet[Math.floor(Math.random() * alphabet.length)];
                    }

                    // [ไฮไลท์] ถ้าเป็นคำตอบให้ใช้สีชมพู (Magenta) ถ้าไม่ใช่ให้ใช้สีฟ้าจางๆ
                    ctx!.fillStyle = '#00ffff';
                    ctx!.shadowColor = '#00ffff';
                    ctx!.shadowBlur = 15;

                    ctx!.fillText(char, c * cellW + cellW / 2, r * cellH + cellH / 2);
                }
            }

            const texture = new THREE.CanvasTexture(canvas);
            if (rendererRef.current) {
                texture.anisotropy = rendererRef.current.capabilities.getMaxAnisotropy();
            }
            return texture;
        };

        cylindersRef.current.forEach((cyl, idx) => {
            const isTarget = idx === targetIndex;
            const texture = createTextTexture(targetWord, isTarget);
            const mat = cyl.material as THREE.MeshStandardMaterial;
            mat.map = texture;
            mat.needsUpdate = true;
        });

    }, [targetIndex]);

    // Event Listeners & State Logic (เหมือนเดิม)
    useEffect(() => {
        const handleCylinderClick = (e: any) => {
            if (!isSubmitted && !isShuffling) {
                setSelectedCylinder(e.detail);
                setConfirming(false);
            }
        };
        window.addEventListener('cylinder-clicked', handleCylinderClick);
        return () => window.removeEventListener('cylinder-clicked', handleCylinderClick);
    }, [isSubmitted, isShuffling]);

    useEffect(() => {
        selectedCylinderRef.current = selectedCylinder;
    }, [selectedCylinder]);

    const handleButtonClick = () => {
        if (selectedCylinder === null || isShuffling) return;

        if (!confirming) {
            setConfirming(true);
        } else {
            if (selectedCylinder === targetIndex) {
                setIsSubmitted(true);
                setFeedback(null);
                onComplete(true);
            } else {
                setFeedback("นี่มันไม่น่าใช่แท่งรหัสนี้นะ! ลองใหม่อีกรอบสิ!");
                setIsShuffling(true);
                setSelectedCylinder(null);
                setConfirming(false);

                setTimeout(() => {
                    let newIndex = Math.floor(Math.random() * 5);
                    while (newIndex === targetIndex) {
                        newIndex = Math.floor(Math.random() * 5);
                    }
                    setTargetIndex(newIndex);
                    setIsShuffling(false);
                    setFeedback(null);
                }, 1500);
            }
        }
    };

    return (
        <div className="flex flex-col items-center w-full max-w-4xl mx-auto bg-black/50 backdrop-blur-md rounded-xl border-2 border-love-pink/50 p-4 shadow-glow">
            <div className="text-center mb-4">
                <h3 className="text-2xl font-bold text-gradient-love mb-2">Scytale Decoder</h3>
                <p className="text-muted-foreground">
                    "คำใบ้คือ: "การที่เราเรียนหนักแตกต่างจากมหาลัยอื่นคืออะไรนะ" ลองหมุนหาคำศัพท์ที่เกี่ยวข้องดูนะคะ"
                </p>
                <p className="text-xs text-love-pink mt-1 animate-pulse">
                    (หากตอบผิด ระบบจะทำการสลับตำแหน่งคำตอบใหม่ทันที)
                </p>
            </div>

            <div
                ref={mountRef}
                className="w-full h-[400px] cursor-grab active:cursor-grabbing rounded-lg overflow-hidden border border-cyber-blue/30 relative"
            >
                <div className="absolute top-4 left-4 bg-black/60 p-2 rounded text-xs text-white pointer-events-none select-none flex flex-col gap-1">
                    <div className="flex items-center gap-2">
                        {selectedCylinder !== null ? (
                            <>
                                <ZoomIn className="w-4 h-4 text-love-pink" />
                                Viewing Cylinder {selectedCylinder + 1}
                            </>
                        ) : (
                            "Select a cylinder"
                        )}
                    </div>
                </div>

                {feedback && (
                    <div className="absolute inset-0 flex items-center justify-center bg-black/70 z-10 backdrop-blur-sm transition-all">
                        <div className="text-red-500 font-bold text-xl flex flex-col items-center animate-bounce">
                            <RefreshCcw className="w-10 h-10 mb-2 animate-spin" />
                            {feedback}
                        </div>
                    </div>
                )}
            </div>

            <div className="grid grid-cols-5 gap-2 mt-6 w-full px-4">
                {[0, 1, 2, 3, 4].map((idx) => (
                    <Button
                        key={idx}
                        variant={selectedCylinder === idx ? "default" : "outline"}
                        className={`
              h-12 font-orbitron transition-all
              ${selectedCylinder === idx
                                ? 'bg-love-pink hover:bg-love-pink/80 border-love-pink shadow-[0_0_15px_rgba(255,0,255,0.5)]'
                                : 'border-cyber-blue/50 text-cyber-blue hover:bg-cyber-blue/10'}
              ${isSubmitted || isShuffling ? 'opacity-50 cursor-not-allowed' : ''}
            `}
                        onClick={() => {
                            if (!isSubmitted && !isShuffling) {
                                setSelectedCylinder(idx);
                                setConfirming(false);
                            }
                        }}
                        disabled={isSubmitted || isShuffling}
                    >
                        {selectedCylinder === idx && <CheckCircle2 className="w-4 h-4 mr-1" />}
                        #{idx + 1}
                    </Button>
                ))}
            </div>

            <div className="mt-6 w-full max-w-xs">
                <Button
                    className={`
            w-full text-lg h-12 transition-all duration-300
            ${confirming
                            ? 'bg-yellow-600 hover:bg-yellow-500 text-white animate-pulse shadow-[0_0_20px_rgba(255,200,0,0.6)]'
                            : 'bg-gradient-to-r from-cyber-purple to-love-pink'}
          `}
                    onClick={handleButtonClick}
                    disabled={selectedCylinder === null || isSubmitted || isShuffling}
                >
                    {isSubmitted ? (
                        'รหัสถูกต้อง!'
                    ) : confirming ? (
                        <span className="flex items-center gap-2">
                            <AlertCircle className="w-5 h-5" />
                            ยืนยันคำตอบ?
                        </span>
                    ) : (
                        'เลือกคำตอบนี้'
                    )}
                </Button>
            </div>
        </div>
    );
};

export default ScytaleCipher;