'use client';
import React, { use, useEffect, useRef, useState } from 'react';
// import { MediaRoom } from '@/components/media-room';
// import {
//   ReactMediaRecorder,
//   useReactMediaRecorder,
// } from 'react-media-recorder';

import { useRecordWebcam } from 'react-record-webcam';

const page = () => {
  const {
    activeRecordings,
    cancelRecording,
    clearAllRecordings,
    clearError,
    clearPreview,
    closeCamera,
    createRecording,
    devicesById,
    devicesByType,
    download,
    errorMessage,
    muteRecording,
    openCamera,
    pauseRecording,
    resumeRecording,
    startRecording,
    stopRecording,
  } = useRecordWebcam();

  const [videoDeviceId, setVideoDeviceId] = React.useState<string>('');
  const [audioDeviceId, setAudioDeviceId] = React.useState<string>('');

  const handleSelect = async (event: any) => {
    const { deviceid: deviceId } =
      event.target.options[event.target.selectedIndex].dataset;
    if (devicesById?.[deviceId].type === 'videoinput') {
      setVideoDeviceId(deviceId);
    }
    if (devicesById?.[deviceId].type === 'audioinput') {
      setAudioDeviceId(deviceId);
    }
  };

  const start = async () => {
    const recording = await createRecording(videoDeviceId, audioDeviceId);
    if (recording) await openCamera(recording.id);
  };

  useEffect(() => {
    if (videoDeviceId) {
      start();
    }
  }, [videoDeviceId]);

  const [numb, setNumb] = useState(0);
  const [recordedBlobs, setRecordedBlobs] = useState([]);
  const [numberOfdones, setNumberOfDones] = useState(0);
  async function record() {
    if (recordedBlobs.length === 3) {
      console.log('here stop');
      return;
    }
    const recording = await createRecording();

    await openCamera(recording.id);
    await startRecording(recording.id);
    await new Promise((resolve) => setTimeout(resolve, 3000)); // Record for 3 seconds
    const recorded = await stopRecording(recording.id);
    if (recorded) {
      setRecordedBlobs((prevBlobs) => {
        const updatedBlobs = [...prevBlobs, recorded.blob];
        return updatedBlobs;
      });
    }

    if (recordedBlobs.length === 1) {
      sendBlobsToServer(recordedBlobs[0]);
    }

    // await clearAllRecordings();
    setNumb(numb + 1);
    record();
  }

  const sendBlobsToServer = useCallback(async (bolb) => {
    console.log('Sending blobs to server', bolb);
    const formData = new FormData();
    const blob = new Blob([bolb], { type: 'video/webm' });
    formData.append('videofile', blob, `recorded-${blob.size}.webm`);

    const response = await fetch('http://192.168.1.3:3006/', {
      method: 'POST',
      body: formData,
    });
    const data = await response.json();

    if (data) {
      console.log('Data sent to server', data);
      setNumberOfDones((numberOfdones) => numberOfdones + 1);
      setRecordedBlobs((prevBlobs) => {
        const updatedBlobs = prevBlobs.slice(1);
        console.log('updatedBlobs', updatedBlobs);
        if (updatedBlobs.length > 0) {
          // sendBlobsToServer(nextBlob);
        } else {
          // Handle the case when there are no more blobs to send
          console.log('NONONONON');
        }
        return updatedBlobs;
      });
    }
  }, []);
  // Call the function with your array of blobs
  // console.log('recordedBlobs', recordedBlobs);
  useEffect(() => {
    console.log('recordedBlobs in useEffetct', recordedBlobs);
    if (recordedBlobs.length > 0) {
      sendBlobsToServer(recordedBlobs[0]);
    }
  }, [numberOfdones]);
  useEffect(() => {
    if (recordedBlobs.length === 1) {
      sendBlobsToServer(recordedBlobs[0]);
    }
  }, [recordedBlobs]);

  // useEffect(() => {
  //   if (recordedBlobs.length === 5) {
  //     console.log('here');
  //     return;
  //   }
  //   record();
  // }, [numb]);

  const recognitionRef = useRef(null);
  const [stream, setStream] = useState(true);

  const startRecordingx = () => {
    const videoElement = document.getElementsByClassName('reccorded-video');
    if (videoElement.length > 0) {
      console.log('Stram shoud be falseyy', stream);
      const mediaStream = videoElement?.item(0)?.srcObject;
      const mediaRecorder = new MediaRecorder(mediaStream);
      const chunks = [];
      setStream(false);
      mediaRecorder.ondataavailable = (event) => {
        chunks.push(event.data);
      };

      mediaRecorder.onstop = async () => {
        const blob = new Blob(chunks, { type: 'video/mp4' });
        console.log(blob, 'blob');
        const formData = new FormData();
        formData.append('videofile', blob, `recorded-${blob.size}.webm`);

        const response = await fetch('http://192.168.1.3:3006/', {
          method: 'POST',
          body: formData,
        });
        const data = await response.json();
        console.log(data, 'data');

        // Process the recorded video blob as needed
        // ...

        // Reset chunks array
        chunks.length = 0;
      };

      mediaRecorder.start();
    }
  };

  useEffect(() => {
    if (stream) {
      startRecordingx();
    }
  }, [stream]);

  return (
    <>
      <button onClick={record}>Record Video</button>;
      <video
        className="reccorded-video"
        ref={activeRecordings[0]?.webcamRef}
        loop
        autoPlay
        playsInline
        muted
      />
      {activeRecordings?.map((recording) => (
        <div className="rounded-lg bg-white px-4 py-4" key={recording.id}>
          <div className="grid grid-cols-1 text-black">
            <p>Live</p>
            <small>Status: {recording.status}</small>
            <small>Video: {recording.videoLabel}</small>
            <small>Audio: {recording.audioLabel}</small>
          </div>
          <video
            ref={recording.previewRef}
            autoPlay
            loop
            playsInline
            controls
          />
        </div>
      ))}
      <VideoPreview blobs={recordedBlobs} />
    </>
  );
};
export default page;

const VideoPreview = ({ blobs }) => {
  return (
    <div>
      {blobs.map((blob, index) => (
        <div key={index}>
          <video controls>
            <source src={URL.createObjectURL(blob)} type="video/webm" />
            Your browser does not support the video tag.
          </video>
        </div>
      ))}
    </div>
  );
};

import { useCallback } from 'react';
