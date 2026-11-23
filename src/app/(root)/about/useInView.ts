"use client";

import { useEffect, useRef, useState } from "react";

// Fires once when the element enters the viewport
export function useInView<T extends HTMLElement>(threshold = 0.2) {
    const ref = useRef<T>(null);
    const [inView, setInView] = useState(false);

    useEffect(() => {
        const element = ref.current;

        if (!element) return;

        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting) {
                    setInView(true);
                    observer.disconnect();
                }
            },
            { threshold }
        );

        observer.observe(element);

        return () => observer.disconnect();
    }, [threshold]);

    return { ref, inView };
}