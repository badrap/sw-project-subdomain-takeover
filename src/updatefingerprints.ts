import axios from 'axios';
import * as fs from 'fs';
import * as path from 'path';

export async function updateFingerprintFile(): Promise<void> {
    const downloadUrl = 'https://github.com/EdOverflow/can-i-take-over-xyz/blob/master/fingerprints.json';
    const dirPath = path.join(__dirname, 'src');
    const fingerprintPath = path.join(dirPath, 'fingerprints.json');
    const backupPath = path.join(dirPath, 'backup_fingerprints.json');
    const tempPath = path.join(dirPath, 'new_fingerprints.json');

    try {
        // Downloading new file from can i take over xyz
        console.log(`Downloading updated fingerprints.json from: ${downloadUrl}`);
        const response = await axios.get(downloadUrl, { responseType: 'json' });
        fs.writeFileSync(tempPath, JSON.stringify(response.data, null, 2));
        console.log(`File downloaded and saved as: ${tempPath}`);

        // Verifying downloaded file
        if (!fs.existsSync(tempPath) || !fs.readFileSync(tempPath, 'utf-8').trim()) {
            throw new Error('Downloaded file is missing or empty.');
        }
        console.log('Downloaded file verified successfully.');

        // Renaming the current fingerprints.json to backup
        if (fs.existsSync(fingerprintPath)) {
            fs.renameSync(fingerprintPath, backupPath);
            console.log(`Existing fingerprints.json renamed to: ${backupPath}`);
        }

        // Renaming the temporary file to fingerprints.json
        fs.renameSync(tempPath, fingerprintPath);
        console.log(`New file renamed to: fingerprints.json`);

        console.log('Fingerprint update process completed successfully.');
    } catch (error) {
        console.error('Error during the update process:', error.message);
    } finally {
        // Cleaning up temporary file if that still exists
        if (fs.existsSync(tempPath)) {
            fs.unlinkSync(tempPath);
            console.log(`Temporary file ${tempPath} removed.`);
        }
    }
}
