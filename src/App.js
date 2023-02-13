import { ethers } from "ethers";
import React, { useEffect, useState } from "react";
import "./styles/App.css";
import "./styles/myImage.css";
import "./styles/markdown.css";
import twitterLogo from "./assets/twitter-logo.svg";
import DigitalNoMadNFTV5 from "./utils/DigitalNoMadNFTV5.json";
// import testImage from "./assets/testImage.jpeg";
import NFTImage from "./assets/NFTImage.png";
import ReactMarkdown from "react-markdown";
import Who_are_We from "./documentation/Who_are_We.md";

const TWITTER_HANDLE = "jamalforbes_";
const TWITTER_LINK = `https://twitter.com/${TWITTER_HANDLE}`;
const App = () => {
  const [currentAccount, setCurrentAccount] = useState("");
  const [totalNFTsMinted, setTotalNFTsMinted] = useState(0);
  const [markdown, setMarkdown] = useState("");
  const checkIfWalletIsConnected = async () => {
    const { ethereum } = window;
    if (!ethereum) {
      console.log("Make sure you have metamask!");
      return;
    } else {
      console.log("We have the ethereum object", ethereum);
    }
    const accounts = await ethereum.request({ method: "eth_accounts" });
    if (accounts.length !== 0) {
      const account = accounts[0];
      console.log("Found an authorized account:", account);
      setCurrentAccount(account);
    } else {
      console.log("No authorized account found");
    }
  };
  const connectWallet = async () => {
    try {
      const { ethereum } = window;
      if (!ethereum) {
        alert("Get MetaMask!");
        return;
      }
      const accounts = await ethereum.request({
        method: "eth_requestAccounts",
      });
      /*
       * This should print out public address once we authorize Metamask.
       */
      console.log("Connected", accounts[0]);
      setCurrentAccount(accounts[0]);
    } catch (error) {
      console.log(error);
    }
  };
  const askContractToMintNft = async () => {
    const CONTRACT_ADDRESS = "0xCC56be298A8125d579e8141F1aa52E4a72629f37";
    try {
      const { ethereum } = window;
      if (ethereum) {
        const provider = new ethers.providers.Web3Provider(ethereum);
        const signer = provider.getSigner();
        const connectedContract = new ethers.Contract(
          CONTRACT_ADDRESS,
          DigitalNoMadNFTV5.abi,
          signer
        );
        console.log("Going to pop wallet now to pay gas...");
        let nftTxn = await connectedContract.makeADigitalNomadNFT();
        console.log("Mining...please wait.");
        await nftTxn.wait();    
        console.log(
          `Mined, see transaction: https://goerli.etherscan.io/tx/${nftTxn.hash}`
        );
      } else {
        console.log("Ethereum object doesn't exist!");
      }
    } catch (error) {
      console.log(error);
    }
  };
  const nftTotalSupply = async () => {
    const total = parseInt(totalNFTsMinted, 10) || 0;
    setTotalNFTsMinted(total + 1);
  }
  // Render Methods
  const renderNotConnectedContainer = () => (
    <button
      onClick={connectWallet}
      className="cta-button connect-wallet-button"
    >
      Connect to Wallet
    </button>
  );
  // useEffect(() => {
  //   checkIfWalletIsConnected();
  // }, []);

  useEffect(() => {
    checkIfWalletIsConnected();
    fetch(Who_are_We)
    .then(res => res.text())
    .then(text => {
      setMarkdown(text);
    });
  }, []);
  /*
   * Added a conditional render! So we don't show "Connect to Wallet" if we're already connected.
   */
  return (
    <div className="App">
      <div className="container">
        <div className="header-container">
          <p className="header gradient-text">DigitalNoMadNFT</p>
          <p className="sub-text">
            WELCOME TO THE CLUB!
            <br></br>
            For A distinct set of Professional Specialists, Forward thinkers and
            Underdogs.
            <br></br>
            Founded by the Worlds most Persistent and Strong-willed Individuals.
          </p>
          {currentAccount === "" ? (
            renderNotConnectedContainer()
          ) : (
            <button
              onClick={() => {
                askContractToMintNft();
                nftTotalSupply();
              }}
              className="cta-button connect-wallet-button"
            >
              Mint NFT
            </button>
          )}
          <div className="image-container">
            <img src={NFTImage} alt="Digital_NoMad_NFT.png" className="my-image" />
          </div>
          <p className="sub-text">
            Total NFTs Minted So Far: 
          </p>
            <div className="flashing"> {totalNFTsMinted} / 50
            </div>
          <div className="hover-container">
            <ReactMarkdown children={markdown} />
          </div>
          {/* <button onClick={handleMint}>Mint NFT
          </button> */}
        </div>

        <div className="footer-container">
          <img alt="Twitter Logo" className="twitter-logo" src={twitterLogo} />
          <a
            className="footer-text"
            href={TWITTER_LINK}
            target="_blank"
            rel="noreferrer"
          >{`built by Jamal Forbes 
            `}</a>
        </div>
      </div>
    </div>
  );
};
export default App;
