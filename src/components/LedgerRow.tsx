interface Props {
  title: string;
  detail: string;
  date: string;
}

export default function LedgerRow({ title, detail, date }: Props) {
  return (
    <div className="ledger-row">
      <div className="ledger-main">
        <span className="ledger-title">{title}</span>
        <span className="ledger-detail">{detail}</span>
      </div>
      <span className="ledger-date mono">{date}</span>
    </div>
  );
}
