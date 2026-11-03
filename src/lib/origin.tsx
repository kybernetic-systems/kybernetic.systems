import { useRouter } from "@tanstack/react-router";
import { createContext, useContext } from "react";

/**
 * The origin links resolve against. The router's own origin is already correct in the browser and
 * on the development server, where every render answers a real request. A production build renders
 * its pages in the prerenderer, which serves from a throwaway origin that must never reach the
 * HTML, so the root supplies the published origin of the page being rendered instead.
 */
const PublicOrigin = createContext<string | undefined>(undefined);

export const PublicOriginProvider = PublicOrigin.Provider;

export function usePublicOrigin(): string {
	const router = useRouter();
	return useContext(PublicOrigin) ?? router.origin;
}
