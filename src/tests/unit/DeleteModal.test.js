import DeleteModal from "../../components/DeleteModal.vue";
import { render } from "@testing-library/vue";
import { describe, test, vi } from "vitest";

vi.mock("../../api/Meta.ts", () => vi.fn());
vi.mock("dexie");
const routes = [{ path: "/", component: DeleteModal }];

describe("DeleteModal.vue", () => {
  test("test", () => {
    const { debug } = render(DeleteModal, {
      props: { showModal: true },
      routes,
    });

    debug();
  });
});
