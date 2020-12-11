const { Octokit } = require("@octokit/rest");

const octokit = new Octokit({
  auth: process.env.GITHUB_TOKEN,
});

octokit.teams.listReposInOrg({
    org: process.env.GITHUB_ORG,
    team_slug: process.env.GITHUB_TEAM,
  })
  .then(({ data }) => {
     console.dir(data)
     console.log("Done!")
  });