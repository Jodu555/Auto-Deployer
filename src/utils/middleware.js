const crypto = require('crypto')

const secret = process.env.GH_WEBHOOK_SECRET || 'Test123';

const githubSignatureVerifier = (req, res, next) => {
    const computedSignature = `sha1=${crypto.createHmac("sha1", secret).update(JSON.stringify(req.body)).digest("hex")}`;
    if (!crypto.timingSafeEqual(Buffer.from(req.headers['x-hub-signature']), Buffer.from(computedSignature))) {
        return next(new Error('Signature verification failed'));
    }
    return next()
}

const notFound = (req, res) => {
    throw new Error('notFound')
}

const errorHandling = (err, req, res, next) => {
    const error = {
        message: err.stack.split('\n')[0],
        stack: err.stack,
    };
    let status = 500;
    //Do here error instance checks

    if (process.env.NODE_ENV !== 'production') {
        if (error.message.includes('notFound')) {
            res.status(404).send({
                success: false,
                path: req.path,
                message: 'Route not Found!',
            });
        } else {
            console.log(err);
            res.status(status).send({
                success: false,
                method: req.method,
                path: req.path,
                error,
            });
        }
    } else {
        res.status(status).send({
            success: false,
            message: error.message,
        })
    }
}

module.exports = {
    githubSignatureVerifier,
    notFound,
    errorHandling
}