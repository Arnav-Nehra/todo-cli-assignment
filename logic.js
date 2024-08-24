const { Command } = require('commander');
const program = new Command();
//to read and write files
const fs=require("fs")
//for using the file and directory paths easily
const path=require("path")


//defined a function to find the index of a todo in a array

function find(arrr,id){
    for(let i=0;i<arrr.length;i++){
        if(parseInt(arrr[i].id) === id){
            return i;
        }
    }
    return -1;
}

//defined a function to remove an todo and push other todos to a new array 

function removeAtIndex(arr, index) {
    let newArray = [];
    for (let i = 0; i < arr.length; i++) {
      if (i !== index) newArray.push(arr[i]);
    }
    return newArray;
  }

//basic program name and description  
program
    .name("todo-list")  
    .description("CLI based todo-list")
    .version('0.0.1')

//you can view a specific todo using a id
program
    .command("view-todo")
    .description('View an Todo-item.')
    .argument('<todoid>', 'to view todos')
    .action((todoid)=>{
        fs.readFile(path.join(__dirname,'/todos.json'),function(err,data){
            if(err) throw err 
            else{
                const todos=JSON.parse(data)
                const todosIndex=find(todos,parseInt(todoid))
                if(todos.length==0){
                    console.log("no todo to display.")
                }
                else{
                    const indexdata=todos[todosIndex].title
                    const isdone=todos[todosIndex].done
                    console.log(`ID ${todoid} \n TITLE: ${indexdata} \n DONE STATUS:${isdone}`)
                }
                
            }    
        })
    })

//you can view all todos in a single go
program
    .command("view-all-todos")
    .description('View all Todo-items.')
    .action(()=>{
            fs.readFile(path.join(__dirname,'/todos.json'),function(err,data){
            if(err) throw err 
            else{
                const todos=JSON.parse(data)
                if (todos.length === 0) {
                    console.log('No todos found.');
                    return;
                }
                todos.forEach((todo, index) => {
                    console.log(`ID: ${todo.id} \n TITLE: ${todo.title} \n DONE STATUS: ${todo.done}\n`);
                });
            }    
        })
    })

// it generates an random id, so two id's dont'match 
// on adding a new todo it is automatically declared false


program
    .command("add-todo")
    .description("Add an todo-item.")
    .argument("<todotitle>","to add todos")
    .action((todotitle,isdone)=>{
        const newTodo = {
            id: JSON.stringify(Math.floor(Math.random() * 100)),
            title: todotitle,
            done: false
        };
        fs.readFile(path.join(__dirname, '/todos.json'), 'utf8', (err, data) => {
            if (err) throw err;
            let todos = JSON.parse(data)
            todos.push(newTodo);
    
            fs.writeFile(path.join(__dirname, '/todos.json'), JSON.stringify(todos, null, 2), (err) => {
                if (err) throw err;
            });
            console.log("added todo")
        });
    })

program
    .command("delete-todo")
    .description("Delete an todo-item.")
    .argument("<todoid>","to delete todos")    
    .action((todoid)=>{
        fs.readFile(path.join(__dirname,'/todos.json'),(err,data)=>{
            if(err) throw err
                let todos=JSON.parse(data)
                let todosIndex=find(todos,parseInt(todoid))
                if(todosIndex===-1){
                    console.log("todo not found")
                }
                todos=removeAtIndex(todos,todosIndex)
                fs.writeFile(path.join(__dirname,'/todos.json'),JSON.stringify(todos),(err)=>{
                if(err) throw err
                console.log(console.log(`Deleted Todo ${todoid}`))
            })
        })
        
    })

program
    .command("done")
    .description("marks an todo done.")
    .argument("<todoid>","to mark todos done")    
    .action((todoid)=>{
        fs.readFile(path.join(__dirname, '/todos.json'), 'utf8', (err, data) => {
            if (err) throw err;
            let todos = JSON.parse(data)
            todosIndex=find(todos,parseInt(todoid))
            if (isNaN(todosIndex) || todosIndex < 0 || todosIndex >= todos.length) {
            console.log('Please provide a valid todo number to mark as done.');
            return;
            }
            else{
                todos[todosIndex].done = true;
                fs.writeFile(path.join(__dirname, '/todos.json'), JSON.stringify(todos, null, 2), (err) => {
                    if (err) throw err;
                });
                console.log(`Marked todo as done: "${todos[todosIndex].title}"`);
            }
            })
    })



program.parse();


//Thanks for your time..