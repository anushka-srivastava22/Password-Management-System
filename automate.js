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

function execute4(command, callback){
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
            execute4('git push origin '+c, (d) => {
                console.log("4", d)
            })
        })
    })
})



