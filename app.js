const { Octokit } = require("@octokit/rest");
const { Base64 } = require("js-base64")
const sodium = require('tweetsodium'); 

//Initialize ocktokit Client
const octokit = new Octokit({
    auth: process.env.GH_TOKEN,
});

//Promise to get all repos from Team in an Org
console.log(`Retrieving repositories from Org ${process.env.GH_ORG}`)
const repos = octokit.teams.listReposInOrg({
    org: process.env.GH_ORG,
    team_slug: process.env.GH_TEAM
})

//Promise to get all members from Team in an Org
console.log(`Retrieving Members from Org ${process.env.GH_ORG}`)
const members = octokit.teams.listMembersInOrg({
    org: process.env.GH_ORG,
    team_slug: process.env.GH_TEAM,
})

//Call all promises
Promise.all([repos, members]).then((values) => {
    
    var publicRepos = []
    //Filter only public repos
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
    
    //Show only relevant member's data
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

    //Encode both members + repos 
    const content = Base64.encode(JSON.stringify({members: publicMembers, repos: publicRepos}))

    //Update file on github repo with encoded content
    octokit.repos.createOrUpdateFileContents({
        // replace the owner and email with your own details
        owner:  process.env.GH_PAGE_OWNER,
        repo:   process.env.GH_PAGE_REPO,
        sha:    process.env.GH_SHA_DATA,
        path:   "data/data.json",
        message:"Auto Refresh Repos and Members",
        content: content,
        committer: {
        name: "Octokit Bot",
        email: "notvalid@email.com",
        },
        author: {
        name: "Octokit Bot",
        email: "notvalid@email.com",
        },
    }).then(data => {
        octokit.actions.createOrUpdateRepoSecret({
            owner:  process.env.GH_PAGE_OWNER,
            repo:   process.env.GH_PAGE_REPO,
            secret_name: "GH_SHA_DATA",
            encrypted_value: encryptSecret(data.data.content.sha),
            key_id: process.env.GH_ORG_KEY_ID

        }).then(data =>{
            console.log("New SHA Key updated")
            console.log("all done!")    
        }).catch(err => {
            console.error("Error updating secret SHA")
            console.error(err)
        })
    }).catch (err => {
         console.error(err)
    }) 
}).catch (err => {
    console.error(err)
}) 

function encryptSecret(value){
    const key = process.env.GH_ORG_KEY;
    // Convert the message and key to Uint8Array's (Buffer implements that interface)
    const messageBytes = Buffer.from(value);
    const keyBytes = Buffer.from(key, 'base64');
    
    // Encrypt using LibSodium.
    const encryptedBytes = sodium.seal(messageBytes, keyBytes);

    // Base64 the encrypted secret
    const encrypted = Buffer.from(encryptedBytes).toString('base64');
    
    return encrypted
}