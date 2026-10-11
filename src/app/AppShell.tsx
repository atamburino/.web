import { Link, Outlet } from "@tanstack/react-router";
import { ThemeToggle } from "@/shared/theme";

export function AppShell() {
	return (
		<div className="min-h-dvh">
			<header className="border-b">
				<nav className="mx-auto flex max-w-4xl items-center gap-6 px-6 py-3">
					<Link to="/" className="font-semibold">
						Web Template
					</Link>
					<div className="ml-auto">
						<ThemeToggle />
					</div>
				</nav>
			</header>
			<main className="mx-auto max-w-4xl px-6 py-10">
				<Outlet />
			</main>
		</div>
	);
}
