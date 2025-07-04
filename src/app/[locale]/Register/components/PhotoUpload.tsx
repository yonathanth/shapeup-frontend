import React, { useRef, useEffect, useState } from "react";

interface WebcamCaptureProps {
  onCapture: (image: string | null) => void;
  onClose: () => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({
  onCapture,
  onClose,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [facingMode, setFacingMode] = useState<"user" | "environment">("user");
  const streamRef = useRef<MediaStream | null>(null);

  const startCamera = (facing: "user" | "environment") => {
    if (navigator.mediaDevices) {
      // Stop existing stream if any
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }

      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: facing } })
        .then((stream) => {
          streamRef.current = stream;
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
            videoRef.current.play();
            setIsCameraActive(true);
          }
        })
        .catch((err) => {
          console.error("Error accessing webcam: ", err);
          setIsCameraActive(false);
        });
    } else {
      console.error("Camera not supported on this browser.");
      setIsCameraActive(false);
    }
  };

  useEffect(() => {
    startCamera(facingMode);

    // Cleanup on component unmount
    return () => {
      if (streamRef.current) {
        streamRef.current.getTracks().forEach((track) => track.stop());
      }
    };
  }, [facingMode]);

  const toggleCamera = () => {
    setFacingMode((prev) => (prev === "user" ? "environment" : "user"));
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext("2d");
      if (context) {
        canvasRef.current.width = videoRef.current.videoWidth;
        canvasRef.current.height = videoRef.current.videoHeight;
        context.drawImage(
          videoRef.current,
          0,
          0,
          canvasRef.current.width,
          canvasRef.current.height
        );
        const imageUrl = canvasRef.current.toDataURL("image/png");
        onCapture(imageUrl);
        onClose(); // Close the modal after capturing
      }
    }
  };

  return (
    <div className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50">
      <div className="bg-gray-800 text-white p-6 rounded-lg w-11/12 sm:w-96">
        <h2 className="text-2xl font-semibold text-center mb-4">
          Capture your photo
        </h2>
        {/* Webcam video feed */}
        <video
          ref={videoRef}
          className="w-full h-auto border border-gray-300 rounded-lg"
          style={{ maxWidth: "400px" }}
        ></video>
        {!isCameraActive && (
          <p className="text-red-500 text-center">
            Unable to access the camera.
          </p>
        )}

        <button
          onClick={(e) => {
            e.preventDefault();
            toggleCamera();
          }}
          className="mt-4 w-full p-3 bg-blue-600 text-white rounded-lg"
        >
          Switch to {facingMode === "user" ? "Back" : "Front"} Camera
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            capturePhoto(); // Capture and close
          }}
          className="mt-4 w-full p-3 bg-customBlue text-white rounded-lg"
        >
          Capture Photo
        </button>

        <button
          onClick={(e) => {
            e.preventDefault();
            onClose(); // Close without capturing
          }}
          className="mt-4 w-full p-3 bg-gray-500 text-white rounded-lg"
        >
          Close
        </button>

        {/* Invisible canvas to capture images */}
        <canvas ref={canvasRef} className="hidden"></canvas>
      </div>
    </div>
  );
};

export default WebcamCapture;
