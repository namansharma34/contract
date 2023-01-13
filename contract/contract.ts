import register from "./contracts/register";
import { get } from "./contracts/get";
import { getByHeader } from "./contracts/getByHeader";
import { getByWallet } from "./contracts/getByWallet";
import { getByAuthor } from "./contracts/getByAuthor";
import { delete_ } from "./contracts/delete";
import { update } from "./contracts/update";
export async function handle(state: State, action: Action): Promise<Return> {
  switch (action.input.function) {
    case "register":
      return await register(state, action);
    case "get":
      return await get(state);
    case "getByHeader":
      return await getByHeader(state, action);
    case "getByWallet":
      return await getByWallet(state, action);
    case "getByAuthor":
      return await getByAuthor(state, action);
    case "update":
      return await update(state, action);
    case "delete":
      return await delete_(state, action);
    default:
      throw new ContractError("undefined function called:");
  }
}
