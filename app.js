const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
    auth: process.env.GITHUB_TOKEN,
});

const repos = octokit.teams.listReposInOrg({
    org: process.env.GITHUB_ORG,
    team_slug: process.env.GITHUB_TEAM
})

const members = octokit.teams.listMembersInOrg({
    org: process.env.GITHUB_ORG,
    team_slug: process.env.GITHUB_TEAM,
})

Promise.all([repos, members]).then((values) => {
    var publicRepos = []
    values[0].data.forEach(repo => {
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
    
    var publicMembers = []
    values[1].data.forEach(member => {
        item = {avatar_url: member.avatar_url,
                login: member.login,
                html_url: member.html_url}
        publicMembers.push(item)
    })
    console.log("** PUBLIC MEMBERS **")
    console.log(publicMembers)
    console.log("** PUBLIC REPOS **")
    console.log(publicRepos)
    console.log("all done!")
});