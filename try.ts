import bcrypt from 'bcrypt';

async function checkPassword(){
    const hash = "$2b$10$p9gy1cG1LfNGkKX48EQKMOuyegHxV58ET1j.qoocUHK.HdsD7X7DW";
    const passwordToCheck = "1";

    const isMatch = await bcrypt.compare(passwordToCheck, hash);
    console.log(isMatch); // true אם זה מתאים, אחרת false
}

checkPassword();