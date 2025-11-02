
import React, { useRef, useEffect } from 'react';

interface WaveformVisualizerProps {
    analyserNode: AnalyserNode | null;
    isRecording: boolean;
}

export const WaveformVisualizer: React.FC<WaveformVisualizerProps> = ({ analyserNode, isRecording }) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const animationFrameId = useRef<number | null>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas || !analyserNode) return;

        const canvasCtx = canvas.getContext('2d');
        if (!canvasCtx) return;

        const bufferLength = analyserNode.frequencyBinCount;
        const dataArray = new Uint8Array(bufferLength);

        const draw = () => {
            animationFrameId.current = requestAnimationFrame(draw);

            analyserNode.getByteTimeDomainData(dataArray);

            canvasCtx.fillStyle = '#0a0e27';
            canvasCtx.fillRect(0, 0, canvas.width, canvas.height);

            canvasCtx.lineWidth = 3;
            canvasCtx.strokeStyle = isRecording ? '#00d9ff' : '#151933';
            canvasCtx.beginPath();

            const sliceWidth = canvas.width * 1.0 / bufferLength;
            let x = 0;

            for (let i = 0; i < bufferLength; i++) {
                const v = dataArray[i] / 128.0;
                const y = v * canvas.height / 2;

                if (i === 0) {
                    canvasCtx.moveTo(x, y);
                } else {
                    canvasCtx.lineTo(x, y);
                }
                x += sliceWidth;
            }

            canvasCtx.lineTo(canvas.width, canvas.height / 2);
            canvasCtx.stroke();
        };

        draw();

        return () => {
            if (animationFrameId.current !== null) {
                cancelAnimationFrame(animationFrameId.current);
            }
        };
    }, [analyserNode, isRecording]);

    return <canvas ref={canvasRef} className="w-full h-full rounded-lg bg-bg-primary" />;
};
