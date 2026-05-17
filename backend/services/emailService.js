// Email service disabled until custom domain is set up
// Using placeholder functions that don't crash the server

const sendVerificationEmail = async () => { 
  console.log("Email skipped - domain not configured"); 
};
const sendNewSupporterEmail = async () => { 
  console.log("Email skipped - domain not configured"); 
};
const sendWithdrawalEmail = async () => { 
  console.log("Email skipped - domain not configured"); 
};

module.exports = { sendVerificationEmail, sendNewSupporterEmail, sendWithdrawalEmail };
