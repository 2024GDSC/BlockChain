import express from "express";
import { onChainCCTVMetaInfo, getCCTVMetaInfo } from "../service/purify.js";
const router = express.Router();

router.post("/", onChainCCTVMetaInfo);
router.get("/metaInfo", getCCTVMetaInfo);
export default router;
