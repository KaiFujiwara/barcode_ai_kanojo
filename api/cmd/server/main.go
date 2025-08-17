package main

import (
	"crypto/sha256"
	"encoding/binary"
	"encoding/json"
	"log"
	"net/http"
)

type genReq struct {
	Barcode string `json:"barcode"`
}
type genRes struct {
	ImageURL string `json:"image_url"`
	Seed     uint32 `json:"seed"`
}

func main() {
	mux := http.NewServeMux()
	mux.HandleFunc("/v1/generate", handleGenerate)

	// CORS(開発中は雑に許容。後で絞る)
	handler := http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		w.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS")
		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusNoContent); return
		}
		mux.ServeHTTP(w, r)
	})

	addr := ":8080"
	log.Println("listening", addr)
	log.Fatal(http.ListenAndServe(addr, handler))
}

func handleGenerate(w http.ResponseWriter, r *http.Request) {
	var in genReq
	if err := json.NewDecoder(r.Body).Decode(&in); err != nil || in.Barcode == "" {
		http.Error(w, "bad request", http.StatusBadRequest); return
	}

	// 決定論シード（まずは作るだけ）
	sum := sha256.Sum256([]byte(in.Barcode))
	seed := binary.BigEndian.Uint32(sum[:4])

	// ここで本来は「既存キャッシュ確認 → なければ生成API → ストレージ保存」
	// まずはダミー画像返してアプリ配線を確認
	out := genRes{
		ImageURL: "https://picsum.photos/seed/" + in.Barcode + "/800/1200",
		Seed:     seed,
	}
	w.Header().Set("Content-Type", "application/json")
	json.NewEncoder(w).Encode(out)
}
