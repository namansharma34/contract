export async function getByHeader(
  state: State,
  action: Action
): Promise<Return> {
  if (!action.input.header) {
    throw new ContractError("Header is not present");
  }
  const data = state.db.filter((e) => e.header === action.input.header);
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
