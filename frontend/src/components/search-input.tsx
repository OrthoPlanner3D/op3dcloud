import { ArrowRightIcon, SearchIcon } from "lucide-react";
import { useId } from "react";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

interface SearchInputProps {
	onSearch: (query: string) => void;
	placeholder?: string;
	className?: string;
	value?: string;
	disabled?: boolean;
}

export default function SearchInput({
	onSearch,
	placeholder = "Buscar...",
	className = "",
	value = "",
	disabled = false,
}: SearchInputProps) {
	const id = useId();

	const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
		onSearch(e.target.value);
	};

	const handleSubmit = (e: React.FormEvent) => {
		e.preventDefault();
		const formData = new FormData(e.target as HTMLFormElement);
		const query = formData.get("search") as string;
		onSearch(query);
	};

	return (
		<form
			onSubmit={handleSubmit}
			className={`*:not-first:mt-2 ${className}`}
		>
			<Label htmlFor={id} className="sr-only">
				Search input with icon and button
			</Label>
			<div className="relative">
				<Input
					id={id}
					name="search"
					className="peer ps-9 pe-9"
					placeholder={placeholder}
					type="search"
					value={value}
					onChange={handleInputChange}
					disabled={disabled}
				/>
				<div className="text-muted-foreground/80 pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 peer-disabled:opacity-50">
					<SearchIcon size={16} />
				</div>
				<button
					className="text-muted-foreground/80 hover:text-foreground focus-visible:border-ring focus-visible:ring-ring/50 absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md transition-[color,box-shadow] outline-none focus:z-10 focus-visible:ring-[3px] disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
					aria-label="Submit search"
					type="submit"
					disabled={disabled}
				>
					<ArrowRightIcon size={16} aria-hidden="true" />
				</button>
			</div>
		</form>
	);
}
