import { useState, useEffect, useRef } from "react";
import { fetchMetadata, convertVideo, getStatus, getDownloadUrl } from "../api/conversionApi";

export const useConvert = () => {
  const [url, setUrl] = useState("");
  const [metadata, setMetadata] = useState<any>(null);
  const [jobId, setJobId] = useState<string | null>(null);
  const [status, setStatus] = useState<"idle" | "loading_metadata" | "converting" | "completed" | "failed">("idle");
  const [progress, setProgress] = useState(0);
  const [downloadUrl, setDownloadUrl] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [bitrate, setBitrateState] = useState("320");
  const [downloading, setDownloading] = useState(false);
  
  const setBitrate = (val: string) => {
    setBitrateState(val);
    if (status === "completed") {
      setStatus("idle");
      setProgress(0);
      setDownloadUrl(null);
    }
  };
  
  const pollingRef = useRef<NodeJS.Timeout | null>(null);

  const getMetadata = async (inputUrl: string) => {
    setUrl(inputUrl);
    setError(null);
    setStatus("loading_metadata");
    try {
      const data = await fetchMetadata(inputUrl);
      setMetadata(data);
      setStatus("idle");
    } catch (err: any) {
      setError(err.message || "Failed to fetch metadata");
      setStatus("failed");
    }
  };

  const startConversion = async () => {
    if (!url) return;
    setError(null);
    setStatus("converting");
    setProgress(0);
    try {
      const { jobId } = await convertVideo(url, bitrate);
      setJobId(jobId);
    } catch (err: any) {
      setError(err.message || "Failed to start conversion");
      setStatus("failed");
    }
  };

  useEffect(() => {
    if (jobId && status === "converting") {
      pollingRef.current = setInterval(async () => {
        try {
          const { status: jobStatus, progress: jobProgress } = await getStatus(jobId);
          setProgress(jobProgress || 0);
          
          if (jobStatus === "completed") {
            clearInterval(pollingRef.current!);
            const { url: dlUrl } = await getDownloadUrl(jobId);
            setDownloadUrl(dlUrl);
            setStatus("completed");
          } else if (jobStatus === "failed") {
            clearInterval(pollingRef.current!);
            setError("Conversion failed. Please try again.");
            setStatus("failed");
          }
        } catch (err) {
          console.error("Polling error:", err);
        }
      }, 2000);
    }
    
    return () => {
      if (pollingRef.current) clearInterval(pollingRef.current);
    };
  }, [jobId, status]);

  const reset = () => {
    setMetadata(null);
    setJobId(null);
    setStatus("idle");
    setProgress(0);
    setDownloadUrl(null);
    setError(null);
  };

  return {
    url,
    setUrl,
    metadata,
    status,
    progress,
    downloadUrl,
    error,
    bitrate,
    setBitrate,
    downloading,
    setDownloading,
    getMetadata,
    startConversion,
    reset
  };
};
