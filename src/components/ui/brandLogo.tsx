import logo from "@/assets/images/logos/logo-black.png";

interface Props {
	className?: string;
}

export default function BrandLogo({ className }: Props) {
	return (
		<div className="flex items-center gap-2">
			<img src={logo} alt="OrthoPlanner3D" className={className} />
		</div>
	);
}
