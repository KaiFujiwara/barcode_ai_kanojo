.PHONY: help
help: ## Show this help message
	@grep -E '^[a-zA-Z_-]+:.*?## .*$$' $(MAKEFILE_LIST) | awk 'BEGIN {FS = ":.*?## "}; {printf "\033[36m%-20s\033[0m %s\n", $$1, $$2}'

.PHONY: run
run: ## Run the server
	go run ./cmd/server

.PHONY: build
build: ## Build the server binary
	go build -o bin/server ./cmd/server

.PHONY: test
test: ## Run tests
	go test -v ./...

.PHONY: fmt
fmt: ## Format Go code
	go fmt ./...

.PHONY: lint
lint: ## Run linter
	golangci-lint run

.PHONY: tidy
tidy: ## Tidy go modules
	go mod tidy

.PHONY: docker-build
docker-build: ## Build Docker image
	docker build -f build/docker/Dockerfile.prod -t barcode-ai-kanojo-api .

.PHONY: docker-run
docker-run: ## Run with Docker Compose
	docker compose up --build

.PHONY: clean
clean: ## Clean build artifacts
	rm -rf bin/ tmp/