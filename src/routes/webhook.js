const { callDeployByRepoURL, hasDeployByRepoUrl, getDeployByRepoUrl } = require('../utils/utils');

const webhook = (req, res, next) => {
    console.log(req.body);
    try {


        const { repository, head_commit: commit, pusher } = req.body;

        const { name, id, full_name, url, description } = repository;
        const { id: commit_id, message, timestamp, author, added, removed, modified } = commit;

        console.log(name, id, full_name, url, description, pusher, commit_id, message, timestamp, author, added, removed, modified);

        const data = {
            repository: { name, id, full_name, url, description },
            commit: { commit_id, message, timestamp, author, added, removed, modified },
            pusher
        }
        if (hasDeployByRepoUrl(data.repository.url)) {
            const repo = getDeployByRepoUrl(data.repository.url);

            verify(req, repo.gh_repo_SECRET);

            console.log('Goot Hook Request & Validated Secret');
            callDeployByRepoURL(data.repository.url, data);
            res.sendStatus(200);
        } else {
            next(new Error('Signature verification failed'));
        }
    } catch (error) {
        console.log(error);
        console.log('Got Test Commit, or a fake');
        res.sendStatus(200);
    }
};
const crypto = require('crypto');
const verify = (req, secret) => {
    const computedSignature = `sha1=${crypto.createHmac("sha1", secret).update(JSON.stringify(req.body)).digest("hex")}`;
    return (crypto.timingSafeEqual(Buffer.from(req.headers['x-hub-signature']), Buffer.from(computedSignature)));
}

module.exports = {
    webhook
}