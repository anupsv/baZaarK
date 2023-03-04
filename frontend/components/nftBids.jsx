import styles from "../styles/NftGallery.module.css";
import { useEffect, useState } from "react";
import { useAccount } from "wagmi";
import abi from "./abi.json"
import { ethers } from 'ethers';
import signalData from "../signals.json";

export default function NftBids({
}) {
  const [nfts, setNfts] = useState([]);
  const [isLoading, setIsloading] = useState(false);
  const { address, isDisconnected } = useAccount();
  const [pageKey, setPageKey] = useState();

  const fetchNfts = async () => {
    let nftsFormatted = [];
    setIsloading(true);
    const ethereum = (window).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.providers.Web3Provider(ethereum)
    const walletAddress = accounts[0]    // first account in MetaMask
    const signer = provider.getSigner(walletAddress)

    let contract = new ethers.Contract("0x005Fa83d9894653CE120672dca54E2E0aAbf1C31", abi, provider);

    const usernames = [
      {"name": "ShadowKnight", "description": "Stealthy warrior in shadows", "speed": 5, "endurance": 5, "armor": 0},
      {"name": "PixelAssassin", "description": "Killer with pixel precision", "speed": 8, "endurance": 1, "armor": 1},
      {"name": "MysticMage", "description": "Mysterious wielder of magic", "speed": 3, "endurance": 3, "armor": 2},
      {"name": "CrimsonDragon", "description": "Fiery red dragon master", "speed": 7, "endurance": 7, "armor": 5},
      {"name": "GalacticGamer", "description": "Gamer from the stars", "speed": 6, "endurance": 5, "armor": 2},
      {"name": "Nightingale", "description": "Songbird in the night", "speed": 2, "endurance": 8, "armor": 5},
      {"name": "WanderingWarrior", "description": "Traveling fighter on quest", "speed": 4, "endurance": 2, "armor": 5},
      {"name": "FrostByte", "description": "Cold and calculating gamer", "speed": 9, "endurance": 2, "armor": 6},
      {"name": "MythicLegend", "description": "Legendary mythological hero", "speed": 5, "endurance": 3, "armor": 9},
      {"name": "CosmicCrusader", "description": "Crusader of the cosmos", "speed": 6, "endurance": 4, "armor": 6},
      {"name": "StormBringer", "description": "Brings storms and destruction", "speed": 8, "endurance": 9, "armor": 5},
      {"name": "DragonSlayer", "description": "Slayer of fearsome dragons", "speed": 7, "endurance": 4, "armor": 4},
      {"name": "MagicManiac", "description": "Crazy for magical powers", "speed": 3, "endurance": 2, "armor": 3},
      {"name": "IceQueen", "description": "Cold but beautiful ruler", "speed": 2, "endurance": 1, "armor": 3},
      {"name": "StealthHunter", "description": "Hunter in the shadows", "speed": 6, "endurance": 8, "armor": 2},
      {"name": "GhostlyGoblin", "description": "Eerie goblin phantom", "speed": 4, "endurance": 7, "armor": 8},
      {"name": "CelestialWarrior", "description": "Warrior from celestial realm", "speed": 9, "endurance": 1, "armor": 6},
      {"name": "SavageSamurai", "description": "Ruthless Japanese warrior", "speed": 8, "endurance": 3, "armor": 4},
      {"name": "TechTrendsetter", "description": "Sets trends in technology", "speed": 7, "endurance": 5, "armor": 2},
      {"name": "CyberCrusader", "description": "Crusader in virtual world", "speed": 5, "endurance": 7, "armor": 0},
      {"name": "MysticMarauder", "description": "Mysterious invader with magic", "speed": 4, "endurance": 9, "armor": 9},
      {"name": "PiratePenguin", "description": "Seafaring penguin adventurer", "speed": 3, "endurance": 0, "armor": 7},
      {"name": "LunarLion", "description": "Lion of the moon", "speed": 6, "endurance": 1, "armor": 5},
      {"name": "DivineDragon", "description": "Heavenly, powerful dragon", "speed": 10, "endurance": 2, "armor": 3},
      {"name": "BlackoutBattler", "description": "Fighter in darkness", "speed": 5, "endurance": 3, "armor": 1}
    ];

    const collections = ["MultiMadness", "char4all", "RetiredNinja", "AshVsBatman"];


    for (let i =0; i < 24; i++){
      const bidData = await contract.bids(i, "0xCE4de93f2AB21758c5a9b442D72860fFAaA598eF");

      console.log(ethers.utils.formatEther(bidData))

      if (ethers.utils.formatEther(bidData) !== "0.0"){
        const contractData = await contract.characters(i);
        nftsFormatted.push({
          id: i,
          url: contractData[5],
          owner: contractData[4],
          title: usernames[i].name,
          speed: signalData[i][1].a,
          endurance: signalData[i][1].b,
          armor: signalData[i][1].c,
          verified: true,
          description: usernames[i].description,
          collectionName: collections[Math.floor(Math.random() * collections.length)],
          contract: "0xDCDfeE75E4b2BAd230CAef8f4a68dd0E78C93136"
        });
      }
    }

    setNfts(nftsFormatted);
    setIsloading(false);
  };

  useEffect(() => {
    fetchNfts();
  }, []);


  if (isDisconnected) return <p>Loading...</p>;

  return (
    <div className={styles.nft_gallery_page_container}>
      <div className={styles.nft_gallery}>
        <div className={styles.nfts_display}>
          {isLoading ? (
            <p>Loading...</p>
          ) : nfts?.length ? (
              nfts.map((nftsFormatted) => {
              return <NftCard key={nftsFormatted.tokenId} nft={nftsFormatted} currAccount={address}
                               />;
            })
          ) : (
            <p>No NFTs found for the selected address</p>
          )}
        </div>
      </div>

      {pageKey && (
        <div className={styles.button_container}>
          <a
            className={styles.button_black}
            onClick={() => {
              fetchNfts(pageKey);
            }}
          >
            Load more
          </a>
        </div>
      )}
    </div>
  );
}

