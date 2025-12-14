import { exec } from './exec';

export async function detectFileType(
  filePath: string,
  cwd = process.cwd()
): Promise<string> {
  try {
    const { stdout, stderr } = await exec(`file -b '${filePath}'`, {
      cwd,
    });
    if (stderr.trim().length) {
      console.error(`getDuHumanSize stderr: ${stderr}`);
    }
    if (!stdout.trim().length) {
      console.error('getDuHumanSize no stdout');
      return 'no output';
    }
    return stdout.trim();
  } catch (error) {
    console.error('getDuHumanSize error:', error);
    return `${error}`;
  }
}
