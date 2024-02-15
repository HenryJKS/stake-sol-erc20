import { web3 } from "../components/ButtonWeb3";
import MyToken from "./build/MyToken.json";

const mytoken = () => {
    return new web3.eth.Contract(MyToken.abi, process.env.NEXT_PUBLIC_ADDRESS_MYTOKEN);
}

export default mytoken;
