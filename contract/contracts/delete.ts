export async function delete_(state: State, action: Action): Promise<Return> {
  if (!action.input.id) {
    throw new ContractError("Id is not present");
  }
  const data = state.db.filter((e) => e.id === action.input.id);
  if (data.length) {
    //@ts-ignore
    const target = SmartWeave.transaction.owner;
    if (
      String(target) === String(data[0].uploader) ||
      String(target) === String(state.maintainer)
    ) {
      state.db = state.db.filter((e) => e.id !== action.input.id);
      return { state: state };
    }
  }
  return { state: state };
}
