import React, { useState, useEffect, useRef } from 'react';

const ArrayStack = () => {
  const [stack, setStack] = useState([]);
  const [capacity, setCapacity] = useState(0);
  const [inputVal, setInputVal] = useState('');
  const [message, setMessage] = useState('');

  const msgTimeout = useRef(null);

  const initStack = () => {
    const cap = parseInt(capacity);
    if (isNaN(cap) || cap <= 0) {
      alert('Please enter a valid positive stack size.');
      return;
    }
    setStack([]);
  };

  const push = () => {
    const val = Number(inputVal);
    if (inputVal.trim() === '' || isNaN(val)) {
      alert('Please enter a valid number.');
      return;
    }
    if (stack.length >= capacity) {
      alert('Stack Overflow!');
      return;
    }
    setStack([...stack, val]);
    setInputVal('');
  };

  const pop = () => {
    if (stack.length === 0) {
      alert('Stack Underflow!');
      return;
    }
    setStack(stack.slice(0, -1));
  };

  const resetStack = () => {
    setStack([]);
    setCapacity(0);
    setInputVal('');
  };

  const getTop = () => {
    if (stack.length === 0) {
      showStackMessage('The stack is empty.');
    } else {
      showStackMessage(`Top of stack: ${stack[stack.length - 1]}`);
    }
  };

  const showStackMessage = (msg) => {
    setMessage(msg);
    clearTimeout(msgTimeout.current);
    msgTimeout.current = setTimeout(() => setMessage(''), 3000);
  };

  const styles = {
    stackSlot: (filled, isTop) => ({
      width: '100px', height: '40px', margin: '3px 0', position: 'relative',
      display: 'flex', alignItems: 'center', justifyContent: 'center',
      fontWeight: 'bold', borderRadius: '6px',
      border: filled ? '2px solid #bf7400' : '2px dashed #bbb',
      backgroundColor: filled ? '#ff9800' : '#fff'
    }),
    topLabel: {
      position: 'absolute', right: '-50px', top: '50%', transform: 'translateY(-50%)',
      backgroundColor: '#1a237e', color: 'white', padding: '2px 6px', fontSize: '12px',
      borderRadius: '4px', fontWeight: 'bold'
    },
    indexLabel: {
      position: 'absolute', left: '-30px', fontSize: '12px', color: '#333'
    },
    msgBox: {
      position: 'fixed', bottom: '30px', left: '50%', transform: 'translateX(-50%)',
      fontSize: '16px', fontWeight: 500, color: '#5d4037', padding: '12px 24px',
      borderRadius: '12px', textAlign: 'center', zIndex: 1000,
      backgroundColor: '#fff3e0', border: '2px solid #f57c00'
    }
  };

  return (
    <div style={{ background: 'linear-gradient(135deg, #fceabb, #f8b500)', minHeight: '100vh', display: 'flex', flexDirection: 'column', alignItems: 'center', fontFamily: 'Segoe UI, Tahoma, sans-serif' }}>
      <header style={{ textAlign: 'center', padding: '40px 20px 10px' }}>
        <h1 style={{ fontSize: '40px', color: '#5d4037' }}>📦 Stack via Array</h1>
        <p style={{ fontSize: '18px', color: '#555' }}>Push, Pop & top - A Visual Guide to Array Stacks</p>
      </header>

      <main style={{ width: '100%', maxWidth: '1000px', padding: '30px', boxSizing: 'border-box', position: 'relative' }}>
        <section style={{ textAlign: 'center', marginBottom: '30px' }}>
          <input type="number" placeholder="Set stack size..." value={capacity} onChange={(e) => setCapacity(e.target.value)} style={{ padding: '10px', width: '180px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '6px' }} />
          <button onClick={initStack} style={{ marginLeft: '10px', ...buttonStyle }}>Create Stack</button>
          <br /><br />
          <input type="number" placeholder="Enter value..." value={inputVal} onChange={(e) => setInputVal(e.target.value)} style={{ padding: '10px', width: '180px', fontSize: '16px', border: '1px solid #ccc', borderRadius: '6px' }} />
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', justifyContent: 'center', marginTop: '10px' }}>
            <button onClick={push} style={buttonStyle}>Push</button>
            <button onClick={pop} style={buttonStyle}>Pop</button>
            <button onClick={getTop} style={buttonStyle}>Top</button>
            <button onClick={resetStack} style={buttonStyle}>Reset</button>
          </div>
        </section>

        <div style={{ width: '150px', margin: '0 auto', display: 'flex', flexDirection: 'column-reverse', alignItems: 'center', padding: '10px 0' }}>
          {Array.from({ length: capacity }).map((_, i) => {
            const stackIndex = i;
            const val = stack[stackIndex];
            const filled = stackIndex < stack.length;
            const isTop = stackIndex === stack.length - 1;
            return (
              <div key={i} style={styles.stackSlot(filled, isTop)}>
                {filled ? val : ''}
                {isTop && <div style={styles.topLabel}>TOP</div>}
                <div style={styles.indexLabel}>{stackIndex}</div>
              </div>
            );
          })}
        </div>

        <div style={{ position: 'absolute', top: '25px', left: '10px', width: '260px', padding: '18px 24px', background: '#ffffffcc', border: '1px solid #cfd8dc', borderRadius: '12px', boxShadow: '0 6px 14px rgba(0, 0, 0, 0.1)' }}>
          <p><strong style={{ color: '#795548' }}>Stack Size:</strong> {stack.length}</p>
          <p><strong style={{ color: '#795548' }}>Top Value:</strong> {stack.length > 0 ? stack[stack.length - 1] : 'None'}</p>
        </div>
      </main>

      {message && <div style={styles.msgBox}>{message}</div>}
    </div>
  );
};

const buttonStyle = {
  padding: '10px 20px',
  fontSize: '15px',
  border: 'none',
  borderRadius: '6px',
  backgroundColor: '#795548',
  color: 'white',
  cursor: 'pointer',
  transition: 'background-color 0.3s ease, transform 0.2s ease'
};

export default ArrayStack;
