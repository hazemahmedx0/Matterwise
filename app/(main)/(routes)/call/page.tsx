'use client';
import React, { useEffect, useRef, useState } from 'react';
import { MediaRoom } from '@/components/media-room';
import {
  ReactMediaRecorder,
  useReactMediaRecorder,
} from 'react-media-recorder';

import { useRecordWebcam } from 'react-record-webcam';
import { record } from 'zod';

const page = () => {
  const {
    createRecording,
    openCamera,
    startRecording,
    stopRecording,
    activeRecordings,
    clearAllRecordings,
    download,
  } = useRecordWebcam();

  const [currentRecs, setCurrRecs] = useState([]);

  async function record() {
    const recording = await createRecording();

    await openCamera(recording.id);
    await startRecording(recording.id);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Record for 3 seconds
    const recorded = await stopRecording(recording.id);

    // Upload the blob to a back-end
    const formData = new FormData();
    formData.append('videofile', recorded.blob, 'recorded.webm');

    const response = await fetch('http://192.168.1.3:3006/', {
      method: 'POST',
      body: formData,
    });
  }

  return (
    <>
      <button onClick={record}>Record Video</button>;
      {activeRecordings?.map((recording) => (
        <div className="rounded-lg bg-white px-4 py-4" key={recording.id}>
          <div className="grid grid-cols-1 text-black">
            <p>Live</p>
            <small>Status: {recording.status}</small>
            <small>Video: {recording.videoLabel}</small>
            <small>Audio: {recording.audioLabel}</small>
          </div>
          <video ref={recording.webcamRef} loop autoPlay playsInline muted />
          <video
            ref={recording.previewRef}
            autoPlay
            loop
            playsInline
            controls
          />
        </div>
      ))}
    </>
  );
};
export default page;
