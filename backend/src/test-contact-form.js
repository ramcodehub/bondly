// Test script for contact form API
// Run with: node backend/src/test-contact-form.js

async function testContactForm() {
  try {
    const testData = {
      name: "Test User",
      email: "test@example.com",
      subject: "Test Subject",
      companyType: "company",
      company: "Test Company",
      location: "Test Location",
      message: "This is a test message for the contact form."
    };

    console.log("Testing contact form submission...");
    console.log("Sending data:", testData);

    const response = await fetch('http://localhost:3000/api/contact-form', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(testData),
    });

    const result = await response.json();
    console.log("Response status:", response.status);
    console.log("Response data:", result);

    if (response.ok) {
      console.log("✅ Contact form submission successful!");
    } else {
      console.log("❌ Contact form submission failed!");
    }
  } catch (error) {
    console.error("Error testing contact form:", error);
  }
}

// Run the test
testContactForm();