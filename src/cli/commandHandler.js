import { add, listAll, updateTask, deleteTask } from '../core/taskManager.js';

function readInput(mainPath) {
    
    const input = process.argv.slice(2);

        switch (input[0]) {
            case 'add':
                add(input, mainPath)
                console.log('Task added successfully')
                break;
            case 'update':
                updateTask(input, mainPath);
                break;
            case 'list':
                listAll(mainPath);
                break;
            case 'delete':
                deleteTask(input, mainPath);
                break;
            case 'mark-in-progress':
                updateTask(input, mainPath);
                break;
            case 'mark-done':
                updateTask(input, mainPath);
                break;
        }
}

export default readInput;