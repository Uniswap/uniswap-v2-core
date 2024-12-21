const path = require('path'); 
const fs = require('fs-extra');
const solc = require('solc');

// Set the path to the contracts directory
const contractsPath = path.resolve(__dirname, 'contracts');

// Set the path to the build directory
const buildPath = path.resolve(__dirname, 'build');

// Remove the existing build directory if it exists
fs.removeSync(buildPath);

// Create the build directory
fs.ensureDirSync(buildPath);

// Read all Solidity files in the contracts directory
const contractFiles = fs.readdirSync(contractsPath).filter(file => file.endsWith('.sol'));

// Read and compile each contract
contractFiles.forEach(file => {
    const filePath = path.resolve(contractsPath, file);
    const source = fs.readFileSync(filePath, 'utf8');
    
    const input = {
        language: 'Solidity',
        sources: {
            [file]: {
                content: source,
            },
        },
        settings: {
            evmVersion: 'byzantium',
            outputSelection: {
                '*': {
                    '*': ['abi', 'evm.bytecode.object'],
                },
            },
        },
    };

    console.log(`Compiling ${file}...`);

    // Import callback to resolve relative paths
    function findImports(importPath) {
        const resolvedPath = path.resolve(contractsPath, importPath);
        if (fs.existsSync(resolvedPath)) {
            return { contents: fs.readFileSync(resolvedPath, 'utf8') };
        } else {
            return { error: `File not found: ${importPath}` };
        }
    }

    const output = JSON.parse(solc.compile(JSON.stringify(input), { import: findImports }));

    // Check for compilation errors
    if (output.errors) {
        output.errors.forEach(err => {
            console.error(err.formattedMessage);
        });
        process.exit(1); // Exit on compilation error
    }

    // Save compiled contract output to the build directory
    const contracts = output.contracts[file];
    for (let contractName in contracts) {
        const contractOutput = contracts[contractName];
        const outputFilePath = path.resolve(buildPath, `${contractName}.json`);
        fs.outputJsonSync(outputFilePath, contractOutput);
        console.log(`Compiled and saved: ${contractName}`);
    }
});
