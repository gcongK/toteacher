// wood.jsx — Variation 2: warm wooden board with washi-tape post-its.
// Pastel palette, softer paper, a more crafty / scrapbooking feel.
// 손글씨 + 둥근 폰트.

const WOOD_COLORS = {
  coral:    { bg: '#ffb4a8', edge: '#e89080' },
  sage:     { bg: '#b4d4a0', edge: '#8ab880' },
  butter:   { bg: '#ffdc8c', edge: '#e8c060' },
  lavender: { bg: '#c8c8ec', edge: '#a0a0d0' },
  rose:     { bg: '#ffc0d8', edge: '#e898b8' },
};

const TAPE_COLORS = [
  { fill: 'rgba(210,185,140,.65)', stripe: 'rgba(170,140,90,.45)' },
  { fill: 'rgba(220,200,160,.65)', stripe: 'rgba(180,155,100,.45)' },
  { fill: 'rgba(200,182,148,.65)', stripe: 'rgba(160,138,92,.45)'  },
];

function WashiTape({ seed, width = 70, angle = 0 }) {
  const idx = seed % TAPE_COLORS.length;
  const c = TAPE_COLORS[idx];
  return (
    <div style={{
      width, height: 22,
      background: `repeating-linear-gradient(135deg, ${c.fill} 0 8px, ${c.stripe} 8px 10px)`,
      transform: `rotate(${angle}deg)`,
      boxShadow: '0 2px 4px rgba(0,0,0,.1)',
      // ragged torn edges
      maskImage: 'linear-gradient(to right, transparent 0, #000 4px, #000 calc(100% - 4px), transparent 100%)',
      WebkitMaskImage: 'linear-gradient(to right, transparent 0, #000 4px, #000 calc(100% - 4px), transparent 100%)',
    }}/>
  );
}

function WoodNote({ msg, onClick, flow }) {
  const c = WOOD_COLORS[msg.color] || WOOD_COLORS.coral;
  const seed = hashSeed(msg.id);
  const rot = msg._rot !== undefined ? msg._rot : noteRotation(msg.id);
  const tapeAngle = (seededRandom(seed, 7) * 2 - 1) * 8 - 90; // mostly horizontal
  return (
    <div
      onClick={onClick}
      style={{
        position: flow ? 'relative' : 'absolute',
        ...(flow ? {} : { left: msg._x, top: msg._y }),
        width: 210,
        transform: `rotate(${rot}deg)`,
        transformOrigin: '50% 0',
        transition: 'transform .3s cubic-bezier(.2,.7,.3,1), filter .25s',
        cursor: 'pointer',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.transform = `rotate(${rot * 0.4}deg) translateY(-8px) scale(1.05)`;
        e.currentTarget.style.zIndex = 50;
        e.currentTarget.style.filter = 'drop-shadow(0 16px 22px rgba(80,50,30,.3))';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.transform = `rotate(${rot}deg)`;
        e.currentTarget.style.zIndex = '';
        e.currentTarget.style.filter = '';
      }}
    >
      {/* Washi tape on top */}
      <div style={{
        position: 'absolute', top: -8, left: '50%',
        transform: `translateX(-50%) rotate(${(seededRandom(seed, 9) * 2 - 1) * 6}deg)`,
        zIndex: 2,
      }}>
        <WashiTape seed={seed} width={80} angle={0}/>
      </div>
      {/* paper */}
      <div style={{
        position: 'relative',
        background: c.bg,
        backgroundImage: `
          repeating-linear-gradient(180deg, transparent 0 26px, rgba(120,90,60,.07) 26px 27px)
        `,
        padding: '24px 16px 14px',
        boxShadow: '0 4px 8px rgba(60,40,20,.18), 0 1px 2px rgba(0,0,0,.08)',
        border: `1px solid ${c.edge}`,
        minHeight: 180,
        display: 'flex', flexDirection: 'column',
      }}>
        <div style={{
          fontFamily: '"Gaegu", cursive', fontSize: 19, lineHeight: 1.45, fontWeight: 400,
          color: '#5a3a1a', whiteSpace: 'pre-wrap', flex: 1, wordBreak: 'break-all', overflowWrap: 'break-word',
        }}>{msg.text}</div>
        <div style={{
          fontFamily: '"Gaegu", cursive', fontSize: 16, fontWeight: 700,
          color: '#7a5a3a', textAlign: 'right', marginTop: 10,
        }}>♡ {msg.name}</div>
      </div>
    </div>
  );
}

