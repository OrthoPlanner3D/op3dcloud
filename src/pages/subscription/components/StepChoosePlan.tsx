import { CheckIcon, MinusIcon, SparklesIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Skeleton } from "@/components/ui/skeleton";
import { usePlans } from "@/hooks/swr/usePlans";
import { cn } from "@/lib/utils";
import {
	buildPlans,
	COMMON_INCLUSIONS,
	formatUsd,
	MASTER_FEATURES,
	type Plan,
} from "../plans.data";

interface StepChoosePlanProps {
	onChoose: (plan: Plan) => void;
}

/** Precio grande con centavos chicos, reutilizado en tarjeta y banner. */
function PriceTag({
	value,
	highlighted = false,
}: {
	value: number;
	highlighted?: boolean;
}) {
	const [whole, cents] = formatUsd(value).replace("USD ", "").split(",");
	return (
		<span className="flex items-baseline gap-1">
			<span
				className={cn(
					"text-sm",
					highlighted
						? "text-background/70"
						: "text-muted-foreground",
				)}
			>
				USD
			</span>
			<span className="text-4xl font-bold tracking-tight tabular-nums">
				{whole}
			</span>
			<span
				className={cn(
					"text-base font-medium",
					highlighted
						? "text-background/70"
						: "text-muted-foreground",
				)}
			>
				,{cents}
			</span>
			<span
				className={cn(
					"text-sm",
					highlighted
						? "text-background/70"
						: "text-muted-foreground",
				)}
			>
				/ crédito
			</span>
		</span>
	);
}

function PlanCard({
	plan,
	regularPricePerCredit,
	onChoose,
}: {
	plan: Plan;
	regularPricePerCredit: number;
	onChoose: (plan: Plan) => void;
}) {
	const highlighted = Boolean(plan.label);

	return (
		<div
			className={cn(
				"relative flex flex-col rounded-2xl border p-6 transition-all duration-200",
				highlighted
					? "bg-foreground text-background border-foreground shadow-xl md:-translate-y-2"
					: "bg-card text-card-foreground border-border hover:-translate-y-1 hover:shadow-lg",
			)}
		>
			{highlighted && (
				<Badge className="bg-primary text-primary-foreground absolute -top-3 left-1/2 -translate-x-1/2 gap-1 px-3 py-1">
					<SparklesIcon className="size-3" />
					Oferta especial · {plan.label}
				</Badge>
			)}

			{/* Header */}
			<div className="flex items-start justify-between gap-2">
				<div>
					<h3 className="text-xl font-bold">{plan.name}</h3>
					<p
						className={cn(
							"mt-1 text-sm",
							highlighted
								? "text-background/70"
								: "text-muted-foreground",
						)}
					>
						{plan.concept}
					</p>
				</div>
				{plan.savingPercent != null && (
					<Badge
						variant="secondary"
						className={cn(
							"shrink-0",
							highlighted && "bg-background/15 text-background",
						)}
					>
						{plan.savingPercent}% OFF
					</Badge>
				)}
			</div>

			{/* Precio */}
			<div className="mt-5 min-h-20">
				{plan.savingPercent != null && (
					<p
						className={cn(
							"text-sm line-through",
							highlighted
								? "text-background/50"
								: "text-muted-foreground",
						)}
					>
						{formatUsd(regularPricePerCredit)}
					</p>
				)}
				<PriceTag
					value={plan.pricePerCredit}
					highlighted={highlighted}
				/>
				<p
					className={cn(
						"mt-1 text-sm font-semibold",
						highlighted ? "text-background" : "text-foreground",
					)}
				>
					{plan.total != null && `Total: ${formatUsd(plan.total)}`}
				</p>
			</div>

			{/* CTA */}
			<Button
				type="button"
				className={cn(
					"mt-4 w-full",
					highlighted &&
						"bg-background text-foreground hover:bg-background/90",
				)}
				variant={highlighted ? "default" : "outline"}
				onClick={() => onChoose(plan)}
			>
				{plan.cta}
			</Button>

			<p
				className={cn(
					"mt-3 text-center text-xs",
					highlighted
						? "text-background/60"
						: "text-muted-foreground",
				)}
			>
				{plan.credits != null &&
					`${plan.credits} ${plan.credits === 1 ? "crédito" : "créditos"} · vigencia 12 meses`}
			</p>

			<Separator
				className={cn("my-5", highlighted && "bg-background/20")}
			/>

			{/* Ahorro destacado */}
			{plan.savingAmount != null ? (
				<p
					className={cn(
						"mb-3 text-sm font-semibold",
						highlighted ? "text-background" : "text-primary",
					)}
				>
					Ahorrás {formatUsd(plan.savingAmount)}
				</p>
			) : (
				<p
					className={cn(
						"mb-3 text-sm",
						highlighted
							? "text-background/70"
							: "text-muted-foreground",
					)}
				>
					{plan.description}
				</p>
			)}

			{/* Matriz de features */}
			<ul className="space-y-2.5">
				{MASTER_FEATURES.map((feature) => {
					const included = plan.benefits.includes(feature);
					return (
						<li
							key={feature}
							className={cn(
								"flex items-start gap-2 text-sm",
								!included &&
									(highlighted
										? "text-background/40"
										: "text-muted-foreground/60"),
							)}
						>
							{included ? (
								<CheckIcon
									className={cn(
										"mt-0.5 size-4 shrink-0",
										highlighted
											? "text-background"
											: "text-primary",
									)}
								/>
							) : (
								<MinusIcon className="mt-0.5 size-4 shrink-0 opacity-50" />
							)}
							<span>{feature}</span>
						</li>
					);
				})}
			</ul>
		</div>
	);
}

