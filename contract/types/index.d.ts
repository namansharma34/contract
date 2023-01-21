/* eslint-disable no-var */

declare global {
  interface State {
    db: Array<{
      id: string;
      header: string;
      uploader: string;
      subject: string;
      time: string;
      author: string;
      version: number;
      version_txn_history: Array<string>;
    }>;
    maintainer: string;
  }
  interface Action {
    input: {
      function:
        | "register"
        | "get"
        | "getByHeader"
        | "getByWallet"
        | "getByAuthor"
        | "update"
        | "delete";
      id: string;
      header: string;
      subject: string;
      author: string;
      wallet: string;
    };
  }
  const ContractError: any;
  type Return =
    | ContractError
    | { state: State }
    | { result: { db: Array<State>; success: boolean } };
}

export {};