function WoodComposer({ onClose, onSubmit }) {
  const [name, setName] = React.useState('');
  const [text, setText] = React.useState('');
  const [color, setColor] = React.useState('coral');
  const canSubmit = name.trim() && text.trim();
  return (
    <div style={{
      position: 'absolute', inset: 0, background: 'rgba(60,40,20,.5)',
      display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 200,
      backdropFilter: 'blur(2px)',
    }} onClick={onClose}>
      <div onClick={(e) => e.stopPropagation()} style={{
        width: 'min(440px, calc(100vw - 32px))', background: '#fff8ed', borderRadius: 14, padding: 30,
        boxShadow: '0 30px 60px rgba(0,0,0,.35)',
        fontFamily: '"Gowun Dodum", sans-serif',
        position: 'relative',
      }}>
        {/* decorative tape on modal */}
        <div style={{ position: 'absolute', top: -10, left: 60, transform: 'rotate(-4deg)' }}>
          <WashiTape seed={3} width={90}/>
        </div>
        <div style={{ position: 'absolute', top: -10, right: 60, transform: 'rotate(3deg)' }}>
          <WashiTape seed={1} width={90}/>
        </div>
        <div style={{ fontFamily: '"Gaegu", cursive', fontWeight: 700, fontSize: 28, color: '#7a5a3a', marginBottom: 2 }}>
          선생님께 한 마디 ♡
        </div>
        <div style={{ fontSize: 13, color: '#a08a6a', marginBottom: 22 }}>
          작은 메모지에 진심을 담아보세요
        </div>
        <label style={{ display: 'block', fontSize: 12, color: '#7a5a3a', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em' }}>이름</label>
        <input value={name} onChange={(e) => setName(e.target.value)}
          placeholder="이름"
          style={{
            width: '100%', padding: '11px 14px', borderRadius: 10,
            border: '1.5px solid #e8d8b8', background: '#fffdf6', fontSize: 15,
            fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
            marginBottom: 16, color: '#5a3a1a',
          }}/>
        <label style={{ display: 'block', fontSize: 12, color: '#7a5a3a', marginBottom: 6, fontWeight: 700, letterSpacing: '0.05em' }}>메시지</label>
        <textarea value={text} onChange={(e) => setText(e.target.value)}
          placeholder="감사한 마음을 적어주세요 :)"
          rows={4}
          style={{
            width: '100%', padding: '11px 14px', borderRadius: 10,
            border: '1.5px solid #e8d8b8', background: '#fffdf6', fontSize: 15,
            fontFamily: 'inherit', boxSizing: 'border-box', outline: 'none',
            resize: 'none', marginBottom: 18, color: '#5a3a1a', lineHeight: 1.5,
          }}/>
        <label style={{ display: 'block', fontSize: 12, color: '#7a5a3a', marginBottom: 8, fontWeight: 700, letterSpacing: '0.05em' }}>메모지 색상</label>
        <div style={{ display: 'flex', gap: 10, marginBottom: 24 }}>
          {Object.keys(WOOD_COLORS).map((k) => (
            <button key={k} onClick={() => setColor(k)} style={{
              width: 38, height: 38, borderRadius: 10,
              background: WOOD_COLORS[k].bg,
              border: color === k ? '2.5px solid #7a5a3a' : `1.5px solid ${WOOD_COLORS[k].edge}`,
              cursor: 'pointer', transition: 'transform .12s',
              transform: color === k ? 'scale(1.1)' : 'scale(1)',
            }}/>
          ))}
        </div>
        <div style={{ display: 'flex', gap: 10, justifyContent: 'flex-end' }}>
          <button onClick={onClose} style={{
            padding: '11px 20px', border: 'none', background: 'transparent',
            color: '#a08a6a', borderRadius: 10, fontSize: 14, cursor: 'pointer',
            fontFamily: 'inherit', fontWeight: 600,
          }}>취소</button>
          <button onClick={() => canSubmit && onSubmit({ name: name.trim(), text: text.trim(), color })}
            disabled={!canSubmit}
            style={{
              padding: '11px 24px', border: 'none',
              background: canSubmit ? '#e89a7a' : '#e8d8b8',
              color: '#fff', borderRadius: 10, fontSize: 14, cursor: canSubmit ? 'pointer' : 'not-allowed',
              fontFamily: 'inherit', fontWeight: 700, letterSpacing: '0.02em',
              boxShadow: canSubmit ? '0 4px 12px rgba(232,154,122,.4)' : 'none',
            }}>
            메모 붙이기 ♡
          </button>
        </div>
      </div>
    </div>
  );
}

function WoodBoard() {
  const [messages, setMessages] = React.useState(() => loadMessages());
  const [composing, setComposing] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState(null);

  const handleSubmit = ({ name, text, color }) => {
    const newMsg = { id: 'm' + Date.now(), name, text, color, createdAt: Date.now() };
    const next = [newMsg, ...messages];
    setMessages(next); saveMessages(next);
    setComposing(false); setJustAdded(newMsg.id);
    setTimeout(() => setJustAdded(null), 700);
  };

  const laid = layoutNotes(messages, 5, 230, 230, 30, 20, 18);

  return (
    <div style={{
      position: 'absolute', inset: 0, overflow: 'hidden',
      // light wood / linen
      background: `
        repeating-linear-gradient(92deg, rgba(180,140,100,.08) 0 2px, transparent 2px 7px),
        repeating-linear-gradient(89deg, rgba(120,80,40,.06) 0 1px, transparent 1px 19px),
        radial-gradient(ellipse at 30% 20%, rgba(255,240,210,.5), transparent 60%),
        linear-gradient(135deg, #f4e4c8 0%, #e8d4b0 50%, #d8c098 100%)
      `,
      fontFamily: '"Gowun Dodum", sans-serif',
    }}>
      {/* Subtle wood knots */}
      <div style={{
        position: 'absolute', top: '15%', left: '8%', width: 40, height: 30,
        background: 'radial-gradient(ellipse, rgba(120,80,40,.25), transparent 70%)',
      }}/>
      <div style={{
        position: 'absolute', bottom: '20%', right: '12%', width: 60, height: 40,
        background: 'radial-gradient(ellipse, rgba(120,80,40,.2), transparent 70%)',
      }}/>

      {/* Header strip */}
      <div style={{
        position: 'absolute', top: 28, left: 32, right: 32, height: 96,
        display: 'flex', alignItems: 'center', gap: 22, zIndex: 30,
      }}>
        {/* Teacher photo with washi tape */}
        <div style={{ position: 'relative', transform: 'rotate(-2deg)' }}>
          <div style={{
            width: 90, height: 110, background: '#fff', padding: '8px 8px 22px',
            boxShadow: '0 6px 14px rgba(60,40,20,.25)',
          }}>
            <div style={{
              width: '100%', height: '100%',
              background: 'linear-gradient(135deg, #f8e8d4 0%, #d8c0a0 100%)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              color: '#a08a6a', fontSize: 11, textAlign: 'center', lineHeight: 1.3,
            }}>강사님<br/>사진</div>
          </div>
          <div style={{ position: 'absolute', top: -10, left: 18, transform: 'rotate(-8deg)' }}>
            <WashiTape seed={2} width={60}/>
          </div>
        </div>
        <div style={{ flex: 1 }}>
          <div style={{
            fontFamily: '"Gaegu", cursive', fontSize: 42, fontWeight: 700, color: '#5a3a1a',
            letterSpacing: '-0.01em', lineHeight: 1,
          }}>고마워요, 선생님 ♡</div>
          <div style={{ fontSize: 14, color: '#8a6a4a', marginTop: 6, fontWeight: 500 }}>
            Teacher's Day · 5 .15 · 따뜻한 한 마디를 남겨보세요
          </div>
        </div>
        <button onClick={() => setComposing(true)} style={{
          padding: '14px 24px', background: '#e89a7a', color: '#fff',
          border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
          fontFamily: '"Gowun Dodum", sans-serif', cursor: 'pointer',
          boxShadow: '0 6px 16px rgba(232,154,122,.4), 0 2px 4px rgba(0,0,0,.1)',
          letterSpacing: '-0.01em', transition: 'transform .15s',
        }}
        onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
        onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >＋ 메모 남기기</button>
      </div>

      {/* Notes board */}
      <div style={{ position: 'absolute', top: 144, left: 32, right: 32, bottom: 28 }}>
        {laid.map((msg) => (
          <div key={msg.id} style={{
            animation: justAdded === msg.id ? 'wood-drop .55s cubic-bezier(.34,1.56,.64,1)' : undefined,
          }}>
            <WoodNote msg={msg} onClick={() => {}}/>
          </div>
        ))}
      </div>

      {composing && <WoodComposer onClose={() => setComposing(false)} onSubmit={handleSubmit}/>}

      <style>{`
        @keyframes wood-drop {
          0% { transform: translateY(-30px) rotate(0deg); opacity: 0; }
          100% { transform: translateY(0) rotate(0deg); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

Object.assign(window, { WoodBoard, WoodNote, WoodComposer, WashiTape, WOOD_COLORS });
