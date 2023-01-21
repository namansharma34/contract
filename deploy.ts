import { LoggerFactory, WarpFactory } from "warp-contracts";
import fs from "fs";
import path from "path";
import { execSync } from "child_process";
(async () => {
  execSync("yarn run build");
  const warp = WarpFactory.forMainnet();
  const contractSrc = fs.readFileSync(
    path.join(__dirname + "/./dist/contract.js"),
    "utf8"
  );
  const stateSrc = JSON.parse(
    fs.readFileSync(path.join(__dirname + "/./dist/initial-state.json"), "utf8")
  );
  const wallet = JSON.parse(
    fs.readFileSync(path.join(__dirname + "/./key_sl.json"), "utf8")
  );
  const address = await warp.arweave.wallets.getAddress(wallet);
  const state = {
    ...stateSrc,
    maintainer: address,
  };
  const contractId = await warp.createContract.deploy({
    wallet: wallet,
    initState: JSON.stringify(state),
    src: contractSrc,
  });
  console.log(contractId.contractTxId);
})();
