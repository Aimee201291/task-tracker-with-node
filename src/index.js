import readInput from './cli/commandHandler.js'
import { fileURLToPath } from 'url';
import { dirname } from 'path';

const getDirname = () => {
    // It converts the file URL (file://...) into a file system route.
    // It removes the file:// prefix and ensures that the path format is
    // the one used by your operating system
    const __filename = fileURLToPath(import.meta.url);
    // It extracts the dirname of that route
    return dirname(__filename);
};

const currentDir = getDirname();

readInput(currentDir);