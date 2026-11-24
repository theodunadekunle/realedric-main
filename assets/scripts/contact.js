const inquiryForm = document.querySelector(".contact-form");

inquiryForm.addEventListener("submit", event => {
  event.preventDefault();
  const details = new FormData(inquiryForm);
  if (details.get("company_website")) return;
  const subject = `Photography inquiry: ${details.get("service")}`;
  const body = [
    `Name: ${details.get("name").trim()}`,
    `Email: ${details.get("email").trim()}`,
    `Photography service: ${details.get("service")}`,
    `Expected timeline: ${details.get("timeline").trim() || "To be discussed"}`,
    "",
    "Project details:",
    details.get("project").trim(),
  ].join("\r\n");

  window.location.href = `${inquiryForm.action}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
});
