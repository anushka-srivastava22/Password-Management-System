const exec = require('child_process').exec;

function execute1(command, callback){
    exec(command, function(error, stdout, stderr){ 
        callback(stdout); 
    });
};

function execute2(command, callback){
    exec(command, function(error, stdout, stderr){ 
        callback(stdout); 
    });
};

function execute3(command, callback){
    exec(command, function(error, stdout, stderr){ 
        callback(stdout); 
    });
};

execute1('git add -A', (a) => {
    console.log("1",a)
    execute2('git commit -m "Automating"', (b) => {
        console.log("2",b)
        execute3('git symbolic-ref --short HEAD', (c) => {
            console.log("3",c)
        })
    })
})


// .then(() => {
// let curr_branch = null
// exec('git symbolic-ref --short HEAD', function(err, stdout, stdder)
// {
//     console.log(curr_branch)
//     curr_branch = stdout
// })})
// .then(
// exec('git push origin '+curr_branch, function(err, stdout, stdder)
// {
//     console.log("4")
//     console.log(stdout)
// }))



