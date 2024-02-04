import React, { useEffect, useRef } from "react";

const ReactImageZoom: React.FC<any> = ({ src, alt, srcOrigin, style }) => {
  const image = useRef(null);
  const zoomImage = useRef(null);
  const zoomLens = useRef(null);
  const container = useRef(null);

  function getCursorPos(e: any) {
    let x = 0;
    let y = 0;
    e = e || window.event;
    const a = image.current.getBoundingClientRect();
    x = e.pageX - a.left;
    y = e.pageY - a.top;
    x -= window.pageXOffset;
    y -= window.pageYOffset;
    return { x, y };
  }

  useEffect(() => {
    function handleMouseEnter() {
      zoomLens.current.style.display = "block";
      zoomImage.current.style.display = "block";
    }
    function handleMouseLeave() {
      zoomLens.current.style.display = "none";
      zoomImage.current.style.display = "none";
    }
    let cx: any;
    let cy: any;
    function moveLens(e: any) {
      // zoomLens.current.style.display = "block";

      let x;
      let y;

      e.preventDefault();

      const pos = getCursorPos(e);

      x = pos.x - zoomLens.current.offsetWidth / 2;
      y = pos.y - zoomLens.current.offsetHeight / 2;

      if (x > image.current.width - zoomLens.current.offsetWidth) {
        x = image.current.width - zoomLens.current.offsetWidth;
      }
      if (x < 0) {
        x = 0;
      }
      if (y > image.current.height - zoomLens.current.offsetHeight) {
        y = image.current.height - zoomLens.current.offsetHeight;
      }
      if (y < 0) {
        y = 0;
      }

      zoomLens.current.style.left = `${x}px`;
      zoomLens.current.style.top = `${y}px`;

      zoomImage.current.style.backgroundPosition = `-${x * cx}px -${y * cy}px`;
    }

    cx = zoomImage.current.offsetWidth / zoomLens.current.offsetWidth;
    cy = zoomImage.current.offsetHeight / zoomLens.current.offsetHeight;

    zoomImage.current.style.backgroundSize = `
      ${image.current.width * cx}px ${image.current.height * cy}px`;
    zoomLens.current.style.display = "none";
    zoomImage.current.style.display = "none";
    container.current.addEventListener("mousemove", moveLens);
    container.current.addEventListener("mouseenter", handleMouseEnter);
    container.current.addEventListener("mouseleave", handleMouseLeave);
  }, []);
  return (
    <div className=" img-zoom-container" ref={container} style={style}>
      <div className="img-zoom-lens" ref={zoomLens}></div>

      <img ref={image} src={src} alt={alt} className=" w-[450px] h-[450px]" />

      <div
        className="img-zoom-result"
        ref={zoomImage}
        // style={{ backgroundImage: `url(${src})` }}
        style={{ backgroundImage: `url(${srcOrigin || src})` }}
      ></div>
    </div>
  );
};

export default ReactImageZoom;
