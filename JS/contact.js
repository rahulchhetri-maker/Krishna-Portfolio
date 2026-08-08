document.addEventListener('DOMContentLoaded', () => {
  const contactForm = document.getElementById('contactForm');

  if (!contactForm) return;

  contactForm.addEventListener('submit', async (e) => {
    e.preventDefault();

    const name = contactForm.name.value.trim();
    const contactInput = contactForm.contact ? contactForm.contact.value.trim() : '';
    const message = contactForm.message.value.trim();

    // 1. Validate Name: must contain at least 2 letters (letters and spaces only)
    const nameRegex = /^[a-zA-Z\s]{2,50}$/;
    if (!name || !nameRegex.test(name)) {
      showNotification('Please enter a valid name (at least 2 letters).', 'warning');
      contactForm.name.focus();
      return;
    }

    // 2. Validate Contact Field: accepts either a valid 10-digit phone number OR a valid email address
    const phoneRegex = /^[0-9]{10}$/;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

    // Remove any spaces or hyphens if the user formatted their phone number
    const cleanedContact = contactInput.replace(/[\s-]/g, '');

    const isPhoneValid = phoneRegex.test(cleanedContact);
    const isEmailValid = emailRegex.test(contactInput);

    if (!isPhoneValid && !isEmailValid) {
      showNotification('Please enter a valid 10-digit phone number or email address.', 'warning');
      if (contactForm.contact) contactForm.contact.focus();
      return;
    }

    // 3. Validate Message
    if (!message) {
      showNotification('Please enter your message.', 'warning');
      contactForm.message.focus();
      return;
    }

    const submitBtn = contactForm.querySelector('button[type="submit"]');
    const originalBtnContent = submitBtn.innerHTML;

    // Show loading state
    submitBtn.disabled = true;
    submitBtn.innerHTML = `Sending... <i class="fa-solid fa-spinner fa-spin"></i>`;

    const formData = {
      name,
      contact: contactInput,
      message,
    };

    try {
      const response = await fetch('/api/send', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      const result = await response.json();

      if (response.ok) {
        // Clear form fields
        contactForm.reset();
        
        // Trigger custom success notification
        showNotification('Your message has been sent successfully!', 'success');
      } else {
        // Trigger custom error notification
        showNotification(result.error || 'Failed to send message. Please try again.', 'error');
      }
    } catch (err) {
      console.error('Fetch error:', err);
      showNotification('Failed to connect to the server. Please check your network.', 'error');
    } finally {
      // Restore button state
      submitBtn.disabled = false;
      submitBtn.innerHTML = originalBtnContent;
    }
  });
});

/**
 * Custom Notification Toast Function
 * @param {string} message - Text to show in notification
 * @param {'success' | 'error' | 'warning' | 'info'} type - Toast theme type
 */
function showNotification(message, type = 'info') {
  const toast = document.getElementById('customNotification');
  const toastText = document.getElementById('notificationText');

  if (!toast || !toastText) return;

  // Set notification text
  toastText.textContent = message;

  // Remove existing status classes
  toast.classList.remove('success', 'error', 'warning', 'info');
  
  // Add active type class and trigger visibility
  toast.classList.add(type, 'show');

  // Auto hide after 4 seconds
  setTimeout(() => {
    toast.classList.remove('show');
  }, 4000);
}