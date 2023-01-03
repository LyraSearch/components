import t from "tap";
import { intersectTokenScores } from "../src/algorithms.js";
import { intersectTokenScores as wasmIntersectTokenScores } from "../src/wasm.js";

t.test("utils", t => {
  t.plan(2);

  t.test("should correctly intersect 2 or more arrays", async t => {
    t.plan(3);

    t.same(
      await intersectTokenScores({
        data: [
          [
            ["foo", 1],
            ["bar", 1],
            ["baz", 2],
          ],
          [
            ["foo", 4],
            ["quick", 10],
            ["brown", 3],
            ["bar", 2],
          ],
          [
            ["fox", 12],
            ["foo", 4],
            ["jumps", 3],
            ["bar", 6],
          ],
        ],
      }),
      {
        data: [
          ["foo", 9],
          ["bar", 9],
        ],
      },
    );

    t.same(
      await intersectTokenScores({
        data: [
          [
            ["foo", 1],
            ["bar", 1],
            ["baz", 2],
          ],
          [
            ["quick", 10],
            ["brown", 3],
          ],
        ],
      }),
      {
        data: [],
      },
    );

    t.same(
      await intersectTokenScores({
        data: [],
      }),
      {
        data: [],
      },
    );
  });

  t.test("should correctly intersect 2 or more arrays (using WASM)", async t => {
    t.plan(3);

    t.same(
      await wasmIntersectTokenScores([
        [
          ["foo", 1],
          ["bar", 1],
          ["baz", 2],
        ],
        [
          ["foo", 4],
          ["quick", 10],
          ["brown", 3],
          ["bar", 2],
        ],
        [
          ["fox", 12],
          ["foo", 4],
          ["jumps", 3],
          ["bar", 6],
        ],
      ]),
      [
        ["bar", 9],
        ["foo", 9],
      ],
    );

    t.same(
      await wasmIntersectTokenScores([
        [
          ["foo", 1],
          ["bar", 1],
          ["baz", 2],
        ],
        [
          ["quick", 10],
          ["brown", 3],
        ],
      ]),
      [],
    );

    t.same(await wasmIntersectTokenScores([]), []);
  });
});
