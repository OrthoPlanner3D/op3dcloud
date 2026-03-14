import { FileIcon, Upload, X } from "lucide-react";
import { useRef } from "react";
import { Button } from "./button";

interface FileUploadProps {
	files: File[];
	onFilesChange: (files: File[]) => void;
	accept?: string;
	multiple?: boolean;
	disabled?: boolean;
}

export function FileUpload({
	files,
	onFilesChange,
	accept,
	multiple = true,
	disabled = false,
}: FileUploadProps) {
	const inputRef = useRef<HTMLInputElement>(null);

	function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
		const selected = e.target.files;
		if (!selected) return;
		onFilesChange([...files, ...Array.from(selected)]);
		if (inputRef.current) inputRef.current.value = "";
	}

	function handleRemove(index: number) {
		onFilesChange(files.filter((_, i) => i !== index));
	}

	return (
		<div className="space-y-2">
			<Button
				type="button"
				variant="outline"
				className="w-full"
				disabled={disabled}
				onClick={() => inputRef.current?.click()}
			>
				<Upload className="mr-2 size-4" />
				Seleccionar archivos
			</Button>
			<input
				ref={inputRef}
				type="file"
				className="hidden"
				accept={accept}
				multiple={multiple}
				onChange={handleInputChange}
			/>
			{files.length > 0 && (
				<ul className="space-y-1">
					{files.map((file, index) => (
						<li
							key={`${file.name}-${index}`}
							className="flex items-center justify-between rounded-md border px-3 py-2 text-sm"
						>
							<span className="flex items-center gap-2 truncate">
								<FileIcon className="size-4 shrink-0" />
								<span className="truncate">{file.name}</span>
							</span>
							<Button
								type="button"
								variant="ghost"
								size="icon"
								className="size-6 shrink-0"
								disabled={disabled}
								onClick={() => handleRemove(index)}
							>
								<X className="size-3" />
							</Button>
						</li>
					))}
				</ul>
			)}
		</div>
	);
}
