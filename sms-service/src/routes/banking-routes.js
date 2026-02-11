import express from "express";
import { getCustomerDetails, getEcoBankAccountBalance, validateExpressCashToken, validateIdentity } from "../controllers/account-controller.js";




const router = express.Router();


router.post("/thirdpartyagency/sms/validateidentity",validateIdentity);
router.post("/thirdpartyagency/sms/pd/bulk-sms",bu);





export default router