import React, { useState, useRef, useEffect } from 'react';
import { Camera, Upload, X, Check, RefreshCw, AlertCircle, FlipHorizontal } from 'lucide-react';

interface ClockOutPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: (photoUrl: string) => void;
}

export default function ClockOutPhotoModal({ isOpen, onClose, onConfirm }: ClockOutPhotoModalProps) {
  const [activeTab, setActiveTab] = useState<'camera' | 'upload'>('camera');
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);
  
  // Camera state
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [stream, setStream] = useState<MediaStream | null>(null);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [isCameraStarting, setIsCameraStarting] = useState(false);
  const [facingMode, setFacingMode] = useState<'user' | 'environment'>('user');

  // File upload state
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Start Camera Stream
  const startCamera = async (mode: 'user' | 'environment' = facingMode) => {
    setIsCameraStarting(true);
    setCameraError(null);
    stopCamera();

    try {
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        throw new Error('Camera access is not supported by your browser.');
      }
      const mediaStream = await navigator.mediaDevices.getUserMedia({
        video: {
          facingMode: mode,
          width: { ideal: 1280 },
          height: { ideal: 720 }
        },
        audio: false
      });
      setStream(mediaStream);
      if (videoRef.current) {
        videoRef.current.srcObject = mediaStream;
      }
    } catch (err: any) {
      console.warn('Camera error:', err);
      setCameraError(err.message || 'Unable to access camera. Please check browser permissions or upload a file instead.');
    } finally {
      setIsCameraStarting(false);
    }
  };

  // Stop Camera Stream
  const stopCamera = () => {
    if (stream) {
      stream.getTracks().forEach(track => track.stop());
      setStream(null);
    }
  };

  useEffect(() => {
    if (isOpen && activeTab === 'camera' && !capturedPhoto) {
      startCamera();
    } else {
      stopCamera();
    }
    return () => {
      stopCamera();
    };
  }, [isOpen, activeTab, capturedPhoto]);

  if (!isOpen) return null;

  const handleCaptureSnapshot = () => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      canvas.width = video.videoWidth || 640;
      canvas.height = video.videoHeight || 480;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // If facing user, flip horizontally for natural selfie view
        if (facingMode === 'user') {
          ctx.translate(canvas.width, 0);
          ctx.scale(-1, 1);
        }
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/jpeg', 0.85);
        setCapturedPhoto(dataUrl);
        stopCamera();
      }
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setCapturedPhoto(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleToggleFacingMode = () => {
    const nextMode = facingMode === 'user' ? 'environment' : 'user';
    setFacingMode(nextMode);
    startCamera(nextMode);
  };

  const handleRetake = () => {
    setCapturedPhoto(null);
    if (activeTab === 'camera') {
      startCamera();
    }
  };

  const handleConfirm = () => {
    if (capturedPhoto) {
      onConfirm(capturedPhoto);
      stopCamera();
    }
  };

  const handleClose = () => {
    stopCamera();
    setCapturedPhoto(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-sm flex items-center justify-center p-4">
      <div className="bg-white rounded-[2.5rem] border border-slate-200 max-w-lg w-full p-6 sm:p-8 shadow-2xl relative animate-in fade-in zoom-in-95 overflow-hidden">
        
        {/* Close Button */}
        <button
          type="button"
          onClick={handleClose}
          className="absolute top-6 right-6 w-10 h-10 rounded-2xl bg-slate-100 text-slate-500 hover:bg-slate-200 flex items-center justify-center transition-all z-10"
        >
          <X size={20} />
        </button>

        {/* Modal Header */}
        <div className="flex items-center gap-3 mb-6">
          <div className="w-12 h-12 rounded-2xl bg-rose-50 text-rose-600 flex items-center justify-center font-black shadow-sm">
            <Camera size={24} />
          </div>
          <div>
            <h3 className="text-xl font-black text-slate-900 tracking-tight">Clock-Out Photo Required</h3>
            <p className="text-xs font-bold text-slate-400">Capture a live photo or upload an image to verify shift end</p>
          </div>
        </div>

        {/* Mode Selector Tabs (only if no photo captured yet) */}
        {!capturedPhoto && (
          <div className="flex bg-slate-100 p-1.5 rounded-2xl mb-5">
            <button
              type="button"
              onClick={() => {
                setActiveTab('camera');
                setCameraError(null);
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === 'camera' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Camera size={16} />
              <span>Camera Capture</span>
            </button>
            <button
              type="button"
              onClick={() => {
                setActiveTab('upload');
                stopCamera();
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs font-black flex items-center justify-center gap-2 transition-all ${
                activeTab === 'upload' 
                  ? 'bg-white text-slate-900 shadow-sm' 
                  : 'text-slate-500 hover:text-slate-800'
              }`}
            >
              <Upload size={16} />
              <span>Upload Photo</span>
            </button>
          </div>
        )}

        {/* Main Content Area */}
        <div className="my-2">
          {/* 1. Preview of Captured/Uploaded Photo */}
          {capturedPhoto ? (
            <div className="relative rounded-3xl overflow-hidden border-2 border-emerald-500 bg-slate-900 group shadow-md">
              <img src={capturedPhoto} alt="Clock Out Verification" className="w-full h-72 object-cover" />
              <div className="absolute top-3 right-3 px-3 py-1 bg-emerald-500 text-white rounded-full text-[10px] font-black uppercase tracking-wider flex items-center gap-1 shadow-md">
                <Check size={12} /> Photo Ready
              </div>
              <div className="absolute bottom-4 left-0 right-0 flex justify-center px-4">
                <button
                  type="button"
                  onClick={handleRetake}
                  className="px-5 py-2.5 bg-white/95 backdrop-blur-md text-slate-900 font-black rounded-2xl text-xs flex items-center gap-2 shadow-lg hover:bg-white transition-all active:scale-95"
                >
                  <RefreshCw size={14} /> Retake / Choose Different
                </button>
              </div>
            </div>
          ) : activeTab === 'camera' ? (
            /* 2. Live Camera View */
            <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-200 min-h-[280px] flex flex-col items-center justify-center shadow-inner">
              <canvas ref={canvasRef} className="hidden" />
              
              {/* Live Video Element */}
              <video
                ref={videoRef}
                autoPlay
                playsInline
                muted
                className={`w-full h-72 object-cover ${facingMode === 'user' ? '-scale-x-100' : ''} ${cameraError ? 'hidden' : 'block'}`}
              />

              {/* Camera Starting Spinner */}
              {isCameraStarting && !cameraError && (
                <div className="absolute inset-0 bg-slate-950/80 backdrop-blur-sm flex flex-col items-center justify-center text-white p-4">
                  <RefreshCw size={28} className="animate-spin text-rose-500 mb-2" />
                  <p className="text-xs font-bold text-slate-300">Starting Camera Feed...</p>
                </div>
              )}

              {/* Camera Error / Fallback State */}
              {cameraError && (
                <div className="p-6 text-center text-slate-300 flex flex-col items-center justify-center space-y-3">
                  <div className="w-12 h-12 rounded-2xl bg-rose-500/20 text-rose-400 flex items-center justify-center">
                    <AlertCircle size={24} />
                  </div>
                  <p className="text-xs font-bold text-slate-300 max-w-xs">{cameraError}</p>
                  <div className="flex flex-wrap gap-2 justify-center pt-2">
                    <button
                      type="button"
                      onClick={() => startCamera()}
                      className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <RefreshCw size={14} /> Retry Camera
                    </button>
                    <button
                      type="button"
                      onClick={() => {
                        setActiveTab('upload');
                        fileInputRef.current?.click();
                      }}
                      className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5"
                    >
                      <Upload size={14} /> Upload File Instead
                    </button>
                  </div>
                </div>
              )}

              {/* Live Controls Overlay */}
              {!cameraError && stream && (
                <div className="absolute bottom-4 left-0 right-0 flex items-center justify-center gap-4 px-4 z-20">
                  <button
                    type="button"
                    onClick={handleToggleFacingMode}
                    className="w-10 h-10 rounded-full bg-slate-900/70 text-white backdrop-blur-md hover:bg-slate-900 flex items-center justify-center transition-all shadow-lg active:scale-90"
                    title="Flip Camera"
                  >
                    <FlipHorizontal size={18} />
                  </button>

                  <button
                    type="button"
                    onClick={handleCaptureSnapshot}
                    className="px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-black rounded-full text-xs flex items-center gap-2 shadow-xl shadow-rose-600/40 transition-all active:scale-95"
                  >
                    <div className="w-3 h-3 rounded-full bg-white animate-pulse" />
                    <span>Capture Photo</span>
                  </button>
                </div>
              )}
            </div>
          ) : (
            /* 3. Upload File Box */
            <div 
              onClick={() => fileInputRef.current?.click()}
              className="border-2 border-dashed border-slate-300 hover:border-rose-500 bg-slate-50 hover:bg-rose-50/40 rounded-3xl p-8 min-h-[280px] flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
            >
              <input 
                type="file" 
                accept="image/*" 
                capture="environment"
                ref={fileInputRef} 
                onChange={handleFileUpload} 
                className="hidden" 
              />
              <div className="w-16 h-16 rounded-2xl bg-white text-rose-600 border border-slate-200/80 flex items-center justify-center mb-3 shadow-md group-hover:scale-110 transition-transform">
                <Upload size={28} />
              </div>
              <p className="text-sm font-black text-slate-900 mb-1">Click to Upload or Browse Image</p>
              <p className="text-xs font-bold text-slate-400 max-w-xs">
                Upload staff selfie or shift end workspace photo from device
              </p>
            </div>
          )}
        </div>

        {/* Modal Actions */}
        <div className="flex items-center gap-3 mt-6">
          <button
            type="button"
            onClick={handleClose}
            className="flex-1 py-4 rounded-2xl border border-slate-200 text-slate-700 font-black text-xs hover:bg-slate-50 transition-all"
          >
            Cancel
          </button>
          <button
            type="button"
            disabled={!capturedPhoto}
            onClick={handleConfirm}
            className="flex-1 py-4 rounded-2xl bg-rose-600 hover:bg-rose-700 text-white font-black text-xs transition-all disabled:opacity-40 disabled:hover:bg-rose-600 shadow-md flex items-center justify-center gap-2"
          >
            <Check size={16} />
            <span>Confirm & Clock Out</span>
          </button>
        </div>

      </div>
    </div>
  );
}
