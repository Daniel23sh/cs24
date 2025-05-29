import React, { useState } from 'react';

const styles = {
  container: {
    margin: 0,
    padding: 0,
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
    background: 'linear-gradient(135deg, #f1f8e9, #aed581)',
    minHeight: '100vh',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },
  header: {
    textAlign: 'center',
    padding: '40px 20px 10px'
  },
  title: {
    fontSize: '40px',
    color: '#33691e',
    marginBottom: '5px'
  },
  subtitle: {
    fontSize: '18px',
    color: '#555'
  },
  controls: {
    textAlign: 'center',
    marginBottom: '30px'
  },
  input: {
    padding: '10px',
    width: '180px',
    fontSize: '16px',
    border: '1px solid #ccc',
    borderRadius: '6px'
  },
  button: {
    padding: '10px 20px',
    fontSize: '15px',
    border: 'none',
    borderRadius: '6px',
    backgroundColor: '#558b2f',
    color: 'white',
    cursor: 'pointer',
    margin: '5px'
  },
  queueWrapper: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    margin: '20px 0',
    gap: '10px'
  },
  queueBoundary: {
    width: '10px',
    height: '60px',
    backgroundColor: '#3e2723',
    borderRadius: '4px'
  },
  queueSlot: {
    width: '60px',
    height: '60px',
    border: '2px dashed #bbb',
    borderRadius: '6px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 'bold',
    fontSize: '16px',
    backgroundColor: '#fff',
    position: 'relative'
  },
  queueInfo: {
    position: 'absolute',
    top: '25px',
    left: '10px',
    width: '260px',
    padding: '18px 24px',
    background: '#ffffffcc',
    border: '1px solid #cfd8dc',
    borderRadius: '12px',
    boxShadow: '0 6px 14px rgba(0, 0, 0, 0.1)'
  }
};

const ArrayQueue = () => {
  const [queue, setQueue] = useState([]);
  const [capacity, setCapacity] = useState(0);
  const [front, setFront] = useState(0);
  const [rear, setRear] = useState(0);
  const [size, setSize] = useState(0);
  const [value, setValue] = useState('');

  const initQueue = () => {
    const cap = parseInt(capacity);
    if (isNaN(cap) || cap <= 0) {
      alert('Please enter a valid positive queue size.');
      return;
    }
    setQueue(new Array(cap).fill(null));
    setFront(0);
    setRear(0);
    setSize(0);
  };

  const enqueue = () => {
    if (value.trim() === '') return;
    if (size >= capacity) {
      alert('Queue is full!');
      return;
    }

    const newQueue = [...queue];
    newQueue[rear] = value;
    setQueue(newQueue);
    setRear((rear + 1) % capacity);
    setSize(size + 1);
    setValue('');
  };

  const dequeue = () => {
    if (size === 0) {
      alert('Queue is empty!');
      return;
    }
    const newQueue = [...queue];
    newQueue[front] = null;
    setQueue(newQueue);
    setFront((front + 1) % capacity);
    setSize(size - 1);
  };

  const resetQueue = () => {
    setQueue([]);
    setFront(0);
    setRear(0);
    setSize(0);
    setCapacity(0);
  };

  const renderQueue = () => {
    return queue.map((item, i) => {
      const slotStyle = {
        ...styles.queueSlot,
        backgroundColor: item !== null && item !== undefined ? '#c5e1a5' : '#fff',
        border: item !== null && item !== undefined ? '2px solid #7cb342' : '2px dashed #bbb'
      };
      return (
        <div key={i} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', margin: '4px' }}>
          <div
            style={{
              ...slotStyle,
              ...(i === front && size > 0 ? { boxShadow: 'inset 0 0 0 2px #33691e' } : {}),
              ...(i === ((rear + capacity) % capacity) && size > 0 && rear !== front
                ? { outline: '2px solid #33691e' }
                : {})
            }}
          >
            {item}
          </div>
          <div style={{ fontSize: '12px', color: '#333' }}>{i}</div>
        </div>
      );
    });
  };

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>📬 Queue via Array</h1>
        <p style={styles.subtitle}>Static Array Queue — First In, First Out </p>
      </header>

      <main style={{ width: '100%', maxWidth: '1000px', padding: '30px', boxSizing: 'border-box', position: 'relative' }}>
        <section style={styles.controls}>
          <input
            type="number"
            value={capacity}
            placeholder="Set queue size..."
            onChange={(e) => setCapacity(Number(e.target.value))}
            style={styles.input}
          />
          <button onClick={initQueue} style={styles.button}>Create Queue</button>
          <br /><br />
          <input
            type="number"
            value={value}
            placeholder="Enter value..."
            onChange={(e) => setValue(e.target.value)}
            style={styles.input}
          />
          <div>
            <button onClick={enqueue} style={styles.button}>Enqueue</button>
            <button onClick={dequeue} style={styles.button}>Dequeue</button>
            <button onClick={resetQueue} style={styles.button}>Reset</button>
          </div>
        </section>

        <div style={styles.queueWrapper}>
          <div style={styles.queueBoundary}></div>
          <div id="queue-visual">
            <div id="queue-container" style={{ display: 'flex', gap: '5px', padding: '10px', flexWrap: 'wrap' }}>
              {renderQueue()}
            </div>
          </div>
          <div style={styles.queueBoundary}></div>
        </div>

        <div style={styles.queueInfo}>
          <p><strong>Queue Size:</strong> {size}</p>
          <p><strong>Front Value:</strong> {size > 0 ? queue[front] : 'None'}</p>
        </div>
      </main>
    </div>
  );
};

export default ArrayQueue;
