import React from 'react';

const Die = (props) => {
  const renderDots = () => {
    const dots = [];
    for (let i = 0; i < props.value; i++) {
      dots.push(<div className="dot" key={i}></div>);
    }
    return <div className="dots">{dots}</div>;
  };

  return (
    <button style={{ backgroundColor: props.isHeld ? '#59E391' : 'white' }} onClick={props.holdDice}>
      {renderDots()}
    </button>
  )
}

export default Die;
