/// <reference types="cypress" />

describe("something", () => {
  beforeEach(() => {
    cy.visit("/");
  });

  it("should not display table when no leagues exist", () => {
    cy.contains("Welcome to the International Basketball Association");
    cy.get("table").should("not.exist");
  });

  it("should create a new league when new league button is clicked and go to the new league dashboard page", () => {
    cy.get("button").should("contain", "New League").click();

    cy.location("pathname").should("include", "dashboard/league/1");
  });

  it("should go back to create league page when logo is clicked", () => {
    cy.get(".navbar").find(".navbar-brand").click();
  });
});
