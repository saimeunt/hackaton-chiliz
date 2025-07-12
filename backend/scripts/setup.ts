import { ethers } from "hardhat";

async function main() {
  console.log("🚀 Configuration du système de paris sportifs...");

  // Vérifier que Hardhat est configuré
  const [deployer] = await ethers.getSigners();
  console.log("📋 Compte de déploiement:", deployer.address);

  // Vérifier le solde
  const balance = await ethers.provider.getBalance(deployer.address);
  console.log("💰 Solde:", ethers.formatEther(balance), "ETH");

  console.log("\n✅ Configuration terminée !");
  console.log("\n📖 Prochaines étapes :");
  console.log("1. Installer Foundry : curl -L https://foundry.paradigm.xyz | bash");
  console.log("2. Lancer les tests : forge test");
  console.log("3. Compiler les contrats : forge build");
  console.log("\n🔧 Ou utiliser Hardhat :");
  console.log("1. Lancer un nœud local : pnpm start:node");
  console.log("2. Lancer les tests : pnpm test:hardhat");
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }); 