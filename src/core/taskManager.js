import { promises as fsys, constants } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

async function generateFilePath(mainPath) {
    const fileName = 'fileStore.json';
    const dirPath = join(mainPath, 'data');
    const filePath = join(dirPath, fileName);
    return {
        filePath: filePath,
        dirPath: dirPath
    };
}

async function getFileContent(route) {
    try {
        await fsys.access(route, fsys.constants.F_OK)
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`The file doesn't exist on the route: ${route}`);
            return {
                maxId: null,
                taskArray: null
            };
        }
        throw error;
    }

    let content;
    try {
        content = await fsys.readFile(route, 'utf8')
    } catch (error) {
        console.log(`Failed to read the file: ${error.message}`);
        return {
            maxId: null,
            taskArray: null
        };
    }

    let data;
    try {
        data = JSON.parse(content);
    } catch (error) {
        console.log('The file is not a valid JSON')
    }

    if (!Array.isArray(data)) {
        console.warn('Warning: the file content is not an array of objects')
        console.log(data)
        return {
            maxId: null,
            taskArray: null
        };
    }

    if (data.length === 0) {
        console.log("The JSON exists but it's an empty array")
    }

    return data;
}

async function getMaxIdFromJSON(route) {

    const data = await getFileContent(route);

    const maxId = data.reduce((max, object) => {
        return Math.max(max, object.id)
    }, 0);

    return {
        maxId: maxId,
        taskArray: data
    };
}

function writeFile(route, content) {
    fsys.writeFile(route, content, (err) => {
        if (err) throw err
    })
}

async function addTask(input, mainPath) {
    if (input.length > 1) {
        const { filePath, dirPath } = await generateFilePath(mainPath);
        try {
            let firstTaskArray = [];
            const { maxId, taskArray } = await getMaxIdFromJSON(filePath);

            const JSONObject = {
                id: maxId ? maxId + 1 : 1,
                name: input.slice(1, input.length).join(' '),
                status: 'todo'
            }

            taskArray ? taskArray.push(JSONObject) : firstTaskArray.push(JSONObject);
            const textJSON = JSON.stringify(taskArray ? taskArray : firstTaskArray, null, 2);

            // Ensure the directory exist
            // The {recursive: true} option ensures that the 'mainPath/data' is created if 'data' does not exist.
            fs.mkdirSync(dirPath, {recursive: true});
            writeFile(filePath, textJSON);
            console.log('Task added successfully')

        } catch (error) {
            console.log('Error: ', error)
        }
    } else {
        console.log('Task name is required to add a new task. Usage: add "Task name"')
    }
}

async function listTasks (mainPath, status) {
    const { filePath } = await generateFilePath(mainPath);
    const statusOptions = ['todo', 'in-progress', 'done'];
    let data = await getFileContent(filePath);
    if (status && statusOptions.includes(status)) {
        data = data.filter(task => task.status === status);
        console.log(data);
    } else if (status && !statusOptions.includes(status)) {
        console.log('Invalid status. Must be one of the following: todo, in-progress, done.')
    } else if (!status) {
        console.log(data);
    }
}

async function updateTask(input, mainPath) {
    if (input.length > 2 || ((input[0] === 'mark-in-progress' || input[0] === 'mark-done') && input.length > 1)) {
        const { filePath, dirPath } = await generateFilePath(mainPath);
        const data = await getFileContent(filePath);
        const index = data.findIndex(task => task.id === parseInt(input[1]));
        if (index !== -1) {
            const taskArray = data.map (task => {
                if (task.id === parseInt(input[1])) {
                    return {
                        ...task,
                        name: input[0] === 'update' ? input.slice(2, input.length).join(' ') : task.name,
                        status: input[0] === 'mark-in-progress' ? 'in-progress'
                                : input[0] === 'mark-done' ? 'done' : task.status
                    };
                };
                return task;
            });
            const textJSON = JSON.stringify(taskArray, null, 2);
            fs.mkdirSync(dirPath, {recursive: true});
            writeFile(filePath, textJSON);
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
        const data = await getFileContent(filePath);
        const index = data.findIndex(task => task.id === parseInt(input[1]));
        if (index !== -1) {
            data.splice(index, 1);
            const textJSON = JSON.stringify(data, null, 2);
            fs.mkdirSync(dirPath, {recursive: true});
            writeFile(filePath, textJSON); 
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