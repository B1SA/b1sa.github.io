$.getJSON("./data/data.json", function(json) {
    addRepos(JSON.repos)
});

function addRepos(repos){
    
    repos.forEach(repo => {
        var myCol = $('<div class="col-sm-3 col-md-4 pb-2"></div>');
        var myPanel = $('<div class="card">'
                        +   '<div class="card-block">'
                        +       '<div class="card-header">'
                        +           '<span>'+repo.name+'</span>'
                        +       '</div>'
                        +      '<p>'+repo.description+'</p><img src="//placehold.it/50/eeeeee" class="rounded rounded-circle">'
                        +   '</div>'
                        +'</div>');

        myPanel.appendTo(myCol);
        myCol.appendTo('#contentPanel');
        
    });
};