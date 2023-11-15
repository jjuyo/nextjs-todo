"use client"; //컴포넌트가 2개 있음 server, use

import { useState } from "react";
import { Button } from "@nextui-org/button";

export const Counter = ({initialCount, children}:
	{initialCount : number, children : React.ReactNode}) => {
	const [count, setCount] = useState(initialCount);
	return (
	<>
		<Button radius="full" onPress={() => setCount(count + 1)}>
			Count is {count}
		</Button>
		{children}
	</>
	);
};
