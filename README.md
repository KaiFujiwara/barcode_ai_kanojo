# バーコードAIカノジョ

バーコードをスキャンして、AIキャラクターと対話するモバイルアプリケーション。

## 技術スタック

- **フロントエンド**: React Native (Expo)
- **バックエンド**: Go
- **インフラ**: Docker, ngrok

## 開発環境セットアップ

### 必要なツール

- Docker & Docker Compose
- Node.js (v22以上)
- ngrok アカウント ([https://ngrok.com/](https://ngrok.com/))
- Expo アカウント ([https://expo.dev/](https://expo.dev/))
- iOS実機 (開発ビルド済みアプリがインストール済み)

### 初回セットアップ

#### 1. リポジトリのクローン

```bash
git clone https://github.com/you/barcode-ai-kanojo.git
cd barcode-ai-kanojo
```

#### 2. バックエンドAPI起動

```bash
# APIサーバーを起動 (ポート8080)
docker compose up --build
```

#### 3. ngrokでAPI公開

```bash
# ローカルAPIを外部公開
ngrok http 8080
```

表示される `Forwarding` のHTTPS URLをメモする。
例: `https://abc123.ngrok-free.app`

#### 4. フロントエンド設定

```bash
# native-appディレクトリへ移動
cd native-app

# 依存関係インストール
npm install

# 環境変数設定
cp .env.example .env
```

`.env`ファイルを編集し、ngrokのURLを設定:
```
EXPO_PUBLIC_API_URL=https://abc123.ngrok-free.app
```

#### 5. Expoアカウントでログイン

```bash
# 組織アカウントでログイン（ログイン情報は問い合わせてください）
npx expo login
```

#### 6. 開発サーバー起動

```bash
# Metro Bundlerを起動
npx expo start --dev-client
```

#### 7. 実機で確認

1. iOS実機で開発ビルド済みアプリを起動
2. Metro BundlerのQRコードをスキャン、または手動でURLを入力
3. アプリが起動し、バーコードスキャン機能が利用可能

## 2回目以降の開発

```bash
# 1. API起動
docker compose up

# 2. ngrok起動 (別ターミナル)
ngrok http 8080

# 3. フロントエンド起動 (別ターミナル)
cd native-app
# .envファイルのAPI URLを更新
npx expo start --dev-client
```

## 開発ビルドについて

### 既存ビルドを使用する場合

他の開発者が作成した開発ビルドがある場合、新規ビルドは不要です。
同じExpoアカウントでログインすれば、既存の開発ビルドを利用できます。

### 新規ビルド作成が必要な場合

以下の場合は新規ビルドが必要です:

- ネイティブ依存関係の追加/更新
- app.json の設定変更
- 初めての開発環境構築

```bash
# EAS CLIインストール (グローバル)
npm install -g eas-cli

# 開発ビルド作成
cd native-app
eas build --profile development --platform ios
```