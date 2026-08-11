import "./Boulder.css";

/** A drawn boulder. */

type HoldType = "jug" | "crimp" | "sloper" | "pinch";

/** One hold. `r` is rotation in degrees — holds are bolted on at whatever angle the setter chose, and a wall of
 * axis-aligned holds is the tell that nobody looked at one. */
type Hold = { x: number; y: number; type: HoldType; r: number };

/** The wall's holds, in viewBox units. */
const HOLDS: Record<string, Hold> = {
  /* THE START. Two hands on one big hold, feet low — where every line begins. */
  start: { x: 96, y: 268, type: "jug", r: -8 },

  /* THE LEFT LINE, the crimp ladder: small positive holds close together. Most
     moves, no long spans, nothing to rest on. Suits reach and patience. */
  l1: { x: 66, y: 226, type: "crimp", r: 14 },
  l2: { x: 78, y: 188, type: "crimp", r: -9 },
  l3: { x: 54, y: 150, type: "crimp", r: 18 },
  l4: { x: 82, y: 112, type: "pinch", r: -12 },

  /* The centre line, the powerful one: fewer moves, each one long. the crux is c2 -> c3, the biggest span on
     the wall and off a sloper — which is the reason the other two lines are worth trying. */
  c1: { x: 120, y: 214, type: "pinch", r: 10 },
  c2: { x: 132, y: 162, type: "sloper", r: -6 },
  c3: { x: 116, y: 92, type: "jug", r: 16 },

  /* THE RIGHT LINE, the technical one: it travels sideways before it goes up, so it
     climbs further for the same height and depends on body position. */
  r1: { x: 150, y: 232, type: "crimp", r: -16 },
  r2: { x: 196, y: 200, type: "jug", r: 8 },
  r3: { x: 214, y: 156, type: "pinch", r: -14 },
  r4: { x: 182, y: 116, type: "crimp", r: 12 },

  /* THE SHARED REST, where all three converge. A real problem usually has one good
     hold before the finish, and every line takes it. */
  rest: { x: 140, y: 66, type: "jug", r: -5 },

  /* THE TOP. Match hands and the problem is over. */
  finish: { x: 132, y: 28, type: "jug", r: 6 },
};

/** Holds none of the three lines uses. A wall is not a route: most of what is bolted to it belongs to some
 * other problem. */
const OFF_ROUTE: Hold[] = [
  { x: 244, y: 262, type: "sloper", r: 24 },
  { x: 30, y: 274, type: "pinch", r: -21 },
  { x: 246, y: 96, type: "crimp", r: 11 },
  { x: 34, y: 62, type: "jug", r: 17 },
  { x: 252, y: 210, type: "crimp", r: -16 },
  { x: 40, y: 200, type: "sloper", r: -8 },
];

/** Every hold the SVG paints, counted from the two collections that paint them. derived, because the accessible
 * name says it out loud. */
const HOLD_COUNT = Object.keys(HOLDS).length + OFF_ROUTE.length;

/** Three sequences up the same boulder. All three finish on the same hold, because they are ways up one
 * boulder; two share a start, because two really would. */
const ROUTES: readonly (readonly string[])[] = [
  /* Left: the crimp ladder — most moves, smallest holds. */
  ["start", "l1", "l2", "l3", "l4", "rest", "finish"],
  /* Centre: the power line — fewest moves, and it carries the crux. */
  ["start", "c1", "c2", "c3", "rest", "finish"],
  /* Right: the technical line — sideways first, so longer for the same height. */
  ["start", "r1", "r2", "r3", "r4", "rest", "finish"],
];


/** Hold silhouettes, drawn once each in local coordinates and placed by transform. */
const SHAPES: Record<HoldType, string> = {
  jug: "M -13 4 C -14 -3 -9 -9 -2 -9 C 6 -10 13 -5 13 2 C 13 6 9 9 3 9 C -4 10 -12 8 -13 4 Z",
  crimp: "M -11 2 C -11 -2 -6 -5 0 -5 C 6 -5 11 -2 11 2 C 11 5 6 7 0 7 C -6 7 -11 5 -11 2 Z",
  sloper: "M -12 5 C -12 -4 -6 -10 0 -10 C 7 -10 12 -4 12 5 C 12 8 6 9 0 9 C -6 9 -12 8 -12 5 Z",
  pinch: "M -7 8 C -8 0 -6 -9 0 -9 C 6 -9 8 0 7 8 C 6 10 -6 10 -7 8 Z",
};

