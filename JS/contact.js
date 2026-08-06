const form = document.getElementById("contactForm");
const notification = document.getElementById("customNotification");
const notificationText = document.getElementById("notificationText");

// Show Notification Banner
function showMessage(message, type = "error") {
  notificationText.textContent = message;
  notification.className = `notification-banner show ${type}`;

  setTimeout(() => {
    notification.className = "notification-banner";
  }, 4000);
}

form.addEventListener("submit", async function (event) {
  event.preventDefault();

  const nameInput = form.querySelector('input[name="name"]').value.trim();
  const emailInput = form.querySelector('input[name="email"]').value.trim();
  const messageInput = form
    .querySelector('textarea[name="message"]')
    .value.trim();

  // 1. Empty Field Validation
  if (!nameInput || !emailInput || !messageInput) {
    showMessage("Please fill out all fields before submitting.");
    return;
  }

  // 2. Full Name Regex Validation
  const fullNameRegex =
    /^[a-zA-Z\u00C0-\u024F'-]+(?:\s+[a-zA-Z\u00C0-\u024F'-]+)+$/;

  if (!fullNameRegex.test(nameInput)) {
    showMessage("Please enter your full name (First and Last).");
    return;
  }

  // 3. Bad Word Filter
  const badWords = ["spam", "fake", "crypto"];
  const textToCheck = `${nameInput} ${messageInput}`.toLowerCase();

  const containsBadWord = badWords.some((word) =>
    new RegExp(`\\b${word}\\b`, "i").test(textToCheck),
  );

  if (containsBadWord) {
    showMessage("Please keep your message professional.");
    return;
  }

  // 4. Submission Cooldown (3 minutes)
  const COOLDOWN_TIME = 3 * 60 * 1000;
  const lastSubmit = localStorage.getItem("lastSubmitTime");

  if (lastSubmit) {
    const elapsed = Date.now() - Number(lastSubmit);

    if (elapsed < COOLDOWN_TIME) {
      const remaining = COOLDOWN_TIME - elapsed;
      const minutes = Math.floor(remaining / 60000);
      const seconds = Math.floor((remaining % 60000) / 1000);

      showMessage(
        `Please wait ${minutes}:${String(seconds).padStart(2, "0")} before sending another message.`,
        "warning",
      );
      return;
    }
  }

  // 5. Send Data to Next.js API Route
  try {
    showMessage("Sending message...", "warning");

    // NOTE: If your Next.js backend is hosted separately from your static site
    // (e.g., Vercel), change "/api/contact" to "https://your-nextjs-app.vercel.app/api/contact"
    const response = await fetch("/api/contact", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
      },
      body: JSON.stringify({
        name: nameInput,
        email: emailInput,
        message: messageInput,
      }),
    });

    if (response.ok) {
      localStorage.setItem("lastSubmitTime", Date.now());
      showMessage("Message sent successfully!", "success");
      form.reset();
    } else {
      // Read as text first so a non-JSON response (e.g. a 404/500 HTML
      // error page from the host) doesn't just silently disappear into
      // a generic message — it gets logged so you can see what's really
      // happening.
      const rawText = await response.text().catch(() => "");
      let data = {};
      try {
        data = JSON.parse(rawText);
      } catch {
        console.error(
          `Contact form: non-JSON response (status ${response.status}):`,
          rawText.slice(0, 500),
        );
      }
      showMessage(
        data.message ||
          `Something went wrong (status ${response.status}). Please try again later.`,
      );
    }
  } catch (error) {
    console.error("Fetch Error:", error);
    showMessage(
      "Network error. Please check your connection and try again.",
    );
  }
});