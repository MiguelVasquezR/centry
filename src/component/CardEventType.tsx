import { EventCardType } from "../types/event";

const CardEventType = ({ event }: { event: EventCardType }) => {
  return (
    <div
      className="card p-2"
      style={{
        border: 0,
        borderLeft: 4,
        borderColor: event.color,
        borderStyle: "solid",
      }}
    >
      <p className="is-size-5">{event.title}</p>
    </div>
  );
};

export default CardEventType;
