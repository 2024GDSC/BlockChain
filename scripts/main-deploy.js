const dotenv = require("dotenv");
const sqlCon = require("../db/sqlCon.js");
const fs = require("fs");
const path = require("path");
const cmd = require("node-cmd");
const contractWriter = require("../controller/main_contract_writer.js");
const hre = require("hardhat");

dotenv.config();
const conn = sqlCon();

const PURIFY_CONTRACT = "PurifyContract";

const writeFileSync = (filePath, content) => {
  try {
    filePath = path.join(__dirname, filePath);
    console.log(filePath);
    fs.writeFileSync(filePath, content, "utf-8");
    console.log("File written successfully");
  } catch (e) {
    console.log(e);
    return e;
  }
};

const main = async () => {
  try {
    const [result] = await conn.execute(
      "SELECT * FROM CONTRACT_INFO WHERE network = ?",
      ["polygon_main"]
    );
    let contract_id = result.length;
    let contract_factory_name;

    contract_id += 1;
    contract_factory_name = PURIFY_CONTRACT + contract_id;

    writeFileSync(
      `../contracts/${contract_factory_name}.sol`,
      contractWriter(contract_factory_name)
    );
    console.log("파일 작성을 완료했습니다.");
    cmd.runSync("npx hardhat compile", (err, data, stterr) => {
      console.log(data);
      if (err) return err;
    });
    console.log("컨트랙트 컴파일을 완료했습니다.");

    const purifyContract = await hre.ethers.deployContract(
      contract_factory_name
    );
    console.log(purifyContract);

    const txResult = await purifyContract.waitForDeployment();

    console.log(`Success!! : ${txResult.target}`);
    const contract_ABI = require(`../artifacts/contracts/${contract_factory_name}.sol/${contract_factory_name}.json`);

    packagedDatas = [
      null,
      contract_id,
      "polygon_main",
      contract_factory_name,
      txResult.target,
      contract_ABI,
    ];
    await conn.execute(
      "INSERT INTO CONTRACT_INFO VALUES (?,?,?,?,?,?)",
      packagedDatas
    );
    return packagedDatas;
  } catch (e) {
    console.log(e);
  }
};

// Execute the deployment
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
