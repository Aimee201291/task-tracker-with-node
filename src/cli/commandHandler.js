import  { add } from '../core/taskManager.js';

function readInput(mainPath) {
    
    const input = process.argv.slice(2);

        switch (input[0]) {
            case 'add':
                add(input, mainPath)
                console.log('Task added successfully')
                break;
            case 'update':
                listTask();
                break;
            case 'delete':
                deleteTask();
                break;
        }
}

export default readInput;