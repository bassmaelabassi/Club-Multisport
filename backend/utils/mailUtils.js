const sendWelcomeEmail = async (email, name) => {
  console.log(`Welcome email would be sent to ${email} for user ${name}`);
  return true;
};

const sendReservationConfirmation = async (email, name, activityName, date, time) => {
  console.log(`Reservation confirmation email would be sent to ${email} for user ${name}`);
  console.log(`Activity: ${activityName}, Date: ${date}, Time: ${time}`);
  return true;
};

const sendContactNotificationToAdmin = async (adminEmail, contactData) => {
  console.log(`Contact notification email would be sent to admin ${adminEmail}`);
  console.log(`New contact message from: ${contactData.name} (${contactData.email})`);
  console.log(`Subject: ${contactData.subject}`);
  console.log(`Message: ${contactData.message}`);
  return true;
};

const sendContactNotificationToCoach = async (coachEmail, contactData) => {
  console.log(`Contact notification email would be sent to coach ${coachEmail}`);
  console.log(`New contact message from: ${contactData.name} (${contactData.email})`);
  console.log(`Subject: ${contactData.subject}`);
  console.log(`Message: ${contactData.message}`);
  return true;
};

module.exports = {
  sendWelcomeEmail,
  sendReservationConfirmation,
  sendContactNotificationToAdmin,
  sendContactNotificationToCoach
};
