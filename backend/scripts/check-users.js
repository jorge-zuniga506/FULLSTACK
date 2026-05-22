const { User } = require('../models');

async function run() {
  try {
    const users = await User.findAll();
    console.log('=== LIST OF USERS IN DB ===');
    users.forEach(u => {
      console.log(`ID: ${u.id} | Email: ${u.email} | Code: ${u.two_factor_code} | Expires: ${u.two_factor_expires_at} | Whitelisted: ${u.is_role_whitelisted}`);
    });
    console.log('===========================');
  } catch (err) {
    console.error('Error running script:', err);
  } finally {
    process.exit();
  }
}

run();
