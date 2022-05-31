const exec = require('child_process').exec;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ 
        console.log(command)
        console.log("Error",error)
        if(error)
        {
            process.exit(error["cmd"])
        }
        callback(stdout); 
    });
};

execute('git add -A', (a) => {
    console.log("1 Add\n",a)
    execute('git commit -m "Automating"', (b) => {
        console.log("2 Commit\n",b)
        execute('git symbolic-ref --short HEAD', (c) => {
            console.log("3 Branch name\n",c)
            const branch_name = c;
            execute('git push origin '+ branch_name, (d) => {
                console.log("4 Push\n", d)
                execute('git config --get remote.upstream.url', (e) => {
                    const cloned_repo = e.replace(/\n/g, '')
                    console.log("5 Upstream Repo\n", e)
                    execute('git config --get remote.origin.url', (f) => {
                        const my_repo = f
                        const my_username = my_repo.split('/')[3]
                        console.log("6 My Repo\n", f)
                        console.log("6 My Username\n", my_username)
                        execute('gh pr create --title "Automated Pull" --body "Automated Pull Testing" --repo '+cloned_repo+' --head '+my_username+':'+branch_name, (g) => {
                            console.log("7 PR generated\n", g)
                        })
                    })
                })
            })
        })
    })
})



