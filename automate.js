const exec = require('child_process').exec;

exec('git add -A', function(err, stdout, stdder)
{
    console.log("1")
    console.log(stdout)
    exec('git commit -m "Automating"', function(err, stdout, stdder)
    {   
        console.log("2")
        console.log(stdout)
        let curr_branch = null
        exec('git symbolic-ref --short HEAD', function(err, stdout, stdder)
        {
            console.log(curr_branch)
            curr_branch = stdout
            exec('git push origin '+curr_branch, function(err, stdout, stdder)
            {
                console.log("4")
                console.log(stdout)
            })
        })

    })
})



