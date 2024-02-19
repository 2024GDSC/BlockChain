import sqlCon from "../configs/sqlCon.js";
import moment from "moment-timezone";
import { ethers } from "ethers";
import dotenv from "dotenv";
import provider from "./provider.js";

dotenv.config();
moment.tz.setDefault("Asia/Seoul");
const conn = sqlCon();

class ContractManager {
  constructor(wallet_private_key) {
    this.provider = provider;
    this.wallet = new ethers.Wallet(wallet_private_key, this.provider);
  }

  async getContract(contract_factory_name) {
    const [contractJoinResult] = await conn.execute(
      "SELECT *  FROM CONTRACT_INFO WHERE contract_factory_name = ?",
      [contract_factory_name]
    );

    const selectABIResult = contractJoinResult[0].contractABI.abi;
    const contractAddress = contractJoinResult[0].contract_address;
    console.log(contractAddress);
    this.contractAddress = contractAddress;

    const contract = new ethers.Contract(
      contractAddress,
      selectABIResult,
      this.wallet
    );

    return contract;
  }
}

export default ContractManager;
