/** Decorators (no libs) - requires tsconfig: "experimentalDecorators": true */
export function log() {
    return function <This, Args extends any[], R>(
        original: (this: This, ...args: Args) => Promise<R>,
        _context: ClassMethodDecoratorContext<
            This,
            (this: This, ...args: Args) => Promise<R>
        >
    ) {
        return async function (this: This, ...args: Args): Promise<R> {
            const t0 = performance.now();
            try {
                return await original.apply(this, args);
            } finally {
                const ms = Math.round(performance.now() - t0);
                console.debug(`[log] ${ms}ms`, {args});
            }
        };
    };
}