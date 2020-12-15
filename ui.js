$.getJSON("./data/data.json", function(data) {
    addRepos(data.repos)
    addMembers(data.members)

});

function addRepos(repos){
    
    repos.forEach(repo => {
        var myCol = $('<div class="col-sm-3 col-md-4 pb-2"></div>');
        var myPanel = $('<div class="card">'
                        +   '<div class="card-block">'
                        +       '<div class="card-header">'
                        +           '<a href="'+repo.html_url+'"><span>'+repo.name+'</span></a>'
                        +       '</div>'
                        +      '<p class"p-card">'+repo.description+'</p>'
                        +   '</div>'
                        +'</div>');

        myPanel.appendTo(myCol);
        myCol.appendTo('#contentPanel');
        
    });
};

function addMembers(members){
    
    members.forEach(member => {
        var membersHtml= $('<a class="member-avatar" href="'+member.html_url+'">'
                        +'<img src="'+member.avatar_url+'" title="'+member.login+'" width="48" height="48"></img></a>')
        membersHtml.appendTo('#membersContent')

    })


}