

import React, { useState, useRef, useEffect } from 'react';
import { VoiceRecording, PricingTier } from '../types';
import { Card } from './common/Card';
import { Button } from './common/Button';
import { RecordIcon, StopIcon, PlayIcon, TrashIcon, PauseIcon, ChevronLeftIcon } from '../constants';
import { WaveformVisualizer } from './WaveformVisualizer';

interface RecordingScreenProps {
    tier: PricingTier;
    onRecordingsReady: (recordings: VoiceRecording[]) => void;
    onBack: () => void;
}

const blobToBase64 = (blob: Blob): Promise<string> =>
    new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.readAsDataURL(blob);
        reader.onload = () => resolve(reader.result as string);
        reader.onerror = (error) => reject(error);
    });

export const RecordingScreen: React.FC<RecordingScreenProps> = ({ tier, onRecordingsReady, onBack }) => {
    const [isRecording, setIsRecording] = useState(false);
    const [recordings, setRecordings] = useState<VoiceRecording[]>([]);
    const [currentPlaying, setCurrentPlaying] = useState<string | null>(null);
    const [time, setTime] = useState(0);

    const mediaRecorderRef = useRef<MediaRecorder | null>(null);
    const audioChunksRef = useRef<Blob[]>([]);
    const timerIntervalRef = useRef<number | null>(null);
    const audioRef = useRef<HTMLAudioElement>(null);
    const audioContextRef = useRef<AudioContext | null>(null);
    const analyserNodeRef = useRef<AnalyserNode | null>(null);
    const sourceNodeRef = useRef<MediaStreamAudioSourceNode | null>(null);

    useEffect(() => {
        return () => {
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
            if (audioContextRef.current && audioContextRef.current.state !== 'closed') {
                audioContextRef.current.close();
            }
        };
    }, []);

    const startRecording = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            
            if (!audioContextRef.current) {
                audioContextRef.current = new (window.AudioContext || (window as any).webkitAudioContext)();
                analyserNodeRef.current = audioContextRef.current.createAnalyser();
                sourceNodeRef.current = audioContextRef.current.createMediaStreamSource(stream);
                sourceNodeRef.current.connect(analyserNodeRef.current);
            }

            mediaRecorderRef.current = new MediaRecorder(stream);
            mediaRecorderRef.current.ondataavailable = event => {
                audioChunksRef.current.push(event.data);
            };
            mediaRecorderRef.current.onstop = async () => {
                const audioBlob = new Blob(audioChunksRef.current, { type: 'audio/wav' });
                const audioUrl = URL.createObjectURL(audioBlob);
                const base64 = await blobToBase64(audioBlob);
                const newRecording: VoiceRecording = { id: Date.now().toString(), blob: audioBlob, url: audioUrl, base64 };
                setRecordings(prev => [...prev, newRecording]);
                audioChunksRef.current = [];
            };
            audioChunksRef.current = [];
            mediaRecorderRef.current.start();
            setIsRecording(true);

            setTime(0);
            timerIntervalRef.current = window.setInterval(() => {
                setTime(prevTime => {
                    const newTime = prevTime + 1;
                    if (tier.maxRecordingSeconds !== Infinity && newTime >= tier.maxRecordingSeconds) {
                        stopRecording();
                    }
                    return newTime;
                });
            }, 1000);

        } catch (err) {
            console.error("Error accessing microphone:", err);
            alert("Microphone access was denied. Please allow microphone access in your browser settings.");
        }
    };

    const stopRecording = () => {
        if (mediaRecorderRef.current) {
            mediaRecorderRef.current.stop();
            mediaRecorderRef.current.stream.getTracks().forEach(track => track.stop());
            setIsRecording(false);
            if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
        }
    };

    const toggleRecording = () => {
        if (isRecording) {
            stopRecording();
        } else {
            startRecording();
        }
    };

    const deleteRecording = (id: string) => {
        setRecordings(prev => prev.filter(r => r.id !== id));
    };

    const playRecording = (url: string, id: string) => {
        if(audioRef.current){
            if(currentPlaying === id) {
                audioRef.current.pause();
                setCurrentPlaying(null);
            } else {
                audioRef.current.src = url;
                audioRef.current.play();
                setCurrentPlaying(id);
            }
        }
    };

    const formatTime = (seconds: number) => {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    return (
        <div className="min-h-screen w-full flex items-center justify-center p-4 bg-bg-primary animate-fade-in">
             <Button variant="ghost" onClick={onBack} className="absolute top-24 left-6 !p-2">
                <ChevronLeftIcon className="w-8 h-8"/> Go Back
            </Button>
            <Card className="w-full max-w-2xl">
                <h2 className="text-3xl font-bold gradient-text mb-4 text-center">Record Your Voice</h2>
                <div className="h-40 my-4">
                    <WaveformVisualizer analyserNode={analyserNodeRef.current} isRecording={isRecording} />
                </div>
                <div className="flex flex-col items-center gap-4">
                    <button
                        onClick={toggleRecording}
                        className={`w-24 h-24 rounded-full flex items-center justify-center transition-all duration-300 ${
                            isRecording ? 'bg-error active-recording-pulse' : 'bg-accent-pink hover:bg-opacity-80'
                        }`}
                        aria-label={isRecording ? 'Stop recording' : 'Start recording'}
                    >
                        {isRecording ? <StopIcon className="w-10 h-10" /> : <RecordIcon className="w-10 h-10" />}
                    </button>
                    <div className="text-2xl font-mono">
                        {formatTime(time)} / {tier.maxRecordingSeconds === Infinity ? '∞' : formatTime(tier.maxRecordingSeconds)}
                    </div>
                </div>

                <div className="mt-8 space-y-3 max-h-48 overflow-y-auto pr-2">
                    {recordings.map((rec, index) => (
                        <div key={rec.id} className="flex items-center gap-4 bg-bg-secondary p-3 rounded-lg">
                            <button onClick={() => playRecording(rec.url, rec.id)}>
                                {currentPlaying === rec.id ? <PauseIcon className="w-6 h-6 text-accent-cyan"/> : <PlayIcon className="w-6 h-6 text-accent-cyan"/>}
                            </button>
                            <p className="flex-grow text-text-primary">Recording {index + 1}</p>
                            <button onClick={() => deleteRecording(rec.id)}>
                                <TrashIcon className="w-6 h-6 text-error hover:text-opacity-80"/>
                            </button>
                        </div>
                    ))}
                </div>

                <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-between">
                    <Button variant="secondary" onClick={() => onRecordingsReady([])}>Skip This Step</Button>
                    <Button onClick={() => onRecordingsReady(recordings)} disabled={recordings.length === 0}>Continue</Button>
                </div>
                <audio ref={audioRef} onEnded={() => setCurrentPlaying(null)} className="hidden" />
            </Card>
        </div>
    );
};
