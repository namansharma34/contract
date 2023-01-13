export default async function register(
  state: State,
  action: Action
): Promise<Return> {
  if (
    !action.input.id ||
    !action.input.header ||
    !action.input.subject ||
    !action.input.author
  ) {
    throw new ContractError("Fileds are Missing");
  }
  //@ts-ignore
  const uploader = SmartWeave.transaction.owner;
  //@ts-ignore
  const time = SmartWeave.block.timestamp;
  //@ts-ignore
  const txn_id = SmartWeave.transaction.id;
  state.db.push({
    id: action.input.id,
    header: action.input.header,
    uploader: String(uploader),
    subject: action.input.subject,
    time: String(time),
    author: action.input.author,
    version: 1,
    version_txn_history: [String(txn_id)],
  });

  return { state: state };
}
