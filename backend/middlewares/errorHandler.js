const errorHandler = (err, req, res, next) => {
    console.error('Error details:', {
        message: err.message,
        stack: err.stack,
        name: err.name,
        code: err.code
    });

    if (err.name === 'ValidationError') {
        const messages = Object.values(err.errors).map(val => val.message);
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Validation Error',
            errors: messages
        });
    }

    if (err.name === 'CastError') {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Invalid ID format'
        });
    }

    if (err.code === 11000) {
        const field = Object.keys(err.keyValue)[0];
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: `${field} already exists`
        });
    }


    if (err.name === 'JsonWebTokenError') {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: 'Invalid token'
        });
    }

    if (err.name === 'TokenExpiredError') {
        return res.status(401).json({
            success: false,
            statusCode: 401,
            message: 'Token expired'
        });
    }
    if (err.name === 'MongoNetworkError' || err.name === 'MongoServerSelectionError') {
        return res.status(500).json({
            success: false,
            statusCode: 500,
            message: 'Database connection error'
        });
    }

    if (err.isJoi) {
        return res.status(400).json({
            success: false,
            statusCode: 400,
            message: 'Validation Error',
            errors: err.details.map(detail => detail.message)
        });
    }

    const status = err.statusCode || 500;
    const message = err.message || 'Internal Server Error';

    res.status(status).json({
        success: false,
        statusCode: status,
        message,
        stack: process.env.NODE_ENV === 'development' ? err.stack : undefined,
    });
};

module.exports = errorHandler;