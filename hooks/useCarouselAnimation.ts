import { useEffect, useRef, useCallback, useState } from 'react';

interface UseCarouselAnimationProps {
    containerRef: React.RefObject<HTMLDivElement>;
    enableDragDetection?: boolean;
}

interface CarouselAnimationState {
    isAnimating: boolean;
    isPaused: boolean;
    isDragging: boolean;
}

export const useCarouselAnimation = ({
                                         containerRef,
                                         enableDragDetection = true,
                                     }: UseCarouselAnimationProps) => {
    const [state, setState] = useState<CarouselAnimationState>({
        isAnimating: true,
        isPaused: false,
        isDragging: false,
    });

    const stateRef = useRef(state);
    const pauseTimeoutRef = useRef<ReturnType<typeof setTimeout>>();
    const dragStartRef = useRef({ x: 0, y: 0 });
    const isDragThresholdRef = useRef(false);
    const isDeviceTouchEnabledRef = useRef(false);

    // Detect if device supports touch - RUN ONCE
    useEffect(() => {
        const isTouchDevice = () => {
            return (
                (typeof window !== 'undefined' &&
                    ('ontouchstart' in window ||
                        navigator.maxTouchPoints > 0 ||
                        (navigator as any).msMaxTouchPoints > 0)) ||
                false
            );
        };
        isDeviceTouchEnabledRef.current = isTouchDevice();
    }, []);

    // Update ref when state changes
    useEffect(() => {
        stateRef.current = state;
    }, [state]);

    // Apply animation state to DOM
    useEffect(() => {
        if (!containerRef.current) return;
        const element = containerRef.current.querySelector('ul');
        if (!element) return;

        const playState = state.isPaused ? 'paused' : 'running';
        element.style.animationPlayState = playState;

        if (state.isPaused) {
            element.style.filter = 'blur(0.5px)';
            element.style.opacity = '0.95';
        } else {
            element.style.filter = 'blur(0px)';
            element.style.opacity = '1';
        }
    }, [state.isPaused]);

    // Pause animation
    const pauseAnimation = useCallback(() => {
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
        }
        setState((prev) => ({
            ...prev,
            isPaused: true,
        }));
    }, []);

    // Resume animation
    const resumeAnimation = useCallback(() => {
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
        }
        pauseTimeoutRef.current = setTimeout(() => {
            setState((prev) => ({
                ...prev,
                isPaused: false,
            }));
        }, 100);
    }, []);

    // Force resume
    const forceResume = useCallback(() => {
        if (pauseTimeoutRef.current) {
            clearTimeout(pauseTimeoutRef.current);
        }
        setState((prev) => ({
            ...prev,
            isPaused: false,
            isDragging: false,
        }));
    }, []);

    // Drag detection handlers
    const handleTouchStart = useCallback(
        (e: TouchEvent) => {
            dragStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
            isDragThresholdRef.current = false;
            pauseAnimation();
        },
        [pauseAnimation]
    );

    const handleTouchMove = useCallback((e: TouchEvent) => {
        const deltaX = Math.abs(e.touches[0].clientX - dragStartRef.current.x);
        const deltaY = Math.abs(e.touches[0].clientY - dragStartRef.current.y);
        const threshold = 5;

        if (deltaX > threshold || deltaY > threshold) {
            isDragThresholdRef.current = true;
        }

        setState((prev) => ({
            ...prev,
            isDragging: isDragThresholdRef.current,
        }));
    }, []);

    const handleTouchEnd = useCallback(() => {
        setState((prev) => ({
            ...prev,
            isDragging: false,
        }));
        resumeAnimation();
    }, [resumeAnimation]);

    // Mouse events
    const handleMouseEnter = useCallback(() => {
        pauseAnimation();
    }, [pauseAnimation]);

    const handleMouseLeave = useCallback(() => {
        resumeAnimation();
    }, [resumeAnimation]);

    // Keyboard support
    const handleKeyDown = useCallback((e: KeyboardEvent) => {
        if (!containerRef.current) return;
        if (e.code === 'Space') {
            e.preventDefault();
            if (stateRef.current.isPaused) {
                resumeAnimation();
            } else {
                pauseAnimation();
            }
        }
    }, [pauseAnimation, resumeAnimation]);

    // Visibility change
    const handleVisibilityChange = useCallback(() => {
        if (document.hidden) {
            pauseAnimation();
        } else {
            resumeAnimation();
        }
    }, [pauseAnimation, resumeAnimation]);

    // SINGLE effect dla wszystkich event listenerów
    useEffect(() => {
        if (!containerRef.current) return;

        const container = containerRef.current;
        const ul = container.querySelector('ul');

        if (!ul) {
            console.log('No UL found, retrying...');
            const retryId = setTimeout(() => {
                // Trigger re-render by setting a dummy state
            }, 100);
            return () => clearTimeout(retryId);
        }

        console.log('Attaching listeners!');

        // Attach listeners
        if (enableDragDetection && isDeviceTouchEnabledRef.current) {
            container.addEventListener('touchstart', handleTouchStart, { passive: true });
            container.addEventListener('touchmove', handleTouchMove, { passive: true });
            container.addEventListener('touchend', handleTouchEnd, { passive: true });
        }

        container.addEventListener('mouseenter', handleMouseEnter);
        container.addEventListener('mouseleave', handleMouseLeave);
        window.addEventListener('keydown', handleKeyDown);
        document.addEventListener('visibilitychange', handleVisibilityChange);

        // Cleanup
        return () => {
            console.log('Detaching listeners!');
            container.removeEventListener('touchstart', handleTouchStart);
            container.removeEventListener('touchmove', handleTouchMove);
            container.removeEventListener('touchend', handleTouchEnd);
            container.removeEventListener('mouseenter', handleMouseEnter);
            container.removeEventListener('mouseleave', handleMouseLeave);
            window.removeEventListener('keydown', handleKeyDown);
            document.removeEventListener('visibilitychange', handleVisibilityChange);
        };
    }, [
        handleTouchStart,
        handleTouchMove,
        handleTouchEnd,
        handleMouseEnter,
        handleMouseLeave,
        handleKeyDown,
        handleVisibilityChange,
        enableDragDetection,
    ]);

    // Intersection Observer
    useEffect(() => {
        if (!containerRef.current) return;

        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        if (!stateRef.current.isDragging) {
                            resumeAnimation();
                        }
                    } else {
                        pauseAnimation();
                    }
                });
            },
            { threshold: 0.25 }
        );

        observer.observe(containerRef.current);

        return () => observer.disconnect();
    }, [pauseAnimation, resumeAnimation]);

    return {
        state,
        pauseAnimation,
        resumeAnimation,
        forceResume,
    };
};