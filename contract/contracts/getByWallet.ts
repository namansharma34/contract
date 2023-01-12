export async function getByWallet(
  state: State,
  action: Action
): Promise<Return> {
  if (!action.input.wallet) {
    throw new ContractError("Wallet Address is not present");
  }
  const data = state.db.filter(
    (e) => e.uploader === String(action.input.wallet)
  );
  if (data.length) {
    return {
      result: { db: data, success: true },
    };
  } else {
    return {
      result: { data: [], success: false },
    };
  }
}
