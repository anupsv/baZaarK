import styles from "../styles/Home.module.css";
import InstructionsComponent from "../components/InstructionsComponent";
import NftGallery from "../components/nftGallery.jsx"
import MainPageStyles from "../styles/InstructionsComponent.module.css";
import NftBids from "../components/nftBids";


export default function Home() {
  return (
    <div>
      <main className={styles.main}>
          <InstructionsComponent/>
          <NftGallery walletAddress={"0x005Fa83d9894653CE120672dca54E2E0aAbf1C31"} chain={"MATIC_MUMBAI"} />
          <NftBids />
      </main>
    </div>
  );
}
