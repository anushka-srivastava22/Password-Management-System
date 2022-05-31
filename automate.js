const exec = require('child_process').exec;

function execute(command, callback){
    exec(command, function(error, stdout, stderr){ 
        callback(stdout); 
    });
};

execute('git add -A', (a) => {
    console.log("1",a)
    execute('git commit -m "Automating"', (b) => {
        console.log("2",b)
        execute('git symbolic-ref --short HEAD', (c) => {
            console.log("3",c)
            execute('git push origin '+c, (d) => {
                console.log("4", d)

            })
        })
    })
})



