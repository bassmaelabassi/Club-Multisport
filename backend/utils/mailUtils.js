const sendWelcomeEmail = async (email, name) => {

  console.log(`Welcome email would be sent to ${email} for user ${name}`);
  return true;
};

module.exports = {
  sendWelcomeEmail
};
