/*
  Unique Home Edit
  This file does two small jobs:
  1. Open and close the mobile menu.
  2. Check the contact form before showing a preview message.

  The form does not send an email. There is no backend in version 1.
  Phone, email, and location are shown on the page for visitors to use directly.
*/

(function () {
  var button = document.querySelector(".menu-toggle");
  var menu = document.querySelector("#site-menu");
  var closeButton = document.querySelector(".menu-close");
  var menuLabel = button ? button.querySelector(".sr-only") : null;

  function setMenu(open) {
    if (!button || !menu) {
      return;
    }

    menu.classList.toggle("is-open", open);
    button.setAttribute("aria-expanded", open ? "true" : "false");
    document.body.classList.toggle("menu-open", open);

    if (menuLabel) {
      menuLabel.textContent = open ? "Close menu" : "Open menu";
    }
  }

  if (button && menu) {
    button.addEventListener("click", function () {
      var isOpen = button.getAttribute("aria-expanded") === "true";
      setMenu(!isOpen);

      if (!isOpen && closeButton) {
        closeButton.focus();
      }
    });

    if (closeButton) {
      closeButton.addEventListener("click", function () {
        setMenu(false);
        button.focus();
      });
    }

    menu.querySelectorAll("a").forEach(function (link) {
      link.addEventListener("click", function () {
        // Close after the click, so the browser can still follow the link.
        window.setTimeout(function () {
          setMenu(false);
        }, 0);
      });
    });

    document.addEventListener("keydown", function (event) {
      if (event.key === "Escape") {
        setMenu(false);
      }
    });

    window.addEventListener("resize", function () {
      if (window.matchMedia("(min-width: 768px)").matches) {
        setMenu(false);
      }
    });
  }

  var form = document.querySelector("#enquiry-form");
  if (!form) {
    return;
  }

  var note = document.querySelector("#form-note");

  form.addEventListener("submit", function (event) {
    event.preventDefault();

    var fields = [
      { id: "name", message: "Please enter your name." },
      { id: "phone", message: "Please enter a phone number." },
      { id: "email", message: "Please enter an email address.", email: true },
      { id: "style-space", message: "Please choose a space to style." },
      { id: "occasion", message: "Please choose a season or celebration." }
    ];

    var firstInvalid = null;
    var valid = true;

    fields.forEach(function (field) {
      var input = document.getElementById(field.id);
      var error = document.getElementById(field.id + "-error");
      var value = input.value.trim();
      var message = field.message;
      var problem = value.length === 0;

      if (!problem && field.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
        problem = true;
        message = "Please enter a valid email address.";
      }

      input.setAttribute("aria-invalid", problem ? "true" : "false");
      error.textContent = problem ? message : "";

      if (problem) {
        valid = false;
        if (!firstInvalid) {
          firstInvalid = input;
        }
      }
    });

    if (!valid) {
      note.classList.remove("is-visible");
      note.textContent = "";
      if (firstInvalid) {
        firstInvalid.focus();
      }
      return;
    }

    note.textContent = "This is a preview only. The form is not connected yet, so nothing was sent. When you add your own email address, enquiries can go there.";
    note.classList.add("is-visible");
  });
})();
