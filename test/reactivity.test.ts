
import { describe, expect, test, vitest } from "vitest";
import { createEffect, createRoot } from "solid-js";
import { bindReactive } from "../src/reactivity";

describe("Reactivity Engine", () => {
    test("bindReactive should link a property to a Solid signal", () => {
        const target = {
            active: false
        };

        // Bind reactivity to 'active' property
        bindReactive(target, "active", false);

        let effectCount = 0;
        let lastValue: boolean | undefined;

        createRoot(() => {
            createEffect(() => {
                lastValue = target.active;
                effectCount++;
            });
        });

        // Initial effect run
        expect(effectCount).toBe(1);
        expect(lastValue).toBe(false);

        // Update target property
        target.active = true;
        
        // Solid effects are scheduled on the next microtask or can be observed 
        // if we wait or use synchronous patterns. 
        // In Vitest, we might need a small delay or check after a tick.
        
        expect(target.active).toBe(true);
        expect(effectCount).toBe(2);
        expect(lastValue).toBe(true);
    });

    test("bindReactive should handle complex types", () => {
        const target = {
            data: { name: "initial" }
        };

        bindReactive(target, "data", { name: "initial" });

        let lastValue: string = "";

        createRoot(() => {
            createEffect(() => {
                lastValue = target.data.name;
            });
        });

        expect(lastValue).toBe("initial");

        target.data = { name: "updated" };
        expect(lastValue).toBe("updated");
    });
});
