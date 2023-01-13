export async function update(state: State, action: Action) {
  if (!action.input.id) {
    throw new ContractError("Id is not present over here");
  }
  //@ts-ignore
  const target = SmartWeave.transaction.owner;
  //@ts-ignore
  const tx = SmartWeave.transaction.id;
  const data = state.db.filter((e) => e.id === action.input.id)[0];
  if (data.uploader === String(target) || state.maintainer === String(target)) {
    const n_data: Record<string, any> = {};
    n_data.id = data.id;
    if (action.input.header) {
      n_data.header = action.input.header;
    } else {
      n_data.header = data.header;
    }
    n_data.uploader = data.uploader;
    if (action.input.subject) {
      n_data.subject = action.input.subject;
    } else {
      n_data.subject = data.subject;
    }
    n_data.time = data.time;
    if (action.input.author) {
      n_data.author = action.input.author;
    } else {
      n_data.author = data.author;
    }
    n_data.version = data.version + 1;
    n_data.version_txn_history = [...data.version_txn_history, tx];
    state.db = state.db.filter((e) => e.id !== action.input.id);
    state.db.push(n_data as State["db"][0]);
    return { state: state };
  }
  return { state: state };
}
