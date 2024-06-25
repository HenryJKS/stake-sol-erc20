const fs = require("fs-extra");
const path = require("path");
const hre = require("hardhat");

async function main() {
  await hre.run("compile");

  const artifactsPath = path.resolve(__dirname, "../build/contracts");

  const contracts = ["Stake.sol", "MyToken.sol"];
  for (let contract of contracts) {
    const contractName = contract.replace(".sol", "");
    const contractArtifactPath = path.join(artifactsPath, contractName + ".sol", contractName + ".json");
    if (fs.existsSync(contractArtifactPath)) {
      const artifact = await fs.readJson(contractArtifactPath);
      fs.outputJsonSync(
        path.resolve(buildPath, contractName + ".json"),
        artifact
      );
      console.log(`Contract ${contractName} compiled and saved to ${contractName}.json`);
    } else {
      console.error(`Artifact for ${contractName} not found at ${contractArtifactPath}`);
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(error => {
    console.error(error);
    process.exit(1);
  });
