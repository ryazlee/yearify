import React, { useRef } from "react";
import html2canvas from "html2canvas";

const DownloadableComponent2 = () => {
    const componentRef = useRef(null);

    const handleDownload = async () => {
        if (componentRef.current) {
            const canvas = await html2canvas(componentRef.current);
            const image = canvas.toDataURL("image/png");

            // Create a link and trigger download
            const link = document.createElement("a");
            link.href = image;
            link.download = "component.png";
            link.click();
        }
    };

    return (
        <div>
            <div ref={componentRef} style={{ padding: "20px", border: "1px solid #ccc" }}>
                <h1>Hello, World!</h1>
                <p>This is the component to be exported as PNG.</p>
            </div>
            <button onClick={handleDownload}>Download as PNG</button>
        </div>
    );
};

export default DownloadableComponent2;
