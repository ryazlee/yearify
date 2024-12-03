import React, { useRef } from "react";
import html2canvas from "html2canvas";
import { Box } from "@mui/material";

const DownloadableComponent = ({ children }: { children: React.ReactNode }) => {
    const componentRef = useRef<HTMLDivElement>(null);

    const handleDownload = async () => {
        if (componentRef.current) {
            try {
                const canvas = await html2canvas(componentRef.current, {
                    scale: 2, // Higher resolution for better quality
                    useCORS: true, // Handle cross-origin images
                });

                const image = canvas.toDataURL("image/png");

                const link = document.createElement("a");
                link.href = image;
                const date = new Date();
                link.download = `yearify-image-${date.toISOString()}.png`;

                link.click();
            } catch (error) {
                console.error("Error capturing the image:", error);
                alert("Unable to download image. Please try again.");
            }
        }
    };

    return (
        <Box style={{ display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center" }}>
            {/* Button above the component */}
            <button
                onClick={handleDownload}
                style={{
                    fontSize: "16px",
                    cursor: "pointer",
                    marginBottom: "20px", // Add margin to separate from the component below
                }}
            >
                Download as PNG
            </button>

            <Box
                ref={componentRef}
                style={{
                    border: "1px solid #ddd",
                    backgroundColor: "white",
                    boxShadow: "0px 4px 6px rgba(0,0,0,0.1)",
                    display: "inline-block", // Ensures proper bounding box
                    padding: "20px",
                    borderRadius: "8px", // Optional: Adds rounded corners
                }}
            >
                {children}
            </Box>
        </Box>
    );
};

export default DownloadableComponent;
