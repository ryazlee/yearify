import React, { useRef } from "react";
import html2canvas from "html2canvas";

const DownloadableComponent = ({ children }: { children: React.ReactNode }) => {
    const componentRef = useRef(null);

    const handleDownload = async () => {
        if (componentRef.current) {
            const canvas = await html2canvas(componentRef.current);
            const image = canvas.toDataURL("image/png");

            const link = document.createElement("a");
            link.href = image;
            const date = new Date();
            link.download = `yearify-image-${date.getUTCMilliseconds()}.png`;
            link.click();
        }
    };

    return (
        <>
            <button onClick={handleDownload}>Download as PNG</button>
            <div ref={componentRef} >
                {children}
            </div>
        </>
    );
};

export default DownloadableComponent;
