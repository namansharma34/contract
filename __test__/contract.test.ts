import ArLocal from "arlocal";
import { Warp, WarpFactory } from "warp-contracts";
import fs from "fs";
import path from "path";
import { Wallet } from "warp-contracts/lib/types/contract/testing/Testing";
import { execSync } from "child_process";
jest.setTimeout(1200000);
describe("testing the contract", () => {
  let warp: Warp;
  let arlocal: ArLocal;
  let contractTxId: string;
  const db: State["db"] = [];
  let m_wallet: Wallet;
  beforeAll(async () => {
    execSync("yarn run build");
    arlocal = new ArLocal(2020);
    const contractSrc = fs.readFileSync(
      path.join(__dirname + "/../dist/contract.js"),
      "utf8"
    );
    const state = fs.readFileSync(
      path.join(__dirname + "/../dist/initial-state.json"),
      "utf8"
    );
    await arlocal.start();
    warp = WarpFactory.forLocal(2020);
    const { jwk } = await warp.testing.generateWallet();
    ({ contractTxId } = await warp.createContract.deploy({
      wallet: jwk,
      initState: state,
      src: contractSrc,
    }));
  });
  afterAll(async () => {
    await arlocal.stop();
  });
  it("registering two event in the contract", async () => {
    let wallet = await warp.testing.generateWallet();
    await warp.testing.mineBlock();
    let contract = warp.contract<State>(contractTxId).connect(wallet.jwk);
    let transcation = await warp.arweave.createTransaction(
      {
        data: fs.readFileSync(path.join(__dirname + "/./ae.pdf"), "utf8"),
      },
      wallet.jwk
    );
    transcation.addTag("header", "The Quantum Theory of Radiation");
    transcation.addTag("Author", "Albert Einstein");
    await warp.arweave.transactions.sign(transcation, wallet.jwk);
    await warp.testing.mineBlock();
    if (transcation.id) {
      const data: Record<string, any> = {
        id: transcation.id,
        header: "The Quantum Theory of Radiation",
        uploader: wallet.address,
        subject: "Physics",
        time: Number(Date.now().toString().substring(0, 10)).toString(),
        author: "Albert Einstein",
        version: 1,
      };
      const res = await contract.writeInteraction({
        function: "register",
        id: data.id,
        header: data.header,
        subject: data.subject,
        author: data.author,
      });
      data.version_txn_history = [res?.originalTxId];
      db.push(data as State["db"][0]);
      await warp.testing.mineBlock();
    } else {
      fail("Transcation first is not uploaded to the Permaweb");
    }
    m_wallet = await warp.testing.generateWallet();
    await warp.testing.mineBlock();
    contract = warp.contract<State>(contractTxId).connect(m_wallet.jwk);
    transcation = await warp.arweave.createTransaction(
      {
        data: fs.readFileSync(path.join(__dirname + "/./pdf.pdf"), "utf8"),
      },
      m_wallet.jwk
    );
    transcation.addTag("header", "Darwins Theory of Evolution");
    transcation.addTag("author", "Charles Darwins");
    await warp.arweave.transactions.sign(transcation, m_wallet.jwk);
    if (transcation.id) {
      const data: Record<string, any> = {
        id: transcation.id,
        header: "Darwins Theory of Evolution",
        uploader: m_wallet.address,
        subject: "Biology",
        time: Number(Date.now().toString().substring(0, 10)).toString(),
        author: "Charles Darwins",
        version: 1,
      };
      const res = await contract.writeInteraction({
        function: "register",
        id: transcation.id,
        header: data.header,
        subject: data.subject,
        author: data.author,
      });
      data.version_txn_history = [res?.originalTxId];
      db.push(data as State["db"][0]);
      await warp.testing.mineBlock();
    } else {
      fail("Transcation second is not uploaded to the permaweb");
    }
    expect((await contract.readState()).cachedValue.state.db).toEqual(db);
  });
  it("testing the get method", async () => {
    const contract = warp.contract(contractTxId).connect(m_wallet.jwk);
    const data = await contract.viewState<{ function: "get" } | Return>({
      function: "get",
    });
    //@ts-ignore
    expect(db[1]).toEqual(data.result.db[0]);
  });
  it("testing the getByHeader method", async () => {
    const contract = warp.contract(contractTxId);
    let data = await contract.viewState<
      { function: string; header: string } | Return
    >({
      function: "getByHeader",
      header: "The Quantum Theory of Radiation",
    });
    //@ts-ignore
    expect(data.result.db[0]).toEqual(db[0]);
  });
  it("testing the getByWallet method", async () => {
    const contract = warp.contract(contractTxId);
    let data = await contract.viewState({
      function: "getByWallet",
      wallet: m_wallet.address,
    });
    //@ts-ignore
    expect(data.result.db[0]).toEqual(db[1]);
  });
  it("testing the getByAuthor method", async () => {
    const contract = warp.contract(contractTxId);
    let data = await contract.viewState({
      function: "getByAuthor",
      author: "Albert Einstein",
    });
    //@ts-ignore
    expect(data.result.db[0]).toEqual(db[0]);
  });
  it("testing the update method", async () => {
    const contract = warp.contract(contractTxId).connect(m_wallet.jwk);
    const n_data = {
      header: "Darwins Marc",
      subject: "Computer Science",
      author: "Marc Andressen",
    };
    const res = await contract.writeInteraction({
      function: "update",
      id: db[1].id,
      header: n_data.header,
      subject: n_data.subject,
      author: n_data.author,
    });
    await warp.testing.mineBlock();
    db[1].header = n_data.header;
    db[1].subject = n_data.subject;
    db[1].author = n_data.author;
    db[1].version = db[1].version + 1;
    db[1].version_txn_history.push(res?.originalTxId as string);
    const data = await contract.readState();
    //@ts-ignore
    expect(db).toEqual(data.cachedValue.state["db"]);
  });
  it("testing the delete method", async () => {
    const contract = warp.contract(contractTxId).connect(m_wallet.jwk);
    await contract.writeInteraction({ function: "delete", id: db[1].id });
    db.pop();
    const data = await contract.readState();
    //@ts-ignore
    expect(db).toEqual(data.cachedValue.state.db);
  });
});
