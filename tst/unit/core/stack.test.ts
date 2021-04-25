import { Stack } from "src/core/stack";

test("new stack is sized correctly", () => {
	const stack = new Stack(10);
	expect(stack.size()).toBe(10);
});