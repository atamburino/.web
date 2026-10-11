import js from "@eslint/js";
import betterTailwind from "eslint-plugin-better-tailwindcss";
import jsxA11y from "eslint-plugin-jsx-a11y";
import reactHooks from "eslint-plugin-react-hooks";
import globals from "globals";
import { defineConfig } from "eslint/config";
import tseslint from "typescript-eslint";

const vendored = ["src/shared/ui/**", "src/shared/motion/bits/**"];

const restrictedImports = {
	patterns: [
		{ group: ["@/features/*/*"], message: "Import a feature through its index.ts." },
		{ group: ["@tanstack/react-query"], message: "RTK Query owns server data." },
		{
			group: ["@/shared/api/generated/*"],
			message: "Only a feature's api.ts and model.ts read generated code.",
		},
	],
};

const motionImports = {
	regex: "^(motion|gsap)(/.*)?$|^@/shared/motion/bits",
	message: "Import motion through @/shared/motion.",
};

export default defineConfig(
	{
		ignores: [
			"dist",
			"coverage",
			".vitest",
			"src/routeTree.gen.ts",
			"src/shared/api/generated",
			"public/mockServiceWorker.js",
		],
	},
	js.configs.recommended,
	...tseslint.configs.strictTypeChecked,
	{
		languageOptions: {
			globals: { ...globals.browser, ...globals.node },
			parserOptions: { projectService: true, tsconfigRootDir: import.meta.dirname },
		},
		rules: {
			"@typescript-eslint/consistent-type-assertions": ["error", { assertionStyle: "never" }],
			"@typescript-eslint/switch-exhaustiveness-check": "error",
			"@typescript-eslint/strict-boolean-expressions": "error",
			"@typescript-eslint/restrict-template-expressions": ["error", { allowNumber: true }],
			"@typescript-eslint/no-unused-vars": ["error", { varsIgnorePattern: "^_" }],
			"@typescript-eslint/no-confusing-void-expression": ["error", { ignoreArrowShorthand: true }],
			"@typescript-eslint/only-throw-error": [
				"error",
				{ allow: [{ from: "package", package: "@tanstack/router-core", name: "Redirect" }] },
			],
			"no-console": "error",
			"max-lines": ["warn", 200],
			"max-lines-per-function": ["warn", { max: 60, skipBlankLines: true }],
		},
	},
	{
		files: ["src/**/*.{ts,tsx}", "test/**/*.{ts,tsx}"],
		extends: [reactHooks.configs.flat["recommended-latest"], jsxA11y.flatConfigs.recommended],
		plugins: { "better-tailwindcss": betterTailwind },
		settings: { "better-tailwindcss": { entryPoint: "src/shared/styles/globals.css" } },
		rules: {
			...betterTailwind.configs["correctness-error"].rules,
			"no-restricted-imports": [
				"error",
				{ patterns: [...restrictedImports.patterns, motionImports] },
			],
			"no-restricted-syntax": [
				"error",
				{ selector: "JSXAttribute[name.name='style']", message: "Style with Tailwind classes." },
			],
			"better-tailwindcss/no-restricted-classes": [
				"error",
				{
					restrict: [
						{
							pattern: "\\[([^\\[\\]]*?)\\](?!:)",
							message: "No arbitrary values outside shared/ui.",
						},
						{
							pattern:
								"^(.*:)?(bg|text|border|ring|fill|stroke)-(slate|gray|zinc|neutral|stone|red|orange|amber|yellow|lime|green|emerald|teal|cyan|sky|blue|indigo|violet|purple|fuchsia|pink|rose)-\\d+(\\/\\d+)?$",
							message: "Use a semantic color token.",
						},
						{ pattern: "^(.*:)?duration-\\d+$", message: "Use transition-fast, -base, or -slow." },
					],
				},
			],
		},
	},
	{
		files: ["src/shared/motion/**"],
		rules: { "no-restricted-imports": ["error", restrictedImports], "no-restricted-syntax": "off" },
	},
	{
		files: [
			"src/features/*/api.ts",
			"src/features/*/model.ts",
			"src/fakeBff/**",
			"src/app/main.tsx",
		],
		rules: {
			"no-restricted-imports": [
				"error",
				{ patterns: [...restrictedImports.patterns.slice(0, 2), motionImports] },
			],
		},
	},
	{
		files: ["src/features/*/api.ts", "src/features/*/model.ts"],
		ignores: ["src/features/example/**"],
		rules: {
			"no-restricted-imports": [
				"error",
				{
					patterns: [
						...restrictedImports.patterns.slice(0, 2),
						motionImports,
						{
							group: ["@/shared/api/generated/sample", "@/shared/api/generated/sample/*"],
							message: "Point this feature at the real generated API.",
						},
					],
				},
			],
		},
	},
	{
		files: vendored,
		rules: {
			"@typescript-eslint/consistent-type-assertions": "off",
			"@typescript-eslint/strict-boolean-expressions": "off",
			"@typescript-eslint/no-unnecessary-condition": "off",
			"better-tailwindcss/no-restricted-classes": "off",
			"better-tailwindcss/no-unknown-classes": "off",
			"react-refresh/only-export-components": "off",
			"max-lines": "off",
			"max-lines-per-function": "off",
		},
	},
	{
		files: ["scripts/**"],
		rules: { "no-console": "off" },
	},
	{
		files: ["eslint.config.ts"],
		extends: [tseslint.configs.disableTypeChecked],
	},
	{
		files: ["**/*.test.{ts,tsx}"],
		rules: { "max-lines-per-function": "off" },
	},
);
