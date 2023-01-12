export async function get(state: State): Promise<Return> {
  //@ts-ignore
  const target = SmartWeave.transaction.owner;
  const data = state.db.filter((e) => e.uploader === String(target));
  if (data.length) {
    return {
      result: { db: data, success: true },
    };
  } else {
    return {
      result: { db: [], success: false },
    };
  }
}
