import React from 'react';
import ReactPlayer from 'react-player';
import { Worker, Viewer as PDFViewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {Card, CardContent, getTableSortLabelUtilityClass, Typography} from '@mui/material';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const MediaPlayer = ({ mediaFiles }) => {

    const BASE_URL = "http://localhost:8080/media";
    const VIDEO_URL = "/video?filename=";
    const AUDIO_URL = "/audio?filename=";
    const PDF_URL = "/pdf?filename=";

    const inferMediaType = (fileName) => {
        const extension = fileName.split('.').pop().toLowerCase();
        if (extension === 'mp4' || extension === 'mov' || extension === 'webm' || extension === 'mkv') {
            return 'video';
        } else if (extension === 'mp3' || extension === 'wav') {
            return 'audio';
        } else if (extension === 'pdf') {
            return 'pdf';
        } else if (extension === 'jpg' || extension === 'png' || extension === 'jpeg') {
            return 'image';
        } else {
            return 'unsupported';
        }
    };

    const renderMedia = (file) => {

        const fileType = inferMediaType(file);

        switch (fileType) {
            case 'video':
                return (
                    <ReactPlayer
                        url={BASE_URL + VIDEO_URL + file}
                        width='100%'
                        controls={true}
                    />
                );
            case 'audio':
                return (
                    <ReactPlayer
                        url={BASE_URL + AUDIO_URL + file}
                        width='100%'
                        controls
                    />
                );
            case 'pdf':
                return (
                    <div style={{ maxHeight: '700px', overflow: 'auto' }}>
                        <Worker workerUrl="https://unpkg.com/pdfjs-dist@3.4.120/build/pdf.worker.min.js">
                            <PDFViewer fileUrl={BASE_URL + PDF_URL + file} />
                        </Worker>
                    </div>
                );
            case 'image':
                return (
                    <img src={file} alt="Media content" style={{ width: '100%' }} />
                );
            default:
                return <Typography variant="body1">Unsupported file type</Typography>;
        }
    };

    return (
        <div>
            <Card sx={{ marginBottom: 3 }} key={mediaFiles}>
                <CardContent>
                    {renderMedia(mediaFiles)}
                </CardContent>
            </Card>
        </div>
    );
};

export default MediaPlayer;
