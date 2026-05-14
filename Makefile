# =============================================================================
# Page Studio — monorepo Makefile
# =============================================================================
# One control plane for the four packages and the showcase example. Run
# `make` (or `make help`) to see every target.
#
# Common day-to-day:
#   make install         install workspace deps
#   make build           build the four publishable packages
#   make dev             build packages + run the showcase dev server
#   make test            run the package test suites
#   make clean           wipe dist/ and node_modules/ everywhere
# =============================================================================

SHELL          := /bin/bash
.SHELLFLAGS    := -eu -o pipefail -c
.DEFAULT_GOAL  := help

# Colours
CYAN   := \033[0;36m
GREEN  := \033[0;32m
YELLOW := \033[0;33m
BOLD   := \033[1m
RESET  := \033[0m

# Where the showcase lives.
EXAMPLE_DIR := examples/showcase

.PHONY: help install build build-packages rebuild dev test test-watch lint \
        clean clean-dist example example-install example-dev example-build \
        example-preview example-clean ci all \
        publish publish-check publish-dry-run \
        publish-blocks publish-renderer publish-editor publish-form

help: ## Show this help
	@printf "$(BOLD)$(CYAN)Page Studio — Make targets$(RESET)\n\n"
	@grep -hE '^[a-zA-Z_-]+:.*?## ' $(MAKEFILE_LIST) \
		| awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-20s$(RESET) %s\n", $$1, $$2}'
	@printf "\nRun $(BOLD)$(YELLOW)make <target>$(RESET) to execute. Quick start: $(BOLD)make install && make dev$(RESET)\n"

# --- Workspace -------------------------------------------------------------

install: ## Install all workspace deps (root + packages + example)
	@printf "$(CYAN)→ pnpm install$(RESET)\n"
	@pnpm install

# --- Packages --------------------------------------------------------------

build: build-packages ## Build the four publishable packages (alias)

build-packages: ## tsup-build packages/{editor,blocks,renderer,form}
	@printf "$(CYAN)→ Building @techrox/page-studio-* packages…$(RESET)\n"
	@pnpm -r --filter "./packages/*" run build
	@printf "$(GREEN)✓ Packages built.$(RESET)\n"

rebuild: clean-dist build ## Clean dist/ then rebuild every package

test: ## Run unit tests across every package (vitest)
	@pnpm -r --filter "./packages/*" run test

test-watch: ## Watch tests across every package
	@pnpm -r --filter "./packages/*" run test:watch

lint: ## ESLint over packages/*/src
	@pnpm run lint

# --- Example (showcase) ----------------------------------------------------

example: example-dev ## Run the showcase (alias for example-dev)

example-install: install build-packages ## Workspace install + build packages so the showcase resolves dist/

example-dev: ## Run the showcase Vite dev server (http://localhost:5173)
	@printf "$(CYAN)→ Starting showcase on http://localhost:5173 …$(RESET)\n"
	@$(MAKE) -C $(EXAMPLE_DIR) dev

example-build: ## Production build of the showcase (outputs to $(EXAMPLE_DIR)/dist)
	@$(MAKE) -C $(EXAMPLE_DIR) build

example-preview: ## Preview the showcase production build
	@$(MAKE) -C $(EXAMPLE_DIR) preview

example-clean: ## Remove dist/ + node_modules/ inside the showcase
	@$(MAKE) -C $(EXAMPLE_DIR) clean

# --- Convenience -----------------------------------------------------------

dev: build-packages example-dev ## Build packages then run the showcase dev server

ci: install build test ## Full check used in CI: install + build + test

all: install build test ## Same as `make ci`

clean: ## Remove dist/ and node_modules/ everywhere
	@printf "$(CYAN)→ Cleaning dist/ + node_modules/ across the monorepo…$(RESET)\n"
	@pnpm -r exec rm -rf dist node_modules
	@rm -rf node_modules
	@printf "$(GREEN)✓ Clean.$(RESET)\n"

clean-dist: ## Remove just dist/ across every package (keeps node_modules)
	@pnpm -r --filter "./packages/*" exec rm -rf dist
	@printf "$(GREEN)✓ dist/ wiped across packages.$(RESET)\n"

# --- Publish ---------------------------------------------------------------
# npm publishes are IRREVERSIBLE: a version number can never be reused on
# the same package name, even after `npm unpublish`. Per-package targets
# below let you publish one at a time without prompts. The aggregate
# `publish` target confirms first.
#
# Order matters: dependents follow what they depend on so the registry
# never serves a package whose internal peer hasn't been published yet.
#   blocks      → no internal deps
#   renderer    → peers @techrox/page-studio-blocks
#   editor      → peers @techrox/page-studio-blocks
#   form        → no internal deps
#
# `--no-git-checks` skips pnpm's "must be on main, clean tree" guard.
# Each package's prepublishOnly runs `pnpm run build`, so dist/ is fresh.
#
# 2FA: if your npm account requires OTP on publish, pass it inline:
#   make publish-blocks OTP=123456
#   make publish OTP=123456    # one code reused for all four (codes typically
#                                live 30s — fine for a sequential publish)
# Or set up a granular access token with "Bypass 2FA for publish" and skip OTP.

publish-check: ## Verify npm login + techrox org membership before publishing
	@printf "$(CYAN)→ Checking npm auth…$(RESET)\n"
	@npm whoami
	@printf "$(CYAN)→ techrox org members:$(RESET)\n"
	@npm org ls techrox

publish-dry-run: build-packages ## Dry-run publish of all four packages (no upload)
	@printf "$(CYAN)→ Dry-run publish: blocks$(RESET)\n"
	@pnpm --filter @techrox/page-studio-blocks publish --dry-run --no-git-checks
	@printf "$(CYAN)→ Dry-run publish: renderer$(RESET)\n"
	@pnpm --filter @techrox/page-studio-renderer publish --dry-run --no-git-checks
	@printf "$(CYAN)→ Dry-run publish: editor$(RESET)\n"
	@pnpm --filter @techrox/page-studio publish --dry-run --no-git-checks
	@printf "$(CYAN)→ Dry-run publish: form$(RESET)\n"
	@pnpm --filter @techrox/page-studio-form publish --dry-run --no-git-checks
	@printf "$(GREEN)✓ All four packages would publish cleanly.$(RESET)\n"

publish-blocks: ## Publish @techrox/page-studio-blocks to npm
	@printf "$(CYAN)→ Publishing @techrox/page-studio-blocks…$(RESET)\n"
	@pnpm --filter @techrox/page-studio-blocks publish --no-git-checks --access public $(if $(OTP),--otp=$(OTP))
	@printf "$(GREEN)✓ blocks published.$(RESET)\n"

publish-renderer: ## Publish @techrox/page-studio-renderer to npm
	@printf "$(CYAN)→ Publishing @techrox/page-studio-renderer…$(RESET)\n"
	@pnpm --filter @techrox/page-studio-renderer publish --no-git-checks --access public $(if $(OTP),--otp=$(OTP))
	@printf "$(GREEN)✓ renderer published.$(RESET)\n"

publish-editor: ## Publish @techrox/page-studio to npm
	@printf "$(CYAN)→ Publishing @techrox/page-studio…$(RESET)\n"
	@pnpm --filter @techrox/page-studio publish --no-git-checks --access public $(if $(OTP),--otp=$(OTP))
	@printf "$(GREEN)✓ editor published.$(RESET)\n"

publish-form: ## Publish @techrox/page-studio-form to npm
	@printf "$(CYAN)→ Publishing @techrox/page-studio-form…$(RESET)\n"
	@pnpm --filter @techrox/page-studio-form publish --no-git-checks --access public $(if $(OTP),--otp=$(OTP))
	@printf "$(GREEN)✓ form published.$(RESET)\n"

publish: publish-check ## Publish all four packages to npm (prompts — irreversible)
	@printf "\n$(YELLOW)$(BOLD)⚠  About to publish to npm (irreversible):$(RESET)\n"
	@printf "    @techrox/page-studio-blocks@1.0.0\n"
	@printf "    @techrox/page-studio-renderer@1.0.0\n"
	@printf "    @techrox/page-studio@1.0.0\n"
	@printf "    @techrox/page-studio-form@1.0.0\n\n"
	@printf "$(YELLOW)Type 'publish' to continue: $(RESET)" && read ans && [ "$$ans" = "publish" ] || (printf "$(YELLOW)Aborted.$(RESET)\n" && exit 1)
	@$(MAKE) publish-blocks
	@$(MAKE) publish-renderer
	@$(MAKE) publish-editor
	@$(MAKE) publish-form
	@printf "\n$(GREEN)$(BOLD)✓ All four packages published.$(RESET)\n"
	@printf "  https://www.npmjs.com/package/@techrox/page-studio-blocks\n"
	@printf "  https://www.npmjs.com/package/@techrox/page-studio-renderer\n"
	@printf "  https://www.npmjs.com/package/@techrox/page-studio\n"
	@printf "  https://www.npmjs.com/package/@techrox/page-studio-form\n"
