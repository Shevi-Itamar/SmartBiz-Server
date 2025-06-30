import TempCode from '../models/TempCode.model';
import crypto from 'crypto';

const createTempCode = async (email: string) => {
    const existingCode = await TempCode.find({ email });
    if (existingCode.length > 0) {
    await TempCode.deleteMany({ email }); 
    }
    const code= generateResetCode();
    const expiresAt = new Date(Date.now() + 15 * 60 * 1000); // Code valid for 15 minutes
    const tempCode = new TempCode({ email, code, expiresAt });
    await tempCode.save();
    return tempCode;
}

function generateResetCode() {
    return crypto.randomBytes(3).toString('hex');
}

const verifyTempCode = async (email: string, code: string) => {
    const tempCode= await TempCode.findOne({email});
    if (!tempCode) {
        throw new Error('Temporary code not found');
    }
    if (tempCode.code !== code) {
        throw new Error('Invalid code');
    }
    if (tempCode.expiresAt && tempCode.expiresAt< new Date()) {
        throw new Error('Code has expired');
    }
    return true;
}
    
    

export default {
    createTempCode,
    verifyTempCode
};
  