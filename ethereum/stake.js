import { web3 } from "../components/ButtonWeb3";
const Stake = require("./build/Stake.json");

const stake = () => {
    return new web3.eth.Contract(Stake.abi, process.env.NEXT_PUBLIC_ADDRESS_STAKE);
}

export default stake;
