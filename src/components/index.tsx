import React from "react";
import { ReactNode, useCallback, useEffect, useRef, useState } from "react";

export type CarouselProps = {
  children: ReactNode[];
  className?: string;
  autoplaySpeed?: number;
  buttonScrollSpeed?: number;
  autoplay?: boolean;
  reverse?: boolean;
  showScrollbar?: boolean;
  playOnce?: boolean;
  hideButtons?: boolean;
  alwaysShowButtons?: boolean;
  pauseOnHover?: boolean;
  unlockFrameLimit?: boolean;
  backgroundColor?: string;
  allowMouseDrag?: boolean;
};

export default function Carousel({
  children,
  className,
  autoplaySpeed = 1,
  buttonScrollSpeed = autoplaySpeed * 2,
  autoplay = true,
  reverse = false,
  showScrollbar = false,
  playOnce = false,
  hideButtons = false,
  pauseOnHover = true,
  alwaysShowButtons = false,
  unlockFrameLimit = false,
  backgroundColor = "transparent",
  allowMouseDrag = false,
}: CarouselProps) {
  const [isLeftHovered, setIsLeftHovered] = useState(false);
  const [isRightHovered, setIsRightHovered] = useState(false);
  const [paused, setPaused] = useState(false);
  const [speed, setSpeed] = useState<number>();
  const [repeatPosition, setRepeatPosition] = useState<number | null>(null);
  const [clonePosition, setClonePosition] = useState<number | null>(null);
  const [endPosition, setEndPosition] = useState<number | null>(null);
  const [render, setRender] = useState(false);
  const [frame, setFrame] = useState(0);
  const [animationFrameId, setAnimationFrameId] = useState<number | null>();
  const [childrenWidths, setChildrenWidths] = useState<number[]>([]);
  const [childrenTotalWidth, setChildrenTotalWidth] = useState<number>(0);
  const [frameTime, setFrameTime] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);
  const childRefs = useRef<React.RefObject<HTMLDivElement | null>[]>([]);

  // Mouse drag
  const isDragging = useRef(false);
  const startX = useRef(0);
  const prevTranslate = useRef(0);

  const buttonScrollAmount = buttonScrollSpeed;

  const clonedChildren = playOnce
    ? children
    : [...children, ...children, ...children, ...children];

  const firstChildIndex = 0;
  const firstChildCloneIndex = children.length;

  useEffect(() => {
    const getRefreshRate = () => {
      const frameTimes: number[] = [];
      let lastFrameTime = performance.now();

      const frame = (time: number) => {
        frameTimes.push(time - lastFrameTime);
        lastFrameTime = time;

        if (frameTimes.length < 24) {
          requestAnimationFrame(frame);
        } else {
          const averageFrameTime =
            frameTimes.reduce((a, b) => a + b, 0) / frameTimes.length;
          setFrameTime(averageFrameTime);

          if (averageFrameTime > 0) {
            const calculatedSpeed = 60 / (1000 / frameTime);
            setSpeed(Math.round(1 / calculatedSpeed));
          }
        }
      };

      requestAnimationFrame(frame);
    };

    getRefreshRate();
  }, [frameTime]);

  useEffect(() => {
    if (childRefs.current.length > 0) {
      const widths = childRefs.current.map((child) => {
        if (child.current) {
          return child.current.getBoundingClientRect().width;
        }
        return 0;
      });

      setChildrenWidths(widths);
      setChildrenTotalWidth(widths.reduce((a, b) => a + b, 0));
    }
  }, []);

  useEffect(() => {
    if (
      carouselRef.current &&
      childRefs.current[0].current &&
      childRefs.current[children.length - 1] &&
      childRefs.current[children.length - 1].current !== null
    ) {
      // Positions on load
      const firstChildPosition =
        childRefs.current[firstChildIndex].current?.getBoundingClientRect().x ||
        0;
      const cloneChildPosition = childRefs.current[children.length]?.current
        ? childRefs.current[children.length]?.current?.getBoundingClientRect()
            ?.x ?? 0
        : 0;

      setRepeatPosition(firstChildPosition);
      setClonePosition(cloneChildPosition);

      if (!reverse) carouselRef.current.scrollLeft += 1;

      if (reverse) {
        // Move to the end of the carousel
        carouselRef.current.scrollLeft = childrenTotalWidth;

        // Get the new position of the carousel after moving to the end
        const newEndPosition =
          childRefs.current[firstChildIndex].current?.getBoundingClientRect().x;

        setEndPosition(newEndPosition);

        carouselRef.current.scrollLeft -= 1;
      }
    }
  }, [
    children.length,
    childrenTotalWidth,
    childrenWidths,
    clonedChildren.length,
    firstChildCloneIndex,
    firstChildIndex,
    reverse,
  ]);

  const scroll = useCallback(
    ({
      scrollSpeed,
      stop = false,
    }: {
      scrollSpeed: number;
      stop?: boolean;
    }) => {
      // If speed is set, use it to determine how many frames to skip
      if (speed) {
        // Displays around 60hz, 50hz, 75hz
        // move 1 pixel every frame
        // unlockFrameLimit will run on every frame
        // resulting in a very fast carousel on high refresh rate displays
        if (speed <= 1 || unlockFrameLimit || stop) {
          // Render every frame
          setRender(true);

          // Display around 90hz and up (100hz, 120hz, 165hz, etc.)
          // Render every N'th frame
          // e.g. 120hz moves 1 pixel every other frame, 240hz once every 4 frames
          // This is to ensure the carousel runs at around the same speed on all displays
          // (Won't be exact same speed; 120hz will run slightly fast than 100hz, etc.)
        } else if (frame < speed - 1) {
          setFrame((prev) => prev + 1);
          setRender(false);
        } else {
          setRender(true);
          setFrame(0);
        }
      }

      if (carouselRef.current && repeatPosition !== null) {
        if (render) {
          // Only move if stop is false
          if (!stop && autoplay) {
            carouselRef.current.scrollLeft += !reverse
              ? scrollSpeed
              : -scrollSpeed;
          }
        }

        // Moving Right
        if (!reverse && !playOnce) {
          // Scrolling backwards
          if (
            clonePosition &&
            childRefs.current[firstChildIndex].current &&
            childRefs.current[firstChildIndex].current.getBoundingClientRect()
              .x > repeatPosition
          ) {
            carouselRef.current.scrollLeft = clonePosition - 1;

            // Scrolling forwards
          } else if (
            childRefs.current[firstChildCloneIndex].current &&
            childRefs.current[
              firstChildCloneIndex
            ].current.getBoundingClientRect().x +
              20 <=
              repeatPosition
          ) {
            carouselRef.current.scrollLeft = repeatPosition + 15;
          }

          // Moving Left
        } else if (reverse) {
          // Scrolling backwards
          if (
            clonePosition &&
            childRefs.current[firstChildIndex].current &&
            childRefs.current[firstChildIndex].current.getBoundingClientRect()
              .x >= repeatPosition
          ) {
            carouselRef.current.scrollLeft = clonePosition - repeatPosition;

            // Scrolling forwards
          } else if (
            clonePosition &&
            childRefs.current[firstChildIndex].current &&
            childRefs.current[firstChildIndex].current?.getBoundingClientRect()
              .x == endPosition
          ) {
            carouselRef.current.scrollLeft -= clonePosition;
          }
        }
      }
    },
    [
      autoplay,
      clonePosition,
      endPosition,
      firstChildCloneIndex,
      frame,
      playOnce,
      render,
      repeatPosition,
      reverse,
      speed,
      unlockFrameLimit,
    ]
  );

  useEffect(() => {
    if (carouselRef.current) {
      let animationFrameId: number;

      const autoScroll = () => {
        scroll({ scrollSpeed: autoplaySpeed, stop: paused });
        animationFrameId = requestAnimationFrame(autoScroll);
      };

      animationFrameId = requestAnimationFrame(autoScroll);

      return () => {
        cancelAnimationFrame(animationFrameId);
      };
    }
  }, [autoplay, autoplaySpeed, paused, reverse, scroll]);

  const handleMouseOver = () => setPaused(true);
  const handleMouseLeave = () => setPaused(autoplay && false);

  const scrollButton = (reverse: boolean) => {
    if (carouselRef.current && !animationFrameId) {
      const scrollButton = () => {
        scroll({
          scrollSpeed: reverse ? -buttonScrollAmount : buttonScrollAmount,
        });
        setAnimationFrameId(requestAnimationFrame(scrollButton));
      };

      setAnimationFrameId(requestAnimationFrame(scrollButton));
    }
  };

  const handleMouseDownRightButton = () => {
    scrollButton(false);
  };

  const handleMouseDownLeftButton = () => {
    scrollButton(true);
  };

  const handleEndAnimation = () => {
    if (animationFrameId) {
      cancelAnimationFrame(animationFrameId);
      setAnimationFrameId(null);
    }
  };

  const handleMouseDownDrag = (e: React.MouseEvent) => startDrag(e.clientX);
  const handleMouseMoveDrag = (e: React.MouseEvent) => onDrag(e.clientX);
  const handleMouseUpDrag = () => endDrag();

  const startDrag = (x: number) => {
    if (carouselRef.current && allowMouseDrag) {
      isDragging.current = true;
      startX.current = x;
      prevTranslate.current = carouselRef.current.scrollLeft;
      carouselRef.current.style.transition = "none";
    }
  };

  const onDrag = (x: number) => {
    if (isDragging.current && carouselRef.current && allowMouseDrag) {
      const distance = x - startX.current;
      carouselRef.current.scrollLeft = prevTranslate.current - distance;
    }
  };

  const endDrag = () => {
    if (carouselRef.current && allowMouseDrag) {
      isDragging.current = false;
      carouselRef.current.style.transition = "all 0.3s ease";
    }
  };

  return (
    <div
      style={carouselContainerStyle}
      onTouchStart={handleMouseOver}
      onTouchEnd={handleMouseLeave}
      onMouseEnter={pauseOnHover ? handleMouseOver : () => {}}
      onMouseLeave={pauseOnHover ? handleMouseLeave : () => {}}
    >
      {!hideButtons && (
        <div
          style={scrollLeftStyle(isLeftHovered || alwaysShowButtons)}
          onMouseDown={handleMouseDownLeftButton}
          onMouseUp={handleEndAnimation}
          onMouseEnter={() => setIsLeftHovered(true)}
          onMouseLeave={() => {
            handleEndAnimation();
            setIsLeftHovered(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m11.25 9-3 3m0 0 3 3m-3-3h7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      )}
      <div
        style={{
          ...carouselWrapperStyle(backgroundColor),
          ...(!showScrollbar && scrollHiddenStyle),
        }}
        ref={carouselRef}
        onMouseDown={handleMouseDownDrag}
        onMouseMove={handleMouseMoveDrag}
        onMouseUp={handleMouseUpDrag}
        className={className}
      >
        {clonedChildren.map((child, index) => (
          <div
            style={carouselItemStyle}
            key={index}
            ref={
              childRefs.current[index] ||
              (childRefs.current[index] = React.createRef())
            }
          >
            {child}
          </div>
        ))}
      </div>
      {!hideButtons && (
        <div
          style={scrollRightStyle(isRightHovered || alwaysShowButtons)}
          onMouseDown={handleMouseDownRightButton}
          onMouseUp={handleEndAnimation}
          onMouseEnter={() => setIsRightHovered(true)}
          onMouseLeave={() => {
            handleEndAnimation();
            setIsRightHovered(false);
          }}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth={1.5}
            stroke="black"
            className="size-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="m12.75 15 3-3m0 0-3-3m3 3h-7.5M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
            />
          </svg>
        </div>
      )}
    </div>
  );
}

const carouselContainerStyle: React.CSSProperties = {
  position: "relative",
  overflow: "hidden",
  width: "100%",
};

const carouselWrapperStyle = (
  backgroundColor: string
): React.CSSProperties => ({
  display: "flex",
  justifyContent: "space-around",
  overflowX: "scroll",
  backgroundColor: backgroundColor,
});

const carouselItemStyle: React.CSSProperties = {
  padding: "0",
  margin: "0",
};

const scrollButtonStyle = (isHovered: boolean): React.CSSProperties => ({
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  top: "50%",
  width: "2.5rem",
  height: "70%",
  background: "transparent",
  opacity: isHovered ? 1 : 0.5,
  cursor: "pointer",
  transform: "translateY(-50%)",
  transition: "opacity 0.3s ease-out",
});

const scrollLeftStyle = (isHovered: boolean): React.CSSProperties => ({
  ...scrollButtonStyle(isHovered),
  left: "0",
});

const scrollRightStyle = (isHovered: boolean): React.CSSProperties => ({
  ...scrollButtonStyle(isHovered),
  right: "0",
});

const scrollHiddenStyle: React.CSSProperties = {
  scrollbarWidth: "none",
  msOverflowStyle: "none",
  // @ts-expect-error - webkit prefixed properties aren't in React.CSSProperties
  WebkitScrollbar: {
    display: "none",
  },
};
