import "./Boulder.css";

/** A DRAWN BOULDER — one wall, three ways up.
 *
 *  This replaces a "route topo" that had two defects, one cosmetic and one not.
 *
 *  THE COSMETIC ONE is the defect the keyboard just had. That file's own comments
 *  said it outright: holds were "sample points with a shape … the same treatment
 *  as .sample-point", START and TOP were "axis tick labels on the topo", and the
 *  route was "the human annotation on the measurement". It was a chart wearing a
 *  climbing costume, which is precisely why one template appeared to have made
 *  every drawing on the page.
 *
 *  THE ONE THAT MATTERS is that it contradicted Ivan's own words. His paragraph,
 *  30px above it, says: "A boulder can usually be done a lot of different ways,
 *  and which one costs you the least depends on your body — working that out is
 *  my favorite part." The drawing showed ONE route, holds numbered 1 through 8,
 *  captioned "start at 1, top out at 8" — a single prescribed sequence, i.e. the
 *  exact opposite of the sentence it was illustrating. It also invented a
 *  specific problem ("BOULDER / SET 01", an 8-move beta) that no source records,
 *  which PRODUCT.md forbids and which the keyboard was careful not to do.
 *
 *  So this draws what he actually said: one boulder, three sequences, drawn at
 *  EQUAL weight and equal colour because his whole point is that none of them is
 *  the right one. The three share a start where two sequences would really share
 *  it, and they take different holds where a taller or stronger climber would.
 *
 *  WHAT IT CLAIMS: only what is true of the drawing — three ways up, and the
 *  count of holds you can see. No gym, no grade, no set date, no problem name,
 *  no assertion that Ivan climbed anything in particular.
 *
 *  DRAWN, not plotted. A hold is a bolt-on lump of textured resin, so each one is
 *  three shapes — a shadow, a body, a bolt — the same depth treatment that makes
 *  a keycap read as a keycap. The wall is real plywood: two panels at different
 *  angles, seams where sheets meet, and a regular grid of t-nuts, because that is
 *  what you are looking at in a bouldering gym.
 */

type HoldType = "jug" | "crimp" | "sloper" | "pinch";

/** One hold. `r` is rotation in degrees — holds are bolted on at whatever angle
 *  the setter chose, and a wall of axis-aligned holds is the tell that nobody
 *  looked at one. */
type Hold = { x: number; y: number; type: HoldType; r: number };

/** The wall's holds, in viewBox units. Keyed, because the routes below are built
 *  FROM these coordinates rather than repeating them — the file this replaces
 *  hand-wrote its route as `d="M 30 88 L 39 84 …"`, a second copy of all eight
 *  hold positions, so moving a hold silently slid the line off the dots. */
const HOLDS: Record<string, Hold> = {
  s1: { x: 70, y: 258, type: "jug", r: -14 },
  s2: { x: 126, y: 264, type: "jug", r: 9 },
  a: { x: 58, y: 214, type: "crimp", r: 16 },
  b: { x: 112, y: 208, type: "pinch", r: -8 },
  c: { x: 168, y: 222, type: "sloper", r: 12 },
  d: { x: 86, y: 168, type: "jug", r: -19 },
  e: { x: 146, y: 160, type: "crimp", r: 7 },
  f: { x: 206, y: 176, type: "pinch", r: -13 },
  g: { x: 66, y: 128, type: "sloper", r: 21 },
  h: { x: 128, y: 112, type: "crimp", r: -6 },
  i: { x: 192, y: 124, type: "jug", r: 15 },
  j: { x: 104, y: 68, type: "pinch", r: -11 },
  k: { x: 166, y: 62, type: "crimp", r: 18 },
  top: { x: 136, y: 26, type: "jug", r: -4 },
};

/** Holds nobody in these three sequences uses. A wall is not a route: most of
 *  what is bolted to it is not on the problem you are trying. */
const OFF_ROUTE: Hold[] = [
  { x: 222, y: 258, type: "sloper", r: 24 },
  { x: 36, y: 168, type: "pinch", r: -21 },
  { x: 238, y: 86, type: "crimp", r: 11 },
  { x: 62, y: 96, type: "jug", r: 17 },
  { x: 250, y: 196, type: "crimp", r: -16 },
];

/** Three sequences up the same boulder. All three finish on the same hold,
 *  because they are ways up ONE boulder; two share a start, because two really
 *  would. Equal weight and equal colour, distinguished only by dash: the moment
 *  one of them is heavier or brighter, the drawing is asserting a correct beta
 *  and has started arguing with the paragraph above it. */
const ROUTES: readonly (readonly string[])[] = [
  ["s1", "a", "d", "g", "j", "top"],
  ["s2", "b", "e", "h", "k", "top"],
  ["s2", "c", "f", "i", "top"],
];

/** Hold silhouettes, drawn once each in local coordinates and placed by
 *  transform. Four shapes because a hold you can wrap a hand around, a quarter-
 *  inch edge, a featureless dome and a squeeze are four different objects — the
 *  silhouette is what tells you which move a sequence is asking for. */
const SHAPES: Record<HoldType, string> = {
  jug: "M -13 4 C -14 -3 -9 -9 -2 -9 C 6 -10 13 -5 13 2 C 13 6 9 9 3 9 C -4 10 -12 8 -13 4 Z",
  crimp: "M -11 2 C -11 -2 -6 -5 0 -5 C 6 -5 11 -2 11 2 C 11 5 6 7 0 7 C -6 7 -11 5 -11 2 Z",
  sloper: "M -12 5 C -12 -4 -6 -10 0 -10 C 7 -10 12 -4 12 5 C 12 8 6 9 0 9 C -6 9 -12 8 -12 5 Z",
  pinch: "M -7 8 C -8 0 -6 -9 0 -9 C 6 -9 8 0 7 8 C 6 10 -6 10 -7 8 Z",
};

/* Drawing geometry, in viewBox user units — the same class of value as a stroke
   width, not a page type size. Square, deliberately: a 5:6 topo once stood 1.86x
   its shortest sibling and was measured the largest, most saturated object in the
   whole document, one screen above the benchmark it out-shouted. A hobby drawing
   does not get to be the loudest thing on a recruiting page. */
const W = 300;
const H = 300;

/** The two plywood panels. A bouldering wall changes angle; one flat rectangle
 *  is a diagram of a wall, not a wall. The upper panel is narrower because it
 *  kicks back away from the viewer. */
const FACE_LOWER = "M 20 300 L 30 118 L 272 112 L 284 300 Z";
const FACE_UPPER = "M 30 118 L 46 16 L 258 12 L 272 112 Z";

/** T-nuts, on the regular grid a real wall is drilled to. Generated, not placed
 *  by hand: the point of them is the regularity, and hand-scattered "bolts" —
 *  what the previous version had — read as decoration instead of hardware. */
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
        aria-label="A drawn bouldering wall with nineteen holds, and three different sequences of holds leading to the same finishing hold at the top."
      >
        <defs>
          {/* The t-nut grid is clipped to the panels so no hardware floats off
              the wall — the grid is generated across the whole box on purpose,
              and this is what makes that safe. */}
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

        {/* Panel seams: where sheets of plywood meet, including the angle change
            between the two panels. Drawn after the t-nuts so a seam reads as
            being on the surface. */}
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

      {/* True of the DRAWING, and nothing more: three sequences are visible and
          you can count them. It does not name a gym, a grade, a set or a
          problem, and it does not claim Ivan climbed any of the three. */}
      <figcaption className="boulder-caption">One boulder, three ways up.</figcaption>
    </figure>
  );
}
