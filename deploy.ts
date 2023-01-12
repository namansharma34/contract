import { LoggerFactory, WarpFactory } from "warp-contracts";
import fs from "fs";
import Arweave from "arweave";
import { JWKInterface } from "arweave/node/lib/wallet";
import path from "path";
import ArLocal from "arlocal";
import { execSync } from "child_process";
(async () => {
  execSync("yarn run build");
  const arlocal = new ArLocal(2020);
  await arlocal.start();
  LoggerFactory.INST.logLevel("error");
  const warp = WarpFactory.forLocal(2020);
  const { jwk: wallet, address: addr } = await warp.testing.generateWallet();
  await warp.testing.mineBlock();
  const contractSrc = fs.readFileSync(
    path.join(__dirname + "/./dist/contract.js"),
    "utf8"
  );
  const stateSrc = fs.readFileSync(
    path.join(__dirname + "/./dist/initial-state.json"),
    "utf8"
  );
  const contractId = await warp.createContract.deploy({
    wallet: wallet,
    initState: stateSrc,
    src: contractSrc,
  });
  await warp.testing.mineBlock();
  console.log(contractId.contractTxId);
  const contract = warp.contract(contractId.contractTxId).connect(wallet);
  await contract.writeInteraction({
    function: "register",
    id: "kjsdf89jfd",
    header: "albert",
    subject: "physics",
    author: "anish",
  });
  await warp.testing.mineBlock();
  const data = await contract.readState();
  console.log(`HI ${JSON.stringify(data)}`);
  await arlocal.stop();
})();
