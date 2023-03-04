import styles from "../styles/InstructionsComponent.module.css";
import Router, { useRouter } from "next/router";
export default function InstructionsComponent() {
	const router = useRouter();
	const scroll = async(e) => {
		e.preventDefault();
		window.scrollTo(0, 1000)
	};

	return (
		<div className={styles.container}>
			<header className={styles.header_container}>
				<h1>
					Attribute <span>Verified</span> Marketplace
				</h1>
				<p>By leveraging the power of zero knowledge proofs, </p>
				<p>we're able to <span>establish verifiable claims</span>
					about NFT game character attributes without compromising user privacy or security.
				</p>
			</header>

			<div className={styles.buttons_container}>
				<a href={"#"} onClick={(e) => {scroll(e)}}>
					<div className={styles.button}>
						<p>Load NFTs</p>
					</div>
				</a>
			</div>
		</div>
	);
}
