import { useEffect, useRef, useState } from "react";
import { ArrowLeft, Camera, RotateCcw, Square } from "lucide-react";
import toast from "react-hot-toast";
import { KycPrimaryButton, KycSecondaryButton } from "../shared/KycButtons";

const MAX_VIDEO_SIZE = 50 * 1024 * 1024;

const getRecorderMimeType = () => {
  if (typeof MediaRecorder === "undefined") return "";
  const types = ["video/mp4", "video/webm;codecs=vp9,opus", "video/webm;codecs=vp8,opus", "video/webm"];
  return types.find((t) => MediaRecorder.isTypeSupported(t)) || "";
};

const getVideoExtension = (mimeType: string) => {
  if (mimeType.includes("mp4")) return "mp4";
  if (mimeType.includes("quicktime")) return "mov";
  return "mkv";
};

// WebM uses the Matroska container — remap to x-matroska so backend accepts it
const getUploadMimeType = (mimeType: string) => {
  if (mimeType.includes("webm")) return "video/x-matroska";
  return mimeType;
};

interface VideoStepProps {
  isPending: boolean;
  onUpload: (video: File) => Promise<void>;
  onBack: () => void;
}

const VideoStep = ({ isPending, onUpload, onBack }: VideoStepProps) => {
  const [kycVideo, setKycVideo] = useState<File | null>(null);
  const [cameraStream, setCameraStream] = useState<MediaStream | null>(null);
  const [isRecording, setIsRecording] = useState(false);
  const [recordingSeconds, setRecordingSeconds] = useState(0);
  const [previewUrl, setPreviewUrl] = useState("");
  const [cameraError, setCameraError] = useState("");

  const liveVideoRef = useRef<HTMLVideoElement | null>(null);
  const recorderRef = useRef<MediaRecorder | null>(null);
  const chunksRef = useRef<Blob[]>([]);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    if (liveVideoRef.current && cameraStream) {
      liveVideoRef.current.srcObject = cameraStream;
    }
  }, [cameraStream]);

  useEffect(() => {
    return () => {
      stopCamera();
      if (previewUrl) URL.revokeObjectURL(previewUrl);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [previewUrl]);

  const stopCamera = () => {
    cameraStream?.getTracks().forEach((track) => track.stop());
    setCameraStream(null);
    if (liveVideoRef.current) liveVideoRef.current.srcObject = null;
  };

  const clearTimer = () => {
    if (timerRef.current) {
      window.clearInterval(timerRef.current);
      timerRef.current = null;
    }
  };

  const startCamera = async () => {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Camera recording is not supported in this browser.");
      return null;
    }
    try {
      setCameraError("");
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: true,
        video: { facingMode: "user", width: { ideal: 720 }, height: { ideal: 720 } },
      });
      setCameraStream(stream);
      return stream;
    } catch {
      setCameraError("Camera permission is required to record KYC video.");
      return null;
    }
  };

  const handleStartRecording = async () => {
    if (typeof MediaRecorder === "undefined") {
      setCameraError("Video recording is not supported in this browser.");
      return;
    }
    const stream = cameraStream || (await startCamera());
    if (!stream) return;

    const mimeType = getRecorderMimeType();
    try {
      chunksRef.current = [];
      const recorder = new MediaRecorder(stream, mimeType ? { mimeType } : undefined);
      recorderRef.current = recorder;

      recorder.ondataavailable = (e) => {
        if (e.data.size > 0) chunksRef.current.push(e.data);
      };

      recorder.onstop = () => {
        const recordedType = recorder.mimeType || mimeType || "video/webm";
        const rawType = recordedType.split(";")[0].trim() || "video/webm";
        const uploadType = getUploadMimeType(rawType);
        const extension = getVideoExtension(rawType);
        const blob = new Blob(chunksRef.current, { type: uploadType });
        const file = new File([blob], `kyc-video-${Date.now()}.${extension}`, { type: uploadType });

        if (file.size > MAX_VIDEO_SIZE) {
          setKycVideo(null);
          toast.error("Video must be under 50 MB. Please record a shorter video.");
          return;
        }

        if (previewUrl) URL.revokeObjectURL(previewUrl);
        setKycVideo(file);
        setPreviewUrl(URL.createObjectURL(blob));
      };

      setKycVideo(null);
      setPreviewUrl("");
      setRecordingSeconds(0);
      setIsRecording(true);
      recorder.start();
      timerRef.current = window.setInterval(() => {
        setRecordingSeconds((s) => s + 1);
      }, 1000);
    } catch {
      setCameraError("Could not start video recording on this device.");
    }
  };

  const handleStopRecording = () => {
    if (recorderRef.current?.state === "recording") recorderRef.current.stop();
    setIsRecording(false);
    clearTimer();
    stopCamera();
  };

  const handleRetake = () => {
    if (previewUrl) URL.revokeObjectURL(previewUrl);
    setPreviewUrl("");
    setKycVideo(null);
    setRecordingSeconds(0);
    setCameraError("");
  };

  const handleUpload = async () => {
    if (!kycVideo) {
      toast.error("Record your KYC video first.");
      return;
    }
    if (!kycVideo.type.startsWith("video/")) {
      toast.error("Only video files are allowed.");
      return;
    }
    if (kycVideo.size > MAX_VIDEO_SIZE) {
      toast.error("Video must be under 50 MB.");
      return;
    }
    await onUpload(kycVideo);
  };

  return (
    <div className="space-y-4">
      <p className="text-sm text-slate-600">
        Record a short live video from your front camera for final KYC submission. Keep it under 50 MB.
      </p>

      <div className="mx-auto w-full max-w-3xl overflow-hidden rounded-lg border border-slate-200 bg-slate-950 shadow-sm">
        {previewUrl ? (
          <video className="aspect-video w-full bg-black object-cover" src={previewUrl} controls />
        ) : cameraStream ? (
          <video
            ref={liveVideoRef}
            className="aspect-video w-full bg-black object-cover"
            autoPlay
            muted
            playsInline
          />
        ) : (
          <div className="flex aspect-video w-full flex-col items-center justify-center bg-slate-900 px-4 text-center text-slate-300">
            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/10 text-white">
              <Camera size={24} />
            </div>
            <p className="mt-4 text-sm font-semibold text-white">Camera preview will appear here</p>
            <p className="mt-1 max-w-sm text-xs leading-5 text-slate-400">
              Keep your face centered and record in a well-lit place.
            </p>
          </div>
        )}
      </div>

      {cameraError && (
        <div className="rounded-lg border border-red-100 bg-red-50 p-3 text-sm text-red-700">
          {cameraError}
        </div>
      )}

      <div className="mx-auto grid w-full max-w-3xl grid-cols-2 gap-2">
        {!isRecording ? (
          <KycSecondaryButton type="button" disabled={Boolean(kycVideo)} onClick={handleStartRecording}>
            <Camera size={16} /> Start
          </KycSecondaryButton>
        ) : (
          <KycSecondaryButton type="button" onClick={handleStopRecording}>
            <Square size={16} /> Stop
          </KycSecondaryButton>
        )}
        <KycSecondaryButton type="button" disabled={!kycVideo || isRecording} onClick={handleRetake}>
          <RotateCcw size={16} /> Retake
        </KycSecondaryButton>
      </div>

      {isRecording && (
        <div className="flex items-center justify-between rounded-lg bg-red-50 p-3 text-sm text-red-700">
          <span className="font-semibold">Recording...</span>
          <span>
            {Math.floor(recordingSeconds / 60)}:
            {(recordingSeconds % 60).toString().padStart(2, "0")}
          </span>
        </div>
      )}

      {kycVideo && (
        <div className="rounded-lg bg-slate-50 p-3 text-sm text-slate-700">
          <p className="font-semibold">Recorded video ready</p>
          <p className="mt-1 text-xs text-slate-500">
            {(kycVideo.size / (1024 * 1024)).toFixed(2)} MB
          </p>
        </div>
      )}

      <div className="mx-auto flex w-full max-w-3xl gap-2">
        <KycSecondaryButton type="button" onClick={onBack}>
          <ArrowLeft size={16} /> Back
        </KycSecondaryButton>
        <KycPrimaryButton
          type="button"
          loading={isPending}
          disabled={!kycVideo || isRecording}
          onClick={handleUpload}
        >
          Submit KYC
        </KycPrimaryButton>
      </div>
    </div>
  );
};

export default VideoStep;
