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
        example-preview example-clean ci all

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
