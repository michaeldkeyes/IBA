import { render, screen } from "@testing-library/vue";
import NotFound from "../../views/NotFound.vue";
import { describe, test } from "vitest";

describe("NotFound.vue", () => {
  test("it should work", () => {
    const { container, debug } = render(NotFound);
    const h1 = container.querySelector("h1");

    console.log(h1.innerHTML);
    debug();
    screen.getByRole("heading", {
      name: "",
    });
  });
});
