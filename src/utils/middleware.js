const crypto = require('crypto')


// For these headers, a sigHashAlg of sha1 must be used instead of sha256
// GitHub: X-Hub-Signature
// Gogs:   X-Gogs-Signature
const sigHeaderName = 'X-Hub-Signature-256'
const sigHashAlg = 'sha256'

const secret = process.env.GH_WEBHOOK_SECRET;

const githubSignatureVerifier = (req, res, next) => {
    const sig = Buffer.from(req.get(sigHeaderName) || '', 'utf8')
    const hmac = crypto.createHmac(sigHashAlg, secret)
    const digest = Buffer.from(sigHashAlg + '=' + hmac.update(req.rawBody).digest('hex'), 'utf8')
    if (sig.length !== digest.length || !crypto.timingSafeEqual(digest, sig)) {
        return next('Signature verification failed');
    }
    return next()
}

module.exports = {
    githubSignatureVerifier
}