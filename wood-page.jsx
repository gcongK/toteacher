// wood-page.jsx — Full-page version of the picked design.
// Uses WoodNote, WoodComposer, WashiTape from wood.jsx (loaded earlier).
// The notes area's height grows with message count so the page scrolls
// naturally instead of clipping.


function WoodPage() {
  const [messages, setMessages] = React.useState([]);
  const [composing, setComposing] = React.useState(false);
  const [justAdded, setJustAdded] = React.useState(null);
  const isMobile = window.innerWidth < 600;

  React.useEffect(() => {
    const unsubscribe = listenMessages(setMessages);
    return unsubscribe;
  }, []);

  const handleSubmit = async ({ name, text, color }) => {
    setComposing(false);
    const ref = await addMessage({ name, text, color });
    setJustAdded(ref.id);
    setTimeout(() => setJustAdded(null), 700);
  };


  return (
    <div style={{
      minHeight: '100vh',
      // light wood / linen — same vocabulary as artboard version
      background: `
        repeating-linear-gradient(92deg, rgba(180,140,100,.08) 0 2px, transparent 2px 7px),
        repeating-linear-gradient(89deg, rgba(120,80,40,.06) 0 1px, transparent 1px 19px),
        radial-gradient(ellipse at 30% 20%, rgba(255,240,210,.5), transparent 60%),
        linear-gradient(135deg, #f4e4c8 0%, #e8d4b0 50%, #d8c098 100%)
      `,
      backgroundAttachment: 'fixed',
      fontFamily: '"Gowun Dodum", sans-serif',
      position: 'relative',
    }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky', top: 0, zIndex: 100,
        backdropFilter: 'blur(8px)',
        background: 'rgba(244,228,200,0.82)',
        borderBottom: '1px solid rgba(120,80,40,.18)',
      }}>
        <div style={{
          maxWidth: 1280, margin: '0 auto',
          padding: '16px 20px',
          display: 'flex', alignItems: 'center', gap: 16,
        }}>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={{
              fontFamily: '"Gaegu", cursive', fontSize: 'clamp(20px, 5vw, 32px)', fontWeight: 700, color: '#5a3a1a',
              letterSpacing: '-0.01em', lineHeight: 1,
            }}> 감사합니다, 유청훈 선생님 ♡</div>
            <div style={{ fontSize: 13, color: '#8a6a4a', marginTop: 5, fontWeight: 500 }}>
              Teacher's Day · 5 .15 · 따뜻한 한 마디를 남겨보세요 &nbsp;·&nbsp;
              <span style={{ color: '#7a5a3a', fontWeight: 700 }}>{messages.length}개의 메모</span>
            </div>
          </div>
          <button onClick={() => setComposing(true)} style={{
            padding: '14px 24px', background: '#e89a7a', color: '#fff',
            border: 'none', borderRadius: 14, fontSize: 15, fontWeight: 700,
            fontFamily: '"Gowun Dodum", sans-serif', cursor: 'pointer',
            boxShadow: '0 6px 16px rgba(232,154,122,.4), 0 2px 4px rgba(0,0,0,.1)',
            letterSpacing: '-0.01em', transition: 'transform .15s',
            flexShrink: 0, whiteSpace: 'nowrap',
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >＋ 메모 남기기</button>
        </div>
      </div>

      {/* Subtle wood knots */}
      <div style={{
        position: 'absolute', top: 200, left: '6%', width: 50, height: 36,
        background: 'radial-gradient(ellipse, rgba(120,80,40,.22), transparent 70%)',
        pointerEvents: 'none',
      }}/>
      <div style={{
        position: 'absolute', top: 600, right: '8%', width: 70, height: 46,
        background: 'radial-gradient(ellipse, rgba(120,80,40,.18), transparent 70%)',
        pointerEvents: 'none',
      }}/>

      {/* Notes board */}
      <div style={{
        maxWidth: 1280, margin: '0 auto',
        padding: isMobile ? '20px 12px 40px' : '28px 20px 60px',
        columnWidth: isMobile ? '150px' : '230px',
        columnGap: isMobile ? '12px' : '28px',
      }}>
        {/* Teacher photo — first slot */}
        <div style={{
          breakInside: 'avoid', pageBreakInside: 'avoid',
          marginBottom: isMobile ? '20px' : '32px', display: 'inline-block', width: '100%',
        }}>
          <div style={{
            position: 'relative', width: isMobile ? 140 : 210,
            transform: 'rotate(-1.5deg)', transformOrigin: '50% 0',
          }}>
            <div style={{ position: 'absolute', top: -10, left: '50%', transform: 'translateX(-50%) rotate(1deg)', zIndex: 2 }}>
              <WashiTape seed={2} width={isMobile ? 60 : 90}/>
            </div>
            <div style={{
              background: '#fff8ed', border: '1px solid #e8d8b8',
              padding: isMobile ? '6px 6px 22px' : '10px 10px 32px',
              boxShadow: '0 4px 8px rgba(60,40,20,.18)',
            }}>
              <img src="teacher_photo.png" alt="선생님"
                style={{ width: '100%', display: 'block', objectFit: 'cover' }}/>
              <div style={{
                fontFamily: '"Gaegu", cursive', fontSize: isMobile ? 13 : 17,
                color: '#7a5a3a', textAlign: 'center', marginTop: isMobile ? 6 : 10,
              }}>유청훈 선생님</div>
            </div>
          </div>
        </div>

        {messages.length === 0 ? (
          <div style={{
            display: 'inline-block', width: '100%',
            color: '#8a6a4a', fontFamily: '"Gaegu", cursive', fontSize: 20,
            padding: '40px 0',
          }}>아직 메모가 없어요. 첫 메모를 남겨주세요 ♡</div>
        ) : messages.map((msg) => (
          <div key={msg.id} style={{
            breakInside: 'avoid', pageBreakInside: 'avoid',
            marginBottom: isMobile ? '20px' : '32px', display: 'inline-block', width: '100%',
            animation: justAdded === msg.id ? 'wood-page-drop .55s cubic-bezier(.34,1.56,.64,1)' : undefined,
          }}>
            <WoodNote msg={msg} onClick={() => {}} flow small={isMobile}/>
          </div>
        ))}
      </div>

      {/* Footer */}
      <div style={{
        textAlign: 'center', padding: '20px', fontSize: 12, color: '#a08a6a',
        letterSpacing: '0.05em',
      }}>made by Gabeen Kim</div>

      {composing && <WoodComposer onClose={() => setComposing(false)} onSubmit={handleSubmit}/>}

      <style>{`
        @keyframes wood-page-drop {
          0% { transform: translateY(-30px); opacity: 0; }
          100% { transform: translateY(0); opacity: 1; }
        }
      `}</style>
    </div>
  );
}

window.WoodPage = WoodPage;
