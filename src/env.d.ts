interface ImportMetaEnv {
	/** Set to "true" by Storybook's Vite builder. */
	readonly STORYBOOK?: string;
}

interface ImportMeta {
	readonly env: ImportMetaEnv;
}

declare module "*as=picture" {
	const picture: import("#/components/primitives/Image/Image").Picture;
	export default picture;
}
