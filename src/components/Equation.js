import React, { useLayoutEffect, useRef } from 'react';
import katex from 'katex';

function Equation({ equation }) {
  const element = useRef();

  useLayoutEffect(() => {
    katex.render(equation, element.current, { throwOnError: false });
  }, [equation]);

  return <div ref={element} />;
}

export default Equation;
