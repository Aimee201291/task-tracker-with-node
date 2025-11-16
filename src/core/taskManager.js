import { promises as fsys, constants } from 'fs';
import { join } from 'path';
import * as fs from 'fs';

async function getMaxIdFromJSON(route) {
    try {
        await fsys.access(route, fsys.constants.F_OK)
    } catch (error) {
        if (error.code === 'ENOENT') {
            console.log(`The file doesn't exist on the route: ${route}`);
            return null;
        }
        throw error;
    }

    let content;
    try {
        content = await fsys.readFile(route, 'utf8')
    } catch (error) {
        console.log(`Failed to read the file: ${error.message}`);
        return null;
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
        return null;
    }

    if (data.length === 0) {
        console.log("The JSON exists but it's an empty array")
    }

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

async function add(input, mainPath) {
    const fileName = 'fileStore.json';
    const dirPath = join(mainPath, 'data');
    const filePath = join(dirPath, fileName);

    try {
        // Ensure the directory exist
        // The {recursive: true} option ensures that the 'mainPath/data' is created if 'data' does not exist.
        const { maxId, taskArray } = await getMaxIdFromJSON(filePath);
        const JSONObject = {
            id: maxId ? maxId + 1 : 1,
            name: input[1]
        }

        taskArray.push(JSONObject)
        const textJSON = JSON.stringify(taskArray, null, 2);

        fs.mkdirSync(dirPath, {recursive: true});
        writeFile(filePath, textJSON);

    } catch (error) {
        console.log('Error: ', error)
    }
}

export {
    add
};