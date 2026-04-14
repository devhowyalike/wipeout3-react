/// <reference types="@testing-library/jest-dom/vitest" />
import "@testing-library/jest-dom/vitest";

// jsdom doesn't implement HTMLDialogElement.showModal / .close
if (typeof HTMLDialogElement !== "undefined") {
  HTMLDialogElement.prototype.showModal ??= function (this: HTMLDialogElement) {
    this.setAttribute("open", "");
  };
  HTMLDialogElement.prototype.close ??= function (this: HTMLDialogElement) {
    this.removeAttribute("open");
  };
}

// jsdom doesn't implement Element.scrollTo
Element.prototype.scrollTo ??= function () {};
