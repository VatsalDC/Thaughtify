const express = require('express');
const fs = require('fs').promises;
const path = require('path');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 4000;

// Enhanced CORS configuration
const corsOptions = {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
};

// Middleware
app.use(cors(corsOptions));
app.options('*', cors(corsOptions)); // Enable pre-flight for all routes
app.use(express.json());
app.use(express.static(__dirname, {
    setHeaders: (res, path) => {
        if (path.endsWith('.json')) {
            res.setHeader('Content-Type', 'application/json');
            res.setHeader('Cache-Control', 'no-store, no-cache, must-revalidate, proxy-revalidate');
            res.setHeader('Pragma', 'no-cache');
            res.setHeader('Expires', '0');
        }
    }
}));

// Routes

// Thoughts routes
app.get('/thoughts.json', async (req, res) => {
    try {
        // Set CORS headers
        res.header('Access-Control-Allow-Origin', '*');
        res.header('Access-Control-Allow-Methods', 'GET, OPTIONS');
        res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
        
        // Handle preflight requests
        if (req.method === 'OPTIONS') {
            return res.status(200).end();
        }
        
        const data = await fs.readFile(path.join(__dirname, 'thoughts.json'), 'utf8');
        const jsonData = JSON.parse(data);
        
        // Log for debugging
        console.log('Serving thoughts.json with', jsonData.thoughts ? jsonData.thoughts.length : 0, 'thoughts');
        
        res.json(jsonData);
    } catch (error) {
        console.error('Error reading thoughts.json:', error);
        res.status(500).json({ 
            error: 'Failed to read thoughts data',
            details: error.message 
        });
    }
});

app.put('/thoughts.json', async (req, res) => {
    try {
        const data = JSON.stringify(req.body, null, 2);
        await fs.writeFile(path.join(__dirname, 'thoughts.json'), data);
        res.status(200).json({ message: 'Thoughts data updated successfully' });
    } catch (error) {
        console.error('Error writing thoughts.json:', error);
        res.status(500).json({ error: 'Failed to update thoughts data' });
    }
});

// Serve HTML files
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

app.get('/admin.html', (req, res) => {
    res.sendFile(path.join(__dirname, 'admin.html'));
});

// Start server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
