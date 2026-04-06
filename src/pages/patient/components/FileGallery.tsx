import { ExternalLink, File, FileText, ImageIcon } from "lucide-react";
import { useEffect, useState } from "react";
import {
	Dialog,
	DialogContent,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import { Skeleton } from "@/components/ui/skeleton";
import { getSignedUrl } from "@/services/supabase/storage.service";

const IMAGE_EXTS = new Set(["jpg", "jpeg", "png", "gif", "webp", "bmp", "svg"]);

function getFileType(path: string): "image" | "pdf" | "other" {
	const ext = path.split(".").pop()?.toLowerCase() ?? "";
	if (IMAGE_EXTS.has(ext)) return "image";
	if (ext === "pdf") return "pdf";
	return "other";
}

function getFileName(path: string): string {
	return path.split("/").pop() ?? path;
}

interface FileGalleryProps {
	label: string;
	paths: string[];
}

export function FileGallery({ label, paths }: FileGalleryProps) {
	const [urls, setUrls] = useState<Record<string, string>>({});
	const [loading, setLoading] = useState(false);
	const [selected, setSelected] = useState<string | null>(null);

	useEffect(() => {
		if (paths.length === 0) return;
		setLoading(true);
		Promise.all(
			paths.map(async (path) => {
				const url = await getSignedUrl(path);
				return [path, url] as const;
			}),
		)
			.then((entries) => setUrls(Object.fromEntries(entries)))
			.catch(console.error)
			.finally(() => setLoading(false));
	}, [paths]);

	if (paths.length === 0) return null;

	const selectedUrl = selected ? urls[selected] : null;
	const selectedType = selected ? getFileType(selected) : null;
	const selectedName = selected ? getFileName(selected) : null;

	return (
		<div>
			<h4 className="font-medium text-sm text-muted-foreground mb-3">
				{label}
			</h4>

			<div
				style={{
					display: "grid",
					gridTemplateColumns:
						"repeat(auto-fill, minmax(160px, 1fr))",
					gap: "12px",
				}}
			>
				{loading
					? paths.map((path) => (
							<Skeleton
								key={path}
								style={{ height: 200, borderRadius: 12 }}
							/>
						))
					: paths.map((path) => {
							const url = urls[path];
							const type = getFileType(path);
							const name = getFileName(path);

							return (
								<div
									key={path}
									role="button"
									tabIndex={0}
									onClick={() => setSelected(path)}
									onKeyDown={(e) =>
										e.key === "Enter" && setSelected(path)
									}
									style={{
										display: "flex",
										flexDirection: "column",
										height: 200,
										borderRadius: 12,
										border: "1px solid hsl(var(--border))",
										background: "hsl(var(--card))",
										overflow: "hidden",
										cursor: "pointer",
										boxShadow:
											"0 1px 3px 0 rgb(0 0 0 / 0.1)",
										transition:
											"box-shadow 0.15s, transform 0.15s",
									}}
									onMouseEnter={(e) => {
										e.currentTarget.style.boxShadow =
											"0 4px 12px 0 rgb(0 0 0 / 0.15)";
										e.currentTarget.style.transform =
											"translateY(-2px)";
									}}
									onMouseLeave={(e) => {
										e.currentTarget.style.boxShadow =
											"0 1px 3px 0 rgb(0 0 0 / 0.1)";
										e.currentTarget.style.transform =
											"translateY(0)";
									}}
								>
									{/* Header */}
									<div
										style={{
											display: "flex",
											alignItems: "center",
											gap: 6,
											padding: "8px 10px",
											borderBottom:
												"1px solid hsl(var(--border))",
											flexShrink: 0,
										}}
									>
										{type === "pdf" ? (
											<span
												style={{
													background: "#e53935",
													color: "#fff",
													fontSize: 9,
													fontWeight: 700,
													padding: "1px 4px",
													borderRadius: 3,
													letterSpacing: 0.5,
													flexShrink: 0,
												}}
											>
												PDF
											</span>
										) : type === "image" ? (
											<ImageIcon
												style={{
													width: 14,
													height: 14,
													color: "hsl(var(--primary))",
													flexShrink: 0,
												}}
											/>
										) : (
											<File
												style={{
													width: 14,
													height: 14,
													color: "hsl(var(--muted-foreground))",
													flexShrink: 0,
												}}
											/>
										)}
										<span
											style={{
												fontSize: 11,
												fontWeight: 500,
												overflow: "hidden",
												textOverflow: "ellipsis",
												whiteSpace: "nowrap",
												color: "hsl(var(--foreground))",
												flex: 1,
											}}
										>
											{name}
										</span>
									</div>

									{/* Preview */}
									<div
										style={{
											flex: 1,
											overflow: "hidden",
											position: "relative",
											background:
												"hsl(var(--muted) / 0.3)",
										}}
									>
										{type === "image" && url ? (
											<img
												src={url}
												alt={name}
												style={{
													width: "100%",
													height: "100%",
													objectFit: "cover",
													display: "block",
												}}
											/>
										) : type === "pdf" && url ? (
											<iframe
												src={`${url}#toolbar=0&navpanes=0&scrollbar=0&view=FitH`}
												title={name}
												style={{
													width: "250%",
													height: "250%",
													transform: "scale(0.4)",
													transformOrigin: "top left",
													border: "none",
													pointerEvents: "none",
													display: "block",
												}}
											/>
										) : (
											<div
												style={{
													width: "100%",
													height: "100%",
													display: "flex",
													flexDirection: "column",
													alignItems: "center",
													justifyContent: "center",
													gap: 8,
												}}
											>
												<FileText
													style={{
														width: 32,
														height: 32,
														color: "hsl(var(--muted-foreground))",
													}}
												/>
											</div>
										)}
									</div>
								</div>
							);
						})}
			</div>

			<Dialog
				open={selected !== null}
				onOpenChange={(open) => !open && setSelected(null)}
			>
				<DialogContent className="max-w-4xl w-full p-4">
					<DialogHeader>
						<DialogTitle className="flex items-center justify-between pr-8">
							<span className="truncate text-sm font-medium">
								{selectedName}
							</span>
							{selectedUrl && (
								<a
									href={selectedUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="inline-flex items-center gap-1 text-xs text-muted-foreground hover:text-foreground shrink-0 ml-2"
								>
									<ExternalLink className="h-3.5 w-3.5" />
									Abrir
								</a>
							)}
						</DialogTitle>
					</DialogHeader>

					<div className="mt-2">
						{selectedType === "image" && selectedUrl && (
							<img
								src={selectedUrl}
								alt={selectedName ?? ""}
								className="w-full max-h-[75vh] object-contain rounded-md"
							/>
						)}
						{selectedType === "pdf" && selectedUrl && (
							<object
								data={selectedUrl}
								type="application/pdf"
								className="w-full rounded-md"
								style={{ height: "75vh" }}
							>
								<div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
									<FileText className="h-10 w-10" />
									<p className="text-sm">
										No se puede previsualizar el PDF.{" "}
										<a
											href={selectedUrl}
											target="_blank"
											rel="noopener noreferrer"
											className="text-primary underline"
										>
											Abrir en nueva pestaña
										</a>
									</p>
								</div>
							</object>
						)}
						{selectedType === "other" && selectedUrl && (
							<div className="flex flex-col items-center justify-center h-48 gap-3 text-muted-foreground">
								<File className="h-10 w-10" />
								<a
									href={selectedUrl}
									target="_blank"
									rel="noopener noreferrer"
									className="text-sm text-primary underline"
								>
									Descargar archivo
								</a>
							</div>
						)}
					</div>
				</DialogContent>
			</Dialog>
		</div>
	);
}
