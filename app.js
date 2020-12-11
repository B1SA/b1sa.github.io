const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

octokit.teams.listReposInOrg({
    org: process.env.GITHUB_ORG,
    team_slug: process.env.GITHUB_TEAM,
}).then(({ data }) => {  
    var publicRepos = []
    data.forEach(repo => {
        if(!repo.private){
            item = {id: repo.id,
                    name: repo.name,
                    description: repo.description,
                    forks_count: repo.forks_count,
                    html_url: repo.html_url,
                    homepage: repo.homepage,
                    language: repo.language,
                    stargazers_count: repo.stargazers_count,
                    watchers_count: repo.watchers_count}

            publicRepos.push(item)
        }
    });
    console.log(publicRepos)
});