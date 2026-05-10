// shared.jsx — Firebase Firestore 연동 버전

// ── Firebase 설정 ──────────────────────────────────────────────────────────
// Firebase 콘솔 > 프로젝트 설정 > 내 앱 > SDK 설정에서 복사해서 붙여넣기
const FIREBASE_CONFIG = {
  apiKey:            "AIzaSyC9gI-hXuK7Y2qyVU2URrYyQq6gn-HDq80",
  authDomain:        "toteacher-bb37b.firebaseapp.com",
  projectId:         "toteacher-bb37b",
  storageBucket:     "toteacher-bb37b.firebasestorage.app",
  messagingSenderId: "430050951203",
  appId:             "1:430050951203:web:5e924fdd1f75801b7a7196",
};

firebase.initializeApp(FIREBASE_CONFIG);
const db = firebase.firestore();
const COLLECTION = 'messages';

// 실시간 메시지 구독 — 콜백으로 최신 목록을 전달, 언마운트 시 반환값(unsubscribe) 호출
function listenMessages(callback) {
  return db.collection(COLLECTION)
    .orderBy('createdAt', 'desc')
    .onSnapshot((snap) => {
      const msgs = snap.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      callback(msgs);
    });
}

// 메시지 추가 — Firestore doc reference 반환
function addMessage({ name, text, color }) {
  return db.collection(COLLECTION).add({
    name, text, color,
    createdAt: firebase.firestore.FieldValue.serverTimestamp(),
  });
}

// ── 레이아웃 유틸 (변경 없음) ──────────────────────────────────────────────
function hashSeed(str) {
  let h = 2166136261;
  for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = (h * 16777619) >>> 0; }
  return h;
}
function seededRandom(seed, salt) {
  const x = Math.sin((seed >>> 0) + salt * 9301) * 43758.5453;
  return x - Math.floor(x);
}
function noteRotation(id, max = 4) {
  return (seededRandom(hashSeed(id), 1) * 2 - 1) * max;
}
function noteJitter(id, max = 12) {
  return {
    x: (seededRandom(hashSeed(id), 2) * 2 - 1) * max,
    y: (seededRandom(hashSeed(id), 3) * 2 - 1) * max,
  };
}
function layoutNotes(messages, cols, cellW, cellH, padX = 0, padY = 0, jitter = 14) {
  return messages.map((m, i) => {
    const col = i % cols;
    const row = Math.floor(i / cols);
    const j = noteJitter(m.id, jitter);
    return { ...m, _x: padX + col * cellW + j.x, _y: padY + row * cellH + j.y, _rot: noteRotation(m.id) };
  });
}
function formatDate(ts) {
  const d = new Date(ts);
  return `${String(d.getMonth() + 1).padStart(2,'0')}.${String(d.getDate()).padStart(2,'0')}`;
}

Object.assign(window, {
  listenMessages, addMessage,
  noteRotation, noteJitter, layoutNotes, formatDate, hashSeed, seededRandom,
});
