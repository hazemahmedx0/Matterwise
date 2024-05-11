'use client';
import dynamic from 'next/dynamic';
import { useState, useRef, useEffect, useCallback } from 'react';
import RecordRTC from 'recordrtc';

const page = () => {
  const [stream, setStream] = useState(null);
  const [blob, setBlob] = useState(null);
  const refVideo = useRef(null);
  const recorderRef = useRef(null);

  const [blobsx, setblobsx] = useState([]);
  const [numberOfdones, setNumberOfDones] = useState(0);

  const handleRecording = async () => {
    // const cameraStream = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
    const mediaStream = await navigator.mediaDevices.getUserMedia({
      video: true,
      audio: false,
    });

    setStream(mediaStream);
    recorderRef.current = new RecordRTC(mediaStream, {
      type: 'video',
      mimeType: 'video/webm;codecs=vp8',
    });
    recorderRef.current.startRecording();
  };

  const handleStop = async () => {
    recorderRef.current.stopRecording(() => {
      setBlob(recorderRef.current.getBlob());

      if (recorderRef.current.getBlob()) {
        setblobsx((blobsx) => {
          const updatedBlobs = [...blobsx, recorderRef.current.getBlob()];
          return updatedBlobs;
        });
      }
      if (blobsx.length === 1) {
        sendBlobsToServer(blobsx[0]);
      }
    });
  };

  console.log('blobsx', blobsx);

  async function record() {
    await handleRecording();
    await new Promise((resolve) => setTimeout(resolve, 5000));
    await handleStop();

    console.log('blobsx inside recored', blobsx);
    if (blobsx && blobsx.length === 5) {
      console.log('blobsx end');
      return;
    }

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
      setblobsx((blobsx) => {
        const updatedBlobs = blobsx.slice(1);
        return updatedBlobs;
      });
    }
  }, []);

  useEffect(() => {
    if (blobsx.length > 0) {
      sendBlobsToServer(blobsx[0]);
    }
  }, [numberOfdones]);

  useEffect(() => {
    if (blobsx.length === 1) {
      sendBlobsToServer(blobsx[0]);
    }
  }, [blobsx]);

  return (
    <div className="App">
      <header className="App-header">
        <button onClick={record}>start</button>
        {/* <button onClick={handleStop}>stop</button>
        <button onClick={handleSave}>save</button> */}
        {blob && (
          <video
            src={URL.createObjectURL(blob)}
            controls
            autoPlay
            ref={refVideo}
            style={{ width: '700px', margin: '1em' }}
          />
        )}
      </header>
    </div>
  );
};

export default dynamic(() => Promise.resolve(page), {
  ssr: false,
});
