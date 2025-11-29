import { addTask, listTasks, updateTask, deleteTask } from '../core/taskManager.js';

async function readInput(mainPath) {
    const input = process.argv.slice(2);
    try {
        switch (input[0]) {
            case 'add':
                await addTask(input, mainPath);
                break;
            case 'list':
                await listTasks(mainPath, input[1]);
                break;
            case 'delete':
                await deleteTask(input, mainPath);
                break;
            case 'update':
            case 'mark-in-progress':
            case 'mark-done':
                await updateTask(input, mainPath);
                break;
            default:
                console.log('Invalid command. Must be one of the following: add, list, update, delete, mark-in-progress, mark-done, list todo, list in-progress, list done.');
        }
    } catch (error) {
        console.log(`An unexpected error ocurred: ${error.message}`)
    }
}

export default readInput;