function PartnerBanner({
	plan,
	onChoose,
}: {
	plan: Plan;
	onChoose: (plan: Plan) => void;
}) {
	return (
		<div className="from-primary/5 flex flex-col gap-6 rounded-2xl border bg-gradient-to-br to-transparent p-8 md:flex-row md:items-center md:justify-between">
			<div className="max-w-md space-y-2">
				<div className="flex items-center gap-2">
					<h3 className="text-2xl font-bold">{plan.name}</h3>
					<Badge variant="outline">{plan.concept}</Badge>
				</div>
				<p className="text-muted-foreground text-sm">
					{plan.description}
				</p>
				<p className="text-sm">
					<span className="text-muted-foreground">Desde </span>
					<span className="text-lg font-bold">
						{formatUsd(plan.pricePerCredit)}
					</span>
					<span className="text-muted-foreground"> / crédito</span>
				</p>
			</div>

			<div className="space-y-4">
				<ul className="grid gap-2 sm:grid-cols-2">
					{plan.benefits.map((benefit) => (
						<li
							key={benefit}
							className="flex items-start gap-2 text-sm"
						>
							<CheckIcon className="text-primary mt-0.5 size-4 shrink-0" />
							<span>{benefit}</span>
						</li>
					))}
				</ul>
				<Button
					type="button"
					size="lg"
					className="w-full md:w-auto"
					onClick={() => onChoose(plan)}
				>
					{plan.cta}
				</Button>
			</div>
		</div>
	);
}

export default function StepChoosePlan({ onChoose }: StepChoosePlanProps) {
	const { plans: rows, isLoading } = usePlans();
	const plans = buildPlans(rows);

	const creditPlans = plans.filter((plan) => !plan.custom);
	const partnerPlan = plans.find((plan) => plan.custom);
	const regularPricePerCredit =
		plans.find((plan) => plan.key === "case")?.pricePerCredit ?? 0;

	return (
		<div className="space-y-10">
			<div className="space-y-5 text-center">
				<div>
					<h2 className="text-foreground text-3xl font-bold">
						Elegí tu plan
					</h2>
					<p className="text-muted-foreground mt-2">
						Créditos prepagos · 1 crédito = 1 caso habilitado ·
						compra única
					</p>
				</div>

				<div className="bg-muted/30 mx-auto max-w-3xl rounded-xl border p-5 text-left">
					<p className="text-foreground mb-3 text-center text-sm font-semibold">
						Todos los planes incluyen
					</p>
					<ul className="grid gap-x-6 gap-y-2 sm:grid-cols-2">
						{COMMON_INCLUSIONS.map((item) => (
							<li
								key={item}
								className="text-muted-foreground flex items-start gap-2 text-sm"
							>
								<CheckIcon className="text-primary mt-0.5 size-4 shrink-0" />
								<span>{item}</span>
							</li>
						))}
					</ul>
				</div>
			</div>

			<div className="grid grid-cols-1 gap-5 pt-3 md:grid-cols-2 xl:grid-cols-4">
				{isLoading && rows.length === 0
					? Array.from({ length: 4 }).map((_, i) => (
							<Skeleton
								// biome-ignore lint/suspicious/noArrayIndexKey: placeholders fijos
								key={i}
								className="h-[520px] rounded-2xl"
							/>
						))
					: creditPlans.map((plan) => (
							<PlanCard
								key={plan.key}
								plan={plan}
								regularPricePerCredit={regularPricePerCredit}
								onChoose={onChoose}
							/>
						))}
			</div>

			{partnerPlan && (
				<PartnerBanner plan={partnerPlan} onChoose={onChoose} />
			)}
		</div>
	);
}
