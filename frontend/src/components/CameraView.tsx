import { useEffect, useRef, useState } from "react";

type Props = {
  onGrabBase64: (grab: () => string) => void;
  running: boolean;
};

export default function CameraView({ onGrabBase64, running }: Props) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(document.createElement("canvas"));
  const [ready, setReady] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let stream: MediaStream | null = null;
    
    (async () => {
      if (!running) return;
      
      try {
        stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: "user" }, 
          audio: false 
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          await videoRef.current.play();
          setReady(true);
          setError(null);
        }
      } catch (err) {
        setError("Camera access denied. Please allow camera permissions.");
        console.error("Camera error:", err);
      }
    })();

    return () => {
      setReady(false);
      stream?.getTracks().forEach(t => t.stop());
      if (videoRef.current) videoRef.current.srcObject = null;
    };
  }, [running]);

  function grabFrameBase64() {
    const v = videoRef.current;
    if (!v || !ready) return "";
    
    const c = canvasRef.current;
    const targetW = 512; // downscale for speed/cost
    const ratio = v.videoHeight / v.videoWidth;
    const targetH = Math.round(targetW * ratio);
    
    c.width = targetW;
    c.height = targetH;
    
    const ctx = c.getContext("2d");
    if (!ctx) return "";
    
    ctx.drawImage(v, 0, 0, targetW, targetH);
    return c.toDataURL("image/jpeg", 0.8).replace(/^data:image\/\w+;base64,/, "");
  }

  useEffect(() => {
    if (ready) {
      onGrabBase64(() => grabFrameBase64());
    }
  }, [ready, onGrabBase64]);

  return (
    <div className="camera-container">
      <video 
        ref={videoRef} 
        className="camera-video"
        playsInline 
        muted 
      />
      {!running && (
        <div className="camera-placeholder">
          <div className="placeholder-content">
            <svg 
              width="80" 
              height="80" 
              viewBox="0 0 24 24" 
              fill="none" 
              stroke="currentColor" 
              strokeWidth="1.5"
              strokeLinecap="round" 
              strokeLinejoin="round"
            >
              <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z" />
              <circle cx="12" cy="13" r="4" />
            </svg>
            <p>Camera Off</p>
          </div>
        </div>
      )}
      {error && (
        <div className="camera-error">
          {error}
        </div>
      )}
    </div>
  );
}
