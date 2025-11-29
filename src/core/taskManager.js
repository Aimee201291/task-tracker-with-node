import { promises as fsp } from 'fs';
import { join } from 'path';

async function generateFilePath(mainPath) {
    const fileName = 'fileStore.json';
    const dirPath = join(mainPath, 'data');
    const filePath = join(dirPath, fileName);
    return {
        filePath: filePath,
        dirPath: dirPath
    };
}

async function readDataFile(filePath) {
    let content = '[]';
    try {
        content = await fsp.readFile(filePath, 'utf8');
    } catch (error) {
        if (error.code === 'ENOENT') {
            return { maxId: 0, taskArray: [] };
        }
        throw error;
    }
    let data;
    try {
        data = JSON.parse(content.trim() || '[]');
    } catch (error) {
        console.warn('Error: The file is not a valid JSON. Data will be reset to an empty list.')
        data = [];
    }
    if (!Array.isArray(data)) {
        console.warn('Warning: The file content is not a JSON array. Data will be reset to an empty list.')
        data = [];
    }
    const maxId = data.reduce((max, task) => Math.max(max, task.id || 0), 0);
    return {
        maxId: maxId,
        taskArray: data
    }
}

async function writeFile(route, content) {
    await fsp.writeFile(route, content);
}

async function addTask(input, mainPath) {
    if (input.length > 1) {
        const { filePath, dirPath } = await generateFilePath(mainPath);
        try {
            // Ensure the directory exist
            // The {recursive: true} option ensures that the 'mainPath/data' is created if 'data' does not exist.
            await fsp.mkdir(dirPath, { recursive: true });
            const { maxId, taskArray } = await readDataFile(filePath);
            const JSONObject = {
                id: maxId + 1,
                name: input.slice(1).join(' '),
                status: 'todo'
            }
            taskArray.push(JSONObject);
            const textJSON = JSON.stringify(taskArray, null, 2);
            await writeFile(filePath, textJSON);
            console.log('Task added successfully')
        } catch (error) {
            console.log('Error adding task: ', error.message);
        }
    } else {
        console.log('Task name is required to add a new task. Usage: add "Task name"')
    }
}

async function listTasks (mainPath, status) {
    const { filePath } = await generateFilePath(mainPath);
    const statusOptions = ['todo', 'in-progress', 'done'];
    let { taskArray } = await readDataFile(filePath);
    if (status && statusOptions.includes(status)) {
        taskArray = taskArray.filter(task => task.status === status);
        console.log(taskArray);
    } else if (status && !statusOptions.includes(status)) {
        console.log('Invalid status. Must be one of the following: todo, in-progress, done.')
    } else if (!status) {
        console.log(taskArray);
    }
}

async function updateTask(input, mainPath) {
    if (input.length > 2 || ((input[0] === 'mark-in-progress' || input[0] === 'mark-done') && input.length > 1)) {
        const { filePath, dirPath } = await generateFilePath(mainPath);
        let { taskArray } = await readDataFile(filePath);      
        const index = taskArray.findIndex(task => task.id === parseInt(input[1]));
        if (index !== -1) {
            taskArray = taskArray.map(task => {
                if (task.id === parseInt(input[1])) {
                    return {
                        ...task,
                        name: input[0] === 'update' ? input.slice(2).join(' ') : task.name,
                        status: input[0] === 'mark-in-progress' ? 'in-progress'
                                : input[0] === 'mark-done' ? 'done' : task.status
                    };
                };
                return task;
            });
            try {
                const textJSON = JSON.stringify(taskArray, null, 2);
                await fsp.mkdir(dirPath, {recursive: true});
                await writeFile(filePath, textJSON);
            } catch (error) {
                console.log('Error updating task: ', error.message);
            }
        } else {
            console.log(`Task with id ${input[1]} not found`);
        }
    } else if (input[0] === 'update') {
        console.log('Task id and new name are required to update a task. Usage: update <task_id> "New task name".')
    } else if (input[0] === 'mark-in-progress' || input[0] === 'mark-done') {
        console.log('Task id is required to update the status of a task. Usage: mark-in-progress <task_id> OR mark-done <task_id>.')
    }
};

async function deleteTask(input, mainPath) {
    if (input.length > 1) {
        const {filePath, dirPath} = await generateFilePath(mainPath);
        const { taskArray } = await readDataFile(filePath);
        const index = taskArray.findIndex(task => task.id === parseInt(input[1]));
        if (index !== -1) {
            taskArray.splice(index, 1);
            const textJSON = JSON.stringify(taskArray, null, 2);
            await fsp.mkdir(dirPath, {recursive: true});
            await writeFile(filePath, textJSON); 
        } else {
            console.log(`Task with id ${input[1]} not found`);
        }
    } else {
        console.log('Task id is required to delete a task. Usage: delete <task_id>.')
    }
}

export {
    addTask,
    listTasks,
    updateTask,
    deleteTask,
};