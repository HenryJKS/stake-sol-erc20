import { web3 } from "../components/ButtonWeb3";
const MyToken = require("../build/contracts/MyToken.json");
require("dotenv").config({ path: "../.env" });

console.log(process.env.NEXT_PUBLIC_ADDRESS_MYTOKEN)

const mytoken = () => {
    return new web3.eth.Contract(MyToken.abi, process.env.NEXT_PUBLIC_ADDRESS_MYTOKEN);
}

export default mytoken;
