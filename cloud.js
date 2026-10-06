// Contas (login) e sincronização na nuvem com Firebase Auth + Firestore.
// Funciona "local primeiro": o app usa o celular e sincroniza quando há internet.
import { firebaseConfig } from './firebase-config.js';

const V = '10.12.5';
const CDN = `https://www.gstatic.com/firebasejs/${V}/`;

(async () => {
  if (!firebaseConfig || !firebaseConfig.apiKey) return;           // nuvem não configurada
  const T = window.TreinoApp;
  if (!T) return;

  let A, AU, FS;
  try {
    [A, AU, FS] = await Promise.all([
      import(CDN + 'firebase-app.js'),
      import(CDN + 'firebase-auth.js'),
      import(CDN + 'firebase-firestore.js')
    ]);
  } catch { return; }                                              // sem internet: segue só local

  const app = A.initializeApp(firebaseConfig);
  const auth = AU.getAuth(app);
  const db = FS.getFirestore(app);

  const emit = state => window.dispatchEvent(new CustomEvent('treino:sync', { detail: { state } }));
  const clean = o => JSON.parse(JSON.stringify(o));
  // Firestore não aceita listas dentro de listas: o trajeto vai como texto.
  const toDoc = h => { const { route, ...rest } = h; return clean({ ...rest, routeJson: JSON.stringify(route || []) }); };
  const fromDoc = d => {
    const { routeJson, ...rest } = d;
    let route = []; try { route = JSON.parse(routeJson || '[]'); } catch {}
    return { ...rest, route };
  };

  let syncing = false, again = false, timer = null;

  async function sync() {
    const u = auth.currentUser;
    if (!u) return;
    if (!navigator.onLine) { emit('offline'); return; }
    if (syncing) { again = true; return; }
    syncing = true; emit('syncing');
    try {
      const uref = FS.doc(db, 'users', u.uid);
      const wcol = FS.collection(db, 'users', u.uid, 'workouts');
      const [snap, ws] = await Promise.all([FS.getDoc(uref), FS.getDocs(wcol)]);
      const r = snap.exists() ? snap.data() : {};
      const remote = {
        done: r.done || {}, evo: r.evo || {}, deleted: r.deleted || {},
        settings: r.settings || null, settingsT: r.settingsT || 0,
        history: ws.docs.map(d => fromDoc(d.data()))
      };
      const merged = T.merge(remote);

      const remoteIds = new Set(remote.history.map(h => String(h.id)));
      const ops = [];
      merged.history.filter(h => !remoteIds.has(String(h.id))).forEach(h => ops.push(['set', h]));
      remote.history.filter(h => merged.deleted[h.id]).forEach(h => ops.push(['del', h]));
      for (let i = 0; i < ops.length; i += 400) {
        const b = FS.writeBatch(db);
        ops.slice(i, i + 400).forEach(([k, h]) => {
          const ref = FS.doc(db, 'users', u.uid, 'workouts', String(h.id));
          if (k === 'set') b.set(ref, toDoc(h)); else b.delete(ref);
        });
        await b.commit();
      }
      await FS.setDoc(uref, clean({
        done: merged.done, evo: merged.evo, deleted: merged.deleted,
        settings: merged.settings, settingsT: merged.settingsT || 0
      }), { merge: true });
      emit('ok');
    } catch (e) {
      console.warn('Sincronização falhou', e);
      emit(navigator.onLine ? 'error' : 'offline');
    } finally {
      syncing = false;
      if (again) { again = false; sync(); }
    }
  }

  window.TreinoCloud = {
    sync,
    async signIn(email, pass) { await AU.signInWithEmailAndPassword(auth, email, pass); },
    async signUp(name, email, pass) {
      const c = await AU.createUserWithEmailAndPassword(auth, email, pass);
      if (name) { try { await AU.updateProfile(c.user, { displayName: name }); } catch {} }
      T.setUser({ uid: c.user.uid, name, email });
      sync();
    },
    reset(email) { return AU.sendPasswordResetEmail(auth, email); },
    signOut() { return AU.signOut(auth); }
  };

  AU.onAuthStateChanged(auth, u => {
    if (u) { T.setUser({ uid: u.uid, name: u.displayName || '', email: u.email || '' }); sync(); }
    else T.setUser(null);
  });
  window.dispatchEvent(new Event('treino:cloud-ready'));

  window.addEventListener('treino:changed', () => { clearTimeout(timer); timer = setTimeout(sync, 1500); });
  window.addEventListener('online', sync);
  document.addEventListener('visibilitychange', () => { if (document.visibilityState === 'visible') sync(); });
})();
