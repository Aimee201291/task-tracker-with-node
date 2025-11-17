import  { add, listAll } from '../core/taskManager.js';

function readInput(mainPath) {
    
    const input = process.argv.slice(2);

        switch (input[0]) {
            case 'add':
                add(input, mainPath)
                console.log('Task added successfully')
                break;
            case 'list':
                listAll(mainPath);
                break;
            case 'delete':
                delete(input, mainPath);
                break;
        }
}

export default readInput;