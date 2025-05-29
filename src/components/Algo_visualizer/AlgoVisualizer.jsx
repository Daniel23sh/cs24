import React from 'react';
import { Link } from 'react-router-dom';

const styles = {
  container: {
    minHeight: '100vh',
    background: 'linear-gradient(135deg, #f5f7fa, #c3cfe2)',
    padding: '40px 20px',
  },
  header: {
    textAlign: 'center',
    marginBottom: '50px',
  },
  title: {
    fontSize: '2.5rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  subtitle: {
    fontSize: '1.2rem',
    color: '#34495e',
  },
  grid: {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
    gap: '30px',
    maxWidth: '1200px',
    margin: '0 auto',
    padding: '20px',
  },
  card: {
    background: 'white',
    borderRadius: '15px',
    padding: '25px',
    boxShadow: '0 10px 20px rgba(0,0,0,0.1)',
    transition: 'transform 0.3s ease',
    cursor: 'pointer',
    textDecoration: 'none',
    color: 'inherit',
  },
  cardHover: {
    transform: 'translateY(-5px)',
  },
  cardTitle: {
    fontSize: '1.5rem',
    color: '#2c3e50',
    marginBottom: '15px',
  },
  cardDescription: {
    color: '#7f8c8d',
    lineHeight: '1.6',
  },
  icon: {
    fontSize: '2rem',
    marginBottom: '15px',
    color: '#3498db',
  },
};

const AlgoVisualizer = () => {
  const algorithms = [
    {
      title: 'Queue Visualization',
      description: 'Visualize queue operations using a static array implementation. Learn about FIFO principle and basic queue operations.',
      icon: '📬',
      path: '/algo/queue'
    },
    {
      title: 'Stack Visualization',
      description: 'Visualize stack operations and understand LIFO principle with an array-based implementation.',
      icon: '📚',
      path: '/algo/stack'
    },
    {
      title: 'Linked List',
      description: 'Coming soon - Explore linked list operations and understand memory allocation.',
      icon: '🔗',
      path: '/algo/linked-list'
    },
    {
      title: 'Binary Tree',
      description: 'Explore binary search tree operations including insertion, deletion, and traversal algorithms.',
      icon: '🌳',
      path: '/algo/binary-tree'
    }
  ];

  return (
    <div style={styles.container}>
      <header style={styles.header}>
        <h1 style={styles.title}>Algorithm Visualizer</h1>
        <p style={styles.subtitle}>Interactive visualizations to help you understand data structures and algorithms</p>
      </header>

      <div style={styles.grid}>
        {algorithms.map((algo, index) => (
          <Link
            key={index}
            to={algo.path}
            style={styles.card}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-5px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={styles.icon}>{algo.icon}</div>
            <h2 style={styles.cardTitle}>{algo.title}</h2>
            <p style={styles.cardDescription}>{algo.description}</p>
          </Link>
        ))}
      </div>
    </div>
  );
};

export default AlgoVisualizer; 