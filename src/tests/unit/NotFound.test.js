import { render } from "@testing-library/vue";
import NotFound from "../../views/NotFound.vue";
import { describe, expect, test } from "vitest";

describe("NotFound.vue", () => {
  test("it should work", () => {
    const { container, getByRole } = render(NotFound);
    const h1 = container.querySelector("h1");

    console.log(h1.innerHTML);
    const heading = getByRole("heading");
    expect(h1).toMatchInlineSnapshot(`
      <h1>
        Oops, it looks like the page you're looking for doesn't exist
      </h1>
    `);
    expect(heading).toMatchInlineSnapshot(`
      <h1>
        Oops, it looks like the page you're looking for doesn't exist
      </h1>
    `);
  });
});
