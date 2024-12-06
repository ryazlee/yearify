import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { Box } from "@mui/material";

const DownloadableComponent = ({ children }: { children: React.ReactNode }) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const captureImage = async () => {
        if (!componentRef.current) return null;

        try {
            const canvas = await html2canvas(componentRef.current, {
                scale: 2,
                useCORS: true,
            });
            return new Promise<Blob | null>((resolve) =>
                canvas.toBlob((blob) => resolve(blob), "image/png")
            );
        } catch (error) {
            console.error("Error capturing the image:", error);
            alert("Unable to generate image. Please try again.");
            return null;
        }
    };

    const handleDownload = async () => {
        const blob = await captureImage();
        if (blob) {
            const fileName = `yearify-image-${new Date().toISOString()}.png`;
            const link = document.createElement("a");
            link.href = URL.createObjectURL(blob);
            link.download = fileName;
            link.click();
            URL.revokeObjectURL(link.href);
        }
    };

    const handleShare = async () => {
        const blob = await captureImage();
        if (blob && navigator.share) {
            const fileName = `yearify-image-${new Date().toISOString()}.png`;
            const file = new File([blob], fileName, { type: "image/png" });

            try {
                await navigator.share({
                    files: [file],
                    title: "Yearify Image",
                    text: "Check out my Yearify image!",
                });
            } catch (error) {
                console.error("Error sharing the image:", error);
                alert("Unable to share image. Please try again.");
            }
        } else {
            handleDownload();
        }
    };

    return (
        <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            <Box style={{ display: "flex", gap: "10px", marginBottom: "20px" }}>
                <button onClick={handleShare} style={buttonStyle}>Share Image</button>
                <button onClick={handleDownload} style={buttonStyle}>Download Image</button>
            </Box>
            <Box
                ref={componentRef}
                style={{
                    border: "1px solid #ddd",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    display: "inline-block",
                    padding: "20px",
                    borderRadius: "8px",
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

const buttonStyle = {
    fontSize: "16px",
    cursor: "pointer",
    padding: "10px 20px",
};

export default DownloadableComponent;
