# 0) Docker Desktop/Colima を入れる
# 1) API初期化
docker compose run --rm api-dev bash -lc 'test -f go.mod || go mod init github.com/you/barcode-bishojo/api && go mod tidy'
# 2) API起動
docker compose up --build
# 3) Expo起動（ホスト側）
cd native-app && npx expo start