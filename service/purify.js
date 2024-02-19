import sqlCon from "../configs/sqlCon.js";
import moment from "moment-timezone";
import { makeGroupHashedID } from "../lib/funcs.js";
import dotenv from "dotenv";
import ContractManager from "../provider/ContractManager.js";

dotenv.config();
moment.tz.setDefault("Asia/Seoul");

const conn = sqlCon();

export const onChainCCTVMetaInfo = async (req, res) => {
  try {
    const { time, location, kind, isAppeared } = req.body;

    console.log(time);
    console.log(location);
    console.log(kind);
    console.log(isAppeared);

    const contractManager = new ContractManager(
      process.env.POLYGON_MAIN_NET_WALLET_PRIVATE_KEY
    );
    const contract = await contractManager.getContract("PurifyContract");
    console.log("계약서 컨트랙트 이서 시작------------------------------");
    const txData = contract.interface.encodeFunctionData("writeCCTVMetaInfo", [
      time,
      location,
      kind,
      isAppeared,
    ]);
    const gasFee = await contractManager.provider.getFeeData();
    const gasPrice = gasFee.maxFeePerGas;
    const gasLimit = await contractManager.provider.estimateGas({
      to: contractManager.contractAddress,
      data: txData,
      from: contractManager.wallet.address,
    });
    const tx = {
      to: contractManager.contractAddress,
      gasLimit,
      gasPrice,
      data: txData,
    };
    console.log(tx);
    const sentTx = await contractManager.wallet.sendTransaction(tx);
    console.log("계약서 컨트랙트 이서 진행------------------------------");
    const receipt = await sentTx.wait();
    console.log("계약서 컨트랙트 이서 완료------------------------------");
    return res.status(200).json({
      receipt,
    });
  } catch (err) {
    console.error(err);
    return res.status(409).json({
      message: err,
    });
  }
};

export const getCCTVMetaInfo = async (req, res) => {
  try {
    const contractManager = new ContractManager(
      process.env.POLYGON_MAIN_NET_WALLET_PRIVATE_KEY
    );
    const contract = await contractManager.getContract("PurifyContract");
    const tx = await contract.getCCTVMetaInfoList();
    return res.status(200).json({
      cctvMetaInfo: tx,
    });
  } catch (err) {
    console.error(err);
    return res.status(409).json({
      message: err,
    });
  }
};
