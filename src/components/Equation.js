import React, { useEffect, useRef } from 'react';
import katex from 'katex';

function Equation({ equation }) {
  const element = useRef();

  useEffect(() => {
    katex.render(equation, element.current, { throwOnError: false });
  }, [equation]);

  return <div ref={element} />;
}

export default Equation;
