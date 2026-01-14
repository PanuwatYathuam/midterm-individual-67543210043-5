function errorHandler(err, req, res, next) {
    console.error('Error:', err.message);
    
    if (err.message === 'Student not found') return res.status(404).json({ error: err.message });
    
    if (err.message.includes('Invalid') || err.message.includes('required') || err.message.includes('Cannot')) {
        return res.status(400).json({ error: err.message });
    }

    if (err.message.includes('UNIQUE') || err.message.includes('exists')) {
        return res.status(409).json({ error: 'Student code or email already exists' });
    }
    
    res.status(500).json({ error: err.message || 'Internal server error' });
}

module.exports = errorHandler;