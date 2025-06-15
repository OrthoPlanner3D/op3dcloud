interface Props {
	children: React.ReactNode;
}

export default function PrivateLayout({ children }: Props) {
	return <div className="bg-red-300">{children}</div>;
}
