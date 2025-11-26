import { Check, ChevronsUpDown, Search, X } from "lucide-react";
import * as React from "react";
import { useRef, useEffect } from "react";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export interface SearchableSelectOption {
	value: string;
	label: string;
}

interface SearchableSelectProps {
	options: SearchableSelectOption[];
	value?: string;
	onValueChange?: (value: string) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	disabled?: boolean;
	className?: string;
}

export function SearchableSelect({
	options,
	value,
	onValueChange,
	placeholder = "Seleccionar...",
	searchPlaceholder = "Buscar...",
	emptyMessage = "No se encontraron resultados.",
	disabled = false,
	className,
}: SearchableSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const containerRef = useRef<HTMLDivElement>(null);

	const selectedOption = options.find((option) => option.value === value);

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(search.toLowerCase()),
	);

	// Close on click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	return (
		<div ref={containerRef} className="relative w-full">
			<Button
				type="button"
				variant="outline"
				role="combobox"
				aria-expanded={open}
				className={cn(
					"w-full justify-between font-normal",
					!value && "text-muted-foreground",
					className,
				)}
				disabled={disabled}
				onClick={() => setOpen(!open)}
			>
				{selectedOption?.label || placeholder}
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>

			{open && (
				<div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
					<div className="flex items-center border-b px-3">
						<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
						<input
							className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
							placeholder={searchPlaceholder}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							autoFocus
						/>
					</div>
					<div className="max-h-[200px] overflow-y-auto p-1">
						{filteredOptions.length === 0 ? (
							<div className="py-4 text-center text-sm text-muted-foreground">
								{emptyMessage}
							</div>
						) : (
							filteredOptions.map((option) => (
								<div
									key={option.value}
									className={cn(
										"relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
										value === option.value &&
											"bg-accent text-accent-foreground",
									)}
									onClick={() => {
										onValueChange?.(option.value);
										setOpen(false);
										setSearch("");
									}}
								>
									<Check
										className={cn(
											"mr-2 h-4 w-4",
											value === option.value
												? "opacity-100"
												: "opacity-0",
										)}
									/>
									{option.label}
								</div>
							))
						)}
					</div>
				</div>
			)}
		</div>
	);
}

interface SearchableMultiSelectProps {
	options: SearchableSelectOption[];
	values: string[];
	onValuesChange?: (values: string[]) => void;
	placeholder?: string;
	searchPlaceholder?: string;
	emptyMessage?: string;
	disabled?: boolean;
	className?: string;
}

export function SearchableMultiSelect({
	options,
	values = [],
	onValuesChange,
	placeholder = "Seleccionar...",
	searchPlaceholder = "Buscar...",
	emptyMessage = "No se encontraron resultados.",
	disabled = false,
	className,
}: SearchableMultiSelectProps) {
	const [open, setOpen] = React.useState(false);
	const [search, setSearch] = React.useState("");
	const containerRef = useRef<HTMLDivElement>(null);

	const selectedCount = values.length;

	const filteredOptions = options.filter((option) =>
		option.label.toLowerCase().includes(search.toLowerCase()),
	);

	// Close on click outside
	useEffect(() => {
		const handleClickOutside = (event: MouseEvent) => {
			if (
				containerRef.current &&
				!containerRef.current.contains(event.target as Node)
			) {
				setOpen(false);
			}
		};

		if (open) {
			document.addEventListener("mousedown", handleClickOutside);
		}

		return () => {
			document.removeEventListener("mousedown", handleClickOutside);
		};
	}, [open]);

	const toggleOption = (optionValue: string) => {
		const newValues = values.includes(optionValue)
			? values.filter((v) => v !== optionValue)
			: [...values, optionValue];
		onValuesChange?.(newValues);
	};

	return (
		<div ref={containerRef} className="relative w-full">
			<Button
				type="button"
				variant="outline"
				role="combobox"
				aria-expanded={open}
				className={cn(
					"w-full justify-between font-normal",
					!selectedCount && "text-muted-foreground",
					className,
				)}
				disabled={disabled}
				onClick={() => setOpen(!open)}
			>
				{selectedCount > 0
					? `${selectedCount} seleccionado${selectedCount > 1 ? "s" : ""}`
					: placeholder}
				<ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
			</Button>

			{open && (
				<div className="absolute z-50 mt-1 w-full rounded-md border bg-popover text-popover-foreground shadow-md">
					<div className="flex items-center border-b px-3">
						<Search className="mr-2 h-4 w-4 shrink-0 opacity-50" />
						<input
							className="flex h-10 w-full bg-transparent py-3 text-sm outline-none placeholder:text-muted-foreground"
							placeholder={searchPlaceholder}
							value={search}
							onChange={(e) => setSearch(e.target.value)}
							autoFocus
						/>
						{selectedCount > 0 && (
							<button
								type="button"
								className="ml-2 rounded p-1 hover:bg-accent"
								onClick={() => onValuesChange?.([])}
								title="Limpiar selección"
							>
								<X className="h-4 w-4 opacity-50" />
							</button>
						)}
					</div>
					<div className="max-h-[200px] overflow-y-auto p-1">
						{filteredOptions.length === 0 ? (
							<div className="py-4 text-center text-sm text-muted-foreground">
								{emptyMessage}
							</div>
						) : (
							filteredOptions.map((option) => {
								const isSelected = values.includes(option.value);
								return (
									<div
										key={option.value}
										className={cn(
											"relative flex cursor-pointer select-none items-center rounded-sm px-2 py-1.5 text-sm hover:bg-accent hover:text-accent-foreground",
											isSelected && "bg-accent text-accent-foreground",
										)}
										onClick={() => toggleOption(option.value)}
									>
										<Check
											className={cn(
												"mr-2 h-4 w-4",
												isSelected ? "opacity-100" : "opacity-0",
											)}
										/>
										{option.label}
									</div>
								);
							})
						)}
					</div>
				</div>
			)}
		</div>
	);
}
