import { add, list, updateTask, deleteTask } from '../core/taskManager.js';

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
                list(mainPath, input[1]);
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
            default:
                console.log('Invalid command. Must be one of the following: add, list, update, delete, mark-in-progress, mark-done, list todo, list in-progress, list done.');
        }
}

export default readInput;