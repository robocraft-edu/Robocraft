// Robot Gallery: students share robot photos. Each post starts as "pending" and
// is shown to other students only after the owner sets it to "approved" in the
// Firebase console. The photo is resized and re-encoded in the browser, which
// removes any location or camera metadata. Text is kept short (140 characters).
import { fb } from '@/api/firebase';
import { accountsEnabled } from '@/lib/features';

const COL = 'community';
const MAX_SIDE = 800;
const MAX_CHARS = 140;

async function ctx() {
  if (!accountsEnabled) return null;
  const { db, F, auth } = await fb();
  if (!auth.currentUser) return null;
  return { db, F, uid: auth.currentUser.uid };
}

/** Resize a photo to at most 800px and re-encode it as a JPEG data URL. */
export function compressPhoto(file) {
  return new Promise((resolve, reject) => {
    if (!file || !file.type.startsWith('image/')) return reject(new Error('Please choose a photo.'));
    const url = URL.createObjectURL(file);
    const img = new Image();
    img.onload = () => {
      const scale = Math.min(1, MAX_SIDE / Math.max(img.width, img.height));
      const canvas = document.createElement('canvas');
      canvas.width = Math.round(img.width * scale);
      canvas.height = Math.round(img.height * scale);
      canvas.getContext('2d').drawImage(img, 0, 0, canvas.width, canvas.height);
      URL.revokeObjectURL(url);
      resolve(canvas.toDataURL('image/jpeg', 0.72));
    };
    img.onerror = () => { URL.revokeObjectURL(url); reject(new Error("That photo couldn't be opened.")); };
    img.src = url;
  });
}

/** Send a post for approval. */
export async function submitPost({ caption, image, nickname, avatar }) {
  const c = await ctx();
  if (!c) throw Object.assign(new Error('Sign in to share a photo.'), { status: 401 });
  const text = (caption || '').trim().slice(0, MAX_CHARS);
  if (!image || !image.startsWith('data:image/jpeg;base64,')) throw new Error('Add a photo first.');
  await c.F.addDoc(c.F.collection(c.db, COL), {
    uid: c.uid,
    nickname: (nickname || 'Student').slice(0, 40),
    avatar: (avatar || '🤖').slice(0, 8),
    caption: text,
    image,
    status: 'pending',
    created: new Date().toISOString(),
  });
}

/** Approved posts from everyone, newest first. */
export async function approvedPosts() {
  const c = await ctx();
  if (!c) return [];
  const q = c.F.query(c.F.collection(c.db, COL), c.F.where('status', '==', 'approved'), c.F.limit(60));
  const snap = await c.F.getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.created || '').localeCompare(a.created || ''));
}

/** The signed-in student's own posts, whatever their status. */
export async function myPosts() {
  const c = await ctx();
  if (!c) return [];
  const q = c.F.query(c.F.collection(c.db, COL), c.F.where('uid', '==', c.uid), c.F.limit(60));
  const snap = await c.F.getDocs(q);
  return snap.docs.map(d => ({ id: d.id, ...d.data() })).sort((a, b) => (b.created || '').localeCompare(a.created || ''));
}

/** Delete one of your own posts. */
export async function deleteMyPost(id) {
  const c = await ctx();
  if (!c) return;
  await c.F.deleteDoc(c.F.doc(c.db, COL, id));
}
