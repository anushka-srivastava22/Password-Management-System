const exec = require('child_process').exec;
const fs = require('fs')

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ 
        console.log(command)
        if(error)
        {
            console.log("Error",error)
            process.exit()
        }
        callback(stdout); 
    });
};

execute('git checkout -b auto'+Date.now(), (q) => {
    console.log("Branch Created\n", q)
    let data = JSON.parse(fs.readFileSync('package.json', "utf-8"))
    data.dependencies.nodemon = "^2.0.9"
    // console.log(data)
    fs.writeFileSync('package.json', JSON.stringify(data))
    console.log("Package.json updated")
    execute('npm i', (w) => {
        console.log("NPM Installed\n", w)
        execute('git add -A', (a) => {
            console.log("Add\n",a)
            execute('git commit -m "Automating"', (b) => {
                console.log("2 Commit\n",b)
                execute('git symbolic-ref --short HEAD', (c) => {
                    console.log("3 Branch name\n",c)
                    const branch_name = c.replace(/\n/g, '');
                    execute('git push origin '+ branch_name, (d) => {
                        console.log("4 Push\n", d)
                        execute('git config --get remote.upstream.url', (e) => {
                            const cloned_repo = e.replace(/\n/g, '')
                            console.log("5 Upstream Repo\n", e)
                            execute('git config --global user.name', (f) => {
                                const my_username = f.replace(/\n/g, '')
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
    })
})


