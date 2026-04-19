import PlayerSeat from "./PlayerSeat";

const SEATS = [
  {
    id: 0,
    label: "You",
    className: "bottom-0 left-1/2 -translate-x-1/2 translate-y-full",
  },
  {
    id: 1,
    label: "Bottom Left",
    className: "bottom-6 left-6 translate-y-1/4 -translate-x-1/4",
  },
  {
    id: 2,
    label: "Bottom Right",
    className: "bottom-6 right-6 translate-y-1/4 translate-x-1/4",
  },
  {
    id: 3,
    label: "Top Left",
    className: "top-6 left-6 -translate-y-1/4 -translate-x-1/4",
  },
  {
    id: 4,
    label: "Top Right",
    className: "top-6 right-6 -translate-y-1/4 translate-x-1/4",
  },
  {
    id: 5,
    label: "Top Center",
    className: "top-0 left-1/2 -translate-x-1/2 -translate-y-full",
  },
];

export default function Table() {
  return (
    <div className="flex items-center justify-center h-screen">
      <div
        className="relative flex items-center justify-center shadow-2xl"
        style={{
          width: "700px",
          height: "380px",
          borderRadius: "50%",
          background: "#5a3e2b",
        }}
      >
        {/* Felt surface */}
        <div
          className="flex items-center justify-center"
          style={{
            width: "640px",
            height: "320px",
            borderRadius: "50%",
            background: "radial-gradient(ellipse at center, #2d6a4f, #1b4332)",
          }}
        >
          <span className="text-white/20 text-2xl font-bold tracking-widest"></span>
        </div>
        {SEATS.map((seat) => (
          <div key={seat.id} className={`absolute ${seat.className}`}>
            {/* Replace this with your <PlayerSeat /> component later */}
            <PlayerSeat>{seat.id}</PlayerSeat>
          </div>
        ))}
      </div>
    </div>
  );
}
