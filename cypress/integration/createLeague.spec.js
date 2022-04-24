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
    cy.createLeague();

    cy.location("pathname").should("include", "dashboard/league/1");
  });

  it("should go back to create league page when logo is clicked", () => {
    cy.goToLeaguePage();
  });

  it("should be displaying the table with the newly created league", () => {
    cy.get("table").should("exist");
    cy.get("tbody > tr > :nth-child(2)").should("have.text", "League 1");
  });

  it("should be able to delete the new league", () => {
    cy.get("[data-test=delete-button-1]").click();
    cy.get("[data-test=confirm-delete-button]").click();
    cy.get("table").should("not.exist");
  });

  it("can create multiple leagues", () => {
    cy.createLeague();
    cy.goToLeaguePage();
    cy.createLeague();
    cy.goToLeaguePage();
    cy.createLeague();
    cy.goToLeaguePage();
  });
});
