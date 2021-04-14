import { useEffect, useState, useRef } from 'react';
import * as faceapi from 'face-api.js';
import FormDialog from '../components/ModalAddVideo';
import { Container, SelectFile, VideoContainer, ImageContainer, Button } from './faceVideoStyles';
import { useEmotions } from '../providers/Emotions';
import { useServices } from '../providers/Services/index';
import { useVideoPlay } from '../providers/VideoPlay';
import FormDialogImg from '../components/ModalAddImg';
import VideoThumbnail from 'react-video-thumbnail';

const FaceApiVideo = () => {
    const [showVideoOrImage, setShowVideoOrImage] = useState(false);

    const videoHeight = 200;
    const videoWidth = 320;
    const [initializing, setInitializing] = useState(false);
    const videoRef = useRef(); //SRC DO VIDEO
    const canvasRef = useRef();
    const [videoFilePath, setVideoPath] = useState(null);
    const { setData64 } = useServices();
    const { emotions, setEmotions } = useEmotions();
    // const { videoPlay, setVideoPlay } = useVideoPlay();
    const [videoPlay, setVideoPlay] = useState(true);

    const [inputValue, setInputValue] = useState('');
    const [url, setUrl] = useState('');
    const newEmotions = {
        angry: [0],
        disgusted: [0],
        fearful: [0],
        happy: [0],
        neutral: [0],
        sad: [0],
        surprised: [0]
    };

    const handleSubmit = (event) => {
        setVideoPlay(true);
        event.preventDefault();
        setUrl(inputValue);
    };

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = process.env.PUBLIC_URL + '/models';
            setInitializing(true);
            Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
                faceapi.nets.faceRecognitionNet.loadFromUri(MODEL_URL),
                faceapi.nets.faceExpressionNet.loadFromUri(MODEL_URL),
                faceapi.nets.ssdMobilenetv1.loadFromUri(MODEL_URL)
            ]);
        };

        loadModels();
    }, []);

    useEffect(() => {
        if (!videoPlay) {
            // setEmotions(newEmotions);
        }
    }, [videoPlay]);

    const handleVideoUpload = (event) => {
        setVideoPath(URL.createObjectURL(event.target.files[0]));
    };

    const leftVideo = document.getElementById('player');

    const startVideo = () => {
        if (leftVideo.ended !== true) {
            leftVideo.onplay = function () {
                const stream = leftVideo.captureStream();
                videoRef.current.srcObject = stream;
            };
        }
    };

    const handleVideoOnPlay = () => {
        startVideo();
        const interval = setInterval(async () => {
            //A CADA INTERVALO, CALCULA OS DADOS DA API
            if (initializing) {
                setInitializing(false);
            }

            const detections = await faceapi
                .detectAllFaces(videoRef.current, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks()
                .withFaceExpressions();
            if (detections[0] !== undefined && leftVideo.ended !== true) {
                for (const x in detections[0].expressions) {
                    switch (x) {
                        case 'sad':
                        case 'angry':
                        case 'disgusted':
                        case 'fearful':
                        case 'happy':
                        case 'neutral':
                        case 'surprised':
                            newEmotions[x].push((detections[0].expressions[x] * 100).toFixed(2));
                            break;

                        default:
                            break;
                    }
                }
            }
            if (videoPlay && leftVideo.ended) {
                setVideoPlay(false);
                setEmotions(newEmotions);
                // if (!videoPlay) {
                //     console.log('entrou');
                //     setEmotions(newEmotions);
                //     console.log('setouEmotions', newEmotions);
                // }
                clearInterval(interval);
            }
        }, 100);
    };

    const start = async () => {
        // setUrl(value);
        const imgFile = document.getElementById('myFileUpload').files[0];
        const img = await faceapi.bufferToImage(imgFile);
        const myImg = document.getElementById('myImg');
        myImg.src = img.src;
        const detections = await faceapi
            .detectAllFaces(myImg)
            .withFaceLandmarks()
            .withFaceExpressions();
        setData64(img.src);
    };

    return (
        <Container>
            <Button
                className="button-Change"
                onClick={() => setShowVideoOrImage(!showVideoOrImage)}
            >
                {showVideoOrImage ? 'Analyze Video' : 'Analyze Imagem'}
            </Button>

            {!showVideoOrImage && (
                <div>
                    <span>{!initializing && videoPlay ? 'Analyzing' : ''}</span>
                    {videoPlay && (
                        <div>
                            <video
                                poster="images/videologo.png"
                                ref={videoRef}
                                autoPlay
                                muted
                                src={videoFilePath}
                                height={videoHeight}
                                width={videoWidth}
                                onPlay={handleVideoOnPlay}
                                id="player"
                            />
                            <form onSubmit={(e) => handleSubmit(e)}>
                                <input type="file" onChange={handleVideoUpload} />
                            </form>
                        </div>
                    )}
                    <VideoThumbnail
                        renderThumbnail={false}
                        videoUrl={videoFilePath}
                        thumbnailHandler={(thumbnail) => setData64(thumbnail)}
                    />
                    {!videoPlay && (
                        <>
                            <FormDialog />

                            <button onClick={() => window.location.reload()}>
                                Try other video
                            </button>
                        </>
                    )}
                </div>
            )}

            {showVideoOrImage && (
                <ImageContainer>
                    <img alt="" id="myImg" width="280px" height="280px" />
                    <SelectFile
                        id="myFileUpload"
                        type="file"
                        onChange={(e) => setUrl(e.target.value)}
                        accept=".jpg, .jpeg, .png"
                    />
                    <Button onClick={start}>Analyze</Button>
                    <FormDialogImg />
                </ImageContainer>
            )}

            <canvas ref={canvasRef} />
        </Container>
    );
};

export default FaceApiVideo;
