const errorHandler = (err, req, res, next) => {
    console.log(err.stack);

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