import * as React from "react";
import { Graphics } from "../core/graphics";
import { MonochromeDisplay } from "./display/MonochromeDisplay";
import { DISPLAY } from "../util/constants";

type Props = {
};

type State = {
};

export class Chip8App extends React.Component<Props, State>{
	private graphics: Graphics;

	public constructor(props: Props) {
		super(props);
		this.graphics = new Graphics(DISPLAY.WIDTH, DISPLAY.HEIGHT);
	}

	public render(): React.ReactNode {
		return (
			<MonochromeDisplay
				width={this.graphics.width}
				height={this.graphics.height}
				graphics={this.graphics.getRaw()}
			/>
		);
	}
}