function NftCard({ nft, currAccount }) {

  const [isVerifyingProof, setIsVerifyingProof] = useState(false);
  const [proofVerifiedStatus, setProofVerifiedStatus] = useState("not-done");
  const [bidComplete, setBidComplete] = useState("none");
  const [acceptBitComplete, setAcceptBidComplete] = useState("none");

  const acceptBid = async(e, id) => {
    e.preventDefault();
    setAcceptBidComplete("processing");
    const ethereum = (window).ethereum;
    const accounts = await ethereum.request({
      method: "eth_requestAccounts",
    });

    const provider = new ethers.providers.Web3Provider(ethereum)
    const walletAddress = accounts[0]    // first account in MetaMask
    const signer = provider.getSigner(walletAddress)

    let contract = new ethers.Contract("0x005Fa83d9894653CE120672dca54E2E0aAbf1C31", abi, signer);
    await new Promise(r => setTimeout(r, 3000));

    const inputs = [
      [
        "0x2c2f7b0fa569ce013baf3aad42bad0bdd21a5c33b8d05999a46abc0f31fde66e",
        "0x230d0691d23af5df861161444515988f767a79158793135d1f5871108b83e645"
      ],
      [
        [
          "0x1456bff63275f8a231eb2dfcf99b06c6482bfdc59f4c9d4ee6dd5226227be07b",
          "0x1844361ab5d21c43a1f93ccd2f64196b522139baaeaa03aaeb04f57f1a654d57"
        ],
        [
          "0x091d32ed2bc13a31133f92b510b788d5d43f7b1b4f3e4e8f83235d3bb9052020",
          "0x1bb51798e3dec8cc9e7c5ccadf02823dc8632beaa6382c258edb27898a6d1130"
        ]
      ],
      [
        "0x28344ee0ec42f42dc035aaf104171d4d5b8687a1b6de50812c3f480d672cc8da",
        "0x0643c16ac01a9c9ce6c3acd1ff414f2b81cf7f4476e5795005a2c880ba359a36"
      ],
      [
        "0x16a6c95e97b9e82bf0827218ca1762fda0e7da63e32e8fcbfdef4dc30bb547f7",
        "0x16a6c95e97b9e82bf0827218ca1762fda0e7da63e32e8fcbfdef4dc30bb547f7",
        "0x16a6c95e97b9e82bf0827218ca1762fda0e7da63e32e8fcbfdef4dc30bb547f7",
        "0x16a6c95e97b9e82bf0827218ca1762fda0e7da63e32e8fcbfdef4dc30bb547f7"
      ],
        id,
        "0xCE4de93f2AB21758c5a9b442D72860fFAaA598eF"
    ];

    const result = await contract.acceptBid(...(inputs));
    setAcceptBidComplete("done");
  }

  return (
    <div className={styles.card_container}>
      <div className={styles.image_container}>
        <img src={nft.url}></img>
      </div>
      <div className={styles.info_container}>
        <div className={styles.title_container}>
          <h3>
            {nft.title.length > 20
              ? `${nft.title.substring(0, 15)}...`
              : nft.title}
          </h3>
        </div>
        <hr className={styles.separator} />
        <div className={styles.symbol_contract_container}>
          <div className={styles.symbol_container}>
            <p>
              {nft.collectionName && nft.collectionName.length > 20
                ? `${nft.collectionName.substring(0, 20)}`
                : nft.collectionName}
            </p>

            {nft.verified !== "verified" ? (
                <img
                    src={
                      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e4/Twitter_Verified_Badge.svg/2048px-Twitter_Verified_Badge.svg.png"
                    }
                    width="20px"
                    height="20px"
                />
            ) : null}
            {currAccount === nft.owner && <a href="" onClick={(e) => acceptBid(e, nft.id)}><img
                src={
                  "https://i.postimg.cc/3NgNhYvd/dollar.png"
                }
                width="20px"
                height="20px"
            /></a>}
            {currAccount !== nft.owner && <img
                src={
                  "https://www.pngfind.com/pngs/m/243-2437878_circle-grey-solid-grey-colour-circle-png-transparent.png"
                }
                width="20px"
                height="20px"
            />}
          </div>
          <div className={styles.contract_container}>
            <p className={styles.contract_container}>
              {nft.owner.slice(0, 6)}...{nft.owner.slice(38)}
            </p>
            <img
              src={
                "https://etherscan.io/images/brandassets/etherscan-logo-circle.svg"
              }
              width="15px"
              height="15px"
            />
          </div>
        </div>

        <div className={styles.description_container}>
          <p><b>{nft.description}</b></p>
          <p>Speed &gt; {nft.speed-2 <= 0 ? 0 : nft.speed}</p>
          <p>Endurance &gt; {nft.endurance-1 <= 0 ? 0 : nft.endurance}</p>
          <p>Armor &gt; {nft.armor-3 <= 0 ? 0 : nft.armor}</p>
          <p style={{"font-weight": "bold", "color": 'orange'}}>{isVerifyingProof && "Verifying Proof of attributes..."}</p>
          {proofVerifiedStatus === "wrong" && <p style={{"font-weight": "bold", "color": 'red'}}>Proof incorrect! Report to Admin!</p>}
          {proofVerifiedStatus === "right" && <p style={{"font-weight": "bold", "color": 'green'}}>Proof valid and Attributes Verified.</p>}
          {bidComplete === "processing" && <p style={{"font-weight": "bold", "color": 'orange'}}>Submitting Bid...</p>}
          {acceptBitComplete === "processing" && <p style={{"font-weight": "bold", "color": 'orange'}}>Accepting Bid...</p>}
          {bidComplete === "done" && <p style={{"font-weight": "bold", "color": 'green'}}>Bid Submitted .....</p>}
          {acceptBitComplete === "done" && <p style={{"font-weight": "bold", "color": 'green'}}>Accepted Bid! </p>}
        </div>
      </div>
    </div>
  );
}