/* Drawing geometry, in viewBox user units. */
const W = 300;
const H = 300;

/** The two plywood panels. A bouldering wall changes angle; one flat rectangle is a diagram of a wall, not a
 * wall. */
const FACE_LOWER = "M 20 300 L 30 118 L 272 112 L 284 300 Z";
const FACE_UPPER = "M 30 118 L 46 16 L 258 12 L 272 112 Z";

/** T-nuts, on the regular grid a real wall is drilled to. */
const TNUTS: { x: number; y: number }[] = [];
for (let y = 28; y < 296; y += 24)
  for (let x = 32; x < 280; x += 24) TNUTS.push({ x, y });

function routePath(keys: readonly string[]): string {
  return keys
    .map((k, i) => `${i === 0 ? "M" : "L"} ${HOLDS[k].x} ${HOLDS[k].y}`)
    .join(" ");
}

function HoldShape({ hold, onRoute }: { hold: Hold; onRoute: boolean }) {
  const d = SHAPES[hold.type];
  return (
    <g
      className={`boulder-hold${onRoute ? " boulder-hold-on" : " boulder-hold-off"}`}
      transform={`translate(${hold.x} ${hold.y}) rotate(${hold.r})`}
    >
      {/* Shadow, body, bolt. The offset shadow is what lifts a hold off the
          plywood; without it this is a coloured blob at a coordinate. */}
      <path className="boulder-hold-shadow" d={d} transform="translate(0.5 2)" />
      <path className="boulder-hold-body" d={d} />
      <circle className="boulder-bolt" cx="0" cy="0" r="1.6" />
    </g>
  );
}

export function Boulder() {
  return (
    <figure className="plate boulder">
      {/* Hobby drawings take plain labels; only the measured work carries FIG.
          numbers, so a reader never has to decode a hobby. */}
      <p className="plate-label">Bouldering</p>
      <svg
        className="boulder-svg"
        viewBox={`0 0 ${W} ${H}`}
        role="img"
        // Prose, not a spec line: a screen reader announces the numeral as a word ("19 holds"), so this
        // hears the same as the spelled-out version it replaces while being true by construction.
        aria-label={`A drawn bouldering wall with ${HOLD_COUNT} holds, and three different sequences of holds leading to the same finishing hold at the top.`}
      >
        <defs>
          {/* The t-nut grid is clipped to the panels so no hardware floats off the wall. */}
          <clipPath id="boulder-face-clip">
            <path d={FACE_LOWER} />
            <path d={FACE_UPPER} />
          </clipPath>
        </defs>

        <path className="boulder-face" d={FACE_LOWER} />
        <path className="boulder-face boulder-face-upper" d={FACE_UPPER} />

        <g className="boulder-tnuts" clipPath="url(#boulder-face-clip)" aria-hidden="true">
          {TNUTS.map((t) => (
            <circle className="boulder-tnut" key={`${t.x}-${t.y}`} cx={t.x} cy={t.y} r="0.9" />
          ))}
        </g>

        {/* Panel seams: where sheets of plywood meet, including the angle change between the two panels. Drawn
           after the t-nuts so a seam reads as being on the surface. */}
        <g className="boulder-seams" aria-hidden="true">
          <path className="boulder-seam" d="M 30 118 L 272 112" />
          <path className="boulder-seam" d="M 24 210 L 277 206" />
          <path className="boulder-seam" d="M 150 300 L 152 116" />
          <path className="boulder-seam" d="M 152 116 L 152 14" />
        </g>

        {/* Sequences under the holds, so a line runs behind the resin the way a
            drawn line should, and each hold sits on top of it. */}
        <g className="boulder-routes" aria-hidden="true">
          {ROUTES.map((keys, n) => (
            <path key={n} className={`boulder-path boulder-path-${n + 1}`} d={routePath(keys)} />
          ))}
        </g>

        {OFF_ROUTE.map((h) => (
          <HoldShape key={`off-${h.x}-${h.y}`} hold={h} onRoute={false} />
        ))}
        {Object.entries(HOLDS).map(([id, h]) => (
          <HoldShape key={id} hold={h} onRoute />
        ))}
      </svg>

      {/* True of the drawing, and nothing more: three sequences are visible and you can count them. It does not
         name a gym, a grade, a set or a problem, and it does not claim Ivan climbed any of the three. */}
      <figcaption className="boulder-caption">One boulder, three ways up.</figcaption>
    </figure>
  );
}
