import { LegalDocument } from "#/components/patterns/LegalDocument/LegalDocument";
import type { Legal } from "#/content/api";

export function LegalPage({ document }: { document: Legal }) {
	return <LegalDocument document={document} />;
}
