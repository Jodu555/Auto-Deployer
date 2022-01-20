const crypto = require('crypto')

const sigHeaderName = 'x-hub-signature'
const sigHashAlg = 'sha256'

const secret = process.env.GH_WEBHOOK_SECRET || 'Test123';

const githubSignatureVerifier = (req, res, next) => {
    console.log(req.headers);
    const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')
    const hmac = crypto.createHmac(sigHashAlg, secret)
    const digest = Buffer.from(sigHashAlg + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8')
    console.log(sig, hmac, digest);
    if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
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