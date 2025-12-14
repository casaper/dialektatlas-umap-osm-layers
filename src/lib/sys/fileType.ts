import { existsSync, Stats } from 'fs';
import { lstat } from 'fs/promises';

export async function getLstat(path: string): Promise<Stats | null> {
  if (!existsSync(path)) return null;
  return lstat(path);
}

export async function isSameInode(a: string, b: string): Promise<boolean> {
  const [statsA, statsB] = await Promise.all([getLstat(a), getLstat(b)]);
  if (!statsA || !statsB) return false;
  return statsA.ino === statsB.ino && statsA.dev === statsB.dev;
}

export async function isDir(path: string): Promise<boolean> {
  const stats = await getLstat(path);
  return stats ? stats.isDirectory() : false;
}

export async function isFile(path: string): Promise<boolean> {
  const stats = await getLstat(path);
  return stats ? stats.isFile() : false;
}

export async function isSymlink(path: string): Promise<boolean> {
  const stats = await getLstat(path);
  return stats ? stats.isSymbolicLink() : false;
}
