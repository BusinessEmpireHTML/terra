import {
  BORDER_GRAPH,
  buildRouteRound,
  distancesFrom,
  giveUp,
  move,
  movesMade,
  neighborsOf,
  pickRoute,
  ROUND_PARS,
  routeHint,
  shortestPath,
  startRoute,
} from "../travelRoute";
import { routePoints, mysteryPoints } from "../../gamification/gameScoring";
import { seededRng } from "../../utils/random";

describe("border graph", () => {
  it("is symmetric and has no self-loops", () => {
    for (const [id, neighbors] of BORDER_GRAPH) {
      expect(neighbors).not.toContain(id);
      for (const n of neighbors) expect(neighborsOf(n)).toContain(id);
    }
  });

  it("knows islands have no land neighbors", () => {
    expect(neighborsOf("ISL")).toEqual([]);
    expect(neighborsOf("JPN")).toEqual([]);
  });
});

describe("shortest routes", () => {
  it("finds the fewest border crossings", () => {
    expect(shortestPath("ESP", "DEU")).toEqual(["ESP", "FRA", "DEU"]);
    expect(shortestPath("PRT", "PRT")).toEqual(["PRT"]);
    expect(distancesFrom("PRT").get("ESP")).toBe(1);
    const path = shortestPath("PRT", "CHN")!;
    expect(path[0]).toBe("PRT");
    expect(path[path.length - 1]).toBe("CHN");
    for (let i = 1; i < path.length; i++) expect(neighborsOf(path[i - 1])).toContain(path[i]);
    expect(path.length - 1).toBe(distancesFrom("PRT").get("CHN"));
  });

  it("returns null with no land route", () => {
    expect(shortestPath("ISL", "NOR")).toBeNull();
    expect(shortestPath("AUS", "IDN")).toBeNull();
  });
});

describe("picking routes", () => {
  it("picks a route with the requested par", () => {
    const rng = seededRng(42);
    for (const par of [3, 4, 5, 6]) {
      const r = pickRoute(par, rng);
      expect(r.par).toBe(par);
      expect(shortestPath(r.start, r.target)!.length - 1).toBe(par);
    }
  });

  it("builds a round of rising par without reusing countries", () => {
    const round = buildRouteRound(seededRng(7));
    expect(round.map((r) => r.par)).toEqual([...ROUND_PARS]);
    const ends = round.flatMap((r) => [r.start, r.target]);
    expect(new Set(ends).size).toBe(ends.length);
  });
});

describe("playing a route", () => {
  const route = { start: "ESP", target: "DEU", par: 2 };

  it("only moves across a real border", () => {
    let s = startRoute(route);
    expect(move(s, "ITA")).toBe(s); // Spain doesn't border Italy
    s = move(s, "FRA");
    expect(s.path).toEqual(["ESP", "FRA"]);
    expect(s.status).toBe("playing");
  });

  it("scores against par when you arrive", () => {
    let s = move(move(startRoute(route), "FRA"), "DEU");
    expect(s.status).toBe("arrived");
    expect(movesMade(s)).toBe(2);
    expect(s.points).toBe(3);
    // No more moves after arriving.
    expect(move(s, "POL")).toBe(s);

    s = startRoute(route);
    for (const step of ["PRT", "ESP", "FRA", "BEL", "DEU"]) s = move(s, step);
    expect(s.status).toBe("arrived");
    expect(s.points).toBe(routePoints(5, 2));
  });

  it("gives up with zero points", () => {
    const s = giveUp(move(startRoute(route), "FRA"));
    expect(s.status).toBe("gaveUp");
    expect(s.points).toBe(0);
    expect(move(s, "DEU")).toBe(s);
  });

  it("hints how far and which way the destination is", () => {
    const { km, bearing } = routeHint("ESP", "DEU");
    expect(km).toBeGreaterThan(500);
    expect(km).toBeLessThan(1500);
    expect(bearing).toBeGreaterThan(0);
    expect(bearing).toBeLessThan(90); // north-east
  });
});

describe("game scoring", () => {
  it("drops route points with extra moves", () => {
    expect([2, 3, 4, 5, 7, 8].map((m) => routePoints(m, 2))).toEqual([3, 2, 2, 1, 1, 0]);
  });

  it("drops mystery points with each clue, never below 1", () => {
    expect([1, 2, 3, 4, 5, 6, 7, 8].map(mysteryPoints)).toEqual([6, 5, 4, 3, 2, 1, 1, 1]);
  });
});
