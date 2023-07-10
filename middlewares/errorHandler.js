//Not Found

const notFound = (req, res, nxt) => {
    const error = new Error(`Not Found : ${req.originalUrl}`);
    res.status(404);
    nxt(error);
}

const errorHandler = (err, req, res, nxt) => {
    const statusCode = res.statusCode == 200 ? 500 : res.statusCode;
    res.status(statusCode);
    res.json({
        message: err.message,
        stack: err.stack
    });
}

module.exports = { errorHandler, notFound }