import React from 'react';
import ReactPlayer from 'react-player';
import { Viewer as PDFViewer } from '@react-pdf-viewer/core';
import '@react-pdf-viewer/core/lib/styles/index.css';
import {Card, CardContent, getTableSortLabelUtilityClass, Typography} from '@mui/material';
import ImageGallery from 'react-image-gallery';
import 'react-image-gallery/styles/css/image-gallery.css';

const MediaPlayer = ({ mediaFiles }) => {

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
                        url={file}
                        width='100%'
                        controls={true}
                    />
                );
            case 'audio':
                return (
                    <ReactPlayer
                        url={file}
                        width='100%'
                        controls
                    />
                );
            case 'pdf':
                return (
                    <div style={{ height: '500px' }}>
                        <PDFViewer fileUrl={file} />
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
