import React, { useState, useEffect, useCallback } from 'react';
import {
    ThemeProvider,
    createTheme,
    CssBaseline,
    Container,
    Switch,
    AppBar,
    Toolbar,
    Typography,
    CircularProgress,
    Box,
    List, ListItem, ListItemText,
    IconButton,
    Breadcrumbs,
    Link
} from '@mui/material';
import { Folder, InsertDriveFile } from '@mui/icons-material';
import MediaPlayer from "./component/MediaPlayer";

function App() {
    const [darkMode, setDarkMode] = useState(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    const [data, setData] = useState(null);
    const [currentPath, setCurrentPath] = useState('');
    const [isPlayer, setIsPlayer] = useState(false);
    const [currentFile, setCurrentFile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const fetchData = useCallback(async (path) => {
        const params = new URLSearchParams({ path });

        fetch('http://localhost:8080/browse?' + params.toString())
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.statusText);
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
                setError(null);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, []);

    useEffect(() => {
        setLoading(true);
        fetchData(currentPath);
    }, [currentPath, fetchData]);

    // Toggle theme between light and dark mode
    const handleThemeChange = () => {
        setDarkMode(!darkMode);
    };

    // Create MUI theme
    const theme = createTheme({
        palette: {
            mode: darkMode ? 'dark' : 'light',
        },
    });

    const getFolderName = (folder) => {
        const parts = folder.split('/');
        return parts[parts.length - 1];
    };

    const handleFolderClick = (folderName) => {
        setCurrentPath(folderName);
    };

    const handleFileClick = (filePath) => {
        setCurrentFile(filePath);
        setIsPlayer(true);
    };

    const pathParts = currentPath.split('/').filter(Boolean);

    const handleBreadcrumbClick = (index) => {
        const newPath = '/' + pathParts.slice(0, index + 1).join('/') + '/';
        setCurrentPath(newPath);
    };

    return (
        <ThemeProvider theme={theme}>
            <CssBaseline />
            <AppBar position="static">
                <Toolbar>
                    <Typography variant="h6" sx={{ flexGrow: 1 }}>
                        BrowserA
                    </Typography>
                    <Switch checked={darkMode} onChange={handleThemeChange} />
                </Toolbar>
            </AppBar>

            <Container sx={{
                boxShadow: { xs: 0, sm: 5 },
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                minHeight: '80vh',
                flexDirection: 'row',
            }}>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : data === null || (data.files?.length === 0 && data.directories?.length === 0) ? (
                    <Typography variant="body1" align="center">No resources available.</Typography>
                ) : (
                    <Box sx={{ flexDirection:'column', }}>
                        {/* Breadcrumb Navigation */}
                        {pathParts.length > 0 && (
                            <Breadcrumbs aria-label="breadcrumb" sx={{ marginBottom: 1 }}>
                                <Link
                                    underline="hover"
                                    color="inherit"
                                    onClick={() => handleFolderClick('')}
                                    sx={{ cursor: 'pointer' }}
                                >
                                    Home
                                </Link>
                                {pathParts.map((part, index) => (
                                    <Link
                                        key={index}
                                        underline="hover"
                                        color={index === pathParts.length - 1 ? 'textPrimary' : 'inherit'}
                                        onClick={() => handleBreadcrumbClick(index)}
                                        sx={{ cursor: 'pointer' }}
                                    >
                                        {part}
                                    </Link>
                                ))}
                            </Breadcrumbs>
                        )}

                        <List
                            sx={{
                                textAlign: 'left',
                                maxHeight: '300px',
                                overflowY: 'auto',
                                overflowX: 'hidden',
                                border: `1px solid ${theme.palette.divider}`,
                                padding: 1,
                            }}
                        >
                            {/* File List */}
                            {data.files?.map((file) => (
                                <ListItem key={file.fileName} onClick={() => handleFileClick(file.filePath)} sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    cursor: 'pointer',
                                }}>
                                    <IconButton edge="start" color="secondary">
                                        <InsertDriveFile />
                                    </IconButton>
                                    <ListItemText
                                        primary={
                                            <Typography style={{ color: theme.palette.text.primary, wordWrap: 'break-word' }}>
                                                {file.fileName}
                                            </Typography>
                                        }
                                        secondary={file.filePath}
                                    />
                                </ListItem>
                            ))}

                            {/* Folder List */}
                            {data.directories?.map((folder) => (
                                <ListItem button key={folder} onClick={() => handleFolderClick(folder)} sx={{
                                    cursor: 'pointer',
                                }}>
                                    <IconButton edge="start" color="primary">
                                        <Folder />
                                    </IconButton>
                                    <ListItemText
                                        primary={
                                            <Typography variant="body1" color="primary">
                                                {getFolderName(folder)}
                                            </Typography>
                                        }
                                    />
                                </ListItem>
                            ))}
                        </List>
                    </Box>
                )}

                {/* Media Player */}
                {isPlayer && currentFile && (
                    <Container>
                        <Typography variant="h5" align="center" gutterBottom>
                            {getFolderName(currentFile)}
                        </Typography>
                        <MediaPlayer mediaFiles={currentFile} />
                    </Container>
                )}
            </Container>
        </ThemeProvider>
    );
}

export default App;
