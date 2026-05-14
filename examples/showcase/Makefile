# =============================================================================
# Page Studio — Showcase example Makefile
# =============================================================================
# Run `make help` to see all available commands.
# =============================================================================

SHELL          := /bin/bash
.SHELLFLAGS    := -eu -o pipefail -c
.DEFAULT_GOAL  := help

# Monorepo root is one above examples/showcase.
ROOT_DIR       := $(realpath $(dir $(lastword $(MAKEFILE_LIST)))/../..)

# Colours
CYAN    := \033[0;36m
GREEN   := \033[0;32m
YELLOW  := \033[0;33m
BOLD    := \033[1m
RESET   := \033[0m

.PHONY: help install dev build preview clean

help: ## Show this help message
	@printf "$(BOLD)$(CYAN)Page Studio Showcase — Available Make Commands$(RESET)\n\n"
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "  $(GREEN)%-10s$(RESET) %s\n", $$1, $$2}'
	@printf "\nRun $(BOLD)$(YELLOW)make <command>$(RESET) to execute a command.\n"

install: ## Install workspace deps + build the four @techrox/page-studio-* packages
	@printf "$(CYAN)→ Installing monorepo deps at $(ROOT_DIR)…$(RESET)\n"
	@cd "$(ROOT_DIR)" && pnpm install
	@printf "$(CYAN)→ Building @techrox/page-studio-* packages so the example resolves dist/…$(RESET)\n"
	@cd "$(ROOT_DIR)" && pnpm -r --filter "./packages/*" run build
	@printf "$(GREEN)✓ Ready. Try: make dev$(RESET)\n"

dev: ## Run the Vite dev server (port 5174)
	@pnpm dev

build: ## Production build (outputs to dist/)
	@pnpm build

preview: ## Preview the production build
	@pnpm preview

clean: ## Remove dist/ and node_modules
	@rm -rf dist node_modules
	@printf "$(GREEN)✓ Cleaned.$(RESET)\n"
