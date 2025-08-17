# Barcode AI Kanojo API

バーコードから決定論的なAIキャラクター画像を生成するAPIサーバー

## ディレクトリ構成

```
api/
├── cmd/
│   └── server/          # アプリケーションエントリーポイント
│       └── main.go
├── internal/            # 内部パッケージ（外部非公開）
│   ├── domain/         # ドメイン層（ビジネスロジック）
│   ├── usecase/        # ユースケース層
│   ├── adapter/        # アダプター層（外部接続）
│   └── config/         # 設定管理
├── pkg/                # 外部公開可能なパッケージ
├── migrations/         # DBマイグレーション
├── docs/              # API仕様書
└── Makefile           # ビルド・開発用コマンド
```

## 開発方法

### Docker Composeで起動
```bash
docker compose up --build
```

### テスト実行
```bash
make test
```

### その他のコマンド
```bash
make help  # 利用可能なコマンド一覧
```

## API仕様

### POST /v1/generate
バーコードから画像を生成

**Request:**
```json
{
  "barcode": "4901234567890"
}
```

**Response:**
```json
{
  "image_url": "https://...",
  "seed": 12345678
}
```