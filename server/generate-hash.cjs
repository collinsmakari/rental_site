const bcrypt = require("bcrypt");
const readline = require("readline");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

rl.question("Enter your NEW admin password: ", async (password) => {
  try {
    if (!password) throw new Error("Password cannot be empty");

    const hash = await bcrypt.hash(password, 12);
    console.log("\nNew ADMIN_PASSWORD_HASH=");
    console.log(hash);
  } catch (err) {
    console.error("Failed:", err.message);
    process.exitCode = 1;
  } finally {
    rl.close();
  }
});
