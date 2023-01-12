export async function getByAuthor(
  state: State,
  action: Action
): Promise<Return> {
  if (!action.input.author) {
    throw new ContractError("Author Name is not present");
  }
  const data = state.db.filter((e) => e.author === String(action.input.author));
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
