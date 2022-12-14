import React, { useEffect, useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { connect } from "./redux/blockchain/blockchainActions";
import { fetchData } from "./redux/data/dataActions";
import * as s from "./styles/globalStyles";
import styled from "styled-components";
import { InputNumber } from 'primereact/inputnumber';
import 'primeicons/primeicons.css';
import 'primereact/resources/themes/lara-light-indigo/theme.css';
import 'primereact/resources/primereact.css';
import 'primeflex/primeflex.css'

const truncate = (input, len) =>
  input.length > len ? `${input.substring(0, len)}...` : input;

export const StyledButton = styled.button`
  padding: 10px;
  border-radius: 50px;
  border: none;
  background-color: var(--secondary);
  padding: 10px;
  font-weight: bold;
  color: var(--secondary-text);
  width: 100px;
  cursor: pointer;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const StyledRoundButton = styled.button`
  padding: 10px;
  border-radius: 100%;
  border: none;
  background-color: var(--primary);
  padding: 10px;
  font-weight: bold;
  font-size: 15px;
  color: var(--primary-text);
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  :active {
    box-shadow: none;
    -webkit-box-shadow: none;
    -moz-box-shadow: none;
  }
`;

export const ResponsiveWrapper = styled.div`
  display: flex;
  flex: 1;
  flex-direction: column;
  justify-content: stretched;
  align-items: stretched;
  width: 100%;
  @media (min-width: 767px) {
    flex-direction: row;
  }
`;

export const StyledLogo = styled.img`
  width: 200px;
  @media (min-width: 767px) {
    width: 200px;
    padding-top: 50px;
  }
  transition: width 0.5s;
  transition: height 0.5s;
`;

export const StyledImg = styled.img`
  box-shadow: 0px 5px 11px 2px rgba(0, 0, 0, 0.7);
  border: 4px solid var(--secondary);
  background-color: var(--accent);
  border-radius: 100%;
  width: 200px;
  @media (min-width: 900px) {
    width: 250px;
  }
  @media (min-width: 1000px) {
    width: 300px;
  }
  transition: width 0.5s;
`;

export const StyledLink = styled.a`
  color: var(--secondary-text);
  text-decoration: none;
`;


  function App() {
    const dispatch = useDispatch();
    const blockchain = useSelector((state) => state.blockchain);
    const data = useSelector((state) => state.data);
    const [stakingNft, setStakingNft] = useState(false);
    const [value, setValue] = useState(1);
    const [feedback, setFeedback] = useState(`If You Want To Stake Your NFT Click Approve`);
    const [CONFIG, SET_CONFIG] = useState({
      CONTRACT_ADDRESS: "",
      SCAN_LINK: "",
      NETWORK: {
        NAME: "",
        SYMBOL: "",
        ID: 0,
      },
      NFT_NAME: "",
      SYMBOL: "",
      MAX_SUPPLY: 1,
      WEI_COST: 0,
      DISPLAY_COST: 0,
      GAS_LIMIT: 0,
      MARKETPLACE: "",
      MARKETPLACE_LINK: "",
      SHOW_BACKGROUND: false,
    });




    const approveNFTs = () => {
      setFeedback(`Staking your ${CONFIG.NFT_NAME}...`);
      blockchain.smartContract.methods
        .stake(String(value))
        .send({
          to: CONFIG.CONTRACT_ADDRESS,
          from: blockchain.account,
        })
        .once("error", (err) => {
          console.log(err);
          setFeedback("Sorry, something went wrong please try again later.");
        })
        .then((receipt) => {
          console.log(receipt);
          setFeedback(
            `WOW, the ${CONFIG.NFT_NAME} is staked! You will receive 66 fruit/day.`
          );
          dispatch(fetchData(blockchain.account));
        });

    }


    const disapproveNFTs = () => {
      setFeedback(`Withdrawing your ${CONFIG.NFT_NAME}...`);
      blockchain.smartContract.methods
        .unstake(String(value))
        .send({
          to: CONFIG.CONTRACT_ADDRESS,
          from: blockchain.account,
        })
        .once("error", (err) => {
          console.log(err);
          setFeedback("Sorry, something went wrong please try again later.");
        })
        .then((receipt) => {
          console.log(receipt);
          setFeedback(
            `WOW, the ${CONFIG.NFT_NAME} is withdrawn! And The Tokens went to your wallet`
          );
          dispatch(fetchData(blockchain.account));
        });

    }




    const getData = () => {
      if (blockchain.account !== "" && blockchain.smartContract !== null) {
        dispatch(fetchData(blockchain.account));
      }
    };

    const getConfig = async () => {
      const configResponse = await fetch("/config/config.json", {
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      });
      const config = await configResponse.json();
      SET_CONFIG(config);
    };

    useEffect(() => {
      getConfig();
    }, []);

    useEffect(() => {
      getData();
    }, [blockchain.account]);

    return (
      <s.Screen>
        <s.Container
          flex={1}
          ai={"center"}
          style={{ padding: 24, backgroundColor: "var(--primary)" }}
        >
          <a href={CONFIG.MARKETPLACE_LINK}>
            <StyledLogo alt={"logo"} src={"/config/logo.png"} />
          </a>
          <s.SpacerSmall />
          <ResponsiveWrapper flex={1} style={{ padding: 24 }} test>
            <s.SpacerLarge />
            <s.Container
              flex={2}
              jc={"center"}
              ai={"center"}
              style={{
              }}
            >
                <>
                  
                  <s.SpacerXSmall />
                  <s.SpacerSmall />
                  {blockchain.account === "" ||
                  blockchain.smartContract === null ? (
                    <s.Container ai={"center"} jc={"center"}>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        Connect to the {CONFIG.NETWORK.NAME} network
                      </s.TextDescription>
                      <s.SpacerSmall />
                      <StyledButton
                        onClick={(e) => {
                          e.preventDefault();
                          dispatch(connect());
                          getData();
                        }}
                      >
                        CONNECT
                      </StyledButton>
                      {blockchain.errorMsg !== "" ? (
                        <>
                          <s.SpacerSmall />
                          <s.TextDescription
                            style={{
                              textAlign: "center",
                              color: "var(--accent-text)",
                            }}
                          >
                            {blockchain.errorMsg}
                          </s.TextDescription>
                        </>
                      ) : null}
                    </s.Container>
                  ) : (
                    <>
                     <s.Container ai={"center"} jc={"center"} fd={"row"}>
                              <div>
          <div className="card">
          <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                  Token You Want Stake Or Withdraw
                  </s.TextTitle>
              <br/>
              <div className="p-fluid grid formgrid">
                  <div className="field col-12 md:col-12">
                  <s.TextTitle
                  style={{ textAlign: "center", color: "var(--accent-text)" }}
                >
                      <InputNumber inputId="minmax-buttons" value={value} onValueChange={(e) => setValue(e.value)} mode="decimal" showButtons min={1} max={6666}  />
                      </s.TextTitle>
                  </div>
              </div>

          </div>
      </div>

 </s.Container>
                      <s.TextDescription
                        style={{
                          textAlign: "center",
                          color: "var(--accent-text)",
                        }}
                      >
                        {feedback}
                      </s.TextDescription>
                      <s.SpacerMedium />

  
  <s.SpacerMedium />
                          
                          
  
                      <s.SpacerSmall />
                      <s.Container ai={"center"} jc={"center"} fd={"row"}>
                        <StyledButton
                          disabled={stakingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            approveNFTs();
                            getData();
                          }}
                        >
                          {stakingNft ? "BUSY" : "STAKE"}
                        </StyledButton>
                        <s.SpacerSmall />
                        <StyledButton
                          disabled={stakingNft ? 1 : 0}
                          onClick={(e) => {
                            e.preventDefault();
                            disapproveNFTs();
                            getData();
                          }}
                        >
                          {stakingNft ? "BUSY" : "WITHDRAW"}
                        </StyledButton>
                      </s.Container>
                    </>
                  )}
                </>
              <s.SpacerMedium />
            </s.Container>
            <s.SpacerLarge />
          </ResponsiveWrapper>
          <s.SpacerMedium />
          <s.Container jc={"center"} ai={"center"} style={{ width: "70%" }}>
            <s.TextDescription
              style={{
                textAlign: "center",
                color: "var(--primary-text)",
              }}
            >
              Please make sure you are connected to the right network (
              {CONFIG.NETWORK.NAME} Mainnet) and the correct address.
            </s.TextDescription>
            <s.SpacerSmall />
          </s.Container>
        </s.Container>
      </s.Screen>
    );
  }
  
  
  export default App;
