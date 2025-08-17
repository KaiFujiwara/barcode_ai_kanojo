#!/usr/bin/env bash
set -e

# go.modの依存関係を更新
go mod tidy

# ホットリロード開始
exec air -c .air.toml
