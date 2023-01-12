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
  state.db.push({
    id: action.input.id,
    header: action.input.header,
    uploader: String(uploader),
    time: String(time),
    subject: action.input.subject,
    author: action.input.author,
  });

  return { state: state };
}
