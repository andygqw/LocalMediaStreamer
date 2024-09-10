import React, { useState, useEffect } from 'react';
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
} from '@mui/material';
import { Folder, InsertDriveFile } from '@mui/icons-material';

function App() {
    const [darkMode, setDarkMode] = useState(() =>
        window.matchMedia('(prefers-color-scheme: dark)').matches
    );

    const [data, setData] = useState(null);
    const [currentPath, setCurrentPath] = useState('');
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        const params = new URLSearchParams({ path: currentPath });

        fetch('http://localhost:8080/browse?' + params.toString())
            .then((response) => {
                if (!response.ok) {
                    throw new Error(response.body);
                }
                return response.json();
            })
            .then((data) => {
                setData(data);
            })
            .catch((error) => {
                setError(error.message);
            })
            .finally(() => {
                setLoading(false);
            });
    }, [currentPath]);

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

    // Handle folder click to change path (mock implementation)
    const handleFolderClick = (folder) => {
        // Update current path or load folder content logic goes here
        setCurrentPath(folder);
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

            <Container>
                {loading ? (
                    <Box display="flex" justifyContent="center" alignItems="center" height="80vh">
                        <CircularProgress />
                    </Box>
                ) : error ? (
                    <Typography color="error">{error}</Typography>
                ) : data === null || (data.files.length === 0 && data.directories.length === 0) ? (
                    <Typography variant="body1" align="center">No resources available.</Typography>
                ) : (
                    <List sx={{
                        textAlign: 'left',
                        maxHeight: '300px',
                        overflowY: 'auto',
                        overflowX: 'hidden',
                        border: `1px solid ${theme.palette.divider}`,
                        padding: 1,
                    }}>
                        {/* File List */}
                        {data.files?.map((file) => (
                            <ListItem key={file.key} sx={{ display: 'flex', alignItems: 'center' }}>
                                <IconButton edge="start" color="secondary">
                                    <InsertDriveFile />
                                </IconButton>
                                <ListItemText
                                    primary={
                                        <a
                                            href={file.url}
                                            rel="noopener noreferrer"
                                            download
                                            style={{ color: theme.palette.text.primary, wordWrap: 'break-word' }}
                                        >
                                            {file.fileName}
                                        </a>
                                    }
                                    secondary={file.filePath}
                                />
                            </ListItem>
                        ))}

                        {/* Folder List */}
                        {data.directories?.map((folder) => (
                            <ListItem button key={folder} onClick={() => handleFolderClick(folder)}>
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
                )}
            </Container>
        </ThemeProvider>
    );
}

export default App;
