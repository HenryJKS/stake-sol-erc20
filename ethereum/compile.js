const path = require("path")
const solc = require("solc")
const fs = require("fs-extra")

const buildPath = path.resolve(__dirname, "build");
fs.removeSync(buildPath)

const stakePath = path.resolve(__dirname, "contracts", "Stake.sol")

let source = fs.readFileSync(stakePath, "utf8")

let input = {
    language: 'Solidity',
    sources: {
        "Stake.sol": {
            content: source
        }
    },
    settings: {
        outputSelection: {
            "*": {
                "*": ["*"]
            }
        }
    }
};

let output = JSON.parse(solc.compile(JSON.stringify(input))).contracts["Stake.sol"];

fs.ensureDirSync(buildPath);

for (let contract in output) {
    fs.outputJSONSync(
        path.resolve(buildPath, contract.replace(":", "") + ".json"),
        output[contract]
    );
}