const { callDeployByRepoURL, hasDeployByRepoUrl } = require('../utils/utils');

const webhook = (req, res, next) => {
    console.log(req.body);
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
        callDeployByRepoURL(data.repository.url, data);
    }

};

const verify = () => {

}

module.exports = {
    webhook
}